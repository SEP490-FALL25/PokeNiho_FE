import exerciseService from "@services/exercise";
import { useQuery } from "@tanstack/react-query";

/**
 * Handle Exercise List by Lesson ID
 * @param lessonId number
 * @returns { data: data?.data, isLoading, error }
 */
export const useExercisesByLessonId = (lessonId: number) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["exercises", "lesson", lessonId],
    queryFn: () => exerciseService.getExercisesByLessonId(lessonId),
    enabled: !!lessonId, // Only run query if lessonId is provided
  });

  return { 
    data: data?.data, 
    isLoading, 
    error 
  };
};
