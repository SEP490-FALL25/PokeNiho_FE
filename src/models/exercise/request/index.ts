import z from "zod";

export const CreateExerciseRequestSchema = z.object({
  exerciseType: z.enum(['QUIZ', 'multiple_choice', 'matching', 'listening', 'speaking']),
  isBlocked: z.boolean(),
  lessonId: z.number(),
  testSetId: z.number(),
});

export type CreateExerciseRequest = z.infer<typeof CreateExerciseRequestSchema>;
