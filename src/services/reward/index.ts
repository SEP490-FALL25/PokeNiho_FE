import { axiosPrivate } from "@configs/axios";
import { ICreateRewardRequest } from "@models/reward/request";
import { IQueryRequest } from "@models/common/request";

const rewardService = {
    getRewardList: async (params?: IQueryRequest & {
        name?: string;
        rewardType?: string;
        rewardTarget?: string;
    }) => {
        const queryParams = new URLSearchParams();
        const qsParts: string[] = [];

        // Sort
        if (params?.sortBy) {
            const sortDirection = params.sort === 'desc' ? '-' : '';
            qsParts.push(`sort:${sortDirection}${params.sortBy}`);
        }

        // Filters
        if (params?.name) {
            qsParts.push(`name:like=${params.name}`);
        }

        if (params?.rewardType) {
            qsParts.push(`rewardType=${params.rewardType}`);
        }

        if (params?.rewardTarget) {
            qsParts.push(`rewardTarget=${params.rewardTarget}`);
        }

        // Add qs parameter if we have any filters
        if (qsParts.length > 0) {
            queryParams.append('qs', qsParts.join(','));
        }

        // Pagination
        if (params?.page) {
            queryParams.append('currentPage', params.page.toString());
        }

        if (params?.limit) {
            queryParams.append('pageSize', params.limit.toString());
        }

        const queryString = queryParams.toString();
        return axiosPrivate.get(`/reward${queryString ? `?${queryString}` : ''}`);
    },

    createReward: async (data: ICreateRewardRequest) => {
        return axiosPrivate.post('/reward', data);
    },

    updateReward: async (id: number, data: ICreateRewardRequest) => {
        return axiosPrivate.put(`/reward/${id}`, data);
    },

    deleteReward: async (id: number) => {
        return axiosPrivate.delete(`/reward/${id}`);
    },
};

export default rewardService;
