import { axiosPrivate } from "@configs/axios";
import { IQueryRequest } from "@models/common/request";
import { ICreatePokemonRequest } from "@models/pokemon/request";

const pokemonService = {
    getAllPokemon: async (params: IQueryRequest) => {
        const queryParams = new URLSearchParams();
        const filters: string[] = [];

        if (params.page) queryParams.append('currentPage', params.page.toString());
        if (params.limit) queryParams.append('pageSize', params.limit.toString());

        if (params.type && params.type !== 'all') {
            filters.push(`type:${params.type}`);
        }
        if (params.rarity && params.rarity !== 'all') {
            filters.push(`rarity:${params.rarity}`);
        }
        if (params.search) {
            filters.push(`name:${params.search}`);
        }

        if (filters.length > 0) {
            queryParams.append('qs', filters.join('='));
        }

        console.log("Generated Query:", queryParams.toString());
        return axiosPrivate.get(`/pokemon?${queryParams.toString()}`);
    },

    getPokemonById: async (id: string) => {
        return axiosPrivate.get(`/pokemon/${id}`);
    },
    createPokemon: async (data: ICreatePokemonRequest) => {
        return axiosPrivate.post('/pokemon', data);
    },
};

export default pokemonService;