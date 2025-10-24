import { axiosPrivate } from "@configs/axios";
import { ICreateDailyRequestRequest } from "@models/dailyRequest/request";
import { IQueryRequest } from "@models/common/request";

const dailyRequestService = {
    getDailyRequestList: async (params?: IQueryRequest) => {
        const queryParams = new URLSearchParams();

        if (params?.sortBy) {
            queryParams.append('qs', `sort:${params.sortBy}`);
        }

        if (params?.page) {
            queryParams.append('currentPage', params.page.toString());
        }

        if (params?.limit) {
            queryParams.append('pageSize', params.limit.toString());
        }

        const queryString = queryParams.toString();
        return axiosPrivate.get(`/daily-request${queryString ? `?${queryString}` : ''}`);
    },
    createDailyRequest: async (data: ICreateDailyRequestRequest) => {
        return axiosPrivate.post('/daily-request', data);
    },
};

export default dailyRequestService;