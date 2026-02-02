-- Add a policy for rate_limits that allows no direct access
-- This is intentional - only edge functions with service role key can access
-- Adding a policy to satisfy the linter but keeping it restrictive

CREATE POLICY "No direct user access to rate limits"
ON public.rate_limits
FOR ALL
USING (false);

-- This ensures:
-- 1. RLS is enabled (security best practice)
-- 2. No users can directly access rate_limits
-- 3. Edge functions using service role key bypass RLS
-- 4. The check_rate_limit function uses SECURITY DEFINER with proper search_path