import z from "zod";

export const TestSetListRequestSchema = z.object({
  currentPage: z.number().optional(),
  pageSize: z.number().optional(),
  search: z.string().optional(),
  levelN: z.number().optional(),
  testType: z.enum(['VOCABULARY', 'GRAMMAR', 'KANJI', 'LISTENING', 'READING', 'SPEAKING', 'GENERAL']).optional(),
  status: z.enum(['DRAFT', 'ACTIVE', 'INACTIVE']).optional(),
  creatorId: z.number().optional(),
  language: z.enum(['vi', 'en', 'ja']).optional(),
});

export type TestSetListRequest = z.infer<typeof TestSetListRequestSchema>;
