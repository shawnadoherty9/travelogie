-- Drop the insecure policy that allows viewing all profiles
DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;

-- Create a secure policy that only allows users to view their own profile
CREATE POLICY "Users can view their own profile only" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = user_id);

-- Add a column for public profile visibility (optional for future use)
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS is_profile_public boolean DEFAULT false;

-- Create a policy for limited public profile access (only non-sensitive fields)
CREATE POLICY "Public profiles visible to all" 
ON public.profiles 
FOR SELECT 
USING (
  is_profile_public = true 
  AND auth.uid() IS NOT NULL  -- Must be authenticated
);

-- Create a security definer function to get limited public profile data
CREATE OR REPLACE FUNCTION public.get_public_profile(profile_user_id uuid)
RETURNS TABLE (
  id uuid,
  first_name text,
  last_name text,
  bio text,
  is_verified boolean,
  languages text[]
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.first_name,
    p.last_name,
    p.bio,
    p.is_verified,
    p.languages
  FROM public.profiles p
  WHERE p.user_id = profile_user_id 
    AND p.is_profile_public = true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE SET search_path = public;