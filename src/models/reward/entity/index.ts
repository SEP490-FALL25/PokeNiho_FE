import { at, byUser } from "@models/common/response";
import z from "zod";

export const RewardEntitySchema = z.object({
    id: z.number(),
    nameKey: z.string(),
    rewardType: z.string(),
    rewardItem: z.number(),
    rewardTarget: z.string(),
    nameTranslation: z.string().optional(),
    ...byUser,
    ...at,
})

export type IRewardEntityType = z.infer<typeof RewardEntitySchema>;