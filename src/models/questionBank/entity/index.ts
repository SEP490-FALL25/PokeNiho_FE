import { at, byUser } from "@models/common/response";
import z from "zod";
import { QUESTION_TYPE } from "@constants/questionBank";

export const QuestionEntitySchema = z.object({
    id: z.number(),
    questionJp: z.string(),
    questionType: z.enum(Object.values(QUESTION_TYPE) as [string, ...string[]]),
    audioUrl: z.string().nullable(),
    pronunciation: z.string().optional(),
    levelN: z.number(),
    meaning: z.string().optional(), // Keep for backward compatibility
    meanings: z.string().optional(),
    ...byUser,
    ...at,
});

export type QuestionEntityType = z.infer<typeof QuestionEntitySchema>;
