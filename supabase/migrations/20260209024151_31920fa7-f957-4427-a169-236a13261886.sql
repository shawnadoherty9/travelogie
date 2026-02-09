
-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS pg_cron WITH SCHEMA pg_catalog;
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;

-- Grant usage to postgres role
GRANT USAGE ON SCHEMA cron TO postgres;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA cron TO postgres;

-- Schedule per-city event refresh at 06:00 UTC daily, staggered by 2 minutes each
-- This avoids timeouts by processing one city at a time

-- Bangkok, Thailand
SELECT cron.schedule(
  'refresh-events-bangkok',
  '0 6 * * *',
  $$
  SELECT net.http_post(
    url := 'https://rmtjtpaytixcfiwjlhkt.supabase.co/functions/v1/fetch-events',
    headers := '{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJtdGp0cGF5dGl4Y2Zpd2psaGt0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc0NTkyNDAsImV4cCI6MjA3MzAzNTI0MH0.dmG1YjWoJt4BKIS8V4gFUJwlPv9fpVVkB1kE_izVR2g"}'::jsonb,
    body := '{"city":"Bangkok","country":"Thailand","sources":["eventbrite"]}'::jsonb
  ) AS request_id;
  $$
);

-- Chiang Mai, Thailand
SELECT cron.schedule(
  'refresh-events-chiangmai',
  '2 6 * * *',
  $$
  SELECT net.http_post(
    url := 'https://rmtjtpaytixcfiwjlhkt.supabase.co/functions/v1/fetch-events',
    headers := '{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJtdGp0cGF5dGl4Y2Zpd2psaGt0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc0NTkyNDAsImV4cCI6MjA3MzAzNTI0MH0.dmG1YjWoJt4BKIS8V4gFUJwlPv9fpVVkB1kE_izVR2g"}'::jsonb,
    body := '{"city":"Chiang Mai","country":"Thailand","sources":["eventbrite"]}'::jsonb
  ) AS request_id;
  $$
);

-- Tokyo, Japan
SELECT cron.schedule(
  'refresh-events-tokyo',
  '4 6 * * *',
  $$
  SELECT net.http_post(
    url := 'https://rmtjtpaytixcfiwjlhkt.supabase.co/functions/v1/fetch-events',
    headers := '{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJtdGp0cGF5dGl4Y2Zpd2psaGt0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc0NTkyNDAsImV4cCI6MjA3MzAzNTI0MH0.dmG1YjWoJt4BKIS8V4gFUJwlPv9fpVVkB1kE_izVR2g"}'::jsonb,
    body := '{"city":"Tokyo","country":"Japan","sources":["eventbrite"]}'::jsonb
  ) AS request_id;
  $$
);

-- Kyoto, Japan
SELECT cron.schedule(
  'refresh-events-kyoto',
  '6 6 * * *',
  $$
  SELECT net.http_post(
    url := 'https://rmtjtpaytixcfiwjlhkt.supabase.co/functions/v1/fetch-events',
    headers := '{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJtdGp0cGF5dGl4Y2Zpd2psaGt0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc0NTkyNDAsImV4cCI6MjA3MzAzNTI0MH0.dmG1YjWoJt4BKIS8V4gFUJwlPv9fpVVkB1kE_izVR2g"}'::jsonb,
    body := '{"city":"Kyoto","country":"Japan","sources":["eventbrite"]}'::jsonb
  ) AS request_id;
  $$
);

-- Mumbai, India
SELECT cron.schedule(
  'refresh-events-mumbai',
  '8 6 * * *',
  $$
  SELECT net.http_post(
    url := 'https://rmtjtpaytixcfiwjlhkt.supabase.co/functions/v1/fetch-events',
    headers := '{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJtdGp0cGF5dGl4Y2Zpd2psaGt0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc0NTkyNDAsImV4cCI6MjA3MzAzNTI0MH0.dmG1YjWoJt4BKIS8V4gFUJwlPv9fpVVkB1kE_izVR2g"}'::jsonb,
    body := '{"city":"Mumbai","country":"India","sources":["eventbrite"]}'::jsonb
  ) AS request_id;
  $$
);

-- Varanasi, India
SELECT cron.schedule(
  'refresh-events-varanasi',
  '10 6 * * *',
  $$
  SELECT net.http_post(
    url := 'https://rmtjtpaytixcfiwjlhkt.supabase.co/functions/v1/fetch-events',
    headers := '{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJtdGp0cGF5dGl4Y2Zpd2psaGt0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc0NTkyNDAsImV4cCI6MjA3MzAzNTI0MH0.dmG1YjWoJt4BKIS8V4gFUJwlPv9fpVVkB1kE_izVR2g"}'::jsonb,
    body := '{"city":"Varanasi","country":"India","sources":["eventbrite"]}'::jsonb
  ) AS request_id;
  $$
);

-- Bali, Indonesia
SELECT cron.schedule(
  'refresh-events-bali',
  '12 6 * * *',
  $$
  SELECT net.http_post(
    url := 'https://rmtjtpaytixcfiwjlhkt.supabase.co/functions/v1/fetch-events',
    headers := '{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJtdGp0cGF5dGl4Y2Zpd2psaGt0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc0NTkyNDAsImV4cCI6MjA3MzAzNTI0MH0.dmG1YjWoJt4BKIS8V4gFUJwlPv9fpVVkB1kE_izVR2g"}'::jsonb,
    body := '{"city":"Bali","country":"Indonesia","sources":["eventbrite"]}'::jsonb
  ) AS request_id;
  $$
);

-- Siem Reap, Cambodia
SELECT cron.schedule(
  'refresh-events-siemreap',
  '14 6 * * *',
  $$
  SELECT net.http_post(
    url := 'https://rmtjtpaytixcfiwjlhkt.supabase.co/functions/v1/fetch-events',
    headers := '{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJtdGp0cGF5dGl4Y2Zpd2psaGt0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc0NTkyNDAsImV4cCI6MjA3MzAzNTI0MH0.dmG1YjWoJt4BKIS8V4gFUJwlPv9fpVVkB1kE_izVR2g"}'::jsonb,
    body := '{"city":"Siem Reap","country":"Cambodia","sources":["eventbrite"]}'::jsonb
  ) AS request_id;
  $$
);

-- New York, United States
SELECT cron.schedule(
  'refresh-events-newyork',
  '16 6 * * *',
  $$
  SELECT net.http_post(
    url := 'https://rmtjtpaytixcfiwjlhkt.supabase.co/functions/v1/fetch-events',
    headers := '{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJtdGp0cGF5dGl4Y2Zpd2psaGt0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc0NTkyNDAsImV4cCI6MjA3MzAzNTI0MH0.dmG1YjWoJt4BKIS8V4gFUJwlPv9fpVVkB1kE_izVR2g"}'::jsonb,
    body := '{"city":"New York","country":"United States","sources":["eventbrite"]}'::jsonb
  ) AS request_id;
  $$
);

-- Boston, United States
SELECT cron.schedule(
  'refresh-events-boston',
  '18 6 * * *',
  $$
  SELECT net.http_post(
    url := 'https://rmtjtpaytixcfiwjlhkt.supabase.co/functions/v1/fetch-events',
    headers := '{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJtdGp0cGF5dGl4Y2Zpd2psaGt0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc0NTkyNDAsImV4cCI6MjA3MzAzNTI0MH0.dmG1YjWoJt4BKIS8V4gFUJwlPv9fpVVkB1kE_izVR2g"}'::jsonb,
    body := '{"city":"Boston","country":"United States","sources":["eventbrite"]}'::jsonb
  ) AS request_id;
  $$
);

-- Also schedule a stale event cleanup at 05:00 UTC daily (deactivate past events)
SELECT cron.schedule(
  'cleanup-stale-events',
  '0 5 * * *',
  $$
  UPDATE public.events SET is_active = false WHERE end_date < CURRENT_DATE AND is_active = true;
  $$
);
