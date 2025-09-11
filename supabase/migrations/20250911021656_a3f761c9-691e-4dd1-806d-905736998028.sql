-- Create proper Role-Based Access Control (RBAC) system
-- Step 1: Create role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user', 'tour_operator', 'language_teacher', 'cultural_guide');

-- Step 2: Create user_roles table
CREATE TABLE public.user_roles (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now(),
    UNIQUE (user_id, role)
);

-- Step 3: Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Step 4: Create security definer function to check roles (prevents RLS recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Step 5: Create function to get user roles
CREATE OR REPLACE FUNCTION public.get_user_roles(_user_id uuid)
RETURNS TABLE(role app_role)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT ur.role
  FROM public.user_roles ur
  WHERE ur.user_id = _user_id
$$;

-- Step 6: Create RLS policies for user_roles table
CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Only admins can manage user roles"
ON public.user_roles
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Step 7: Create trigger for updating timestamps
CREATE TRIGGER update_user_roles_updated_at
    BEFORE UPDATE ON public.user_roles
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Step 8: Insert default admin role for existing admin users (based on current admin verification logic)
-- Note: This assumes existing admin verification was based on specific emails
-- Users will need to manually assign roles through a proper admin interface

-- Step 9: Fix anonymous access policies - Update policies to require authentication
-- Fix bookings table policies
DROP POLICY IF EXISTS "Users can manage their own bookings as customer" ON public.bookings;
DROP POLICY IF EXISTS "Users can view their own bookings as customer" ON public.bookings;
DROP POLICY IF EXISTS "Users can view their own bookings as provider" ON public.bookings;

CREATE POLICY "Authenticated users can manage their own bookings as customer"
ON public.bookings
FOR ALL
TO authenticated
USING (auth.uid() = customer_id);

CREATE POLICY "Authenticated users can view their own bookings as provider"
ON public.bookings
FOR SELECT
TO authenticated
USING (auth.uid() = provider_id);

-- Fix availability table policies
DROP POLICY IF EXISTS "Users can manage their own availability" ON public.availability;
DROP POLICY IF EXISTS "Users can view their own availability" ON public.availability;

CREATE POLICY "Authenticated users can manage their own availability"
ON public.availability
FOR ALL
TO authenticated
USING (auth.uid() = user_id);

-- Fix services table policies
DROP POLICY IF EXISTS "Users can manage their own services" ON public.services;
DROP POLICY IF EXISTS "Users can view active services" ON public.services;

CREATE POLICY "Authenticated users can manage their own services"
ON public.services
FOR ALL
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Public can view active services"
ON public.services
FOR SELECT
USING (is_active = true);

-- Fix lesson_recordings table policies
DROP POLICY IF EXISTS "Students can view their own lesson recordings" ON public.lesson_recordings;
DROP POLICY IF EXISTS "Teachers can manage their own lesson recordings" ON public.lesson_recordings;
DROP POLICY IF EXISTS "Teachers can view their own lesson recordings" ON public.lesson_recordings;

CREATE POLICY "Authenticated students can view their own lesson recordings"
ON public.lesson_recordings
FOR SELECT
TO authenticated
USING (auth.uid() = student_id);

CREATE POLICY "Authenticated teachers can manage their own lesson recordings"
ON public.lesson_recordings
FOR ALL
TO authenticated
USING (auth.uid() = teacher_id);