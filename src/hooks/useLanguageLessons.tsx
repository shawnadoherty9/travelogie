import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface DBVocabularyItem {
  id: string;
  word: string;
  phonetic: string;
  translation: string;
  category: string;
  sort_order: number;
}

export interface DBLanguageLesson {
  id: string;
  language: string;
  title: string;
  level: string;
  target_sentence: string;
  target_phonetic: string;
  target_translation: string;
  cultural_note: string;
  instructor_name: string | null;
  image_url: string | null;
  duration: string | null;
  is_active: boolean;
  vocabulary_items?: DBVocabularyItem[];
}

export function useLanguageLessons() {
  const lessonsQuery = useQuery({
    queryKey: ["language-lessons"],
    queryFn: async () => {
      const { data: lessons, error: lessonsError } = await supabase
        .from("language_lessons")
        .select("*")
        .eq("is_active", true)
        .order("language")
        .order("sort_order");

      if (lessonsError) throw lessonsError;

      // Fetch all vocabulary items for these lessons
      const lessonIds = lessons.map((l: any) => l.id);
      const { data: vocabItems, error: vocabError } = await supabase
        .from("vocabulary_items")
        .select("*")
        .in("lesson_id", lessonIds)
        .order("sort_order");

      if (vocabError) throw vocabError;

      // Group vocabulary by lesson
      const vocabByLesson = (vocabItems || []).reduce((acc: Record<string, DBVocabularyItem[]>, item: any) => {
        if (!acc[item.lesson_id]) acc[item.lesson_id] = [];
        acc[item.lesson_id].push(item);
        return acc;
      }, {});

      return lessons.map((lesson: any) => ({
        ...lesson,
        vocabulary_items: vocabByLesson[lesson.id] || [],
      })) as DBLanguageLesson[];
    },
  });

  // Derive unique languages
  const languages = [...new Set(lessonsQuery.data?.map(l => l.language) || [])].sort();

  // Transform to sample lesson format for LanguageInstructorsSection
  const sampleLessons = (lessonsQuery.data || []).map((lesson, idx) => ({
    id: idx + 1,
    title: lesson.title,
    language: lesson.language,
    level: lesson.level,
    duration: lesson.duration || "15 min",
    instructor: lesson.instructor_name || "Local Expert",
    image: lesson.image_url || "",
    vocabulary: lesson.vocabulary_items?.map(v => v.word) || [],
    phrases: [lesson.target_sentence],
    culturalNotes: lesson.cultural_note,
  }));

  return {
    lessons: lessonsQuery.data || [],
    sampleLessons,
    languages,
    isLoading: lessonsQuery.isLoading,
    error: lessonsQuery.error,
  };
}
