// Scrape NYC local events using Firecrawl + Lovable AI, upsert into events table
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const NYC_CITY_ID = "94a6f1f6-7224-4ec2-a73d-ee6c8cc4cb82";
const NYC_LAT = 40.7128;
const NYC_LNG = -74.006;

const SOURCES = [
  { name: "Time Out NY", url: "https://www.timeout.com/newyork/things-to-do/things-to-do-in-new-york-this-week" },
  { name: "NYC Tourism", url: "https://www.nyctourism.com/events/" },
];

interface ParsedEvent {
  name: string;
  short_description?: string;
  description?: string;
  start_date: string; // YYYY-MM-DD
  end_date: string;
  venue_name?: string;
  address?: string;
  event_type?: string;
  price_from?: number | null;
  price_to?: number | null;
  ticket_url?: string;
  tags?: string[];
}

async function firecrawlScrape(url: string, apiKey: string): Promise<string | null> {
  try {
    const res = await fetch("https://api.firecrawl.dev/v2/scrape", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        url,
        formats: ["markdown"],
        onlyMainContent: true,
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      console.error(`Firecrawl scrape failed for ${url}:`, data);
      return null;
    }
    return data.data?.markdown ?? data.markdown ?? null;
  } catch (e) {
    console.error(`Firecrawl error for ${url}:`, e);
    return null;
  }
}

async function extractEventsWithAI(markdown: string, sourceUrl: string, lovableKey: string): Promise<ParsedEvent[]> {
  const today = new Date().toISOString().split("T")[0];
  const prompt = `You are an event data extractor. Extract upcoming NYC events from the markdown below (source: ${sourceUrl}).
Return ONLY valid JSON array. Today is ${today}. Skip past events. Max 15 events.

Each event object MUST have:
- name (string, required)
- short_description (string, max 200 chars)
- start_date (YYYY-MM-DD, required, infer year as current/next if missing)
- end_date (YYYY-MM-DD, default = start_date)
- venue_name (string, optional)
- address (string, include "New York, NY")
- event_type (one of: festival, concert, music, food, exhibition, art, sport, cultural, other)
- price_from (number or null, 0 = free)
- price_to (number or null)
- ticket_url (string, absolute URL, optional)
- tags (string array, optional)

Markdown:
${markdown.slice(0, 12000)}`;

  try {
    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${lovableKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: "You return only valid JSON arrays. No prose, no markdown fences." },
          { role: "user", content: prompt },
        ],
      }),
    });
    if (!res.ok) {
      console.error("AI gateway error:", res.status, await res.text());
      return [];
    }
    const data = await res.json();
    let content: string = data.choices?.[0]?.message?.content ?? "[]";
    content = content.replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/, "").trim();
    const start = content.indexOf("[");
    const end = content.lastIndexOf("]");
    if (start !== -1 && end !== -1) content = content.slice(start, end + 1);
    const events = JSON.parse(content);
    return Array.isArray(events) ? events : [];
  } catch (e) {
    console.error("AI extraction failed:", e);
    return [];
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const FIRECRAWL_API_KEY = Deno.env.get("FIRECRAWL_API_KEY");
  const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
  const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
  const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

  if (!FIRECRAWL_API_KEY) {
    return new Response(JSON.stringify({ error: "FIRECRAWL_API_KEY not configured" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
  if (!LOVABLE_API_KEY) {
    return new Response(JSON.stringify({ error: "LOVABLE_API_KEY not configured" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const supabase = createClient(SUPABASE_URL, SERVICE_ROLE);
  let added = 0;
  let skipped = 0;
  const errors: string[] = [];

  for (const source of SOURCES) {
    console.log(`Scraping ${source.name}: ${source.url}`);
    const markdown = await firecrawlScrape(source.url, FIRECRAWL_API_KEY);
    if (!markdown) {
      errors.push(`Failed to scrape ${source.name}`);
      continue;
    }
    const events = await extractEventsWithAI(markdown, source.url, LOVABLE_API_KEY);
    console.log(`Extracted ${events.length} events from ${source.name}`);

    for (const ev of events) {
      if (!ev.name || !ev.start_date) {
        skipped++;
        continue;
      }
      // Dedupe: same name + start_date in NYC
      const { data: existing } = await supabase
        .from("events")
        .select("id")
        .eq("name", ev.name)
        .eq("start_date", ev.start_date)
        .eq("city_id", NYC_CITY_ID)
        .maybeSingle();
      if (existing) {
        skipped++;
        continue;
      }
      const { error } = await supabase.from("events").insert({
        name: ev.name,
        short_description: ev.short_description ?? null,
        description: ev.description ?? null,
        start_date: ev.start_date,
        end_date: ev.end_date ?? ev.start_date,
        venue_name: ev.venue_name ?? null,
        address: ev.address ?? "New York, NY",
        event_type: ev.event_type ?? "other",
        price_from: ev.price_from ?? null,
        price_to: ev.price_to ?? null,
        currency: "USD",
        ticket_url: ev.ticket_url ?? null,
        tags: ev.tags ?? null,
        city_id: NYC_CITY_ID,
        latitude: NYC_LAT,
        longitude: NYC_LNG,
        is_active: true,
      });
      if (error) {
        console.error("Insert error:", error.message);
        skipped++;
      } else {
        added++;
      }
    }
  }

  return new Response(
    JSON.stringify({ success: true, events_added: added, events_skipped: skipped, errors }),
    { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
  );
});
