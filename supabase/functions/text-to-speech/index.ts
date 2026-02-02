import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
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

// Rate limit configuration: 100 requests per hour per user
const RATE_LIMIT_MAX_REQUESTS = 100;
const RATE_LIMIT_WINDOW_MINUTES = 60;

// Validation constants
const MAX_TEXT_LENGTH = 5000;
const ALLOWED_VOICE_IDS = [
  '9BWtsMINqrJLrRacOk9x', 'CwhRBWXzGAHq8TQ4Fs17', 'EXAVITQu4vr4xnSDxMaL',
  'FGY2WhTYpPnrIDTdsKH5', 'IKne3meq5aSn9XLyUdCD', 'JBFqnCBsd6RMkjVDRZzb',
  'N2lVS1w4EtoT3dr4eOWO', 'SAz9YHcvj6GT2YYXdXww', 'TX3LPaxmHKxFdv7VOQHJ',
  'XB0fDUnXU5powFXDhCwa', 'Xb7hH8MSUJpSbSDYk0k2', 'XrExE9yKIg1WjnnlVkGX',
  'bIHbv24MWmeRgasZH58o', 'cgSgspJ2msm6clMCkdW9', 'cjVigY5qzO86Huf0OWal',
  'iP95p4xoKVk53GoZ742B', 'nPczCjzI2devNBz1zQrb', 'onwK4e9ZLuTAKqWW03F9',
  'pFZP5JQG7iQjIQuC4Bku', 'pqHfZKP75CvOlQylNhV4'
];
const ALLOWED_MODELS = [
  'eleven_multilingual_v2', 'eleven_turbo_v2_5', 'eleven_turbo_v2',
  'eleven_multilingual_v1', 'eleven_multilingual_sts_v2',
  'eleven_monolingual_v1', 'eleven_english_sts_v2'
];

serve(async (req) => {
  const origin = req.headers.get('origin');
  const corsHeaders = getCorsHeaders(origin);

  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
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

    // Get user identifier for rate limiting (use IP or auth token)
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
      p_endpoint: 'text-to-speech',
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

    const { text, voiceId = '9BWtsMINqrJLrRacOk9x', model = 'eleven_multilingual_v2' } = await req.json();

    // Input validation
    if (!text || typeof text !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Valid text is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (text.length > MAX_TEXT_LENGTH) {
      return new Response(
        JSON.stringify({ error: `Text must be less than ${MAX_TEXT_LENGTH} characters` }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!ALLOWED_VOICE_IDS.includes(voiceId)) {
      return new Response(
        JSON.stringify({ error: 'Invalid voice ID' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!ALLOWED_MODELS.includes(model)) {
      return new Response(
        JSON.stringify({ error: 'Invalid model' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const elevenLabsApiKey = (Deno.env.get('ELEVENLABS_API_KEY') || '').trim();
    if (!elevenLabsApiKey) {
      console.error('ElevenLabs API key not configured');
      return new Response(
        JSON.stringify({ error: 'Service configuration error' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Generating speech for text length:', text.length, 'chars, identifier:', identifier);

    // Generate speech using Eleven Labs API
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': elevenLabsApiKey,
      },
      body: JSON.stringify({
        text,
        model_id: model,
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.5,
        },
      }),
    });

    if (!response.ok) {
      console.error('Eleven Labs API error:', response.status, await response.text());
      return new Response(
        JSON.stringify({ error: 'Failed to generate speech' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Convert audio to base64
    const audioBuffer = await response.arrayBuffer();
    const base64Audio = btoa(String.fromCharCode(...new Uint8Array(audioBuffer)));

    console.log('Successfully generated speech, audio size:', audioBuffer.byteLength, 'bytes');

    return new Response(
      JSON.stringify({ 
        audioContent: base64Audio,
        contentType: 'audio/mpeg'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Text-to-speech error:', error);
    return new Response(
      JSON.stringify({ error: 'An error occurred processing your request' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});