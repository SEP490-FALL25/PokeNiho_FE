import { useTranslation } from "react-i18next";
import { Badge } from "@ui/Badge";
import { Card, CardContent, CardHeader, CardTitle } from "@ui/Card";
import { Button } from "@ui/Button";
import { Separator } from "@ui/Separator";
import { ArrowLeft, Settings, Calendar, TrendingUp, Zap, Coins, Star, Sparkles, Plus, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { IGachaBannerEntity } from "@models/gacha/entity";
import { RarityBadge } from "@atoms/BadgeRarity";
import { useState } from "react";
import EditGachaDialog from "../EditGachaDialog";
import AddGachaPokemonSidebar from "../AddGachaPokemonSidebar";
import { useDeleteGachaItem } from "@hooks/useGacha";

export default function GachaDetailView({ bannerDetail }: { bannerDetail: IGachaBannerEntity }) {

    /**
     * Define Variables
     */
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [isEditOpen, setIsEditOpen] = useState<boolean>(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
    const [hoveredItemId, setHoveredItemId] = useState<number | null>(null);
    const { mutate: deleteGachaItem } = useDeleteGachaItem();
    const [itemsByRarity, setItemsByRarity] = useState<Record<string, any[]>>({
        COMMON: [], UNCOMMON: [], RARE: [], EPIC: [], LEGENDARY: []
    })
    const [dragOverRarity, setDragOverRarity] = useState<string | null>(null)

    const getHeaderColor = (rarity: string) => (
        rarity === 'COMMON' ? 'bg-green-50 text-green-700 border-green-100' :
            rarity === 'UNCOMMON' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                rarity === 'RARE' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                    rarity === 'EPIC' ? 'bg-purple-50 text-purple-700 border-purple-100' :
                        rarity === 'LEGENDARY' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                            'bg-muted text-foreground border-border'
    )

    const getCardColor = (rarity: string) => (
        rarity === 'COMMON' ? 'border-green-200 hover:border-green-400 bg-green-50/40' :
            rarity === 'UNCOMMON' ? 'border-emerald-200 hover:border-emerald-400 bg-emerald-50/40' :
                rarity === 'RARE' ? 'border-blue-200 hover:border-blue-400 bg-blue-50/40' :
                    rarity === 'EPIC' ? 'border-purple-200 hover:border-purple-400 bg-purple-50/40' :
                        rarity === 'LEGENDARY' ? 'border-amber-200 hover:border-amber-400 bg-amber-50/40' :
                            'border-border hover:border-primary bg-muted/30'
    )

    // Initialize grouping
    useState(() => {
        const grouped: Record<string, any[]> = { COMMON: [], UNCOMMON: [], RARE: [], EPIC: [], LEGENDARY: [] }
            ; (bannerDetail?.items || []).forEach((it: any) => {
                const key = (it?.pokemon?.rarity || 'COMMON') as string
                if (!grouped[key]) grouped[key] = []
                grouped[key].push(it)
            })
        setItemsByRarity(grouped)
    })

    const makeDropHandlers = (rarity: string) => ({
        onDragOver: (e: React.DragEvent) => { e.preventDefault(); e.dataTransfer.dropEffect = 'move'; setDragOverRarity(rarity) },
        onDragEnter: (e: React.DragEvent) => { e.preventDefault(); setDragOverRarity(rarity) },
        onDragLeave: () => { setDragOverRarity((curr) => (curr === rarity ? null : curr)) },
        onDrop: (e: React.DragEvent) => {
            e.preventDefault()
            setDragOverRarity(null)
            const listData = e.dataTransfer.getData('application/pokemon-list')
            const singleData = e.dataTransfer.getData('application/pokemon')
            if (!listData && !singleData) return
            try {
                const payload: any[] = listData ? JSON.parse(listData) : [JSON.parse(singleData)]
                setItemsByRarity((prev) => {
                    const next = { ...prev }
                    payload.forEach((p) => {
                        const exists = Object.values(next).flat().some((it: any) => it?.pokemonId === p.id)
                        if (!exists) {
                            const newItem = {
                                id: Math.floor(Math.random() * 1e9),
                                bannerId: bannerDetail.id,
                                pokemonId: p.id,
                                gachaItemRateId: 0,
                                pokemon: {
                                    imageUrl: p.imageUrl,
                                    nameTranslations: { en: p.nameTranslations.en },
                                    pokedex_number: p.pokedex_number,
                                    rarity: rarity,
                                },
                                gachaItemRate: { id: 0, starType: 'THREE', rate: 1 },
                            }
                            next[rarity] = [...(next[rarity] || []), newItem]
                        }
                    })
                    return next
                })
                setIsSidebarOpen(false)
            } catch { }
        }
    })
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

                            {/* Open Sidebar to add Pokemon */}
                            <Button
                                className="bg-primary text-primary-foreground hover:bg-primary/90"
                                onClick={() => setIsSidebarOpen(true)}
                            >
                                <Sparkles className="h-4 w-4 mr-2" />
                                Add Pokémon
                            </Button>
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

                        {/* Gacha Items by Rarity with DnD */}
                        <div>
                            <h3 className="text-lg font-semibold text-foreground mb-4">{t('configGacha.pokemonInGacha')}</h3>
                            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 xl:grid-cols-5">
                                {(['COMMON', 'UNCOMMON', 'RARE', 'EPIC', 'LEGENDARY'] as const).map((rar) => (
                                    <div key={rar} className={`rounded-lg border border-dashed min-h-[260px] transition-colors ${dragOverRarity === rar ? 'ring-2 ring-primary/50 bg-primary/5' : ''}`}
                                        {...makeDropHandlers(rar)}
                                    >
                                        <div className={`px-3 py-2 rounded-t-lg border-b text-xs font-semibold tracking-wide ${getHeaderColor(rar)}`}>{rar}</div>
                                        <div className="p-2 space-y-2">
                                            {(itemsByRarity[rar] || []).map((item: any) => (
                                                <Card
                                                    key={item.id}
                                                    className={`bg-white relative group transition-colors border shadow-sm ${getCardColor(rar)}`}
                                                    onMouseEnter={() => setHoveredItemId(item.id)}
                                                    onMouseLeave={() => setHoveredItemId(null)}
                                                >
                                                    {hoveredItemId === item.id && (
                                                        <div className="absolute top-2 right-2 flex gap-2 z-10">
                                                            <button
                                                                className="w-7 h-7 flex items-center justify-center rounded-full bg-red-500 hover:bg-red-600 transition-colors cursor-pointer shadow"
                                                                onClick={() => deleteGachaItem(item.id)}
                                                            >
                                                                <X className="w-4 h-4 text-white" />
                                                            </button>
                                                        </div>
                                                    )}
                                                    <CardHeader>
                                                        <div className="flex items-center gap-3">
                                                            <img
                                                                src={item.pokemon.imageUrl}
                                                                alt={item.pokemon.nameTranslations.en}
                                                                className="w-14 h-14 rounded-md shadow"
                                                            />
                                                            <div className="min-w-0">
                                                                <CardTitle className="text-sm truncate">{item.pokemon.nameTranslations.en}</CardTitle>
                                                                <p className="text-[11px] text-muted-foreground mt-0.5 truncate">Dex #{item.pokemon.pokedex_number}</p>
                                                            </div>
                                                        </div>
                                                    </CardHeader>
                                                    <CardContent>
                                                        <div className="space-y-1.5 text-[12px]">
                                                            <div className="flex justify-between">
                                                                <span className="text-muted-foreground">{t('configGacha.starType')}:</span>
                                                                <span className="font-medium text-foreground">{item.gachaItemRate.starType} ★</span>
                                                            </div>
                                                            <div className="flex justify-between">
                                                                <span className="text-muted-foreground">{t('configGacha.rate')}:</span>
                                                                <span className="font-medium text-foreground">{item.gachaItemRate.rate}%</span>
                                                            </div>
                                                            <div className="pt-1">
                                                                <RarityBadge level={item.pokemon.rarity as any} />
                                                            </div>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
            <EditGachaDialog isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} bannerData={bannerDetail} />
            <AddGachaPokemonSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        </div>
    );
}

