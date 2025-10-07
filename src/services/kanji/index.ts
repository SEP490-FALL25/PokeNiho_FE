import { axiosPrivate } from "@configs/axios";
import { IQueryRequest, IKanjiWithMeaningRequest } from "@models/kanji/request";

const kanjiService = {
    getKanjiList: async ({ page, limit, search, sortOrder, ...rest }: IQueryRequest = {}) => {
        return axiosPrivate.get('/kanji', {
            params: {
                page,
                limit,
                search,
                sortOrder,
                ...rest,
            },
        });
    },
    createKanjiWithMeaning: async (data: IKanjiWithMeaningRequest) => {
        return axiosPrivate.post('/kanji/with-meanings', data);
    },
};

export default kanjiService;