-- Fix privacy issues with user location and travel data

-- Remove the problematic public read policy for visited_places
DROP POLICY IF EXISTS "Users can view public visited places" ON public.visited_places;

-- Add a more restrictive policy that only allows users to see their own visited places
-- and optionally allow friends/connections to see limited data (if that feature exists)
CREATE POLICY "Users can only view their own visited places" 
ON public.visited_places 
FOR SELECT 
USING (auth.uid() = user_id);

-- For posts table, we need to be more careful about coordinate exposure
-- Drop the existing public posts policy 
DROP POLICY IF EXISTS "Users can view public posts" ON public.posts;

-- Create a new policy that allows viewing public posts but strips sensitive location data
-- Note: This approach requires handling coordinates access at application level
CREATE POLICY "Users can view public posts content" 
ON public.posts 
FOR SELECT 
USING (
  is_public = true OR auth.uid() = user_id
);

-- Add a security function to get sanitized public posts (without precise coordinates)
CREATE OR REPLACE FUNCTION public.get_public_posts_safe()
RETURNS TABLE(
  id uuid,
  user_id uuid,
  title text,
  content text,
  post_type text,
  location_name text,
  tags text[],
  media_urls text[],
  created_at timestamp with time zone,
  updated_at timestamp with time zone,
  approximate_location text
) 
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.user_id,
    p.title,
    p.content,
    p.post_type,
    p.location_name,
    p.tags,
    p.media_urls,
    p.created_at,
    p.updated_at,
    -- Only show general area, not precise coordinates
    CASE 
      WHEN p.location_name IS NOT NULL THEN 
        split_part(p.location_name, ',', 1) -- Just city/region name
      ELSE 
        'Unknown location'
    END as approximate_location
  FROM public.posts p
  WHERE p.is_public = true
  ORDER BY p.created_at DESC;
END;
$$;

-- Add function for users to get their own posts with full location data
CREATE OR REPLACE FUNCTION public.get_user_posts_with_location()
RETURNS TABLE(
  id uuid,
  user_id uuid,
  title text,
  content text,
  post_type text,
  location_name text,
  coordinates point,
  tags text[],
  media_urls text[],
  is_public boolean,
  created_at timestamp with time zone,
  updated_at timestamp with time zone
) 
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Only authenticated users can access this function
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Authentication required';
  END IF;

  RETURN QUERY
  SELECT 
    p.id,
    p.user_id,
    p.title,
    p.content,
    p.post_type,
    p.location_name,
    p.coordinates,
    p.tags,
    p.media_urls,
    p.is_public,
    p.created_at,
    p.updated_at
  FROM public.posts p
  WHERE p.user_id = auth.uid()
  ORDER BY p.created_at DESC;
END;
$$;

-- Add privacy controls for future use
CREATE TABLE IF NOT EXISTS public.user_privacy_settings (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  show_location_in_posts boolean DEFAULT false,
  show_travel_history boolean DEFAULT false,
  allow_location_sharing boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable RLS on privacy settings
ALTER TABLE public.user_privacy_settings ENABLE ROW LEVEL SECURITY;

-- Privacy settings policies
CREATE POLICY "Users can manage their own privacy settings" 
ON public.user_privacy_settings 
FOR ALL 
USING (auth.uid() = user_id);

-- Add trigger for privacy settings timestamps
CREATE TRIGGER update_user_privacy_settings_updated_at
BEFORE UPDATE ON public.user_privacy_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();