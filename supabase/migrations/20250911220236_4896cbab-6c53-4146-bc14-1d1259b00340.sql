-- Fix security issue: Create view and function for safe public access to tour operators
-- without exposing sensitive contact information

-- 1. Create a security definer function that returns safe tour operator data for public view
CREATE OR REPLACE FUNCTION public.get_public_tour_operators()
RETURNS TABLE(
  id uuid,
  business_name text,
  description text,
  specialties text[],
  languages_spoken text[],
  cities_covered text[],
  experience_years integer,
  rating numeric,
  review_count integer,
  hourly_rate numeric,
  daily_rate numeric,
  currency text,
  website_url text,
  social_media_links jsonb,
  profile_image_url text,
  gallery_urls text[],
  certifications text[],
  insurance_verified boolean,
  background_checked boolean,
  is_active boolean,
  created_at timestamp with time zone,
  updated_at timestamp with time zone
) 
LANGUAGE SQL
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT 
    t.id,
    t.business_name,
    t.description,
    t.specialties,
    t.languages_spoken,
    t.cities_covered,
    t.experience_years,
    t.rating,
    t.review_count,
    t.hourly_rate,
    t.daily_rate,
    t.currency,
    t.website_url,
    t.social_media_links,
    t.profile_image_url,
    t.gallery_urls,
    t.certifications,
    t.insurance_verified,
    t.background_checked,
    t.is_active,
    t.created_at,
    t.updated_at
  FROM tour_operators t
  WHERE t.is_active = true;
$$;

-- 2. Create a security definer function to get contact info only for legitimate booking purposes
CREATE OR REPLACE FUNCTION public.get_tour_operator_contact(operator_id uuid)
RETURNS TABLE(
  contact_email text,
  contact_phone text
)
LANGUAGE SQL
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT 
    t.contact_email,
    t.contact_phone
  FROM tour_operators t
  WHERE t.id = operator_id 
    AND t.is_active = true
    AND auth.uid() IS NOT NULL; -- Only authenticated users can access contact info
$$;

-- 3. Drop the existing public read policy 
DROP POLICY IF EXISTS "Allow public read access to active tour operators" ON public.tour_operators;

-- 4. Create new restrictive policies
CREATE POLICY "Authenticated users can manage their own tour operator profile"
  ON public.tour_operators
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 5. Create policy for authenticated users to view basic info (no contact details)
CREATE POLICY "Authenticated users can view basic tour operator info"
  ON public.tour_operators
  FOR SELECT
  TO authenticated
  USING (is_active = true);

-- 6. Grant execute permissions on the public function
GRANT EXECUTE ON FUNCTION public.get_public_tour_operators() TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_tour_operator_contact(uuid) TO authenticated;