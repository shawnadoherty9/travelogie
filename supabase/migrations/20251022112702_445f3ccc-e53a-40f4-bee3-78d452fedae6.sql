-- Fix SECURITY DEFINER functions - handle trigger dependency

-- 1. Drop trigger that depends on auto_admin_check
DROP TRIGGER IF EXISTS auto_admin_trigger ON public.profiles;

-- 2. Remove auto_admin_check() - hardcoded emails are security risk
DROP FUNCTION IF EXISTS public.auto_admin_check();

-- 3. Restrict make_admin() to only be callable by existing admins
DROP FUNCTION IF EXISTS public.make_admin(text);

CREATE OR REPLACE FUNCTION public.make_admin(user_email text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  target_user_id uuid;
BEGIN
  -- First verify caller is an admin
  IF NOT has_role(auth.uid(), 'admin'::app_role) THEN
    RAISE EXCEPTION 'Access denied: Only admins can grant admin privileges';
  END IF;

  -- Validate email format
  IF user_email !~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$' THEN
    RAISE EXCEPTION 'Invalid email format';
  END IF;

  -- Find user by email
  SELECT id INTO target_user_id
  FROM auth.users
  WHERE email = user_email;

  IF target_user_id IS NULL THEN
    RAISE EXCEPTION 'User not found';
  END IF;

  -- Check if already admin
  IF EXISTS (
    SELECT 1 FROM user_roles 
    WHERE user_id = target_user_id AND role = 'admin'::app_role
  ) THEN
    RAISE NOTICE 'User is already an admin';
    RETURN;
  END IF;

  -- Grant admin role
  INSERT INTO user_roles (user_id, role)
  VALUES (target_user_id, 'admin'::app_role);
END;
$$;

-- 4. Add validation to get_public_posts_safe() to sanitize location data
DROP FUNCTION IF EXISTS public.get_public_posts_safe();

CREATE OR REPLACE FUNCTION public.get_public_posts_safe()
RETURNS TABLE(
  id uuid,
  title text,
  content text,
  post_type text,
  media_urls text[],
  location_name text,
  tags text[],
  created_at timestamptz
)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.title,
    p.content,
    p.post_type,
    p.media_urls,
    -- Sanitize location to prevent PII exposure
    CASE 
      WHEN p.location_name IS NOT NULL THEN 
        split_part(p.location_name, ',', 1) -- Only return city name, not full address
      ELSE NULL
    END as location_name,
    p.tags,
    p.created_at
  FROM posts p
  WHERE p.is_public = true
  ORDER BY p.created_at DESC;
END;
$$;

-- 5. Add input validation to get_public_profile_data()
DROP FUNCTION IF EXISTS public.get_public_profile_data(uuid);

CREATE OR REPLACE FUNCTION public.get_public_profile_data(profile_user_id uuid)
RETURNS TABLE(
  first_name text,
  last_name text,
  bio text,
  profile_image_url text,
  languages text[],
  user_type text
)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Validate UUID format
  IF profile_user_id IS NULL THEN
    RAISE EXCEPTION 'User ID is required';
  END IF;

  RETURN QUERY
  SELECT 
    p.first_name,
    p.last_name,
    p.bio,
    p.profile_image_url,
    p.languages,
    p.user_type::text
  FROM profiles p
  WHERE p.user_id = profile_user_id 
    AND p.is_profile_public = true;
END;
$$;

-- 6. Tighten storage policies - prevent anonymous uploads
DROP POLICY IF EXISTS "Anyone can upload travel photos" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can upload avatars" ON storage.objects;

-- Only authenticated users can upload to their own folder
CREATE POLICY "Authenticated users can upload their own avatars"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'avatars' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Authenticated users can upload their own travel photos"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'travel-photos' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);