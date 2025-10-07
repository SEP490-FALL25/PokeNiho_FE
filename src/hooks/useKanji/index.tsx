import { IQueryRequest } from "@models/common/request";
import kanjiService from "@services/kanji";
import { useQuery } from "@tanstack/react-query";

const useKanjiList = (params: IQueryRequest) => {
    const { data, isLoading, error } = useQuery({
        queryKey: ["kanji-list", params],
        queryFn: () => kanjiService.getKanjiList(params),
    });

    return { data: data?.data, isLoading, error };
};

export default useKanjiList;