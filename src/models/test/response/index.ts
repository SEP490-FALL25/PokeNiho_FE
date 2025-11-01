import { PaginationMetaSchema } from "@models/common/response";
import z from "zod";
import { TestEntitySchema } from "../entity";

export const TestResponseSchema = TestEntitySchema;

export type TestResponseType = z.infer<typeof TestResponseSchema>;

export const TestListResponseSchema = z.object({
  statusCode: z.number(),
  data: z.object({
    results: z.array(TestResponseSchema),
    pagination: PaginationMetaSchema,
  }),
  message: z.string(),
});

export type TestListResponseType = z.infer<typeof TestListResponseSchema>;

export const TestCreateResponseSchema = z.object({
  statusCode: z.number(),
  data: TestEntitySchema,
  message: z.string(),
});

export type TestCreateResponseType = z.infer<typeof TestCreateResponseSchema>;
