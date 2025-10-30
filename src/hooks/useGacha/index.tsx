import { IQueryRequest } from "@models/common/request";
import gachaService from "@services/gacha";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { ICreateGachaRequest } from "@models/gacha/request";

/**
 * Handle Gacha List
 * @param params 
 * @returns 
 */
export const useGachaList = (params: IQueryRequest) => {
    const { data, isLoading, error } = useQuery({
        queryKey: ['gacha-list', params],
        queryFn: () => gachaService.getGachaList(params),
    });
    return { data, isLoading, error };
};
//------------------End------------------//


/**
 * Handle Create Gacha
 * @returns { createGachaMutation }
 */
export const useCreateGacha = () => {
    const queryClient = useQueryClient();
    const { t } = useTranslation();
    return useMutation({
        mutationFn: (data: ICreateGachaRequest) => gachaService.createGacha(data),
        onSuccess: (response: any) => {
            queryClient.invalidateQueries({ queryKey: ['gacha-list'] });
            toast.success(response.message || t('gacha.createSuccess'));
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || t('common.error'));
        },
    });
};
//------------------End------------------//