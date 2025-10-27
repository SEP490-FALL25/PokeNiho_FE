import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import shopService from "@services/shop";
import { IShopBannerListResponse, IShopBannerDetailResponse, IRandomPokemonResponse } from "@models/shop/response";
import { ICreateShopBannerRequest, IGetRandomPokemonRequest, ICreateShopItemsRequest } from "@models/shop/request";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

// Hook to get all shop banners
export const useShopBannerList = (params: { page?: number; limit?: number }) => {
    return useQuery<{ data: IShopBannerListResponse }>({
        queryKey: ["shopBanners", params],
        queryFn: async () => {
            const response = await shopService.getAllShopBanners(params);
            return response.data;
        },
    });
};

// Hook to get shop banner by ID
export const useShopBannerById = (id: number | null) => {
    return useQuery<{ data: IShopBannerDetailResponse }>({
        queryKey: ["shopBanner", id],
        queryFn: async () => {
            if (!id) throw new Error("Shop banner ID is required");
            const response = await shopService.getShopBannerById(id);
            return response.data;
        },
        enabled: !!id,
    });
};

// Hook to get random Pokemon
export const useGetRandomPokemon = () => {
    return useMutation<{ data: IRandomPokemonResponse[] }, Error, IGetRandomPokemonRequest>({
        mutationFn: async (data) => {
            const response = await shopService.getRandomPokemon(data);
            return response.data;
        },
    });
};

/**
 * Handle Create Shop Banner
 * @returns useMutation to create shop banner
 */
export const useCreateShopBanner = () => {
    const queryClient = useQueryClient();
    const { t } = useTranslation();

    return useMutation({
        mutationFn: async (data: ICreateShopBannerRequest) => {
            const response = await shopService.createShopBanner(data);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["shopBanners"] });
            toast.success(t('configShop.createSuccess'));
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || t('configShop.createError'));
        },
    });
};
//-------------------End-------------------//


// Hook to create shop items
export const useCreateShopItems = () => {
    const queryClient = useQueryClient();
    const { t } = useTranslation();

    return useMutation({
        mutationFn: async (data: ICreateShopItemsRequest) => {
            const response = await shopService.createShopItems(data);
            return response.data;
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ["shopBanner", variables.items[0]?.shopBannerId] });
            queryClient.invalidateQueries({ queryKey: ["shopBanners"] });
            toast.success(t('configShop.addPokemonSuccess'));
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || t('configShop.addPokemonError'));
        },
    });
};

