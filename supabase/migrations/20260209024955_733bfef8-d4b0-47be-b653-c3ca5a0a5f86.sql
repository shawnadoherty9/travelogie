
-- ═══ Cron jobs for new cities — staggered every 1 minute from 06:20 to 06:59 UTC ═══
-- (Existing 10 cities run 06:00-06:18)

-- EUROPE
SELECT cron.schedule('refresh-events-paris', '20 6 * * *', $$
  SELECT net.http_post(url:='https://rmtjtpaytixcfiwjlhkt.supabase.co/functions/v1/fetch-events', headers:='{"Content-Type":"application/json","Authorization":"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJtdGp0cGF5dGl4Y2Zpd2psaGt0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc0NTkyNDAsImV4cCI6MjA3MzAzNTI0MH0.dmG1YjWoJt4BKIS8V4gFUJwlPv9fpVVkB1kE_izVR2g"}'::jsonb, body:='{"city":"Paris","country":"France","sources":["eventbrite"]}'::jsonb) AS request_id;
$$);

SELECT cron.schedule('refresh-events-nice', '21 6 * * *', $$
  SELECT net.http_post(url:='https://rmtjtpaytixcfiwjlhkt.supabase.co/functions/v1/fetch-events', headers:='{"Content-Type":"application/json","Authorization":"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJtdGp0cGF5dGl4Y2Zpd2psaGt0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc0NTkyNDAsImV4cCI6MjA3MzAzNTI0MH0.dmG1YjWoJt4BKIS8V4gFUJwlPv9fpVVkB1kE_izVR2g"}'::jsonb, body:='{"city":"Nice","country":"France","sources":["eventbrite"]}'::jsonb) AS request_id;
$$);

SELECT cron.schedule('refresh-events-cannes', '22 6 * * *', $$
  SELECT net.http_post(url:='https://rmtjtpaytixcfiwjlhkt.supabase.co/functions/v1/fetch-events', headers:='{"Content-Type":"application/json","Authorization":"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJtdGp0cGF5dGl4Y2Zpd2psaGt0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc0NTkyNDAsImV4cCI6MjA3MzAzNTI0MH0.dmG1YjWoJt4BKIS8V4gFUJwlPv9fpVVkB1kE_izVR2g"}'::jsonb, body:='{"city":"Cannes","country":"France","sources":["eventbrite"]}'::jsonb) AS request_id;
$$);

SELECT cron.schedule('refresh-events-barcelona', '23 6 * * *', $$
  SELECT net.http_post(url:='https://rmtjtpaytixcfiwjlhkt.supabase.co/functions/v1/fetch-events', headers:='{"Content-Type":"application/json","Authorization":"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJtdGp0cGF5dGl4Y2Zpd2psaGt0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc0NTkyNDAsImV4cCI6MjA3MzAzNTI0MH0.dmG1YjWoJt4BKIS8V4gFUJwlPv9fpVVkB1kE_izVR2g"}'::jsonb, body:='{"city":"Barcelona","country":"Spain","sources":["eventbrite"]}'::jsonb) AS request_id;
$$);

SELECT cron.schedule('refresh-events-madrid', '24 6 * * *', $$
  SELECT net.http_post(url:='https://rmtjtpaytixcfiwjlhkt.supabase.co/functions/v1/fetch-events', headers:='{"Content-Type":"application/json","Authorization":"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJtdGp0cGF5dGl4Y2Zpd2psaGt0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc0NTkyNDAsImV4cCI6MjA3MzAzNTI0MH0.dmG1YjWoJt4BKIS8V4gFUJwlPv9fpVVkB1kE_izVR2g"}'::jsonb, body:='{"city":"Madrid","country":"Spain","sources":["eventbrite"]}'::jsonb) AS request_id;
$$);

SELECT cron.schedule('refresh-events-marbella', '25 6 * * *', $$
  SELECT net.http_post(url:='https://rmtjtpaytixcfiwjlhkt.supabase.co/functions/v1/fetch-events', headers:='{"Content-Type":"application/json","Authorization":"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJtdGp0cGF5dGl4Y2Zpd2psaGt0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc0NTkyNDAsImV4cCI6MjA3MzAzNTI0MH0.dmG1YjWoJt4BKIS8V4gFUJwlPv9fpVVkB1kE_izVR2g"}'::jsonb, body:='{"city":"Marbella","country":"Spain","sources":["eventbrite"]}'::jsonb) AS request_id;
$$);

SELECT cron.schedule('refresh-events-rome', '26 6 * * *', $$
  SELECT net.http_post(url:='https://rmtjtpaytixcfiwjlhkt.supabase.co/functions/v1/fetch-events', headers:='{"Content-Type":"application/json","Authorization":"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJtdGp0cGF5dGl4Y2Zpd2psaGt0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc0NTkyNDAsImV4cCI6MjA3MzAzNTI0MH0.dmG1YjWoJt4BKIS8V4gFUJwlPv9fpVVkB1kE_izVR2g"}'::jsonb, body:='{"city":"Rome","country":"Italy","sources":["eventbrite"]}'::jsonb) AS request_id;
$$);

SELECT cron.schedule('refresh-events-venice', '27 6 * * *', $$
  SELECT net.http_post(url:='https://rmtjtpaytixcfiwjlhkt.supabase.co/functions/v1/fetch-events', headers:='{"Content-Type":"application/json","Authorization":"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJtdGp0cGF5dGl4Y2Zpd2psaGt0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc0NTkyNDAsImV4cCI6MjA3MzAzNTI0MH0.dmG1YjWoJt4BKIS8V4gFUJwlPv9fpVVkB1kE_izVR2g"}'::jsonb, body:='{"city":"Venice","country":"Italy","sources":["eventbrite"]}'::jsonb) AS request_id;
$$);

SELECT cron.schedule('refresh-events-milan', '28 6 * * *', $$
  SELECT net.http_post(url:='https://rmtjtpaytixcfiwjlhkt.supabase.co/functions/v1/fetch-events', headers:='{"Content-Type":"application/json","Authorization":"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJtdGp0cGF5dGl4Y2Zpd2psaGt0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc0NTkyNDAsImV4cCI6MjA3MzAzNTI0MH0.dmG1YjWoJt4BKIS8V4gFUJwlPv9fpVVkB1kE_izVR2g"}'::jsonb, body:='{"city":"Milan","country":"Italy","sources":["eventbrite"]}'::jsonb) AS request_id;
$$);

SELECT cron.schedule('refresh-events-florence', '29 6 * * *', $$
  SELECT net.http_post(url:='https://rmtjtpaytixcfiwjlhkt.supabase.co/functions/v1/fetch-events', headers:='{"Content-Type":"application/json","Authorization":"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJtdGp0cGF5dGl4Y2Zpd2psaGt0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc0NTkyNDAsImV4cCI6MjA3MzAzNTI0MH0.dmG1YjWoJt4BKIS8V4gFUJwlPv9fpVVkB1kE_izVR2g"}'::jsonb, body:='{"city":"Florence","country":"Italy","sources":["eventbrite"]}'::jsonb) AS request_id;
$$);

SELECT cron.schedule('refresh-events-amalfi', '30 6 * * *', $$
  SELECT net.http_post(url:='https://rmtjtpaytixcfiwjlhkt.supabase.co/functions/v1/fetch-events', headers:='{"Content-Type":"application/json","Authorization":"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJtdGp0cGF5dGl4Y2Zpd2psaGt0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc0NTkyNDAsImV4cCI6MjA3MzAzNTI0MH0.dmG1YjWoJt4BKIS8V4gFUJwlPv9fpVVkB1kE_izVR2g"}'::jsonb, body:='{"city":"Amalfi Coast","country":"Italy","sources":["eventbrite"]}'::jsonb) AS request_id;
$$);

SELECT cron.schedule('refresh-events-london', '31 6 * * *', $$
  SELECT net.http_post(url:='https://rmtjtpaytixcfiwjlhkt.supabase.co/functions/v1/fetch-events', headers:='{"Content-Type":"application/json","Authorization":"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJtdGp0cGF5dGl4Y2Zpd2psaGt0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc0NTkyNDAsImV4cCI6MjA3MzAzNTI0MH0.dmG1YjWoJt4BKIS8V4gFUJwlPv9fpVVkB1kE_izVR2g"}'::jsonb, body:='{"city":"London","country":"United Kingdom","sources":["eventbrite"]}'::jsonb) AS request_id;
$$);

SELECT cron.schedule('refresh-events-edinburgh', '32 6 * * *', $$
  SELECT net.http_post(url:='https://rmtjtpaytixcfiwjlhkt.supabase.co/functions/v1/fetch-events', headers:='{"Content-Type":"application/json","Authorization":"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJtdGp0cGF5dGl4Y2Zpd2psaGt0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc0NTkyNDAsImV4cCI6MjA3MzAzNTI0MH0.dmG1YjWoJt4BKIS8V4gFUJwlPv9fpVVkB1kE_izVR2g"}'::jsonb, body:='{"city":"Edinburgh","country":"United Kingdom","sources":["eventbrite"]}'::jsonb) AS request_id;
$$);

SELECT cron.schedule('refresh-events-berlin', '33 6 * * *', $$
  SELECT net.http_post(url:='https://rmtjtpaytixcfiwjlhkt.supabase.co/functions/v1/fetch-events', headers:='{"Content-Type":"application/json","Authorization":"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJtdGp0cGF5dGl4Y2Zpd2psaGt0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc0NTkyNDAsImV4cCI6MjA3MzAzNTI0MH0.dmG1YjWoJt4BKIS8V4gFUJwlPv9fpVVkB1kE_izVR2g"}'::jsonb, body:='{"city":"Berlin","country":"Germany","sources":["eventbrite"]}'::jsonb) AS request_id;
$$);

SELECT cron.schedule('refresh-events-amsterdam', '34 6 * * *', $$
  SELECT net.http_post(url:='https://rmtjtpaytixcfiwjlhkt.supabase.co/functions/v1/fetch-events', headers:='{"Content-Type":"application/json","Authorization":"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJtdGp0cGF5dGl4Y2Zpd2psaGt0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc0NTkyNDAsImV4cCI6MjA3MzAzNTI0MH0.dmG1YjWoJt4BKIS8V4gFUJwlPv9fpVVkB1kE_izVR2g"}'::jsonb, body:='{"city":"Amsterdam","country":"Netherlands","sources":["eventbrite"]}'::jsonb) AS request_id;
$$);

SELECT cron.schedule('refresh-events-istanbul', '35 6 * * *', $$
  SELECT net.http_post(url:='https://rmtjtpaytixcfiwjlhkt.supabase.co/functions/v1/fetch-events', headers:='{"Content-Type":"application/json","Authorization":"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJtdGp0cGF5dGl4Y2Zpd2psaGt0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc0NTkyNDAsImV4cCI6MjA3MzAzNTI0MH0.dmG1YjWoJt4BKIS8V4gFUJwlPv9fpVVkB1kE_izVR2g"}'::jsonb, body:='{"city":"Istanbul","country":"Turkey","sources":["eventbrite"]}'::jsonb) AS request_id;
$$);

SELECT cron.schedule('refresh-events-lisbon', '36 6 * * *', $$
  SELECT net.http_post(url:='https://rmtjtpaytixcfiwjlhkt.supabase.co/functions/v1/fetch-events', headers:='{"Content-Type":"application/json","Authorization":"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJtdGp0cGF5dGl4Y2Zpd2psaGt0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc0NTkyNDAsImV4cCI6MjA3MzAzNTI0MH0.dmG1YjWoJt4BKIS8V4gFUJwlPv9fpVVkB1kE_izVR2g"}'::jsonb, body:='{"city":"Lisbon","country":"Portugal","sources":["eventbrite"]}'::jsonb) AS request_id;
$$);

SELECT cron.schedule('refresh-events-prague', '37 6 * * *', $$
  SELECT net.http_post(url:='https://rmtjtpaytixcfiwjlhkt.supabase.co/functions/v1/fetch-events', headers:='{"Content-Type":"application/json","Authorization":"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJtdGp0cGF5dGl4Y2Zpd2psaGt0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc0NTkyNDAsImV4cCI6MjA3MzAzNTI0MH0.dmG1YjWoJt4BKIS8V4gFUJwlPv9fpVVkB1kE_izVR2g"}'::jsonb, body:='{"city":"Prague","country":"Czech Republic","sources":["eventbrite"]}'::jsonb) AS request_id;
$$);

SELECT cron.schedule('refresh-events-vienna', '38 6 * * *', $$
  SELECT net.http_post(url:='https://rmtjtpaytixcfiwjlhkt.supabase.co/functions/v1/fetch-events', headers:='{"Content-Type":"application/json","Authorization":"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJtdGp0cGF5dGl4Y2Zpd2psaGt0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc0NTkyNDAsImV4cCI6MjA3MzAzNTI0MH0.dmG1YjWoJt4BKIS8V4gFUJwlPv9fpVVkB1kE_izVR2g"}'::jsonb, body:='{"city":"Vienna","country":"Austria","sources":["eventbrite"]}'::jsonb) AS request_id;
$$);

SELECT cron.schedule('refresh-events-athens', '39 6 * * *', $$
  SELECT net.http_post(url:='https://rmtjtpaytixcfiwjlhkt.supabase.co/functions/v1/fetch-events', headers:='{"Content-Type":"application/json","Authorization":"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJtdGp0cGF5dGl4Y2Zpd2psaGt0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc0NTkyNDAsImV4cCI6MjA3MzAzNTI0MH0.dmG1YjWoJt4BKIS8V4gFUJwlPv9fpVVkB1kE_izVR2g"}'::jsonb, body:='{"city":"Athens","country":"Greece","sources":["eventbrite"]}'::jsonb) AS request_id;
$$);

-- SE ASIA + Japan extras
SELECT cron.schedule('refresh-events-hanoi', '40 6 * * *', $$
  SELECT net.http_post(url:='https://rmtjtpaytixcfiwjlhkt.supabase.co/functions/v1/fetch-events', headers:='{"Content-Type":"application/json","Authorization":"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJtdGp0cGF5dGl4Y2Zpd2psaGt0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc0NTkyNDAsImV4cCI6MjA3MzAzNTI0MH0.dmG1YjWoJt4BKIS8V4gFUJwlPv9fpVVkB1kE_izVR2g"}'::jsonb, body:='{"city":"Hanoi","country":"Vietnam","sources":["eventbrite"]}'::jsonb) AS request_id;
$$);

SELECT cron.schedule('refresh-events-hcmc', '41 6 * * *', $$
  SELECT net.http_post(url:='https://rmtjtpaytixcfiwjlhkt.supabase.co/functions/v1/fetch-events', headers:='{"Content-Type":"application/json","Authorization":"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJtdGp0cGF5dGl4Y2Zpd2psaGt0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc0NTkyNDAsImV4cCI6MjA3MzAzNTI0MH0.dmG1YjWoJt4BKIS8V4gFUJwlPv9fpVVkB1kE_izVR2g"}'::jsonb, body:='{"city":"Ho Chi Minh City","country":"Vietnam","sources":["eventbrite"]}'::jsonb) AS request_id;
$$);

SELECT cron.schedule('refresh-events-kl', '42 6 * * *', $$
  SELECT net.http_post(url:='https://rmtjtpaytixcfiwjlhkt.supabase.co/functions/v1/fetch-events', headers:='{"Content-Type":"application/json","Authorization":"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJtdGp0cGF5dGl4Y2Zpd2psaGt0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc0NTkyNDAsImV4cCI6MjA3MzAzNTI0MH0.dmG1YjWoJt4BKIS8V4gFUJwlPv9fpVVkB1kE_izVR2g"}'::jsonb, body:='{"city":"Kuala Lumpur","country":"Malaysia","sources":["eventbrite"]}'::jsonb) AS request_id;
$$);

SELECT cron.schedule('refresh-events-singapore', '43 6 * * *', $$
  SELECT net.http_post(url:='https://rmtjtpaytixcfiwjlhkt.supabase.co/functions/v1/fetch-events', headers:='{"Content-Type":"application/json","Authorization":"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJtdGp0cGF5dGl4Y2Zpd2psaGt0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc0NTkyNDAsImV4cCI6MjA3MzAzNTI0MH0.dmG1YjWoJt4BKIS8V4gFUJwlPv9fpVVkB1kE_izVR2g"}'::jsonb, body:='{"city":"Singapore","country":"Singapore","sources":["eventbrite"]}'::jsonb) AS request_id;
$$);

SELECT cron.schedule('refresh-events-manila', '44 6 * * *', $$
  SELECT net.http_post(url:='https://rmtjtpaytixcfiwjlhkt.supabase.co/functions/v1/fetch-events', headers:='{"Content-Type":"application/json","Authorization":"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJtdGp0cGF5dGl4Y2Zpd2psaGt0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc0NTkyNDAsImV4cCI6MjA3MzAzNTI0MH0.dmG1YjWoJt4BKIS8V4gFUJwlPv9fpVVkB1kE_izVR2g"}'::jsonb, body:='{"city":"Manila","country":"Philippines","sources":["eventbrite"]}'::jsonb) AS request_id;
$$);

SELECT cron.schedule('refresh-events-phuket', '45 6 * * *', $$
  SELECT net.http_post(url:='https://rmtjtpaytixcfiwjlhkt.supabase.co/functions/v1/fetch-events', headers:='{"Content-Type":"application/json","Authorization":"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJtdGp0cGF5dGl4Y2Zpd2psaGt0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc0NTkyNDAsImV4cCI6MjA3MzAzNTI0MH0.dmG1YjWoJt4BKIS8V4gFUJwlPv9fpVVkB1kE_izVR2g"}'::jsonb, body:='{"city":"Phuket","country":"Thailand","sources":["eventbrite"]}'::jsonb) AS request_id;
$$);

SELECT cron.schedule('refresh-events-osaka', '46 6 * * *', $$
  SELECT net.http_post(url:='https://rmtjtpaytixcfiwjlhkt.supabase.co/functions/v1/fetch-events', headers:='{"Content-Type":"application/json","Authorization":"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJtdGp0cGF5dGl4Y2Zpd2psaGt0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc0NTkyNDAsImV4cCI6MjA3MzAzNTI0MH0.dmG1YjWoJt4BKIS8V4gFUJwlPv9fpVVkB1kE_izVR2g"}'::jsonb, body:='{"city":"Osaka","country":"Japan","sources":["eventbrite"]}'::jsonb) AS request_id;
$$);

SELECT cron.schedule('refresh-events-hiroshima', '47 6 * * *', $$
  SELECT net.http_post(url:='https://rmtjtpaytixcfiwjlhkt.supabase.co/functions/v1/fetch-events', headers:='{"Content-Type":"application/json","Authorization":"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJtdGp0cGF5dGl4Y2Zpd2psaGt0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc0NTkyNDAsImV4cCI6MjA3MzAzNTI0MH0.dmG1YjWoJt4BKIS8V4gFUJwlPv9fpVVkB1kE_izVR2g"}'::jsonb, body:='{"city":"Hiroshima","country":"Japan","sources":["eventbrite"]}'::jsonb) AS request_id;
$$);

SELECT cron.schedule('refresh-events-sapporo', '48 6 * * *', $$
  SELECT net.http_post(url:='https://rmtjtpaytixcfiwjlhkt.supabase.co/functions/v1/fetch-events', headers:='{"Content-Type":"application/json","Authorization":"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJtdGp0cGF5dGl4Y2Zpd2psaGt0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc0NTkyNDAsImV4cCI6MjA3MzAzNTI0MH0.dmG1YjWoJt4BKIS8V4gFUJwlPv9fpVVkB1kE_izVR2g"}'::jsonb, body:='{"city":"Sapporo","country":"Japan","sources":["eventbrite"]}'::jsonb) AS request_id;
$$);

SELECT cron.schedule('refresh-events-nara', '49 6 * * *', $$
  SELECT net.http_post(url:='https://rmtjtpaytixcfiwjlhkt.supabase.co/functions/v1/fetch-events', headers:='{"Content-Type":"application/json","Authorization":"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJtdGp0cGF5dGl4Y2Zpd2psaGt0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc0NTkyNDAsImV4cCI6MjA3MzAzNTI0MH0.dmG1YjWoJt4BKIS8V4gFUJwlPv9fpVVkB1kE_izVR2g"}'::jsonb, body:='{"city":"Nara","country":"Japan","sources":["eventbrite"]}'::jsonb) AS request_id;
$$);

-- MIDDLE EAST & AFRICA
SELECT cron.schedule('refresh-events-dubai', '50 6 * * *', $$
  SELECT net.http_post(url:='https://rmtjtpaytixcfiwjlhkt.supabase.co/functions/v1/fetch-events', headers:='{"Content-Type":"application/json","Authorization":"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJtdGp0cGF5dGl4Y2Zpd2psaGt0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc0NTkyNDAsImV4cCI6MjA3MzAzNTI0MH0.dmG1YjWoJt4BKIS8V4gFUJwlPv9fpVVkB1kE_izVR2g"}'::jsonb, body:='{"city":"Dubai","country":"United Arab Emirates","sources":["eventbrite"]}'::jsonb) AS request_id;
$$);

SELECT cron.schedule('refresh-events-marrakech', '51 6 * * *', $$
  SELECT net.http_post(url:='https://rmtjtpaytixcfiwjlhkt.supabase.co/functions/v1/fetch-events', headers:='{"Content-Type":"application/json","Authorization":"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJtdGp0cGF5dGl4Y2Zpd2psaGt0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc0NTkyNDAsImV4cCI6MjA3MzAzNTI0MH0.dmG1YjWoJt4BKIS8V4gFUJwlPv9fpVVkB1kE_izVR2g"}'::jsonb, body:='{"city":"Marrakech","country":"Morocco","sources":["eventbrite"]}'::jsonb) AS request_id;
$$);

SELECT cron.schedule('refresh-events-cairo', '52 6 * * *', $$
  SELECT net.http_post(url:='https://rmtjtpaytixcfiwjlhkt.supabase.co/functions/v1/fetch-events', headers:='{"Content-Type":"application/json","Authorization":"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJtdGp0cGF5dGl4Y2Zpd2psaGt0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc0NTkyNDAsImV4cCI6MjA3MzAzNTI0MH0.dmG1YjWoJt4BKIS8V4gFUJwlPv9fpVVkB1kE_izVR2g"}'::jsonb, body:='{"city":"Cairo","country":"Egypt","sources":["eventbrite"]}'::jsonb) AS request_id;
$$);

SELECT cron.schedule('refresh-events-capetown', '53 6 * * *', $$
  SELECT net.http_post(url:='https://rmtjtpaytixcfiwjlhkt.supabase.co/functions/v1/fetch-events', headers:='{"Content-Type":"application/json","Authorization":"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJtdGp0cGF5dGl4Y2Zpd2psaGt0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc0NTkyNDAsImV4cCI6MjA3MzAzNTI0MH0.dmG1YjWoJt4BKIS8V4gFUJwlPv9fpVVkB1kE_izVR2g"}'::jsonb, body:='{"city":"Cape Town","country":"South Africa","sources":["eventbrite"]}'::jsonb) AS request_id;
$$);

SELECT cron.schedule('refresh-events-nairobi', '54 6 * * *', $$
  SELECT net.http_post(url:='https://rmtjtpaytixcfiwjlhkt.supabase.co/functions/v1/fetch-events', headers:='{"Content-Type":"application/json","Authorization":"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJtdGp0cGF5dGl4Y2Zpd2psaGt0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc0NTkyNDAsImV4cCI6MjA3MzAzNTI0MH0.dmG1YjWoJt4BKIS8V4gFUJwlPv9fpVVkB1kE_izVR2g"}'::jsonb, body:='{"city":"Nairobi","country":"Kenya","sources":["eventbrite"]}'::jsonb) AS request_id;
$$);

-- LATIN AMERICA
SELECT cron.schedule('refresh-events-mexicocity', '55 6 * * *', $$
  SELECT net.http_post(url:='https://rmtjtpaytixcfiwjlhkt.supabase.co/functions/v1/fetch-events', headers:='{"Content-Type":"application/json","Authorization":"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJtdGp0cGF5dGl4Y2Zpd2psaGt0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc0NTkyNDAsImV4cCI6MjA3MzAzNTI0MH0.dmG1YjWoJt4BKIS8V4gFUJwlPv9fpVVkB1kE_izVR2g"}'::jsonb, body:='{"city":"Mexico City","country":"Mexico","sources":["eventbrite"]}'::jsonb) AS request_id;
$$);

SELECT cron.schedule('refresh-events-buenosaires', '56 6 * * *', $$
  SELECT net.http_post(url:='https://rmtjtpaytixcfiwjlhkt.supabase.co/functions/v1/fetch-events', headers:='{"Content-Type":"application/json","Authorization":"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJtdGp0cGF5dGl4Y2Zpd2psaGt0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc0NTkyNDAsImV4cCI6MjA3MzAzNTI0MH0.dmG1YjWoJt4BKIS8V4gFUJwlPv9fpVVkB1kE_izVR2g"}'::jsonb, body:='{"city":"Buenos Aires","country":"Argentina","sources":["eventbrite"]}'::jsonb) AS request_id;
$$);

SELECT cron.schedule('refresh-events-lima', '57 6 * * *', $$
  SELECT net.http_post(url:='https://rmtjtpaytixcfiwjlhkt.supabase.co/functions/v1/fetch-events', headers:='{"Content-Type":"application/json","Authorization":"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJtdGp0cGF5dGl4Y2Zpd2psaGt0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc0NTkyNDAsImV4cCI6MjA3MzAzNTI0MH0.dmG1YjWoJt4BKIS8V4gFUJwlPv9fpVVkB1kE_izVR2g"}'::jsonb, body:='{"city":"Lima","country":"Peru","sources":["eventbrite"]}'::jsonb) AS request_id;
$$);

SELECT cron.schedule('refresh-events-bogota', '58 6 * * *', $$
  SELECT net.http_post(url:='https://rmtjtpaytixcfiwjlhkt.supabase.co/functions/v1/fetch-events', headers:='{"Content-Type":"application/json","Authorization":"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJtdGp0cGF5dGl4Y2Zpd2psaGt0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc0NTkyNDAsImV4cCI6MjA3MzAzNTI0MH0.dmG1YjWoJt4BKIS8V4gFUJwlPv9fpVVkB1kE_izVR2g"}'::jsonb, body:='{"city":"Bogotá","country":"Colombia","sources":["eventbrite"]}'::jsonb) AS request_id;
$$);

SELECT cron.schedule('refresh-events-rio', '59 6 * * *', $$
  SELECT net.http_post(url:='https://rmtjtpaytixcfiwjlhkt.supabase.co/functions/v1/fetch-events', headers:='{"Content-Type":"application/json","Authorization":"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJtdGp0cGF5dGl4Y2Zpd2psaGt0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc0NTkyNDAsImV4cCI6MjA3MzAzNTI0MH0.dmG1YjWoJt4BKIS8V4gFUJwlPv9fpVVkB1kE_izVR2g"}'::jsonb, body:='{"city":"Rio de Janeiro","country":"Brazil","sources":["eventbrite"]}'::jsonb) AS request_id;
$$);

SELECT cron.schedule('refresh-events-cartagena', '0 7 * * *', $$
  SELECT net.http_post(url:='https://rmtjtpaytixcfiwjlhkt.supabase.co/functions/v1/fetch-events', headers:='{"Content-Type":"application/json","Authorization":"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJtdGp0cGF5dGl4Y2Zpd2psaGt0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc0NTkyNDAsImV4cCI6MjA3MzAzNTI0MH0.dmG1YjWoJt4BKIS8V4gFUJwlPv9fpVVkB1kE_izVR2g"}'::jsonb, body:='{"city":"Cartagena","country":"Colombia","sources":["eventbrite"]}'::jsonb) AS request_id;
$$);
