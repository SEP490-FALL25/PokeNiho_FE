import z from "zod";
import { TranslationRequest } from "@models/common/request";

/**
 * Create Gacha Request Schema (i18n)
 */
export const createCreateGachaSchema = (t: (key: string) => string) => z.object({
    startDate: z.string().min(1, t('configGacha.startDateRequired')),
    endDate: z.string().min(1, t('configGacha.endDateRequired')),
    status: z.enum(["PREVIEW", "EXPIRED", "INACTIVE", "ACTIVE"]),
    hardPity5Star: z.number().min(1, t('configGacha.hardPity')),
    enablePrecreate: z.boolean(),
    precreateBeforeEndDays: z.number().min(1, t('configGacha.precreateBeforeEndDaysRequired')).max(90, t('configGacha.precreateBeforeEndDaysDescription')),
    isRandomItemAgain: z.boolean(),
    costRoll: z.number().min(1, t('configGacha.costRoll')),
    amount5Star: z.number().min(1, t('configGacha.amount5Star')),
    amount4Star: z.number().min(1, t('configGacha.amount4Star')),
    amount3Star: z.number().min(1, t('configGacha.amount3Star')),
    amount2Star: z.number().min(1, t('configGacha.amount2Star')),
    amount1Star: z.number().min(1, t('configGacha.amount1Star')),
    nameTranslations: z.array(TranslationRequest).superRefine((translations, ctx) => {
        translations.forEach((translation, index) => {
            if (!translation.value || translation.value.trim().length === 0) {
                const key = translation.key;
                const errorKey = key === 'vi'
                    ? 'configGacha.nameRequiredVi'
                    : key === 'en'
                        ? 'configGacha.nameRequiredEn'
                        : 'configGacha.nameRequiredJa';
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: t(errorKey),
                    path: [index, 'value'],
                });
            }
        });
    }),
});
export type ICreateGachaRequest = z.infer<ReturnType<typeof createCreateGachaSchema>>;
//------------------End------------------//