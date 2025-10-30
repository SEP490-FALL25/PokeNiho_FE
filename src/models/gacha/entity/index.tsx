import z from "zod";
import { GACHA } from "@constants/gacha";
import { at, byUser, TranslationInputSchema } from "@models/common/response";
import { PokemonOmitEntitySchema } from "@models/pokemon/entity";
/**
 * Gacha Banner Entity Schema
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

export type IGachaBannerEntity = z.infer<typeof GachaBannerEntitySchema>;
//----------------------End----------------------//



//----------------------Gacha Item Rate Entity----------------------//
/**
 * Gacha Item Rate Entity Schema
 */
export const GachaItemRateEntitySchema = z.object({
    id: z.number(),
    starType: z.enum(GACHA.GachaItemRateStarType),
    rate: z.number(),
    ...byUser,
    ...at,
});
//----------------------End----------------------//



//----------------------Gacha Item Entity----------------------//
/**
 * Gacha Item Entity Schema
 */
export const GachaItemEntitySchema = z.object({
    id: z.number(),
    bannerId: z.number(),
    pokemonId: z.number(),
    gachaItemRateId: z.number(),
    ...byUser,
    ...at,
    pokemon: PokemonOmitEntitySchema,
    gachaItemRate: GachaItemRateEntitySchema,
});
//----------------------End----------------------//


