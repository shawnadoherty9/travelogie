-- Fix security vulnerability: Restrict public profile data access
-- Remove the overly permissive public profile policy
DROP POLICY IF EXISTS "Authenticated users can view public profiles" ON public.profiles;

-- Create a secure function that returns only safe public profile data
CREATE OR REPLACE FUNCTION public.get_public_profile_data(profile_user_id uuid)
RETURNS TABLE(
    id uuid,
    first_name text,
    last_name text,
    bio text,
    is_verified boolean,
    languages text[],
    location text,
    profile_image_url text,
    user_type text
) 
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.id,
        p.first_name,
        p.last_name,
        p.bio,
        p.is_verified,
        p.languages,
        p.location,
        p.profile_image_url,
        p.user_type::text
    FROM public.profiles p
    WHERE p.user_id = profile_user_id 
        AND p.is_profile_public = true
        AND p.user_id != auth.uid(); -- Exclude own profile (handled by separate policy)
END;
$$;

-- Create a new restricted policy for viewing public profiles
-- This policy only allows viewing specific safe fields, not the entire row
CREATE POLICY "Users can view limited public profile data" 
ON public.profiles 
FOR SELECT 
USING (
    -- Users can only see their own complete profile
    auth.uid() = user_id
    OR
    -- Or they can see limited data of public profiles through the function only
    false -- This effectively blocks direct table access for other users
);

-- Add a comment explaining the security measure
COMMENT ON FUNCTION public.get_public_profile_data IS 'Securely returns limited public profile information, excluding sensitive data like email addresses, birthdates, and other personal details';