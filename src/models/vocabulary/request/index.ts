import { TranslationsSchema } from "@models/translation/request";
import { z } from "zod";

export const CreateVocabularyFullMultipartSchema = z.object({
    word_jp: z.string().min(1, 'validation.wordJapaneseRequired'),
    reading: z.string().min(1, 'validation.readingRequired'),
    level_n: z.string().transform((val) => parseInt(val, 10)).optional(),
    word_type_id: z.string().transform((val) => parseInt(val, 10)).optional(),
    translations: z.union([
        z.string().transform((val) => JSON.parse(val)),
        TranslationsSchema
    ]),
    // Optional media files for multipart submission
    image: z.any().optional(),
    audio: z.any().optional(),
})

export type ICreateVocabularyFullMultipartType = z.infer<typeof CreateVocabularyFullMultipartSchema>
