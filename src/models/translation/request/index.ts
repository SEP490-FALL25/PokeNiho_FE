import z from "zod"

const TranslationItemSchema = z.object({
    language_code: z.string().min(2, 'Mã ngôn ngữ phải có ít nhất 2 ký tự'),
    value: z.string().min(1, 'Nội dung dịch không được để trống')
})

const ExampleTranslationSchema = z.object({
    language_code: z.string().min(2, 'Mã ngôn ngữ phải có ít nhất 2 ký tự'),
    sentence: z.string().min(1, 'Câu dịch không được để trống'),
    original_sentence: z.string().min(1, 'Câu gốc không được để trống')
})


export const TranslationsSchema = z.object({
    meaning: z.array(TranslationItemSchema).min(1, 'Phải có ít nhất 1 nghĩa'),
    examples: z.array(ExampleTranslationSchema).optional()
})
export type TranslationsType = z.infer<typeof TranslationsSchema>
