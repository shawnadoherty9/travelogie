import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

// Restrict CORS to your domain only
const ALLOWED_ORIGINS = [
  'https://travelogie.io',
  'https://www.travelogie.io',
  'http://localhost:5173', // Development
  'http://localhost:3000'
];

const corsHeaders = (origin: string | null) => ({
  'Access-Control-Allow-Origin': origin && ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0],
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
});

serve(async (req) => {
  const origin = req.headers.get('origin');
  const headers = corsHeaders(origin);

  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers })
  }

  try {
    const mapboxToken = Deno.env.get('MAPBOX_PUBLIC_TOKEN')
    
    if (!mapboxToken) {
      console.error('MapBox token not configured');
      return new Response(
        JSON.stringify({ error: 'Service configuration error' }),
        { 
          status: 500, 
          headers: { ...headers, 'Content-Type': 'application/json' },
        },
      )
    }

    return new Response(
      JSON.stringify({ token: mapboxToken }),
      { 
        headers: { ...headers, 'Content-Type': 'application/json' },
      },
    )
  } catch (error) {
    console.error('Get MapBox token error:', error);
    return new Response(
      JSON.stringify({ error: 'An error occurred' }),
      { 
        status: 500, 
        headers: { ...headers, 'Content-Type': 'application/json' },
      },
    )
  }
})