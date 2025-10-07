import z from "zod";


/**
 * Kanji with meaning request
 */
export const KanjiWithMeaningRequest = z.object({
    kanji: z.object({
        id: z.number(),
        character: z.string(),
        meaningKey: z.string(),
        strokeCount: z.number(),
        jlptLevel: z.number().min(1).max(5),
        createdAt: z.string(),
        updatedAt: z.string(),
    }),
    readings: z.array(z.object({
        id: z.number(),
        kanjiId: z.number(),
        readingType: z.string(),
        reading: z.string(),
        createdAt: z.string(),
        updatedAt: z.string(),
    })),
    meanings: z.array(z.object({
        meaningKey: z.string(),
        translations: z.object({
            vi: z.string(),
            en: z.string(),
            ja: z.string(),
        }),
    })),
});
export type IKanjiWithMeaningRequest = z.infer<typeof KanjiWithMeaningRequest>;
//-----------------End-Login-Request-----------------//

/**
 * Kanji list query (flexible)
 */
export const QueryRequest = z
    .object({
        page: z.number().optional(),
        limit: z.number().optional(),
        search: z.string().optional(),
        sortOrder: z.string().optional(),
    })
    .catchall(z.any());

export type IQueryRequest = z.infer<typeof QueryRequest>;