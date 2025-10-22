-- Drop existing function first to change its signature
DROP FUNCTION IF EXISTS public.get_public_profile_data(uuid);

-- Recreate function without user_type to prevent enumeration
CREATE OR REPLACE FUNCTION public.get_public_profile_data(profile_user_id uuid)
RETURNS TABLE(
  id uuid,
  first_name text,
  last_name text,
  bio text,
  is_verified boolean,
  languages text[],
  location text,
  profile_image_url text
)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
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
    p.profile_image_url
  FROM public.profiles p
  WHERE p.user_id = profile_user_id 
    AND p.is_profile_public = true
    AND p.user_id != auth.uid(); -- Exclude own profile
END;
$$;

-- Add length constraints to profiles table for security
ALTER TABLE public.profiles 
  ADD CONSTRAINT first_name_length CHECK (char_length(first_name) <= 100),
  ADD CONSTRAINT last_name_length CHECK (char_length(last_name) <= 100),
  ADD CONSTRAINT bio_length CHECK (char_length(bio) <= 2000),
  ADD CONSTRAINT location_length CHECK (char_length(location) <= 500),
  ADD CONSTRAINT home_city_length CHECK (char_length(home_city) <= 500),
  ADD CONSTRAINT upcoming_travel_length CHECK (char_length(upcoming_travel) <= 5000);