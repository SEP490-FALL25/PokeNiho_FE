import { IQueryRequest } from "@models/common/request";
import { IKanjiWithMeaningRequest } from "@models/kanji/request";
import kanjiService from "@services/kanji";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

/**
 * hanlde Kanji List
 * @param params 
 * @returns 
 */
export const useKanjiList = (params: IQueryRequest) => {
    const { data, isLoading, error } = useQuery({
        queryKey: ["kanji-list", params],
        queryFn: () => kanjiService.getKanjiList(params),
    });

    return { data: data?.data, isLoading, error };
};

/**
 * hanlde KạniList Management
 * @param params 
 * @returns 
 */
export const useKanjiListManagement = (params: IQueryRequest & { enabled?: boolean; dialogKey?: number }) => {
    const { enabled = true, dialogKey, ...queryParams } = params;
    const { data, isLoading, error } = useQuery({
        queryKey: ["kanji-list-management", queryParams, dialogKey],
        queryFn: () => kanjiService.getKanjiListManagement(queryParams),
        enabled,
    });
    return { data: data?.data, isLoading, error };
};

/**
 * hanlde Create Kanji With Meaning
 * @returns 
 */
export const useCreateKanjiWithMeaning = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: IKanjiWithMeaningRequest) => kanjiService.createKanjiWithMeaning(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['kanji-list-management'] });
        },
    });
};

