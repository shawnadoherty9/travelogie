-- Fix travel suggestions security vulnerabilities
-- 1. Update upvote tracking to use user_id instead of IP

-- First, add user_id column to travel_suggestion_upvotes
ALTER TABLE public.travel_suggestion_upvotes 
ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id);

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_travel_suggestion_upvotes_user_id 
ON public.travel_suggestion_upvotes(user_id);

-- Drop old policies
DROP POLICY IF EXISTS "Anyone can add upvotes" ON public.travel_suggestion_upvotes;
DROP POLICY IF EXISTS "Anyone can view upvotes" ON public.travel_suggestion_upvotes;

-- Create new authenticated-only policies for upvotes
CREATE POLICY "Authenticated users can add upvotes" 
ON public.travel_suggestion_upvotes 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view upvotes" 
ON public.travel_suggestion_upvotes 
FOR SELECT 
USING (true);

-- Add unique constraint for user_id + suggestion_id to prevent duplicate upvotes
ALTER TABLE public.travel_suggestion_upvotes
DROP CONSTRAINT IF EXISTS travel_suggestion_upvotes_suggestion_id_user_ip_key;

-- Add new unique constraint
ALTER TABLE public.travel_suggestion_upvotes
ADD CONSTRAINT travel_suggestion_upvotes_suggestion_user_unique 
UNIQUE (suggestion_id, user_id);

-- Drop old policies for travel_suggestions
DROP POLICY IF EXISTS "Anyone can add travel suggestions" ON public.travel_suggestions;
DROP POLICY IF EXISTS "Anyone can view travel suggestions" ON public.travel_suggestions;

-- Create new policies requiring authentication for adding suggestions
CREATE POLICY "Authenticated users can add travel suggestions" 
ON public.travel_suggestions 
FOR INSERT 
TO authenticated
WITH CHECK (true);

CREATE POLICY "Anyone can view travel suggestions" 
ON public.travel_suggestions 
FOR SELECT 
USING (true);

-- Update the increment_suggestion_upvotes function to use auth.uid()
CREATE OR REPLACE FUNCTION public.increment_suggestion_upvotes(suggestion_id uuid)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
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

  -- Check if user already upvoted
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
  
  -- Insert the upvote
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
$function$;