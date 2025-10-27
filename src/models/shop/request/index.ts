import { TranslationRequest } from "@models/common/request";
import z from "zod";


/**
 * Create Shop Banner Request Schema with translations
 */
export const createCreateShopBannerSchema = (t: (key: string) => string) => z.object({
    startDate: z.string().min(1, t('configShop.startDateRequired')),
    endDate: z.string().min(1, t('configShop.endDateRequired')),
    min: z.number().min(4, t('configShop.minMustBeAtLeast4')).max(7, t('configShop.minMustBeAtMost7')),
    max: z.number().min(5, t('configShop.maxMustBeAtLeast5')).max(8, t('configShop.maxMustBeAtMost8')),
    status: z.enum(["PREVIEW", "EXPIRED", "INACTIVE", "ACTIVE"]),
    nameTranslations: z.array(TranslationRequest).superRefine((translations, ctx) => {
        translations.forEach((translation, index) => {
            if (!translation.value || translation.value.trim().length === 0) {
                const key = translation.key;
                const errorKey = key === 'vi'
                    ? 'configShop.nameRequiredVi'
                    : key === 'en'
                        ? 'configShop.nameRequiredEn'
                        : 'configShop.nameRequiredJa';
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: t(errorKey),
                    path: [index, 'value'],
                });
            }
        });
    }),
}).refine((data) => data.max >= data.min, {
    message: t('configShop.maxMustBeGreaterThanOrEqualMin'),
    path: ["max"],
});

export type ICreateShopBannerRequest = z.infer<ReturnType<typeof createCreateShopBannerSchema>>;
//-------------------End-------------------//

export interface IGetRandomPokemonRequest {
    shopBannerId: number;
    amount: number;
}

export interface ICreateShopItemsRequest {
    items: Array<{
        shopBannerId: number;
        pokemonId: number;
        price: number;
        purchaseLimit: number;
        isActive: boolean;
    }>;
}

