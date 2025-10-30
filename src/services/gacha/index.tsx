import { axiosPrivate } from "@configs/axios";
import { IQueryRequest } from "@models/common/request";
import { ICreateGachaRequest } from "@models/gacha/request";


const gachaService = {
    getGachaList: async (params?: IQueryRequest) => {
        const queryParams = new URLSearchParams();
        const qsParts: string[] = [];

        // Sort
        if (params?.sort) {
            qsParts.push(`sort:${params.sort}`);
        }

        // Filters
        if (params?.nameTranslation) {
            qsParts.push(`nameTranslation:like=${params.nameTranslation}`);
        }

        if (params?.startDate) {
            qsParts.push(`startDate:gte=${params.startDate}`);
        }

        if (params?.endDate) {
            qsParts.push(`endDate:lte=${params.endDate}`);
        }

        if (params?.status && params.status.length > 0) {
            qsParts.push(`status:in=${params.status.join('|')}`);
        }

        if (params?.enablePrecreate !== undefined) {
            qsParts.push(`enablePrecreate=${params.enablePrecreate}`);
        }

        // Add qs parameter if we have any filters
        if (qsParts.length > 0) {
            queryParams.append('qs', qsParts.join(','));
        }

        // Pagination
        if (params?.currentPage) {
            queryParams.append('currentPage', params.currentPage.toString());
        }

        const queryString = queryParams.toString();
        return axiosPrivate.get(`/gacha-banner${queryString ? `?${queryString}` : ''}`);
    },
    createGacha: async (data: ICreateGachaRequest) => {
        return axiosPrivate.post('/gacha-banner', data);
    },
};

export default gachaService;