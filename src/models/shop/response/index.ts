import { PokemonEntitySchema } from "@models/pokemon/entity";
import z from "zod";

/**
 * Shop Item Entity Schema
 */
export const ShopItemRandomSchema = z.object({
    shopBannerId: z.number(),
    pokemonId: z.number(),
    price: z.number(),
    purchaseLimit: z.number(),
    isActive: z.boolean(),
    pokemon: PokemonEntitySchema,
});
export type IShopItemRandomSchema = z.infer<typeof ShopItemRandomSchema>;
//------------------------End------------------------//

