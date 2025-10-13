import { TranslationsSchema } from "@models/translation/request";
import { z } from "zod";

export const CreateVocabularyFullMultipartSchema = z.object({
    word_jp: z.string().min(1, 'Từ tiếng Nhật không được để trống'),
    reading: z.string().min(1, 'Cách đọc không được để trống'),
    level_n: z.string().transform((val) => parseInt(val, 10)).optional(),
    word_type_id: z.string().transform((val) => parseInt(val, 10)).optional(),
    translations: z.union([
        z.string().transform((val) => JSON.parse(val)),
        TranslationsSchema
    ])
})

export type ICreateVocabularyFullMultipartType = z.infer<typeof CreateVocabularyFullMultipartSchema>
