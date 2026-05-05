// Mints LiveKit access tokens for video sessions tied to bookings.
// Authorization: caller MUST be either the customer or the provider on the
// referenced booking. Anyone else is rejected before LiveKit creds are used.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { AccessToken } from "https://esm.sh/livekit-server-sdk@2.9.7?target=deno";

const ALLOWED_ORIGINS = [
  "https://travelogie.io",
  "https://travelogie.co",
  "https://travelogie.lovable.app",
  "https://id-preview--af8db195-ab6b-4548-bcab-d797148e2c14.lovable.app",
  "http://localhost:8080",
  "http://localhost:5173",
];

function corsHeaders(origin: string | null) {
  const allow = origin && ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    "Access-Control-Allow-Origin": allow,
    "Access-Control-Allow-Headers":
      "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Vary": "Origin",
  };
}

function json(body: unknown, status: number, origin: string | null) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders(origin), "Content-Type": "application/json" },
  });
}

type BookingType = "language" | "cultural";

interface ResolvedBooking {
  customerId: string;
  providerId: string;
  roomName: string;
  serviceTitle: string;
}

Deno.serve(async (req) => {
  const origin = req.headers.get("origin");
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders(origin) });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405, origin);

  try {
    // 1. Authenticate caller
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return json({ error: "Unauthorized" }, 401, origin);
    }
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } },
    );
    const token = authHeader.replace("Bearer ", "");
    const { data: claimsData, error: claimsErr } = await supabase.auth.getClaims(token);
    if (claimsErr || !claimsData?.claims?.sub) {
      return json({ error: "Unauthorized" }, 401, origin);
    }
    const userId = claimsData.claims.sub as string;

    // 2. Validate body
    const body = await req.json().catch(() => null);
    const bookingType = body?.bookingType as BookingType | undefined;
    const bookingId = body?.bookingId as string | undefined;
    if (
      !bookingId ||
      !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(bookingId) ||
      (bookingType !== "language" && bookingType !== "cultural")
    ) {
      return json({ error: "Invalid bookingType or bookingId" }, 400, origin);
    }

    // 3. Use service role for the authorization lookup so RLS cannot leak
    //    booking rows the caller doesn't own — we enforce ownership manually.
    const admin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    let resolved: ResolvedBooking | null = null;

    if (bookingType === "language") {
      const { data, error } = await admin
        .from("bookings")
        .select("id, customer_id, provider_id, status, service_title")
        .eq("id", bookingId)
        .maybeSingle();
      if (error) return json({ error: "Lookup failed" }, 500, origin);
      if (!data) return json({ error: "Booking not found" }, 404, origin);
      if (!["pending", "confirmed", "paid"].includes(data.status)) {
        return json({ error: "Booking not active" }, 403, origin);
      }
      resolved = {
        customerId: data.customer_id,
        providerId: data.provider_id,
        roomName: `booking-language-${data.id}`,
        serviceTitle: data.service_title ?? "Language Lesson",
      };
    } else {
      // cultural experience booking — uses tour_bookings + tour_operators
      const { data, error } = await admin
        .from("tour_bookings")
        .select("id, user_id, tour_operator_id, booking_status")
        .eq("id", bookingId)
        .maybeSingle();
      if (error) return json({ error: "Lookup failed" }, 500, origin);
      if (!data) return json({ error: "Booking not found" }, 404, origin);
      if (!["pending", "confirmed", "paid"].includes(data.booking_status)) {
        return json({ error: "Booking not active" }, 403, origin);
      }
      // Resolve operator's auth user id
      let providerId = "";
      if (data.tour_operator_id) {
        const { data: op } = await admin
          .from("tour_operators")
          .select("user_id, business_name")
          .eq("id", data.tour_operator_id)
          .maybeSingle();
        providerId = op?.user_id ?? "";
      }
      resolved = {
        customerId: data.user_id ?? "",
        providerId,
        roomName: `booking-cultural-${data.id}`,
        serviceTitle: "Cultural Experience",
      };
    }

    // 4. ENFORCE ROLE: caller must be exactly customer or provider
    const isCustomer = resolved.customerId && resolved.customerId === userId;
    const isProvider = resolved.providerId && resolved.providerId === userId;
    if (!isCustomer && !isProvider) {
      return json({ error: "Forbidden: not a participant of this booking" }, 403, origin);
    }
    const role: "customer" | "provider" = isProvider ? "provider" : "customer";

    // 5. Mint LiveKit token (short-lived, scoped to this room only)
    const apiKey = Deno.env.get("LIVEKIT_API_KEY");
    const apiSecret = Deno.env.get("LIVEKIT_API_SECRET");
    const livekitUrl = Deno.env.get("LIVEKIT_URL");
    if (!apiKey || !apiSecret || !livekitUrl) {
      return json({ error: "Video service not configured" }, 503, origin);
    }

    // Fetch caller display name from profile (best-effort, no PII leakage)
    const { data: profile } = await admin
      .from("profiles")
      .select("first_name, last_name")
      .eq("user_id", userId)
      .maybeSingle();
    const displayName =
      [profile?.first_name, profile?.last_name].filter(Boolean).join(" ") ||
      (role === "provider" ? "Instructor" : "Guest");

    const at = new AccessToken(apiKey, apiSecret, {
      identity: `${role}-${userId}`,
      name: displayName,
      ttl: 60 * 60, // 1 hour
      metadata: JSON.stringify({ role, bookingId, bookingType }),
    });
    at.addGrant({
      room: resolved.roomName,
      roomJoin: true,
      canPublish: true,
      canSubscribe: true,
      canPublishData: true,
    });

    const accessToken = await at.toJwt();

    return json(
      {
        token: accessToken,
        url: livekitUrl,
        room: resolved.roomName,
        role,
        identity: `${role}-${userId}`,
        displayName,
      },
      200,
      origin,
    );
  } catch (err) {
    console.error("livekit-token error:", err);
    return json({ error: "Internal server error" }, 500, origin);
  }
});
