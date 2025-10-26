import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@ui/Card";
import { Button } from "@ui/Button";
import { Badge } from "@ui/Badge";
import { Skeleton } from "@ui/Skeleton";
import HeaderAdmin from "@organisms/Header/Admin";
import PaginationControls from "@ui/PaginationControls";
import { Plus, ShoppingBag, Calendar, Sparkles, ArrowLeft } from "lucide-react";
import { useShopBannerList, useShopBannerById } from "@hooks/useShop";
import { IShopBannerResponse } from "@models/shop/response";
import CreateShopBannerDialog from "./CreateShopBannerDialog";
import AddRandomPokemonDialog from "./AddRandomPokemonDialog";
import { useTranslation } from "react-i18next";

type ViewType = "list" | "detail";

export default function ConfigShop() {
    const { t } = useTranslation();
    const [currentView, setCurrentView] = useState<ViewType>("list");
    const [selectedBannerId, setSelectedBannerId] = useState<number | null>(2); // Test with banner ID 2
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState<boolean>(false);
    const [isAddRandomDialogOpen, setIsAddRandomDialogOpen] = useState<boolean>(true); // Set to true to test AddRandomPokemonDialog

    const [currentPage, setCurrentPage] = useState<number>(1);
    const [itemsPerPage, setItemsPerPage] = useState<number>(15);

    const { data: bannersData, isLoading: isBannersLoading } = useShopBannerList({
        page: currentPage,
        limit: itemsPerPage,
    });

    const handleViewBanner = (id: number) => {
        setSelectedBannerId(id);
        setCurrentView("detail");
    };

    const handleBackToList = () => {
        setCurrentView("list");
        setSelectedBannerId(null);
    };

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

    if (currentView === "detail" && selectedBannerId) {
        return <ShopBannerDetailViewWrapper
            bannerId={selectedBannerId}
            onBack={handleBackToList}
            onAddRandom={() => setIsAddRandomDialogOpen(true)}
        />;
    }

    return (
        <>
            <HeaderAdmin title={t('configShop.title')} description={t('configShop.description')} />
            <div className="p-8 mt-24">
                <Card className="bg-card border-border">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-foreground">{t('configShop.bannerList')}</CardTitle>
                            <Button
                                className="bg-primary text-primary-foreground hover:bg-primary/90"
                                onClick={() => setIsCreateDialogOpen(true)}
                            >
                                <Plus className="h-4 w-4 mr-2" />
                                {t('configShop.createBanner')}
                            </Button>
                        </div>
                    </CardHeader>

                    <CardContent>
                        {isBannersLoading ? (
                            <BannersSkeleton />
                        ) : bannersData?.data?.results?.length ? (
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                {bannersData.data.results.map((banner: IShopBannerResponse) => (
                                    <Card
                                        key={banner.id}
                                        className="bg-muted/50 border-border hover:border-primary/50 transition-colors cursor-pointer"
                                        onClick={() => handleViewBanner(banner.id)}
                                    >
                                        <CardHeader>
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <CardTitle className="text-lg text-foreground mb-2">
                                                        {banner.nameTranslation}
                                                    </CardTitle>
                                                    <div className="flex items-center gap-2 mb-2">
                                                        {getStatusBadge(banner.status)}
                                                    </div>
                                                </div>
                                            </div>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="space-y-2 text-sm text-muted-foreground">
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="h-4 w-4" />
                                                    <span>{formatDate(banner.startDate)} - {formatDate(banner.endDate)}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <ShoppingBag className="h-4 w-4" />
                                                    <span>Min: {banner.min} - Max: {banner.max}</span>
                                                </div>
                                                <div className="text-xs text-foreground/60 mt-2">
                                                    ID: {banner.id}
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center text-muted-foreground py-12">
                                {t('configShop.noBannersFound')}
                            </div>
                        )}
                    </CardContent>

                    <CardFooter className="justify-between">
                        <PaginationControls
                            currentPage={currentPage}
                            totalPages={bannersData?.data?.pagination?.totalPage || 1}
                            totalItems={bannersData?.data?.pagination?.totalItem || 0}
                            itemsPerPage={itemsPerPage}
                            onPageChange={setCurrentPage}
                            onItemsPerPageChange={setItemsPerPage}
                            isLoading={isBannersLoading}
                        />
                    </CardFooter>
                </Card>
            </div>

            <CreateShopBannerDialog
                isOpen={isCreateDialogOpen}
                onClose={() => setIsCreateDialogOpen(false)}
            />

            {selectedBannerId && (
                <AddRandomPokemonDialog
                    isOpen={isAddRandomDialogOpen}
                    onClose={() => setIsAddRandomDialogOpen(false)}
                    bannerId={selectedBannerId}
                />
            )}
        </>
    );
}

function BannersSkeleton() {
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
                <Card key={`skeleton-${index}`} className="bg-muted/50 border-border">
                    <CardHeader>
                        <div className="space-y-2">
                            <Skeleton className="h-6 w-3/4" />
                            <Skeleton className="h-4 w-24" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-32" />
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}

function ShopBannerDetailViewWrapper({
    bannerId,
    onBack,
    onAddRandom
}: {
    bannerId: number;
    onBack: () => void;
    onAddRandom: () => void;
}) {
    const { data: bannerDetail, isLoading } = useShopBannerById(bannerId);

    if (isLoading) {
        return (
            <div className="p-8 mt-24">
                <Card className="bg-card border-border">
                    <CardHeader>
                        <Skeleton className="h-8 w-48" />
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <Skeleton key={i} className="h-20 w-full" />
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (!bannerDetail) {
        return (
            <div className="p-8 mt-24">
                <Card className="bg-card border-border">
                    <CardContent className="py-12">
                        <div className="text-center text-muted-foreground">
                            Không tìm thấy shop banner
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return <ShopBannerDetailView bannerDetail={bannerDetail.data} onBack={onBack} onAddRandom={onAddRandom} />;
}

function ShopBannerDetailView({
    bannerDetail,
    onBack,
    onAddRandom
}: {
    bannerDetail: any;
    onBack: () => void;
    onAddRandom: () => void;
}) {
    const { t } = useTranslation();

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

    return (
        <div className="p-8 mt-24">
            <Card className="bg-card border-border">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Button variant="ghost" size="icon" onClick={onBack}>
                                <ArrowLeft className="h-4 w-4" />
                            </Button>
                            <div>
                                <CardTitle className="text-foreground">{bannerDetail.nameTranslation}</CardTitle>
                                <div className="flex items-center gap-2 mt-2">
                                    {getStatusBadge(bannerDetail.status)}
                                </div>
                            </div>
                        </div>
                        <Button
                            className="bg-primary text-primary-foreground hover:bg-primary/90"
                            onClick={onAddRandom}
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
                                <p className="text-foreground">{formatDate(bannerDetail.startDate)}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground mb-1">{t('configShop.endDate')}</p>
                                <p className="text-foreground">{formatDate(bannerDetail.endDate)}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground mb-1">{t('configShop.minQuantity')}</p>
                                <p className="text-foreground">{bannerDetail.min}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground mb-1">{t('configShop.maxQuantity')}</p>
                                <p className="text-foreground">{bannerDetail.max}</p>
                            </div>
                        </div>

                        {/* Shop Items */}
                        <div>
                            <h3 className="text-lg font-semibold text-foreground mb-4">
                                {t('configShop.pokemonInShop')} ({bannerDetail.shopItems?.length || 0})
                            </h3>
                            {bannerDetail.shopItems && bannerDetail.shopItems.length > 0 ? (
                                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                    {bannerDetail.shopItems.map((item: any) => (
                                        <Card key={item.id} className="bg-muted/30 border-border">
                                            <CardHeader>
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <CardTitle className="text-sm">Item #{item.id}</CardTitle>
                                                        <p className="text-xs text-muted-foreground mt-1">
                                                            Pokemon ID: {item.pokemonId}
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
        </div>
    );
}

