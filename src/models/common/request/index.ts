import z from "zod";

/**
 * Master data list query (flexible)
 */
export const QueryRequest = z
    .object({
        page: z.number().optional(),
        limit: z.number().optional(),
        search: z.string().optional(),
        sortOrder: z.string().optional(),
        sortBy: z.string().optional(),
    })
    .catchall(z.any());

export type IQueryRequest = z.infer<typeof QueryRequest>;
//------------------End------------------//