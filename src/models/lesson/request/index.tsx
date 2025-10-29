import z from "zod";

export const CreateLessonSchema = z.object({
    titleJp: z.string().min(1, "Tiêu đề tiếng Nhật là bắt buộc"),
    levelJlpt: z.number().min(1).max(5, "Cấp độ JLPT phải từ 1-5"),
    estimatedTimeMinutes: z.number().min(1, "Thời lượng phải lớn hơn 0"),
    isPublished: z.boolean(),
    version: z.string().min(1, "Phiên bản là bắt buộc"),
    lessonCategoryId: z.number().min(1, "Danh mục bài học là bắt buộc"),
    rewardId: z.number().min(1, "ID phần thưởng là bắt buộc"),
    translations: z.object({
        meaning: z.array(z.object({
            language_code: z.string(),
            value: z.string().min(1, "Giá trị dịch không được để trống")
        }))
    })
});

export type ICreateLessonRequest = z.infer<typeof CreateLessonSchema>;