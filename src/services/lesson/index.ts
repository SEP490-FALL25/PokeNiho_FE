import { axiosPrivate } from "@configs/axios";
import { IQueryRequest } from "@models/common/request";
import { ICreateLessonRequest } from "@models/lesson/request";


const lessonService = {
    getLessonList: async ({
        page,
        limit,
        search,
        sort,
        sortBy,
        lessonCategoryId,
        levelJlpt,
        isPublished,
        ...rest
    }: IQueryRequest & {
        lessonCategoryId?: number;
        levelJlpt?: number;
        isPublished?: boolean;
        sort?: "asc" | "desc" | string;
    } = {}) => {
        const queryParams = new URLSearchParams();
        if (page !== undefined) queryParams.append("currentPage", String(page));
        if (limit !== undefined) queryParams.append("pageSize", String(limit));
        if (search) queryParams.append("search", search);
        if (lessonCategoryId !== undefined) queryParams.append("lessonCategoryId", String(lessonCategoryId));
        if (levelJlpt !== undefined) queryParams.append("levelJlpt", String(levelJlpt));
        if (typeof isPublished === "boolean") queryParams.append("isPublished", String(isPublished));
        if (sortBy) queryParams.append("sortBy", sortBy);
        if (sort) queryParams.append("sort", sort);

        // Append any other provided filters
        Object.entries(rest).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                queryParams.append(key, String(value));
            }
        });

        return axiosPrivate.get(`/lessons?${queryParams.toString()}`);
    },
    createLesson: async (data: ICreateLessonRequest) => {
        return axiosPrivate.post("/lessons", data);
    },
};

export default lessonService;

