import { IQueryRequest } from "@models/common/request";
import { IKanjiWithMeaningRequest } from "@models/kanji/request";
import kanjiService from "@services/kanji";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useKanjiList = (params: IQueryRequest) => {
    const { data, isLoading, error } = useQuery({
        queryKey: ["kanji-list", params],
        queryFn: () => kanjiService.getKanjiList(params),
    });

    return { data: data?.data, isLoading, error };
};

export const useKanjiListManagement = (params: IQueryRequest) => {
    const { data, isLoading, error } = useQuery({
        queryKey: ["kanji-list-management", params],
        queryFn: () => kanjiService.getKanjiListManagement(params),
    });

    return { data: data?.data, isLoading, error };
};

