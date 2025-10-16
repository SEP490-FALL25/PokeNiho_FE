import lessonService from "@services/lesson";
import { IQueryRequest } from "@models/common/request";
import { useQuery } from "@tanstack/react-query";

export const useLessonList = (params: IQueryRequest) => {   
    const { data, isLoading, error } = useQuery({
        queryKey: ["lesson-list", params],
        queryFn: () => lessonService.getLessonList(params),
    })
    return { data: data?.data?.data, isLoading, error }
}