import { IQueryRequest } from "@models/common/request";
import { useQuery } from "@tanstack/react-query";
import pokemonService from "@services/pokemon";

/**
 * hanlde Pokemon List
 * @param params 
 * @returns 
 */
export const usePokemonList = (params: IQueryRequest) => {
    const { page, limit, type, search, rarity } = params;

    const { data, isLoading, error } = useQuery({
        queryKey: ["pokemon-list", page, limit, search, type, rarity],
        queryFn: () => pokemonService.getAllPokemon(params),
    });

    return { data: data?.data?.data, isLoading, error };
};
