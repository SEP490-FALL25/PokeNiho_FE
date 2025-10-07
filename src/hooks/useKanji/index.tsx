import { IQueryRequest } from "@models/query/request";
import kanjiService from "@services/kanji";
import { useQuery } from "@tanstack/react-query";

const useKanjiList = (params: IQueryRequest) => {
    const { data, isLoading, error } = useQuery({
        queryKey: ["kanji-list", params],
        queryFn: () => kanjiService.getKanjiList(params),
    });

    return { data, isLoading, error };
};

export default useKanjiList;