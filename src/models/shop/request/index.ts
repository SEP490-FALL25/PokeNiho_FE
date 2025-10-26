export interface ICreateShopBannerRequest {
    startDate: string;
    endDate: string;
    min: number;
    max: number;
    status: "PREVIEW" | "EXPIRED" | "INACTIVE" | "ACTIVE";
    nameTranslations: Array<{
        key: "en" | "ja" | "vi";
        value: string;
    }>;
}

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

