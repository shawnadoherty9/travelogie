-- Fix the anonymous access issue by requiring authentication for public profiles
DROP POLICY IF EXISTS "Public profiles visible to all" ON public.profiles;

-- Create a more secure policy for public profiles that requires authentication
CREATE POLICY "Authenticated users can view public profiles" 
ON public.profiles 
FOR SELECT 
USING (
  is_profile_public = true 
  AND auth.uid() IS NOT NULL  -- Must be authenticated
  AND auth.uid() != user_id   -- Can't use this policy to view own profile
);

-- The main policy for users viewing their own profiles remains unchanged