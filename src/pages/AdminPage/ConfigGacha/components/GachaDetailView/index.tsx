import { useTranslation } from "react-i18next";
import { Badge } from "@ui/Badge";
import { Card, CardContent, CardHeader, CardTitle } from "@ui/Card";
import { Button } from "@ui/Button";
import { Separator } from "@ui/Separator";
import { ArrowLeft, Settings, Calendar, TrendingUp, Zap, Coins, Star, Sparkles, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { IGachaBannerEntity } from "@models/gacha/entity";
import { RarityBadge } from "@atoms/BadgeRarity";
import { useState } from "react";
import EditGachaDialog from "../EditGachaDialog";
import AddRandomGachaPokemonDialog from "../AddRandomGachaPokemonDialog";
import AddHandmadeGachaPokemonDialog from "../AddHandmadeGachaPokemonDialog";

export default function GachaDetailView({ bannerDetail }: { bannerDetail: IGachaBannerEntity }) {

    /**
     * Define Variables
     */
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [isEditOpen, setIsEditOpen] = useState<boolean>(false);
    const [isAddRandomOpen, setIsAddRandomOpen] = useState<boolean>(false);
    const [isAddManualOpen, setIsAddManualOpen] = useState<boolean>(false);
    //------------------------End------------------------//


    /**
     * Handle Back to List
     */
    const handleBackToList = () => {
        navigate(-1);
    };
    //------------------------End------------------------//




    const getStatusBadge = (status: string) => {
        const statusMap: Record<string, { label: string; variant: string }> = {
            PREVIEW: { label: t('configGacha.preview'), variant: "secondary" },
            ACTIVE: { label: t('common.active'), variant: "default" },
            INACTIVE: { label: t('common.inactive'), variant: "outline" },
            EXPIRED: { label: t('configGacha.expired'), variant: "destructive" },
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
                                className="bg-blue-500 text-white hover:bg-blue-600 border-blue-500"
                                onClick={() => setIsEditOpen(true)}
                            >
                                <Settings className="h-4 w-4 mr-2" />
                                {t('common.edit')}
                            </Button>

                            {/* Add Pokemon Buttons */}
                            <div className="flex gap-2">
                                <Button
                                    className="bg-primary text-primary-foreground hover:bg-primary/90"
                                    onClick={() => setIsAddRandomOpen(true)}
                                >
                                    <Sparkles className="h-4 w-4 mr-2" />
                                    {t('configShop.addRandomPokemon')}
                                </Button>
                                <Button
                                    className="bg-secondary text-white hover:bg-secondary/90"
                                    onClick={() => setIsAddManualOpen(true)}
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
                            <div className="flex items-center gap-2 mb-4">
                                <Calendar className="h-5 w-5 text-muted-foreground" />
                                <h3 className="text-base font-semibold text-foreground">{t('configGacha.basicInfo')}</h3>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2 bg-muted/20 p-4 rounded-lg border border-border">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="h-4 w-4 text-muted-foreground" />
                                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{t('configGacha.startDate')}</p>
                                    </div>
                                    <p className="text-base font-semibold text-foreground">{formatDate(bannerDetail?.startDate || '')}</p>
                                </div>
                                <div className="space-y-2 bg-muted/20 p-4 rounded-lg border border-border">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="h-4 w-4 text-muted-foreground" />
                                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{t('configGacha.endDate')}</p>
                                    </div>
                                    <p className="text-base font-semibold text-foreground">{formatDate(bannerDetail?.endDate || '')}</p>
                                </div>
                                <div className="space-y-2 bg-muted/20 p-4 rounded-lg border border-border">
                                    <div className="flex items-center gap-2">
                                        <Coins className="h-4 w-4 text-muted-foreground" />
                                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{t('configGacha.costRoll')}</p>
                                    </div>
                                    <p className="text-base font-semibold text-foreground">{bannerDetail?.costRoll}</p>
                                </div>
                                <div className="space-y-2 bg-muted/20 p-4 rounded-lg border border-border">
                                    <div className="flex items-center gap-2">
                                        <Star className="h-4 w-4 text-muted-foreground" />
                                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{t('configGacha.hardPity')}</p>
                                    </div>
                                    <p className="text-base font-semibold text-foreground">{bannerDetail?.hardPity5Star}</p>
                                </div>
                            </div>
                        </div>

                        {/* Separator */}
                        <Separator />

                        {/* Gacha Stats section */}
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <TrendingUp className="h-5 w-5 text-muted-foreground" />
                                <h3 className="text-base font-semibold text-foreground">{t('configGacha.gachaStats')}</h3>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                                <div className="space-y-2 bg-muted/20 p-4 rounded-lg border border-border">
                                    <div className="flex items-center gap-2">
                                        <Star className="h-4 w-4 text-muted-foreground" />
                                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{t('configGacha.amount5Star')}</p>
                                    </div>
                                    <p className="text-base font-semibold text-foreground">{bannerDetail?.amount5Star}</p>
                                </div>
                                <div className="space-y-2 bg-muted/20 p-4 rounded-lg border border-border">
                                    <div className="flex items-center gap-2">
                                        <Star className="h-4 w-4 text-muted-foreground" />
                                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{t('configGacha.amount4Star')}</p>
                                    </div>
                                    <p className="text-base font-semibold text-foreground">{bannerDetail?.amount4Star}</p>
                                </div>
                                <div className="space-y-2 bg-muted/20 p-4 rounded-lg border border-border">
                                    <div className="flex items-center gap-2">
                                        <Star className="h-4 w-4 text-muted-foreground" />
                                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{t('configGacha.amount3Star')}</p>
                                    </div>
                                    <p className="text-base font-semibold text-foreground">{bannerDetail?.amount3Star}</p>
                                </div>
                                <div className="space-y-2 bg-muted/20 p-4 rounded-lg border border-border">
                                    <div className="flex items-center gap-2">
                                        <Star className="h-4 w-4 text-muted-foreground" />
                                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{t('configGacha.amount2Star')}</p>
                                    </div>
                                    <p className="text-base font-semibold text-foreground">{bannerDetail?.amount2Star}</p>
                                </div>
                                <div className="space-y-2 bg-muted/20 p-4 rounded-lg border border-border">
                                    <div className="flex items-center gap-2">
                                        <Star className="h-4 w-4 text-muted-foreground" />
                                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{t('configGacha.amount1Star')}</p>
                                    </div>
                                    <p className="text-base font-semibold text-foreground">{bannerDetail?.amount1Star}</p>
                                </div>
                            </div>
                        </div>

                        {/* Separator */}
                        <Separator />

                        {/* Auto Pre-create Settings section */}
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <Zap className="h-5 w-5 text-muted-foreground" />
                                <h3 className="text-base font-semibold text-foreground">{t('configGacha.autoPrecreateSettings')}</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="space-y-2 bg-muted/20 p-4 rounded-lg border border-border">
                                    <div className="flex items-center gap-2">
                                        <Zap className="h-4 w-4 text-muted-foreground" />
                                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{t('configGacha.enablePrecreate')}</p>
                                    </div>
                                    <Badge variant={bannerDetail?.enablePrecreate ? "default" : "outline"} className="mt-1">
                                        {bannerDetail?.enablePrecreate ? t('common.active') : t('common.inactive')}
                                    </Badge>
                                </div>
                                <div className="space-y-2 bg-muted/20 p-4 rounded-lg border border-border">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="h-4 w-4 text-muted-foreground" />
                                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{t('configGacha.precreateBeforeEndDays')}</p>
                                    </div>
                                    <p className="text-base font-semibold text-foreground">{bannerDetail?.precreateBeforeEndDays} {t('configGacha.days')}</p>
                                </div>
                                <div className="space-y-2 bg-muted/20 p-4 rounded-lg border border-border">
                                    <div className="flex items-center gap-2">
                                        <Sparkles className="h-4 w-4 text-muted-foreground" />
                                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{t('configGacha.isRandomItemAgain')}</p>
                                    </div>
                                    <Badge variant={bannerDetail?.isRandomItemAgain ? "default" : "outline"} className="mt-1">
                                        {bannerDetail?.isRandomItemAgain ? t('common.active') : t('common.inactive')}
                                    </Badge>
                                </div>
                            </div>
                        </div>

                        {/* Separator */}
                        <Separator />

                        {/* Gacha Items */}
                        <div>
                            <h3 className="text-lg font-semibold text-foreground mb-4">
                                {t('configGacha.pokemonInGacha')} ({bannerDetail?.items?.length || 0})
                            </h3>
                            {bannerDetail?.items && bannerDetail?.items.length > 0 ? (
                                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                    {bannerDetail?.items.map((item: any) => (
                                        <Card
                                            key={item.id}
                                            className="bg-muted/30 relative group hover:border-primary transition-colors"
                                        >
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
                                                        <span className="text-muted-foreground">{t('configGacha.starType')}:</span>
                                                        <span className="font-medium text-foreground">{item.gachaItemRate.starType} ★</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-muted-foreground">{t('configGacha.rate')}:</span>
                                                        <span className="font-medium text-foreground">{item.gachaItemRate.rate}%</span>
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
                                    {t('configGacha.noPokemonInGacha')}
                                </div>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>
            <EditGachaDialog isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} bannerData={bannerDetail} />
            <AddRandomGachaPokemonDialog isOpen={isAddRandomOpen} onClose={() => setIsAddRandomOpen(false)} bannerId={bannerDetail?.id} />
            <AddHandmadeGachaPokemonDialog isOpen={isAddManualOpen} onClose={() => setIsAddManualOpen(false)} bannerId={bannerDetail?.id} />
        </div>
    );
}

