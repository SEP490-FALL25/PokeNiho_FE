import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { selectCurrentLanguage } from "@redux/features/language/selector";
import gachaService from "@services/gacha";

/**
 * Handle Gacha Banner List
 * @param params 
 * @returns 
 */
export const useGachaBannerList = (params: { page?: number; limit?: number; startDate?: string; endDate?: string; status?: string[] }) => {
    const currentLanguage = useSelector(selectCurrentLanguage);
    return useQuery<any>({
        queryKey: ["gachaBanners", params, currentLanguage],
        queryFn: async () => {
            const response = await gachaService.getGachaList(params);
            return response.data;
        },
    });
};
//------------------------End------------------------//


/**
 * Handle Create Gacha Banner
 * @returns useMutation to create gacha banner
 */
export const useCreateGachaBanner = () => {
    const queryClient = useQueryClient();
    const { t } = useTranslation();

    return useMutation({
        mutationFn: async (data: any) => {
            const response = await gachaService.createGacha(data);
            return response.data;
        },
        onSuccess: (data: any) => {
            queryClient.invalidateQueries({ queryKey: ["gachaBanners"] });
            toast.success(data?.message || t('configGacha.createSuccess'));
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || t('configGacha.createError'));
        },
    });
};
//-------------------End-------------------//
