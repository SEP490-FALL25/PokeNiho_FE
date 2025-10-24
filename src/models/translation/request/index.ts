import z from "zod"

const TranslationItemSchema = z.object({
    language_code: z.string().min(2, 'validation.languageCodeMinLength'),
    value: z.string().min(1, 'validation.translationContentRequired')
})

const ExampleTranslationSchema = z.object({
    language_code: z.string().min(2, 'validation.languageCodeMinLength'),
    sentence: z.string().min(1, 'validation.sentenceTranslationRequired'),
    original_sentence: z.string().min(1, 'validation.originalSentenceRequired')
})


export const TranslationsSchema = z.object({
    meaning: z.array(TranslationItemSchema).min(1, 'validation.meaningRequired'),
    examples: z.array(ExampleTranslationSchema).optional()
})
export type TranslationsType = z.infer<typeof TranslationsSchema>
