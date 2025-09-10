-- Create remaining tables for the enhanced profile system

-- Create languages table for tracking spoken languages and fluency
CREATE TABLE IF NOT EXISTS public.user_languages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  language_code TEXT NOT NULL,
  language_name TEXT NOT NULL,
  fluency_level TEXT NOT NULL CHECK (fluency_level IN ('beginner', 'intermediate', 'advanced', 'native')),
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, language_code)
);

-- Create visited places table for travelers
CREATE TABLE IF NOT EXISTS public.visited_places (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  place_name TEXT NOT NULL,
  country TEXT NOT NULL,
  coordinates POINT,
  visit_date DATE,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create posts table for user content
CREATE TABLE IF NOT EXISTS public.posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT,
  content TEXT,
  post_type TEXT NOT NULL CHECK (post_type IN ('tip', 'story', 'photo', 'video')),
  media_urls TEXT[],
  location_name TEXT,
  coordinates POINT,
  tags TEXT[],
  is_public BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create favorites table
CREATE TABLE IF NOT EXISTS public.favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  favorited_type TEXT NOT NULL CHECK (favorited_type IN ('post', 'location', 'user', 'service')),
  favorited_id UUID NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, favorited_type, favorited_id)
);

-- Create lesson recordings table for language teachers
CREATE TABLE IF NOT EXISTS public.lesson_recordings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  teacher_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  recording_url TEXT,
  transcription TEXT,
  duration_minutes INTEGER,
  lesson_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Update services table for more detailed offerings
ALTER TABLE public.services 
ADD COLUMN IF NOT EXISTS media_urls TEXT[],
ADD COLUMN IF NOT EXISTS is_online BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS is_in_person BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS skill_level TEXT CHECK (skill_level IN ('beginner', 'intermediate', 'advanced', 'all_levels')),
ADD COLUMN IF NOT EXISTS equipment_needed TEXT,
ADD COLUMN IF NOT EXISTS cancellation_policy TEXT;

-- Enable RLS for new tables
ALTER TABLE public.user_languages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.visited_places ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lesson_recordings ENABLE ROW LEVEL SECURITY;

-- RLS policies for user_languages (only authenticated users)
CREATE POLICY "Users can view all user languages" ON public.user_languages
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can manage their own languages" ON public.user_languages
  FOR ALL TO authenticated USING (auth.uid() = user_id);

-- RLS policies for visited_places (only authenticated users)
CREATE POLICY "Users can view public visited places" ON public.visited_places
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can manage their own visited places" ON public.visited_places
  FOR ALL TO authenticated USING (auth.uid() = user_id);

-- RLS policies for posts (only authenticated users)
CREATE POLICY "Users can view public posts" ON public.posts
  FOR SELECT TO authenticated USING (is_public = true);

CREATE POLICY "Users can view their own posts" ON public.posts
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own posts" ON public.posts
  FOR ALL TO authenticated USING (auth.uid() = user_id);

-- RLS policies for favorites (only authenticated users)
CREATE POLICY "Users can manage their own favorites" ON public.favorites
  FOR ALL TO authenticated USING (auth.uid() = user_id);

-- RLS policies for lesson_recordings (only authenticated users)
CREATE POLICY "Teachers and students can view their recordings" ON public.lesson_recordings
  FOR SELECT TO authenticated USING (auth.uid() = teacher_id OR auth.uid() = student_id);

CREATE POLICY "Teachers can manage recordings" ON public.lesson_recordings
  FOR ALL TO authenticated USING (auth.uid() = teacher_id);

-- Create triggers for updated_at
CREATE TRIGGER update_posts_updated_at
  BEFORE UPDATE ON public.posts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_languages_user_id ON public.user_languages(user_id);
CREATE INDEX IF NOT EXISTS idx_visited_places_user_id ON public.visited_places(user_id);
CREATE INDEX IF NOT EXISTS idx_posts_user_id ON public.posts(user_id);
CREATE INDEX IF NOT EXISTS idx_posts_public ON public.posts(is_public) WHERE is_public = true;
CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON public.favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_lesson_recordings_booking_id ON public.lesson_recordings(booking_id);