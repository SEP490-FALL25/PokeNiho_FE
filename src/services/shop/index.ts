import { axiosPrivate } from "@configs/axios";
import { ICreateShopBannerRequest, IGetRandomPokemonRequest, ICreateShopItemsRequest } from "@models/shop/request";

const shopService = {
    // Get all shop banners
    getAllShopBanners: async (params: { page?: number; limit?: number }) => {
        const queryParams = new URLSearchParams();
        if (params.page) queryParams.append('currentPage', params.page.toString());
        if (params.limit) queryParams.append('pageSize', params.limit.toString());
        return axiosPrivate.get(`/shop-banner?${queryParams.toString()}`);
    },

    // Get shop banner by ID
    getShopBannerById: async (id: number) => {
        return axiosPrivate.get(`/shop-banner/${id}`);
    },

    // Create shop banner
    createShopBanner: async (data: ICreateShopBannerRequest) => {
        return axiosPrivate.post('/shop-banner', data);
    },

    // Get random Pokemon for shop
    getRandomPokemon: async (data: IGetRandomPokemonRequest) => {
        return axiosPrivate.post('/shop-banner/random-pokemon', data);
    },

    // Create shop items
    createShopItems: async (data: ICreateShopItemsRequest) => {
        return axiosPrivate.post('/shop-banner/items', data);
    },
};

export default shopService;

