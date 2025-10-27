import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import shopService from "@services/shop";
import { IShopBannerSchema } from "@models/shop/entity";
import { IShopItemRandomSchema } from "@models/shop/response";
import { ICreateShopBannerRequest, ICreateShopItemsRequest } from "@models/shop/request";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { selectCurrentLanguage } from "@redux/features/language/selector";
import { PaginationResponseType } from "@models/common/response";

/**
 * Handle Shop Banner List
 * @param params 
 * @returns 
 */
export const useShopBannerList = (params: { page?: number; limit?: number; startDate?: string; endDate?: string; status?: string[] }) => {
    const currentLanguage = useSelector(selectCurrentLanguage);
    return useQuery<{ data: PaginationResponseType<IShopBannerSchema> }>({
        queryKey: ["shopBanners", params, currentLanguage],
        queryFn: async () => {
            const response = await shopService.getAllShopBanners(params);
            return response.data;
        },
    });
};
//------------------------End------------------------//


/**
 * Handle Get Shop Item Random
 * @param shopBannerId 
 * @param amount 
 * @returns 
 */
export const useShopItemRandom = (shopBannerId: number, amount: number) => {
    return useQuery<PaginationResponseType<IShopItemRandomSchema>>({
        queryKey: ["shopItemRandom", shopBannerId, amount],
        queryFn: async () => {
            const response = await shopService.getShopItemRandom(shopBannerId, amount);
            return response.data;
        },
    });
};
//------------------------End------------------------//


/**
 * Handle Get Shop Banner By ID
 * @param id 
 * @returns 
 */
export const useShopBannerById = (id: number | null) => {
    return useQuery<{ data: IShopBannerSchema }>({
        queryKey: ["shopBanner", id],
        queryFn: async () => {
            if (!id) throw new Error("Shop banner ID is required");
            const response = await shopService.getShopBannerById(id);
            return response.data;
        },
        enabled: !!id,
    });
};
//------------------------End------------------------//


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

