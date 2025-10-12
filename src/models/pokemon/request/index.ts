import { z } from 'zod';
import { RarityPokemon } from '@constants/pokemon';

// Schema for form data (before coercion)
export const CreatePokemonFormSchema = z.object({
    pokedex_number: z.string().min(1, "Pokedex number is required."),
    nameJp: z.string().min(1, "Japanese name is required."),
    nameTranslations: z.object({
        jp: z.string().min(1, "Japanese name is required."),
        en: z.string().min(1, "English name is required."),
        vi: z.string().min(1, "Vietnamese name is required."),
    }),
    description: z.string().optional(),
    imageUrl: z.string().optional(),
    isStarted: z.boolean(),
    rarity: z.nativeEnum(RarityPokemon, {
        error: () => ({ message: "Please select a valid rarity." }),
    }),
    typeIds: z.array(z.number()).min(1, "Please select at least one type.").max(2, "A Pokemon can have at most two types."),
});

// Schema for API request (after coercion)
export const CreatePokemonSchema = z.object({
    pokedex_number: z.coerce.number().min(1, "Pokedex number must be at least 1."),
    nameJp: z.string().min(1, "Japanese name is required."),
    nameEn: z.string().min(1, "English name is required."),
    nameVi: z.string().min(1, "Vietnamese name is required."),
    description: z.string().optional(),
    isStarted: z.boolean(),
    imageUrl: z.string().optional(),
    rarity: z.nativeEnum(RarityPokemon, {
        error: () => ({ message: "Please select a valid rarity." }),
    }),
    typeIds: z.array(z.number()).min(1, "Please select at least one type.").max(2, "A Pokemon can have at most two types."),
});

export const CreatePokemonWithUrlSchema = CreatePokemonSchema.extend({
    imageUrl: z.string().url("Invalid URL format.").min(1, "Image URL is required."),
});

export type ICreatePokemonRequest = z.infer<typeof CreatePokemonSchema>;
export type ICreatePokemonWithUrlRequest = z.infer<typeof CreatePokemonWithUrlSchema>;

// Type for form data (before coercion)
export type ICreatePokemonFormData = z.infer<typeof CreatePokemonFormSchema>;    