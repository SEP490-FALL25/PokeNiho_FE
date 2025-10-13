import { axiosPrivate } from "@configs/axios";
import { ICreateVocabularyFullMultipartType } from "@models/vocabulary/request";

const vocabularyService = {
    createVocabulary: (payload: ICreateVocabularyFullMultipartType) => {
        return axiosPrivate.post("/vocabulary/full", payload);
    },
};

export default vocabularyService;


