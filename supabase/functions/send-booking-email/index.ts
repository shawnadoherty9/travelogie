import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

// Restrict CORS to your domain only
const ALLOWED_ORIGINS = [
  'https://travelogie.io',
  'https://www.travelogie.io',
  'http://localhost:5173',
  'http://localhost:3000'
];

const corsHeaders = (origin: string | null) => ({
  'Access-Control-Allow-Origin': origin && ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0],
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
});

// Rate limit configuration: 10 emails per hour per user
const RATE_LIMIT_MAX_REQUESTS = 10;
const RATE_LIMIT_WINDOW_MINUTES = 60;

// Validation constants
const MAX_NAME_LENGTH = 100;
const MAX_EMAIL_LENGTH = 255;
const MAX_LOCATION_LENGTH = 200;
const MAX_DURATION_LENGTH = 50;
const MAX_EXPERIENCE_LENGTH = 200;
const MAX_EXPERIENCES_COUNT = 50;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface BookingEmailRequest {
  guideName: string;
  guideEmail: string;
  clientName: string;
  clientEmail: string;
  tourDetails: {
    location: string;
    date: string;
    duration: string;
    experiences: string[];
    totalPrice: number;
    guideRate: number;
  };
}

function validateEmail(email: string): boolean {
  return EMAIL_REGEX.test(email) && email.length <= MAX_EMAIL_LENGTH;
}

function sanitizeText(text: string, maxLength: number): string {
  return text.trim().substring(0, maxLength).replace(/[<>]/g, '');
}

const handler = async (req: Request): Promise<Response> => {
  const origin = req.headers.get('origin');
  const headers = corsHeaders(origin);

  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers });
  }

  // Reject if origin not allowed
  if (!origin || !ALLOWED_ORIGINS.includes(origin)) {
    console.error('Blocked request from unauthorized origin:', origin);
    return new Response(
      JSON.stringify({ error: 'Access denied' }),
      { status: 403, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    // Initialize Supabase client for rate limiting
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    // Get user identifier for rate limiting
    const authHeader = req.headers.get('Authorization');
    let identifier = req.headers.get('x-forwarded-for')?.split(',')[0] || 'anonymous';
    
    if (authHeader) {
      const jwt = authHeader.replace('Bearer ', '');
      const { data: { user } } = await supabaseClient.auth.getUser(jwt);
      if (user) {
        identifier = user.id;
      }
    }

    // Check rate limit
    const { data: allowed, error: rateLimitError } = await supabaseClient.rpc('check_rate_limit', {
      p_identifier: identifier,
      p_endpoint: 'send-booking-email',
      p_max_requests: RATE_LIMIT_MAX_REQUESTS,
      p_window_minutes: RATE_LIMIT_WINDOW_MINUTES
    });

    if (rateLimitError) {
      console.error('Rate limit check error:', rateLimitError);
      // Continue if rate limit check fails (fail open for availability)
    } else if (!allowed) {
      console.warn('Rate limit exceeded for identifier:', identifier);
      return new Response(
        JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }),
        { status: 429, headers: { "Content-Type": "application/json", ...headers } }
      );
    }

    const { 
      guideName, 
      guideEmail, 
      clientName, 
      clientEmail, 
      tourDetails 
    }: BookingEmailRequest = await req.json();

    // Input validation
    if (!guideName || !guideEmail || !clientName || !clientEmail || !tourDetails) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { "Content-Type": "application/json", ...headers } }
      );
    }

    // Validate and sanitize names
    const sanitizedGuideName = sanitizeText(guideName, MAX_NAME_LENGTH);
    const sanitizedClientName = sanitizeText(clientName, MAX_NAME_LENGTH);
    
    if (sanitizedGuideName.length === 0 || sanitizedClientName.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Invalid input' }),
        { status: 400, headers: { "Content-Type": "application/json", ...headers } }
      );
    }

    // Validate emails
    if (!validateEmail(guideEmail) || !validateEmail(clientEmail)) {
      return new Response(
        JSON.stringify({ error: 'Invalid input' }),
        { status: 400, headers: { "Content-Type": "application/json", ...headers } }
      );
    }

    // Validate tour details
    if (!tourDetails.location || !tourDetails.date || !tourDetails.duration) {
      return new Response(
        JSON.stringify({ error: 'Invalid input' }),
        { status: 400, headers: { "Content-Type": "application/json", ...headers } }
      );
    }

    // Validate and sanitize location and duration
    const sanitizedLocation = sanitizeText(tourDetails.location, MAX_LOCATION_LENGTH);
    const sanitizedDuration = sanitizeText(tourDetails.duration, MAX_DURATION_LENGTH);

    // Validate experiences array
    if (!Array.isArray(tourDetails.experiences) || tourDetails.experiences.length > MAX_EXPERIENCES_COUNT) {
      return new Response(
        JSON.stringify({ error: 'Invalid input' }),
        { status: 400, headers: { "Content-Type": "application/json", ...headers } }
      );
    }

    const sanitizedExperiences = tourDetails.experiences.map(exp => 
      sanitizeText(String(exp), MAX_EXPERIENCE_LENGTH)
    );

    // Validate prices
    if (typeof tourDetails.totalPrice !== 'number' || tourDetails.totalPrice <= 0 || tourDetails.totalPrice > 1000000) {
      return new Response(
        JSON.stringify({ error: 'Invalid input' }),
        { status: 400, headers: { "Content-Type": "application/json", ...headers } }
      );
    }

    if (typeof tourDetails.guideRate !== 'number' || tourDetails.guideRate <= 0 || tourDetails.guideRate > 1000000) {
      return new Response(
        JSON.stringify({ error: 'Invalid input' }),
        { status: 400, headers: { "Content-Type": "application/json", ...headers } }
      );
    }

    const platformCommission = (tourDetails.totalPrice * 0.15).toFixed(2);
    const guideEarnings = (tourDetails.totalPrice - parseFloat(platformCommission)).toFixed(2);

    const emailSubject = `Tour Booking Request from ${sanitizedClientName} via Travelogie`;
    
    const emailContent = `
Dear ${sanitizedGuideName},

You have received a new tour booking request through Travelogie!

CLIENT INFORMATION:
• Name: ${sanitizedClientName}
• Email: ${clientEmail}

TOUR DETAILS:
• Location: ${sanitizedLocation}
• Date: ${tourDetails.date}
• Duration: ${sanitizedDuration}
• Total Price: $${tourDetails.totalPrice}
• Your Rate: $${tourDetails.guideRate}/day

EXPERIENCES REQUESTED:
${sanitizedExperiences.map(exp => `• ${exp}`).join('\n')}

PAYMENT BREAKDOWN:
• Total Tour Value: $${tourDetails.totalPrice}
• Platform Commission (15%): $${platformCommission}
• Your Earnings: $${guideEarnings}

To confirm this booking:
1. Reply to this email confirming your availability
2. We will process the client's payment
3. Upon confirmation, tickets will be auto-purchased
4. You'll receive payment within 24 hours of tour completion

If you have any questions or need to modify the itinerary, please contact us directly.

Best regards,
The Travelogie Team

---
This booking request was sent via Travelogie - Learn from Locals
Visit: https://travelogie.io
    `;

    console.log('Sending booking email for identifier:', identifier);

    const emailResponse = await resend.emails.send({
      from: "Travelogie <bookings@travelogie.io>",
      to: [guideEmail],
      cc: [clientEmail],
      subject: emailSubject,
      text: emailContent,
    });

    console.log("Booking email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ 
      success: true, 
      messageId: emailResponse.data?.id 
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
    });
  } catch (error: any) {
    console.error("Error in send-booking-email function:", error);
    return new Response(
      JSON.stringify({ error: 'An error occurred' }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...headers },
      }
    );
  }
};

serve(handler);