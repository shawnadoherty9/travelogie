ALTER TABLE public.tour_operators ADD COLUMN IF NOT EXISTS intro_video_url text;
ALTER TABLE public.services ADD COLUMN IF NOT EXISTS video_url text;

CREATE POLICY "Anyone can view tour videos" ON storage.objects FOR SELECT USING (bucket_id = 'tour-videos');
CREATE POLICY "Users upload own tour videos" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'tour-videos' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "Users update own tour videos" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'tour-videos' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "Users delete own tour videos" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'tour-videos' AND (storage.foldername(name))[1] = auth.uid()::text);

DROP FUNCTION IF EXISTS public.get_public_tour_operators();
CREATE FUNCTION public.get_public_tour_operators()
 RETURNS TABLE(id uuid, business_name text, description text, specialties text[], languages_spoken text[], cities_covered text[], experience_years integer, rating numeric, review_count integer, hourly_rate numeric, daily_rate numeric, currency text, website_url text, social_media_links jsonb, profile_image_url text, gallery_urls text[], certifications text[], insurance_verified boolean, background_checked boolean, is_active boolean, created_at timestamptz, updated_at timestamptz, intro_video_url text)
 LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO 'public'
AS $$
  SELECT t.id, t.business_name, t.description, t.specialties, t.languages_spoken, t.cities_covered, t.experience_years, t.rating, t.review_count, t.hourly_rate, t.daily_rate, t.currency, t.website_url, t.social_media_links, t.profile_image_url, t.gallery_urls, t.certifications, t.insurance_verified, t.background_checked, t.is_active, t.created_at, t.updated_at, t.intro_video_url
  FROM tour_operators t WHERE t.is_active = true;
$$;
GRANT EXECUTE ON FUNCTION public.get_public_tour_operators() TO anon, authenticated;