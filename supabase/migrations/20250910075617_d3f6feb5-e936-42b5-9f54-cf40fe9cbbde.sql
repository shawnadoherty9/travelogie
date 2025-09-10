-- Enable RLS and create proper policies for all new tables

-- Enable RLS for all new tables
ALTER TABLE public.availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_languages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.visited_places ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lesson_recordings ENABLE ROW LEVEL SECURITY;

-- Availability policies (only authenticated users)
CREATE POLICY "Users can view all availability" ON public.availability
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can manage their own availability" ON public.availability
  FOR ALL TO authenticated USING (auth.uid() = user_id);

-- Bookings policies (only authenticated users)
CREATE POLICY "Users can view bookings as provider or customer" ON public.bookings
  FOR SELECT TO authenticated USING (auth.uid() = provider_id OR auth.uid() = customer_id);

CREATE POLICY "Users can create bookings as customers" ON public.bookings
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = customer_id);

CREATE POLICY "Providers can update their bookings" ON public.bookings
  FOR UPDATE TO authenticated USING (auth.uid() = provider_id);

-- Services policies (only authenticated users)
CREATE POLICY "Users can view all active services" ON public.services
  FOR SELECT TO authenticated USING (is_active = true);

CREATE POLICY "Users can manage their own services" ON public.services
  FOR ALL TO authenticated USING (auth.uid() = user_id);

-- User languages policies (only authenticated users)
CREATE POLICY "Users can view all user languages" ON public.user_languages
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can manage their own languages" ON public.user_languages
  FOR ALL TO authenticated USING (auth.uid() = user_id);

-- Visited places policies (only authenticated users)
CREATE POLICY "Users can view public visited places" ON public.visited_places
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can manage their own visited places" ON public.visited_places
  FOR ALL TO authenticated USING (auth.uid() = user_id);

-- Posts policies (only authenticated users)
CREATE POLICY "Users can view public posts" ON public.posts
  FOR SELECT TO authenticated USING (is_public = true);

CREATE POLICY "Users can view their own posts" ON public.posts
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own posts" ON public.posts
  FOR ALL TO authenticated USING (auth.uid() = user_id);

-- Favorites policies (only authenticated users)
CREATE POLICY "Users can manage their own favorites" ON public.favorites
  FOR ALL TO authenticated USING (auth.uid() = user_id);

-- Lesson recordings policies (only authenticated users)
CREATE POLICY "Teachers and students can view their recordings" ON public.lesson_recordings
  FOR SELECT TO authenticated USING (auth.uid() = teacher_id OR auth.uid() = student_id);

CREATE POLICY "Teachers can manage recordings" ON public.lesson_recordings
  FOR ALL TO authenticated USING (auth.uid() = teacher_id);

-- Create triggers for updated_at columns
CREATE TRIGGER update_availability_updated_at
  BEFORE UPDATE ON public.availability
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at
  BEFORE UPDATE ON public.bookings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_services_updated_at
  BEFORE UPDATE ON public.services
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_posts_updated_at
  BEFORE UPDATE ON public.posts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_availability_user_date ON public.availability(user_id, date);
CREATE INDEX IF NOT EXISTS idx_bookings_provider_id ON public.bookings(provider_id);
CREATE INDEX IF NOT EXISTS idx_bookings_customer_id ON public.bookings(customer_id);
CREATE INDEX IF NOT EXISTS idx_bookings_date ON public.bookings(booking_date);
CREATE INDEX IF NOT EXISTS idx_services_user_id ON public.services(user_id);
CREATE INDEX IF NOT EXISTS idx_services_type ON public.services(service_type);
CREATE INDEX IF NOT EXISTS idx_user_languages_user_id ON public.user_languages(user_id);
CREATE INDEX IF NOT EXISTS idx_visited_places_user_id ON public.visited_places(user_id);
CREATE INDEX IF NOT EXISTS idx_posts_user_id ON public.posts(user_id);
CREATE INDEX IF NOT EXISTS idx_posts_public ON public.posts(is_public) WHERE is_public = true;
CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON public.favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_lesson_recordings_booking_id ON public.lesson_recordings(booking_id);