-- Check current policies and fix anonymous access issues

-- Drop and recreate the update policy to ensure it only allows authenticated users
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

CREATE POLICY "Authenticated users can update their own profile" 
ON public.profiles 
FOR UPDATE 
TO authenticated  -- Explicitly restrict to authenticated users only
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Also ensure the select policy is properly restricted
DROP POLICY IF EXISTS "Users can view their own profile only" ON public.profiles;

CREATE POLICY "Authenticated users can view their own profile" 
ON public.profiles 
FOR SELECT 
TO authenticated  -- Explicitly restrict to authenticated users only
USING (auth.uid() = user_id);

-- Update the public profiles policy to be more explicit
DROP POLICY IF EXISTS "Authenticated users can view public profiles" ON public.profiles;

CREATE POLICY "Authenticated users can view public profiles" 
ON public.profiles 
FOR SELECT 
TO authenticated  -- Explicitly restrict to authenticated users only
USING (
  is_profile_public = true 
  AND auth.uid() != user_id   -- Can't use this policy to view own profile
);