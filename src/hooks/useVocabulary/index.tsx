import { IQueryRequest } from "@models/common/request";
import { useQuery } from "@tanstack/react-query";
import vocabularyService from "@services/vocabulary";

/**
 * hanlde Vocabulary List
 * @param params 
 * @returns 
 */
export const useVocabularyList = (params: IQueryRequest & { enabled?: boolean }) => {
    const { page, limit, search, levelN, sortBy, sort, enabled = true } = params;

    const { data, isLoading, error } = useQuery({
        queryKey: ["vocabulary-list", page, limit, search, levelN, sortBy, sort],
        queryFn: () => vocabularyService.getAllVocabularies(params),
        enabled,
    });

    return { data: data?.data?.data, isLoading, error };
};


/**
 * hanlde Vocabulary Statistics
 * @returns 
 */
export const useVocabularyStatistics = () => {
    const { data, isLoading, error } = useQuery({
        queryKey: ['vocabulary-statistics'],
        queryFn: () => vocabularyService.getStatistics(),
    });
    return { data: data?.data?.data, isLoading, error };
};
//--------------------------------End--------------------------------//