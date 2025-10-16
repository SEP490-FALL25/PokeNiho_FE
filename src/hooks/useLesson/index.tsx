import lessonService from "@services/lesson";
import { IQueryRequest } from "@models/common/request";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ICreateLessonRequest } from "@models/lesson/request";

/**
 * hanlde Lesson List
 * @param params IQueryRequest
 * @returns { data: data?.data?.data, isLoading, error }
 */
export const useLessonList = (params: IQueryRequest) => {
    const { data, isLoading, error } = useQuery({
        queryKey: ["lesson-list", params],
        queryFn: () => lessonService.getLessonList(params),
    })
    return { data: data?.data?.data, isLoading, error }
}

/**
 * hanlde Create Lesson
 * @param data ICreateLessonRequest
 * @returns { data: data?.data, isLoading, error }
 */
export const useCreateLesson = () => {
    const queryClient = useQueryClient();
    const createLessonMutation = useMutation({
        mutationFn: (data: ICreateLessonRequest) => lessonService.createLesson(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['lesson-list'] });
        },
    })
    return createLessonMutation
}