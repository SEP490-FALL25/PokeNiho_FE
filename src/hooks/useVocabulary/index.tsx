import { IQueryRequest } from "@models/common/request";
import { useQuery } from "@tanstack/react-query";
import vocabularyService from "@services/vocabulary";

/**
 * hanlde Vocabulary List
 * @param params 
 * @returns 
 */
export const useVocabularyList = (params: IQueryRequest) => {
    const { page, limit, search, levelN, sortBy, sort } = params;

    const { data, isLoading, error } = useQuery({
        queryKey: ["vocabulary-list", page, limit, search, levelN, sortBy, sort],
        queryFn: () => vocabularyService.getAllVocabularies(params),
    });

    return { data: data?.data?.data, isLoading, error };
};
