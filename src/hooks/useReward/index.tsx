import { ICreateRewardRequest } from "@models/reward/request";
import rewardService from "@services/reward";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { IQueryRequest } from "@models/common/request";
import { useSelector } from "react-redux";
import { selectCurrentLanguage } from "@redux/features/language/selector";

/**
 * Handle Get Reward List
 * @returns { getRewardListQuery }
 */
export const useGetRewardList = (params?: IQueryRequest) => {
    const currentLanguage = useSelector(selectCurrentLanguage);
    const getRewardListQuery = useQuery({
        queryKey: ['reward-list', params, currentLanguage],
        queryFn: () => rewardService.getRewardList(params),
    });
    return { data: getRewardListQuery.data?.data?.data, isLoading: getRewardListQuery.isLoading, error: getRewardListQuery.error };
};
//----------------------End----------------------//

/**
 * Handle Create Reward
 * @returns { createRewardMutation }
 */
export const useCreateReward = () => {
    const queryClient = useQueryClient();
    const createRewardMutation = useMutation({
        mutationFn: (data: ICreateRewardRequest) => rewardService.createReward(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['reward-list'] });
        },
    });
    return createRewardMutation;
};

/**
 * Handle Update Reward
 * @returns { updateRewardMutation }
 */
export const useUpdateReward = () => {
    const queryClient = useQueryClient();
    const updateRewardMutation = useMutation({
        mutationFn: ({ id, data }: { id: number; data: ICreateRewardRequest }) => rewardService.updateReward(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['reward-list'] });
        },
    });
    return updateRewardMutation;
};

/**
 * Handle Delete Reward
 * @returns { deleteRewardMutation }
 */
export const useDeleteReward = () => {
    const queryClient = useQueryClient();
    const deleteRewardMutation = useMutation({
        mutationFn: (id: number) => rewardService.deleteReward(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['reward-list'] });
        },
    });
    return deleteRewardMutation;
};
