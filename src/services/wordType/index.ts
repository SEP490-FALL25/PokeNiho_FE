import { axiosPrivate } from "@configs/axios";
import { IQueryRequest } from "@models/common/request";

const wordTypeService = {
    getAllWordTypes: async (params: IQueryRequest) => {

        return await axiosPrivate.get('/wordtype', {
            params: params,
        });
    }
}

export default wordTypeService;