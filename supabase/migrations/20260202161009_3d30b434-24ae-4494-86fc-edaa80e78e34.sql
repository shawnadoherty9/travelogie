-- Fix 1: Drop the old insecure function with user_ip parameter (no search_path set)
-- This addresses SUPA_function_search_path_mutable
DROP FUNCTION IF EXISTS public.increment_suggestion_upvotes(uuid, text);

-- Fix 2: Harden the RLS policy on travel_suggestions that uses WITH CHECK (true)
-- This addresses SUPA_rls_policy_always_true
DROP POLICY IF EXISTS "Authenticated users can add travel suggestions" ON travel_suggestions;

CREATE POLICY "Authenticated users can add travel suggestions"
ON travel_suggestions
FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL);

-- Fix 3: Replace SECURITY DEFINER function with SECURITY INVOKER version
-- This addresses increment_upvote_definer warning
-- The function will now respect RLS policies instead of bypassing them

DROP FUNCTION IF EXISTS public.increment_suggestion_upvotes(uuid);

-- Create the improved function with SECURITY INVOKER
CREATE OR REPLACE FUNCTION public.increment_suggestion_upvotes(suggestion_id uuid)
RETURNS json
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
DECLARE
  result JSON;
  new_count INTEGER;
  current_user_id uuid;
BEGIN
  -- Get the current user's ID
  current_user_id := auth.uid();
  
  -- Require authentication
  IF current_user_id IS NULL THEN
    RAISE EXCEPTION 'Authentication required to upvote';
  END IF;

  -- Validate UUID input
  IF suggestion_id IS NULL THEN
    RAISE EXCEPTION 'suggestion_id is required';
  END IF;

  -- Check if suggestion exists
  IF NOT EXISTS (SELECT 1 FROM public.travel_suggestions WHERE id = suggestion_id) THEN
    RAISE EXCEPTION 'Suggestion not found';
  END IF;

  -- Check if user already upvoted (idempotent check)
  IF EXISTS (
    SELECT 1 FROM public.travel_suggestion_upvotes
    WHERE travel_suggestion_upvotes.suggestion_id = increment_suggestion_upvotes.suggestion_id
    AND travel_suggestion_upvotes.user_id = current_user_id
  ) THEN
    -- Return current count without error (idempotent)
    SELECT COUNT(*) INTO new_count
    FROM public.travel_suggestion_upvotes
    WHERE travel_suggestion_upvotes.suggestion_id = increment_suggestion_upvotes.suggestion_id;
    
    result := json_build_object('upvotes', new_count, 'already_voted', true);
    RETURN result;
  END IF;
  
  -- Insert the upvote (RLS will verify user can insert)
  INSERT INTO public.travel_suggestion_upvotes (suggestion_id, user_id, user_ip)
  VALUES (suggestion_id, current_user_id, 'authenticated');
  
  -- Count total upvotes for this suggestion
  SELECT COUNT(*) INTO new_count
  FROM public.travel_suggestion_upvotes
  WHERE travel_suggestion_upvotes.suggestion_id = increment_suggestion_upvotes.suggestion_id;
  
  -- Update the suggestion with new count
  UPDATE public.travel_suggestions
  SET upvotes = new_count
  WHERE id = suggestion_id;
  
  result := json_build_object('upvotes', new_count, 'already_voted', false);
  RETURN result;
END;
$$;

-- Fix 4: Create rate limiting table for edge functions
-- This addresses no_rate_limiting warning
CREATE TABLE IF NOT EXISTS public.rate_limits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  identifier text NOT NULL,
  endpoint text NOT NULL,
  request_count integer NOT NULL DEFAULT 1,
  window_start timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (identifier, endpoint)
);

-- Enable RLS on rate_limits - only system/edge functions should access this
ALTER TABLE public.rate_limits ENABLE ROW LEVEL SECURITY;

-- No direct user access - edge functions use service role key
-- This is intentionally restrictive

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_rate_limits_lookup ON public.rate_limits(identifier, endpoint, window_start);

-- Create a function to check and update rate limits
CREATE OR REPLACE FUNCTION public.check_rate_limit(
  p_identifier text,
  p_endpoint text,
  p_max_requests integer,
  p_window_minutes integer
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_current_count integer;
  v_window_start timestamptz;
BEGIN
  -- Calculate window start time
  v_window_start := now() - (p_window_minutes || ' minutes')::interval;
  
  -- Clean up old entries for this identifier/endpoint
  DELETE FROM public.rate_limits 
  WHERE identifier = p_identifier 
    AND endpoint = p_endpoint 
    AND window_start < v_window_start;
  
  -- Try to get current count
  SELECT request_count INTO v_current_count
  FROM public.rate_limits
  WHERE identifier = p_identifier
    AND endpoint = p_endpoint
    AND window_start >= v_window_start;
  
  IF v_current_count IS NULL THEN
    -- No existing record, create new one
    INSERT INTO public.rate_limits (identifier, endpoint, request_count, window_start)
    VALUES (p_identifier, p_endpoint, 1, now())
    ON CONFLICT (identifier, endpoint) 
    DO UPDATE SET 
      request_count = 1,
      window_start = now();
    RETURN true;
  ELSIF v_current_count >= p_max_requests THEN
    -- Rate limit exceeded
    RETURN false;
  ELSE
    -- Increment counter
    UPDATE public.rate_limits
    SET request_count = request_count + 1
    WHERE identifier = p_identifier AND endpoint = p_endpoint;
    RETURN true;
  END IF;
END;
$$;

-- Grant execute to authenticated users for the rate limit function
GRANT EXECUTE ON FUNCTION public.check_rate_limit TO authenticated;
GRANT EXECUTE ON FUNCTION public.check_rate_limit TO anon;