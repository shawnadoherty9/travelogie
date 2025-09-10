-- Enable RLS on tables that don't have it
ALTER TABLE public.availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lesson_recordings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

-- Add RLS policies for availability table
CREATE POLICY "Users can view their own availability" 
ON public.availability 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own availability" 
ON public.availability 
FOR ALL 
USING (auth.uid() = user_id);

-- Add RLS policies for bookings table
CREATE POLICY "Users can view their own bookings as provider" 
ON public.bookings 
FOR SELECT 
USING (auth.uid() = provider_id);

CREATE POLICY "Users can view their own bookings as customer" 
ON public.bookings 
FOR SELECT 
USING (auth.uid() = customer_id);

CREATE POLICY "Users can manage their own bookings as customer" 
ON public.bookings 
FOR ALL 
USING (auth.uid() = customer_id);

-- Add RLS policies for services table
CREATE POLICY "Users can view active services" 
ON public.services 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "Users can manage their own services" 
ON public.services 
FOR ALL 
USING (auth.uid() = user_id);

-- Add RLS policies for lesson_recordings table
CREATE POLICY "Teachers can view their own lesson recordings" 
ON public.lesson_recordings 
FOR SELECT 
USING (auth.uid() = teacher_id);

CREATE POLICY "Students can view their own lesson recordings" 
ON public.lesson_recordings 
FOR SELECT 
USING (auth.uid() = student_id);

CREATE POLICY "Teachers can manage their own lesson recordings" 
ON public.lesson_recordings 
FOR ALL 
USING (auth.uid() = teacher_id);