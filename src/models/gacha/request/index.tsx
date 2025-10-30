import z from "zod";
import { TranslationRequest } from "@models/common/request";

/**
 * Create Gacha Request Schema
 */
export const CreateGachaRequest = z.object({
    startDate: z.string().min(1, 'validation.startDateRequired'),
    endDate: z.string().min(1, 'validation.endDateRequired'),
    min: z.number().min(1, 'validation.minRequired'),
    max: z.number().min(1, 'validation.maxRequired'),
    status: z.enum(["PREVIEW", "EXPIRED", "INACTIVE", "ACTIVE"]),
    enablePrecreate: z.boolean(),
    precreateBeforeEndDays: z.number(),
    isRandomItemAgain: z.boolean(),
    nameTranslations: z.array(TranslationRequest),
});
export type ICreateGachaRequest = z.infer<typeof CreateGachaRequest>;
//------------------End------------------//