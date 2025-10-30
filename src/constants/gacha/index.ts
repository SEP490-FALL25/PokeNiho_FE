const GachaBannerStatus = {
    PREVIEW: "PREVIEW",
    EXPIRED: "EXPIRED",
    INACTIVE: "INACTIVE",
    ACTIVE: "ACTIVE",
} as const;

export const GACHA = {
    GachaBannerStatus,
}

export type GachaBannerStatus = typeof GachaBannerStatus[keyof typeof GachaBannerStatus];

