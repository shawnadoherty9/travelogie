import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
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

// Rate limit configuration: 5 requests per 15 minutes per IP (strict for admin endpoint)
const RATE_LIMIT_MAX_REQUESTS = 5;
const RATE_LIMIT_WINDOW_MINUTES = 15;

serve(async (req) => {
  const origin = req.headers.get('origin');
  const corsHeaders = getCorsHeaders(origin);

  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
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

    // Get identifier for rate limiting (use IP for admin endpoint to prevent brute force)
    const identifier = req.headers.get('x-forwarded-for')?.split(',')[0] || 'anonymous';

    // Check rate limit before processing
    const { data: allowed, error: rateLimitError } = await supabaseClient.rpc('check_rate_limit', {
      p_identifier: identifier,
      p_endpoint: 'admin-auth-rbac',
      p_max_requests: RATE_LIMIT_MAX_REQUESTS,
      p_window_minutes: RATE_LIMIT_WINDOW_MINUTES
    });

    if (rateLimitError) {
      console.error('Rate limit check error:', rateLimitError);
      // Continue if rate limit check fails (fail open for availability)
    } else if (!allowed) {
      console.warn('Rate limit exceeded for admin-auth-rbac, identifier:', identifier);
      return new Response(
        JSON.stringify({ error: 'Too many requests. Please try again later.' }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get the authorization header from the request
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Authentication required' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Verify the user's JWT token
    const jwt = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(jwt);

    if (authError || !user) {
      console.error('Auth error:', authError);
      return new Response(
        JSON.stringify({ error: 'Invalid authentication' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { action } = await req.json();

    if (action === 'verify_admin') {
      // Check if user has admin role using the new RBAC system
      const { data: userRoles, error: rolesError } = await supabaseClient
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id);

      if (rolesError) {
        console.error('Error fetching user roles:', rolesError);
        return new Response(
          JSON.stringify({ error: 'Failed to verify permissions' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const hasAdminRole = userRoles?.some(roleRow => roleRow.role === 'admin') || false;

      console.log('Admin verification for user:', user.id, 'hasAdminRole:', hasAdminRole);

      return new Response(
        JSON.stringify({
          isAdmin: hasAdminRole,
          user: {
            id: user.id,
            email: user.email,
          },
          roles: userRoles?.map(r => r.role) || []
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ error: 'Invalid request' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Unexpected error:', error);
    return new Response(
      JSON.stringify({ error: 'An error occurred' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});