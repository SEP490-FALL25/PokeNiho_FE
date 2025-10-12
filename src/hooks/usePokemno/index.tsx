import { IQueryRequest } from "@models/common/request";
import { useQuery } from "@tanstack/react-query";
import pokemonService from "@services/pokemon";

/**
 * hanlde Pokemon List
 * @param params 
 * @returns 
 */
export const usePokemonList = (params: IQueryRequest) => {
    const { data, isLoading, error } = useQuery({
        queryKey: ["pokemon-list", params],
        queryFn: () => pokemonService.getAllPokemon(params?.page, params?.limit),
    });

    return { data: data?.data, isLoading, error };
};
