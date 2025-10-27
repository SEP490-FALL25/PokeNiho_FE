import z from "zod";

export const ExerciseResponseSchema = z.object({
  id: z.number(),
  lessonId: z.number(),
  exerciseType: z.string(),
  isBlocked: z.boolean(),
  testSetId: z.number(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type ExerciseResponseType = z.infer<typeof ExerciseResponseSchema>;

export const ExerciseListResponseSchema = z.object({
  statusCode: z.number(),
  data: z.array(ExerciseResponseSchema),
  message: z.string(),
});

export type ExerciseListResponseType = z.infer<typeof ExerciseListResponseSchema>;
