import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Allowed origins for CORS
const ALLOWED_ORIGINS = [
  'https://travelogie.io',
  'https://www.travelogie.io',
  'http://localhost:5173',
  'http://localhost:3000',
  'https://rmtjtpaytixcfiwjlhkt.supabase.co'
];

function getCorsHeaders(origin: string | null): HeadersInit {
  if (origin && ALLOWED_ORIGINS.includes(origin)) {
    return {
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    };
  }
  return {};
}

// Rate limit configuration: 1000 requests per day per user (generous for map usage)
const RATE_LIMIT_MAX_REQUESTS = 1000;
const RATE_LIMIT_WINDOW_MINUTES = 1440; // 24 hours

serve(async (req) => {
  const origin = req.headers.get('origin');
  const corsHeaders = getCorsHeaders(origin);

  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
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
      p_endpoint: 'get-mapbox-token',
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
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const mapboxToken = Deno.env.get('MAPBOX_PUBLIC_TOKEN')
    
    if (!mapboxToken) {
      console.error('MapBox token not configured');
      return new Response(
        JSON.stringify({ error: 'Service configuration error' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        },
      )
    }

    return new Response(
      JSON.stringify({ token: mapboxToken }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )
  } catch (error) {
    console.error('Get-mapbox-token error:', error);
    return new Response(
      JSON.stringify({ error: 'An error occurred' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )
  }
})