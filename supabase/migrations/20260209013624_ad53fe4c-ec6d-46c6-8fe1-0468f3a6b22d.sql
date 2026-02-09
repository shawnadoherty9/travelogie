-- Schedule daily event refresh at 6 AM UTC
SELECT cron.schedule(
  'refresh-events-daily',
  '0 6 * * *',
  $$
  SELECT net.http_post(
    url := 'https://rmtjtpaytixcfiwjlhkt.supabase.co/functions/v1/fetch-events',
    headers := '{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJtdGp0cGF5dGl4Y2Zpd2psaGt0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc0NTkyNDAsImV4cCI6MjA3MzAzNTI0MH0.dmG1YjWoJt4BKIS8V4gFUJwlPv9fpVVkB1kE_izVR2g"}'::jsonb,
    body := '{}'::jsonb
  ) AS request_id;
  $$
);