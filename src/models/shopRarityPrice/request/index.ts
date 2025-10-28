import z from "zod";

/**
 * Update Shop Rarity Price Request Schema
 */
const UpdateShopRarityPriceRequestSchema = z.object({
    rarity: z.enum(["COMMON", "UNCOMMON", "RARE", "EPIC", "LEGENDARY"]),
    price: z.number(),
    isChangeAllShopPreview: z.boolean(),
});

export type IUpdateShopRarityPriceRequest = z.infer<typeof UpdateShopRarityPriceRequestSchema>;
//----------------------End----------------------//