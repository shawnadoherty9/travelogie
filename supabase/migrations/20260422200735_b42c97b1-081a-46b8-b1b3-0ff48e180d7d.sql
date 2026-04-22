
-- Add event_venue to app_role enum
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'event_venue';

-- Create a security definer function for self-assigning registration roles
CREATE OR REPLACE FUNCTION public.assign_registration_role(p_role text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  allowed_roles text[] := ARRAY['user', 'tour_operator', 'language_teacher', 'cultural_guide', 'event_venue'];
  current_user_id uuid;
BEGIN
  current_user_id := auth.uid();
  
  IF current_user_id IS NULL THEN
    RAISE EXCEPTION 'Authentication required';
  END IF;
  
  -- Only allow non-admin registration roles
  IF NOT (p_role = ANY(allowed_roles)) THEN
    RAISE EXCEPTION 'Invalid registration role: %', p_role;
  END IF;
  
  -- Insert role if not already assigned
  INSERT INTO public.user_roles (user_id, role)
  VALUES (current_user_id, p_role::app_role)
  ON CONFLICT (user_id, role) DO NOTHING;
END;
$$;
