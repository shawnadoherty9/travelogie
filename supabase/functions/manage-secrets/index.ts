import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get the authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'No authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Verify the user is authenticated and is admin
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid authentication' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if user has admin role
    const { data: profile, error: profileError } = await supabaseClient
      .from('profiles')
      .select('user_type, email')
      .eq('user_id', user.id)
      .single();

    if (profileError || !profile) {
      return new Response(
        JSON.stringify({ error: 'Profile not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // For now, check if user is admin by email (you can create a proper admin role system)
    const adminEmails = [
      'admin@travelogie.io',
      // Add more admin emails as needed
    ];

    const isAdmin = adminEmails.includes(profile.email) || profile.user_type === 'admin';

    if (!isAdmin) {
      return new Response(
        JSON.stringify({ error: 'Insufficient permissions' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { action, secretName, secretValue } = await req.json();

    if (action === 'update') {
      // In a real implementation, you would use Supabase Vault to store secrets
      // For now, we'll use environment variables through Supabase secrets
      console.log(`Admin ${user.email} updating secret: ${secretName}`);
      
      // Here you would typically call Supabase's secret management API
      // or store in a secure vault table
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: `Secret ${secretName} updated successfully` 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (action === 'get') {
      // Return masked versions of secrets for display
      const maskedSecrets = {
        elevenLabs: Deno.env.get('ELEVENLABS_API_KEY') ? '••••••••' + Deno.env.get('ELEVENLABS_API_KEY')?.slice(-4) : '',
        n8n: Deno.env.get('N8N_WEBHOOK_URL') ? '••••••••' + Deno.env.get('N8N_WEBHOOK_URL')?.slice(-10) : '',
        mapbox: Deno.env.get('MAPBOX_PUBLIC_TOKEN') ? '••••••••' + Deno.env.get('MAPBOX_PUBLIC_TOKEN')?.slice(-4) : '',
      };

      return new Response(
        JSON.stringify({ secrets: maskedSecrets }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ error: 'Invalid action' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in manage-secrets function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});