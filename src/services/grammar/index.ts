import { axiosPrivate } from "@configs/axios";
import { IQueryRequest } from "@models/common/request";

const grammarService = {
  getAllGrammars: async (data: IQueryRequest) => {
    const queryParams = new URLSearchParams();

    if (data.page) queryParams.append("page", data.page.toString());
    if (data.limit) queryParams.append("limit", data.limit.toString());
    if (data.search) queryParams.append("search", data.search);
    if (data.levelN) queryParams.append("levelN", data.levelN.toString());
    if (data.sortBy) queryParams.append("sortBy", data.sortBy);
    if (data.sort) queryParams.append("sort", data.sort);

    return await axiosPrivate.get(`/grammars?${queryParams.toString()}`);
  },
};

export default grammarService;
