import z from "zod";
import { GACHA } from "@constants/gacha";
import { at, byUser, TranslationInputSchema } from "@models/common/response";
/**
 * {
    "statusCode": 200,
    "data": {
        "id": 2,
        "nameKey": "gachaBanner.name.2",
        "startDate": "2025-10-27T00:00:00.000Z",
        "endDate": "2025-11-27T00:00:00.000Z",
        "status": "ACTIVE",
        "enablePrecreate": true,
        "precreateBeforeEndDays": 2,
        "isRandomItemAgain": true,
        "hardPity5Star": 90,
        "costRoll": 160,
        "amount5Star": 1,
        "amount4Star": 2,
        "amount3Star": 3,
        "amount2Star": 4,
        "amount1Star": 5,
        "createdById": 1,
        "updatedById": null,
        "deletedById": null,
        "deletedAt": null,
        "createdAt": "2025-10-30T17:43:53.011Z",
        "updatedAt": "2025-10-30T17:43:53.042Z",
        "nameTranslation": "Banner Ước Nguyện Giáng 111",
        "nameTranslations": [
            {
                "key": "en",
                "value": "Christmas Wishes Banner111Banner111111"
            },
            {
                "key": "vi",
                "value": "Banner Ước Nguyện Giáng 111"
            },
            {
                "key": "ja",
                "value": "11"
            }
        ],
        "items": []
    },
    "message": "Lấy thông tin banner gacha thành công"
}
 */
export const GachaBannerEntitySchema = z.object({
    id: z.number(),
    nameKey: z.string(),
    startDate: z.string(),
    endDate: z.string(),
    status: z.enum(GACHA.GachaBannerStatus),
    enablePrecreate: z.boolean(),
    precreateBeforeEndDays: z.number(),
    isRandomItemAgain: z.boolean(),
    hardPity5Star: z.number(),
    costRoll: z.number(),
    amount5Star: z.number(),
    amount4Star: z.number(),
    amount3Star: z.number(),
    amount2Star: z.number(),
    amount1Star: z.number(),
    ...byUser,
    ...at,
    nameTranslation: z.string(),
    nameTranslations: TranslationInputSchema,
    // items: z.array(GachaItemEntitySchema),
});

export type GachaBannerEntity = z.infer<typeof GachaBannerEntitySchema>;