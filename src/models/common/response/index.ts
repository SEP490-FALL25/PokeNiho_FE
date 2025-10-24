import { z } from "zod"

/**
 * Pagination Meta Schema
 */
export const PaginationMetaSchema = z.object({
    current: z.number(),
    pageSize: z.number(),
    totalPage: z.number(),
    totalItem: z.number()
})

export const PaginationDataSchema = z.object({
    results: z.array(z.any()),
    pagination: PaginationMetaSchema
})

export const PaginationResponseSchema = z.object({
    statusCode: z.number().default(200),
    message: z.string(),
    data: PaginationDataSchema
})
export type PaginationMeta = z.infer<typeof PaginationMetaSchema>
export type PaginationResponseType<T = any> = {
    results: T[]
    pagination: PaginationMeta
}
//----------------------End----------------------//


/**
 * By User 
 * This is a object that contains the createdById, updatedById, and deletedById fields
 */
export const byUser = {
    createdById: z.number(),
    updatedById: z.number().nullable(),
    deletedById: z.number().nullable(),
}
//----------------------End----------------------//


/**
 * At
 * This is a object that contains the createdAt, updatedAt, and deletedAt fields
 */
export const at = {
    createdAt: z.string(),
    updatedAt: z.string().nullable(),
    deletedAt: z.string().nullable(),
}
//----------------------End----------------------//
