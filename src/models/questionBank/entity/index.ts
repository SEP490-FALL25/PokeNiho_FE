import { at, byUser } from "@models/common/response";
import z from "zod";
import { QUESTION_TYPE } from "@constants/questionBank";

export const QuestionEntitySchema = z.object({
    id: z.number(),
    questionJp: z.string(),
    questionType: z.enum(Object.values(QUESTION_TYPE) as [string, ...string[]]),
    audioUrl: z.string().nullable(),
    pronunciation: z.string(),
    levelN: z.number(),
    meaning: z.string(),
    // Optional fields that might be present in some questions
    options: z.array(z.string()).optional(),
    correctAnswer: z.string().optional(),
    explanation: z.string().optional(),
    difficulty: z.number().optional(),
    points: z.number().optional(),
    timeLimit: z.number().optional(),
    tags: z.array(z.string()).optional(),
    ...byUser,
    ...at,
});

export type QuestionEntityType = z.infer<typeof QuestionEntitySchema>;
