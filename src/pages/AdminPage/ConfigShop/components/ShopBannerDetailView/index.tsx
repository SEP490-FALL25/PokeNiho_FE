import { useTranslation } from "react-i18next";
import { Badge } from "@ui/Badge";
import { Card, CardContent, CardHeader, CardTitle } from "@ui/Card";
import { Button } from "@ui/Button";
import { ArrowLeft, X } from "lucide-react";
import { Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AddRandomPokemonDialog from "../../AddRandomPokemonDialog";
import { useState } from "react";
import { IShopBannerSchema } from "@models/shop/entity";

export default function ShopBannerDetailView({ bannerDetail }: { bannerDetail: IShopBannerSchema }) {

    console.log(bannerDetail);

    /**
     * Define Variables
     */
    const { t } = useTranslation();
    const navigate = useNavigate();
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
     * Handle Hover for Delete Button
     */
    const [hoveredItemId, setHoveredItemId] = useState<number | null>(null);
    //------------------------End------------------------//


    /**
     * Handle Back to List
     */
    const handleBackToList = () => {
        navigate(-1);
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
                        <Button
                            className="bg-primary text-primary-foreground hover:bg-primary/90"
                            onClick={handleAddRandomPokemon}
                        >
                            <Sparkles className="h-4 w-4 mr-2" />
                            {t('configShop.addRandomPokemon')}
                        </Button>
                    </div>
                </CardHeader>

                <CardContent>
                    <div className="space-y-6">
                        {/* Info section */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-muted-foreground mb-1">{t('configShop.startDate')}</p>
                                <p className="text-foreground">{formatDate(bannerDetail?.startDate || '')}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground mb-1">{t('configShop.endDate')}</p>
                                <p className="text-foreground">{formatDate(bannerDetail?.endDate || '')}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground mb-1">{t('configShop.minQuantity')}</p>
                                <p className="text-foreground">{bannerDetail?.min}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground mb-1">{t('configShop.maxQuantity')}</p>
                                <p className="text-foreground">{bannerDetail?.max}</p>
                            </div>
                        </div>

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
                                            className="bg-muted/30 border-border relative group"
                                            onMouseEnter={() => setHoveredItemId(item.id)}
                                            onMouseLeave={() => setHoveredItemId(null)}
                                        >
                                            {/* Delete button - only visible on hover */}
                                            {hoveredItemId === item.id && (
                                                <button
                                                    className="absolute top-2 right-2 w-7 h-7 flex items-center justify-center rounded-full bg-red-500 hover:bg-red-600 transition-colors z-10 cursor-pointer"
                                                    onClick={() => console.log('Delete item with id:', item.id)}
                                                    type="button"
                                                >
                                                    <X className="w-4 h-4 text-white" />
                                                </button>
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
                                                        <Badge variant={item.isActive ? "default" : "secondary"}>
                                                            {item.isActive ? t('common.active') : t('common.inactive')}
                                                        </Badge>
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

            <AddRandomPokemonDialog
                isOpen={isAddRandomDialogOpen}
                onClose={() => setIsAddRandomDialogOpen(false)}
                bannerId={bannerDetail?.id || 0}
            />
        </div>
    );
}