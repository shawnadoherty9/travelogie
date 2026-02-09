import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export function useLessonProgress() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const progressQuery = useQuery({
    queryKey: ["lesson-progress", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("lesson_progress")
        .select("lesson_id, completed_at, score, attempts")
        .eq("user_id", user.id);
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const completedLessonIds = (progressQuery.data || []).map((p) => p.lesson_id);

  const completeLessonMutation = useMutation({
    mutationFn: async (lessonId: string) => {
      if (!user) throw new Error("Must be logged in");
      const { error } = await supabase
        .from("lesson_progress")
        .upsert(
          { user_id: user.id, lesson_id: lessonId, completed_at: new Date().toISOString(), attempts: 1 },
          { onConflict: "user_id,lesson_id" }
        );
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lesson-progress", user?.id] });
    },
  });

  return {
    completedLessonIds,
    isLoading: progressQuery.isLoading,
    completeLesson: completeLessonMutation.mutateAsync,
    isAuthenticated: !!user,
  };
}
