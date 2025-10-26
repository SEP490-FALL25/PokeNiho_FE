export interface IShopBannerResponse {
    id: number;
    nameKey: string;
    startDate: string;
    endDate: string;
    status: "PREVIEW" | "EXPIRED" | "INACTIVE" | "ACTIVE";
    min: number;
    max: number;
    createdById: number;
    deletedById: number | null;
    updatedById: number | null;
    deletedAt: string | null;
    createdAt: string;
    updatedAt: string;
    nameTranslation: string;
}

export interface IShopBannerListResponse {
    results: IShopBannerResponse[];
    pagination: {
        current: number;
        pageSize: number;
        totalPage: number;
        totalItem: number;
    };
}

export interface IShopItemResponse {
    id: number;
    shopBannerId: number;
    pokemonId: number;
    price: number;
    purchaseLimit: number;
    purchasedCount: number;
    isActive: boolean;
    createdById: number;
    updatedById: number | null;
    deletedById: number | null;
    deletedAt: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface IShopBannerDetailResponse {
    id: number;
    nameKey: string;
    startDate: string;
    endDate: string;
    status: "PREVIEW" | "EXPIRED" | "INACTIVE" | "ACTIVE";
    min: number;
    max: number;
    createdById: number;
    updatedById: number | null;
    deletedById: number | null;
    deletedAt: string | null;
    createdAt: string;
    updatedAt: string;
    nameTranslation: string;
    shopItems: IShopItemResponse[];
}

export interface IRandomPokemonResponse {
    shopBannerId: number;
    pokemonId: number;
    price: number;
    purchaseLimit: number;
    isActive: boolean;
    pokemon: {
        id: number;
        pokedex_number: number;
        nameJp: string;
        nameTranslations: {
            en: string;
            ja: string;
            vi: string;
        };
        description: string;
        conditionLevel: number;
        isStarted: boolean;
        imageUrl: string;
        rarity: string;
        createdById: number | null;
        updatedById: number | null;
        deletedById: number | null;
        createdAt: string;
        updatedAt: string;
        deletedAt: string | null;
    };
}

