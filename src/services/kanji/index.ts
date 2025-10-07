import { axiosClient } from "@configs/axios";
import { IKanjiWithMeaningRequest } from "@models/kanji/request";

const kanjiService = {
    createKanjiWithMeaning: async (data: IKanjiWithMeaningRequest) => {
        return axiosClient.post('/kanji/with-meanings', data)
    }
}

export default kanjiService;