import { axiosClient } from "@configs/axios";
import { ILoginFormDataRequest } from "@models/user/request";

const authService = {
    login: async (data: ILoginFormDataRequest) => {
        return axiosClient.post('/auth/login', data)
    },
}

export default authService;