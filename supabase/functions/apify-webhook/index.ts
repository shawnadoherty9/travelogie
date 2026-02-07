import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-webhook-secret",
};

interface ScrapedActivity {
  name: string;
  description?: string;
  short_description?: string;
  latitude: number;
  longitude: number;
  address?: string;
  category_name?: string;
  tags?: string[];
  price_from?: number;
  price_to?: number;
  currency?: string;
  duration_hours?: number;
  rating?: number;
  review_count?: number;
  image_urls?: string[];
  external_booking_url?: string;
  operating_hours?: Record<string, any>;
}

interface ScrapedEvent {
  name: string;
  description?: string;
  short_description?: string;
  latitude: number;
  longitude: number;
  address?: string;
  venue_name?: string;
  category_name?: string;
  tags?: string[];
  start_date: string;
  end_date: string;
  start_time?: string;
  end_time?: string;
  price_from?: number;
  price_to?: number;
  currency?: string;
  capacity?: number;
  image_urls?: string[];
  ticket_url?: string;
  event_type?: string;
}

interface WebhookPayload {
  source: 'activities' | 'events';
  items: (ScrapedActivity | ScrapedEvent)[];
  city_name?: string;
  country_name?: string;
  webhook_secret?: string;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Verify webhook secret
    const webhookSecret = req.headers.get("x-webhook-secret");
    const expectedSecret = Deno.env.get("APIFY_WEBHOOK_SECRET");
    
    // If secret is configured, verify it
    if (expectedSecret && webhookSecret !== expectedSecret) {
      console.error("Invalid webhook secret");
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Initialize Supabase client with service role for admin operations
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error("Missing Supabase configuration");
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Parse request body
    const payload: WebhookPayload = await req.json();
    
    console.log(`Received ${payload.items.length} ${payload.source} from Apify webhook`);

    // Validate payload
    if (!payload.source || !['activities', 'events'].includes(payload.source)) {
      return new Response(
        JSON.stringify({ error: "Invalid source type. Must be 'activities' or 'events'" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!Array.isArray(payload.items) || payload.items.length === 0) {
      return new Response(
        JSON.stringify({ error: "Items array is required and must not be empty" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get city_id if city_name is provided
    let cityId: string | null = null;
    if (payload.city_name) {
      const { data: cities } = await supabase
        .from('cities')
        .select('id')
        .ilike('name', payload.city_name)
        .limit(1);
      
      if (cities && cities.length > 0) {
        cityId = cities[0].id;
      }
    }

    // Get all category mappings
    const { data: categories } = await supabase
      .from('activity_categories')
      .select('id, name');
    
    const categoryMap = new Map(
      categories?.map(c => [c.name.toLowerCase(), c.id]) || []
    );

    let insertedCount = 0;
    let skippedCount = 0;
    let errorCount = 0;
    const errors: string[] = [];

    if (payload.source === 'activities') {
      for (const item of payload.items as ScrapedActivity[]) {
        try {
          // Validate required fields
          if (!item.name || !item.latitude || !item.longitude) {
            console.warn(`Skipping activity: missing required fields (name, latitude, longitude)`);
            skippedCount++;
            continue;
          }

          // Validate coordinates
          if (item.latitude < -90 || item.latitude > 90 || item.longitude < -180 || item.longitude > 180) {
            console.warn(`Skipping activity "${item.name}": invalid coordinates`);
            skippedCount++;
            continue;
          }

          // Find category ID
          let categoryId: string | null = null;
          if (item.category_name) {
            categoryId = categoryMap.get(item.category_name.toLowerCase()) || null;
          }

          // Check for duplicates (same name + similar coordinates)
          const { data: existing } = await supabase
            .from('activities')
            .select('id')
            .eq('name', item.name)
            .gte('latitude', item.latitude - 0.001)
            .lte('latitude', item.latitude + 0.001)
            .gte('longitude', item.longitude - 0.001)
            .lte('longitude', item.longitude + 0.001)
            .limit(1);

          if (existing && existing.length > 0) {
            console.log(`Skipping duplicate activity: ${item.name}`);
            skippedCount++;
            continue;
          }

          // Insert activity
          const { error: insertError } = await supabase
            .from('activities')
            .insert({
              name: item.name.substring(0, 255),
              description: item.description?.substring(0, 5000),
              short_description: item.short_description?.substring(0, 500),
              latitude: item.latitude,
              longitude: item.longitude,
              address: item.address?.substring(0, 500),
              city_id: cityId,
              category_id: categoryId,
              tags: item.tags?.slice(0, 20),
              price_from: item.price_from,
              price_to: item.price_to,
              currency: item.currency || 'USD',
              duration_hours: item.duration_hours,
              rating: item.rating ? Math.min(5, Math.max(0, item.rating)) : null,
              review_count: item.review_count,
              image_urls: item.image_urls?.slice(0, 10),
              external_booking_url: item.external_booking_url?.substring(0, 500),
              operating_hours: item.operating_hours,
              is_active: true,
            });

          if (insertError) {
            console.error(`Error inserting activity "${item.name}":`, insertError);
            errorCount++;
            errors.push(`${item.name}: ${insertError.message}`);
          } else {
            insertedCount++;
          }
        } catch (err) {
          console.error(`Error processing activity:`, err);
          errorCount++;
        }
      }
    } else if (payload.source === 'events') {
      for (const item of payload.items as ScrapedEvent[]) {
        try {
          // Validate required fields
          if (!item.name || !item.latitude || !item.longitude || !item.start_date || !item.end_date) {
            console.warn(`Skipping event: missing required fields`);
            skippedCount++;
            continue;
          }

          // Validate coordinates
          if (item.latitude < -90 || item.latitude > 90 || item.longitude < -180 || item.longitude > 180) {
            console.warn(`Skipping event "${item.name}": invalid coordinates`);
            skippedCount++;
            continue;
          }

          // Validate dates
          const startDate = new Date(item.start_date);
          const endDate = new Date(item.end_date);
          if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
            console.warn(`Skipping event "${item.name}": invalid dates`);
            skippedCount++;
            continue;
          }

          // Find category ID
          let categoryId: string | null = null;
          if (item.category_name) {
            categoryId = categoryMap.get(item.category_name.toLowerCase()) || null;
          }

          // Check for duplicates
          const { data: existing } = await supabase
            .from('events')
            .select('id')
            .eq('name', item.name)
            .eq('start_date', item.start_date)
            .gte('latitude', item.latitude - 0.001)
            .lte('latitude', item.latitude + 0.001)
            .limit(1);

          if (existing && existing.length > 0) {
            console.log(`Skipping duplicate event: ${item.name}`);
            skippedCount++;
            continue;
          }

          // Insert event
          const { error: insertError } = await supabase
            .from('events')
            .insert({
              name: item.name.substring(0, 255),
              description: item.description?.substring(0, 5000),
              short_description: item.short_description?.substring(0, 500),
              latitude: item.latitude,
              longitude: item.longitude,
              address: item.address?.substring(0, 500),
              venue_name: item.venue_name?.substring(0, 255),
              city_id: cityId,
              category_id: categoryId,
              tags: item.tags?.slice(0, 20),
              start_date: item.start_date,
              end_date: item.end_date,
              start_time: item.start_time,
              end_time: item.end_time,
              price_from: item.price_from,
              price_to: item.price_to,
              currency: item.currency || 'USD',
              capacity: item.capacity,
              image_urls: item.image_urls?.slice(0, 10),
              ticket_url: item.ticket_url?.substring(0, 500),
              event_type: item.event_type?.substring(0, 100),
              is_active: true,
            });

          if (insertError) {
            console.error(`Error inserting event "${item.name}":`, insertError);
            errorCount++;
            errors.push(`${item.name}: ${insertError.message}`);
          } else {
            insertedCount++;
          }
        } catch (err) {
          console.error(`Error processing event:`, err);
          errorCount++;
        }
      }
    }

    console.log(`Webhook processing complete: ${insertedCount} inserted, ${skippedCount} skipped, ${errorCount} errors`);

    return new Response(
      JSON.stringify({
        success: true,
        source: payload.source,
        total_received: payload.items.length,
        inserted: insertedCount,
        skipped: skippedCount,
        errors: errorCount,
        error_details: errors.length > 0 ? errors.slice(0, 10) : undefined,
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );

  } catch (error) {
    console.error("Webhook error:", error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error instanceof Error ? error.message : "Unknown error" 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});
