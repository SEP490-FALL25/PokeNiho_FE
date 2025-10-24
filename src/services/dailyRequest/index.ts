import { axiosPrivate } from "@configs/axios";
import { ICreateDailyRequestRequest } from "@models/dailyRequest/request";

const dailyRequestService = {
    getDailyRequestList: async () => {
        return axiosPrivate.get('/daily-request');
    },
    createDailyRequest: async (data: ICreateDailyRequestRequest) => {
        return axiosPrivate.post('/daily-request', data);
    },
};

export default dailyRequestService;