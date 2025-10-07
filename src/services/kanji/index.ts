import { axiosPrivate } from "@configs/axios";
import { IKanjiWithMeaningRequest } from "@models/kanji/request";
import { IQueryRequest } from "@models/common/request";

const kanjiService = {
    getKanjiList: async ({ page, limit, search, sortOrder, sortBy, ...rest }: IQueryRequest = {}) => {
        const res = await axiosPrivate.get('/kanji', {
            params: {
                page,
                limit,
                search,
                sortOrder,
                sortBy,
                ...rest,
            },
        });
        console.log(res);

        return res;
    },
    createKanjiWithMeaning: async (data: IKanjiWithMeaningRequest) => {
        return axiosPrivate.post('/kanji/with-meanings', data);
    },
};

export default kanjiService;