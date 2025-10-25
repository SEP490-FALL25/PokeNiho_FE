import { at, byUser } from "@models/common/response";
import z from "zod";

export const RewardEntitySchema = z.object({
    id: z.number(),
    name: z.string(),
    rewardType: z.string(),
    rewardItem: z.number(),
    rewardTarget: z.string(),
    ...byUser,
    ...at,
})

export type RewardEntityType = z.infer<typeof RewardEntitySchema>;