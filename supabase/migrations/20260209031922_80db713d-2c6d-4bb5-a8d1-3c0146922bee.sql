
-- Create language_lessons table
CREATE TABLE public.language_lessons (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  language TEXT NOT NULL,
  title TEXT NOT NULL,
  level TEXT NOT NULL DEFAULT 'Beginner',
  target_sentence TEXT NOT NULL,
  target_phonetic TEXT NOT NULL,
  target_translation TEXT NOT NULL,
  cultural_note TEXT NOT NULL,
  instructor_name TEXT,
  image_url TEXT,
  duration TEXT DEFAULT '15 min',
  is_active BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create vocabulary_items table
CREATE TABLE public.vocabulary_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  lesson_id UUID NOT NULL REFERENCES public.language_lessons(id) ON DELETE CASCADE,
  word TEXT NOT NULL,
  phonetic TEXT NOT NULL,
  translation TEXT NOT NULL,
  category TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.language_lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vocabulary_items ENABLE ROW LEVEL SECURITY;

-- Public read access for active lessons
CREATE POLICY "Allow public read access to active language lessons"
  ON public.language_lessons FOR SELECT
  USING (is_active = true);

-- Public read access to vocabulary items for active lessons
CREATE POLICY "Allow public read access to vocabulary items"
  ON public.vocabulary_items FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.language_lessons
    WHERE language_lessons.id = vocabulary_items.lesson_id
    AND language_lessons.is_active = true
  ));

-- Indexes
CREATE INDEX idx_language_lessons_language ON public.language_lessons(language);
CREATE INDEX idx_language_lessons_level ON public.language_lessons(level);
CREATE INDEX idx_vocabulary_items_lesson_id ON public.vocabulary_items(lesson_id);

-- Trigger for updated_at
CREATE TRIGGER update_language_lessons_updated_at
  BEFORE UPDATE ON public.language_lessons
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
