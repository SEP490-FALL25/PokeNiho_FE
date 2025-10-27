import { useTranslation } from "react-i18next";
import { Badge } from "@ui/Badge";
import { Card, CardContent, CardHeader, CardTitle } from "@ui/Card";
import { Button } from "@ui/Button";
import { Separator } from "@ui/Separator";
import { ArrowLeft, Plus, X, Edit, Settings } from "lucide-react";
import { Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AddRandomPokemonDialog from "../AddRandomPokemonDialog";
import { useState } from "react";
import { IShopBannerSchema } from "@models/shop/entity";
import { useDeleteShopItem } from "@hooks/useShop";
import { RarityBadge } from "@atoms/BadgeRarity";
import AddHandmadePokemonDialog from "../AddHandmadePokemonDialog";
import EditPriceDialog from "../EditPriceDialog";
import EditShopBannerDialog from "../EditShopBannerDialog";

export default function ShopBannerDetailView({ bannerDetail }: { bannerDetail: IShopBannerSchema }) {

    /**
     * Define Variables
     */
    const { t } = useTranslation();
    const navigate = useNavigate();
    //------------------------End------------------------//


    /**
     * Handle Back to List
     */
    const handleBackToList = () => {
        navigate(-1);
    };
    //------------------------End------------------------//


    /**
     * Handle Hover for Delete Button
     */
    const [hoveredItemId, setHoveredItemId] = useState<number | null>(null);
    //------------------------End------------------------//


    /**
     * Handle Edit Price
     */
    const [editPriceState, setEditPriceState] = useState<{
        isOpen: boolean;
        itemId: number;
        currentPrice: number;
        shopBannerId: number;
        pokemonId: number;
        purchaseLimit: number;
        isActive: boolean;
        pokemon: {
            id: number;
            nameTranslations: { en: string; ja: string; vi: string };
            imageUrl: string;
            pokedex_number: number;
            rarity: string;
        };
    } | null>(null);

    const handleEditPrice = (item: any) => {
        setEditPriceState({
            isOpen: true,
            itemId: item.id,
            currentPrice: item.price,
            shopBannerId: item.shopBannerId,
            pokemonId: item.pokemonId,
            purchaseLimit: item.purchaseLimit,
            isActive: item.isActive,
            pokemon: item.pokemon,
        });
    };

    const handleCloseEditPrice = () => {
        setEditPriceState(null);
    };
    //------------------------End------------------------//


    /**
     * Handle Edit Shop Banner
     */
    const [isEditBannerDialogOpen, setIsEditBannerDialogOpen] = useState<boolean>(false);
    const handleEditBanner = () => {
        setIsEditBannerDialogOpen(true);
    };
    //------------------------End------------------------//


    const getStatusBadge = (status: string) => {
        const statusMap: Record<string, { label: string; variant: string }> = {
            PREVIEW: { label: t('configShop.preview'), variant: "secondary" },
            ACTIVE: { label: t('common.active'), variant: "default" },
            INACTIVE: { label: t('common.inactive'), variant: "outline" },
            EXPIRED: { label: t('configShop.expired'), variant: "destructive" },
        };

        const statusInfo = statusMap[status] || { label: status, variant: "outline" };
        return (
            <Badge variant={statusInfo.variant as any} className="text-xs">
                {statusInfo.label}
            </Badge>
        );
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("vi-VN");
    };


    /**
     * Handle Add Random Pokemon
     */
    const [isAddRandomDialogOpen, setIsAddRandomDialogOpen] = useState<boolean>(false);
    const handleAddRandomPokemon = () => {
        setIsAddRandomDialogOpen(true);
    };
    //------------------------End------------------------//


    /**
     * Handle Add Pokemon Not Random
     */
    const [isAddPokemonNotRandomDialogOpen, setIsAddPokemonNotRandomDialogOpen] = useState<boolean>(false);
    const handleAddPokemonNotRandom = () => {
        setIsAddPokemonNotRandomDialogOpen(true);
    };
    //------------------------End------------------------//


    /**
     * Handle Delete Shop Item
     */
    const { mutate: deleteShopItem } = useDeleteShopItem();
    const handleDeleteShopItem = (id: number) => {
        deleteShopItem(id);
    };
    //------------------------End------------------------//


    return (

        <div className="p-8 mt-24">
            <Card className="bg-card border-border">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Button variant="ghost" size="icon" onClick={handleBackToList}>
                                <ArrowLeft className="h-4 w-4" />
                            </Button>
                            <div>
                                <CardTitle className="text-foreground">{bannerDetail?.nameTranslation}</CardTitle>
                                <div className="flex items-center gap-2 mt-2">
                                    {getStatusBadge(bannerDetail?.status || '') as any}
                                </div>
                            </div>
                        </div>

                        {/* Button Actions */}
                        <div className="flex items-center gap-2">
                            {/* Edit Banner Button */}
                            <Button
                                variant="outline"
                                onClick={handleEditBanner}
                                className="bg-blue-500 text-white hover:bg-blue-600 border-blue-500"
                            >
                                <Settings className="h-4 w-4 mr-2" />
                                {t('common.edit')}
                            </Button>

                            {/* Add Pokemon Buttons Group */}
                            <div className="flex gap-2">
                                <Button
                                    className="bg-primary text-primary-foreground hover:bg-primary/90"
                                    onClick={handleAddRandomPokemon}
                                >
                                    <Sparkles className="h-4 w-4 mr-2" />
                                    {t('configShop.addRandomPokemon')}
                                </Button>
                                <Button
                                    className="bg-secondary text-white hover:bg-secondary/90"
                                    onClick={handleAddPokemonNotRandom}
                                >
                                    <Plus className="h-4 w-4 mr-2" />
                                    {t('configShop.addPokemonNotRandom')}
                                </Button>
                            </div>
                        </div>
                    </div>
                </CardHeader>

                <CardContent>
                    <div className="space-y-6">
                        {/* Basic Info section */}
                        <div>
                            <h3 className="text-base font-semibold text-foreground mb-4">{t('configShop.basicInfo')}</h3>
                            <Card className="bg-muted/20 border-border">
                                <CardContent className="p-4">
                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="space-y-1">
                                            <p className="text-xs text-muted-foreground uppercase tracking-wide">{t('configShop.startDate')}</p>
                                            <p className="text-lg font-semibold text-foreground">{formatDate(bannerDetail?.startDate || '')}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-xs text-muted-foreground uppercase tracking-wide">{t('configShop.endDate')}</p>
                                            <p className="text-lg font-semibold text-foreground">{formatDate(bannerDetail?.endDate || '')}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-xs text-muted-foreground uppercase tracking-wide">{t('configShop.minQuantity')}</p>
                                            <p className="text-lg font-semibold text-foreground">{bannerDetail?.min}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-xs text-muted-foreground uppercase tracking-wide">{t('configShop.maxQuantity')}</p>
                                            <p className="text-lg font-semibold text-foreground">{bannerDetail?.max}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Separator */}
                        <Separator />

                        {/* Auto Pre-create Settings section */}
                        <div>
                            <h3 className="text-base font-semibold text-foreground mb-4">{t('configShop.autoPrecreateSettings')}</h3>
                            <Card className="bg-muted/20 border-border">
                                <CardContent className="p-4">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="flex flex-col space-y-2">
                                            <p className="text-xs text-muted-foreground uppercase tracking-wide">{t('configShop.enablePrecreate')}</p>
                                            <Badge variant={bannerDetail?.enablePrecreate ? "default" : "outline"} className="w-fit">
                                                {bannerDetail?.enablePrecreate ? t('common.active') : t('common.inactive')}
                                            </Badge>
                                        </div>
                                        <div className="flex flex-col space-y-2">
                                            <p className="text-xs text-muted-foreground uppercase tracking-wide">{t('configShop.precreateBeforeEndDays')}</p>
                                            <p className="text-lg font-semibold text-foreground">{bannerDetail?.precreateBeforeEndDays} {t('configShop.days')}</p>
                                        </div>
                                        <div className="flex flex-col space-y-2">
                                            <p className="text-xs text-muted-foreground uppercase tracking-wide">{t('configShop.isRandomItemAgain')}</p>
                                            <Badge variant={bannerDetail?.isRandomItemAgain ? "default" : "outline"} className="w-fit">
                                                {bannerDetail?.isRandomItemAgain ? t('common.active') : t('common.inactive')}
                                            </Badge>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Separator */}
                        <Separator />

                        {/* Shop Items */}
                        <div>
                            <h3 className="text-lg font-semibold text-foreground mb-4">
                                {t('configShop.pokemonInShop')} ({bannerDetail?.shopItems?.length || 0})
                            </h3>
                            {bannerDetail?.shopItems && bannerDetail?.shopItems.length > 0 ? (
                                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                    {bannerDetail?.shopItems.map((item: any) => (
                                        <Card
                                            key={item.id}
                                            className="bg-muted/30 relative group hover:border-primary transition-colors"
                                            onMouseEnter={() => setHoveredItemId(item.id)}
                                            onMouseLeave={() => setHoveredItemId(null)}
                                        >
                                            {/* Action buttons - only visible on hover */}
                                            {hoveredItemId === item.id && (
                                                <div className="absolute top-2 right-2 flex gap-2 z-10">
                                                    <button
                                                        className="w-7 h-7 flex items-center justify-center rounded-full bg-blue-500 hover:bg-blue-600 transition-colors cursor-pointer"
                                                        onClick={() => handleEditPrice(item)}
                                                    >
                                                        <Edit className="w-4 h-4 text-white" />
                                                    </button>
                                                    <button
                                                        className="w-7 h-7 flex items-center justify-center rounded-full bg-red-500 hover:bg-red-600 transition-colors cursor-pointer"
                                                        onClick={() => handleDeleteShopItem(item.id)}
                                                    >
                                                        <X className="w-4 h-4 text-white" />
                                                    </button>
                                                </div>
                                            )}
                                            <CardHeader>
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <img
                                                            src={item.pokemon.imageUrl}
                                                            alt={item.pokemon.nameTranslations.en}
                                                            className="w-20 h-20 rounded-full"
                                                        />
                                                    </div>

                                                    <div>
                                                        <CardTitle className="text-sm">{item.pokemon.nameTranslations.en}</CardTitle>
                                                        <p className="text-xs text-muted-foreground mt-1">
                                                            Pokedex: {item.pokemon.pokedex_number}
                                                        </p>
                                                    </div>
                                                </div>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="space-y-2 text-sm">
                                                    <div className="flex justify-between">
                                                        <span className="text-muted-foreground">{t('configShop.price')}:</span>
                                                        <span className="font-medium text-foreground">{item.price.toLocaleString()} đ</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-muted-foreground">{t('configShop.purchaseLimit')}:</span>
                                                        <span className="font-medium text-foreground">{item.purchaseLimit}</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-muted-foreground">{t('configShop.purchasedCount')}:</span>
                                                        <span className="font-medium text-foreground">{item.purchasedCount}</span>
                                                    </div>
                                                    <div className="mt-2">
                                                        <RarityBadge level={item.pokemon.rarity as any} />
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center text-muted-foreground py-8">
                                    {t('configShop.noPokemonInShop')}
                                </div>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Add Random Pokemon Dialog */}
            <AddRandomPokemonDialog
                isOpen={isAddRandomDialogOpen}
                onClose={() => setIsAddRandomDialogOpen(false)}
                bannerId={bannerDetail?.id || 0}
            />

            {/* Add Handmade Pokemon Dialog */}
            <AddHandmadePokemonDialog
                isOpen={isAddPokemonNotRandomDialogOpen}
                onClose={() => setIsAddPokemonNotRandomDialogOpen(false)}
                bannerId={bannerDetail?.id || 0}
            />

            {/* Edit Price Dialog */}
            {editPriceState && (
                <EditPriceDialog
                    isOpen={editPriceState.isOpen}
                    onClose={handleCloseEditPrice}
                    itemId={editPriceState.itemId}
                    currentPrice={editPriceState.currentPrice}
                    shopBannerId={editPriceState.shopBannerId}
                    pokemonId={editPriceState.pokemonId}
                    purchaseLimit={editPriceState.purchaseLimit}
                    isActive={editPriceState.isActive}
                    pokemon={editPriceState.pokemon}
                />
            )}

            {/* Edit Shop Banner Dialog */}
            <EditShopBannerDialog
                isOpen={isEditBannerDialogOpen}
                onClose={() => setIsEditBannerDialogOpen(false)}
                bannerData={bannerDetail}
            />
        </div>
    );
}