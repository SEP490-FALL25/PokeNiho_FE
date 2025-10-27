import { IQueryRequest } from "@models/common/request";
import { useQuery } from "@tanstack/react-query";
import grammarService from "@services/grammar";
import { useSelector } from "react-redux";
import { selectCurrentLanguage } from "@redux/features/language/selector";

/**
 * Handle Grammar List
 * @param params
 * @returns
 */
export const useGrammarList = (params: IQueryRequest & { enabled?: boolean; dialogKey?: number }) => {
  const language = useSelector(selectCurrentLanguage);
  const { page, limit, search, levelN, sortBy, sort, enabled = true, dialogKey } = params;

  const { data, isLoading, error } = useQuery({
    queryKey: [
      "grammar-list",
      page,
      limit,
      search,
      levelN,
      sortBy,
      sort,
      language,
      dialogKey,
    ],
    queryFn: () => grammarService.getAllGrammars(params),
    enabled,
  });

  return { data: data?.data?.data, isLoading, error };
};
