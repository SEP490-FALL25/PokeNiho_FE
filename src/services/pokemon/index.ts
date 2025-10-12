import { axiosPrivate } from "@configs/axios";
import { IQueryRequest } from "@models/common/request";

const pokemonService = {
    getAllPokemon: async (params: IQueryRequest) => {
        const queryParams = new URLSearchParams({
            currentPage: params.page?.toString(),
            pageSize: params.limit?.toString(),
        });

        if (params.type && params.type !== 'all') {
            queryParams.append('type', params.type);
        }
        if (params.search) {
            queryParams.append('search', params.search);
        }

        return axiosPrivate.get(`/pokemon?${queryParams.toString()}`);
    },
    getPokemonById: async (id: string) => {
        return axiosPrivate.get(`/pokemon/${id}`)
    },
}

export default pokemonService;