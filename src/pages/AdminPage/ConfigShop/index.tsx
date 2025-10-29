import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@ui/Card";
import { Button } from "@ui/Button";
import { Badge } from "@ui/Badge";
import { Skeleton } from "@ui/Skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@ui/Select";
import HeaderAdmin from "@organisms/Header/Admin";
import PaginationControls from "@ui/PaginationControls";
import { Plus, ShoppingBag, Calendar, X, Sparkles } from "lucide-react";
import { useShopBannerList } from "@hooks/useShop";
import { IShopBannerSchema } from "@models/shop/entity";
import { useTranslation } from "react-i18next";
import CustomDatePicker from "@ui/DatePicker";
import { SHOP } from "@constants/shop";
import { ROUTES } from "@constants/route";
import { useNavigate } from "react-router-dom";
import CreateShopBannerDialog from "./components/CreateShopBannerDialog";
import UpdateRarityPriceDialog from "./components/UpdateRarityPriceDialog";

export default function ConfigShop() {
    /**
     * Define Variables
     */
    const { t } = useTranslation();
    const navigate = useNavigate();
    //------------------------End------------------------//


    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState<boolean>(false);
    const [isUpdateRarityPriceDialogOpen, setIsUpdateRarityPriceDialogOpen] = useState<boolean>(false);

    /***
     * Handle Shop Banner List
     */
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [itemsPerPage, setItemsPerPage] = useState<number>(15);

    // Format dates for API (YYYY-MM-DD format)
    const formatDateForAPI = (date: Date | null) => {
        if (!date) return undefined;
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };
    const [filterStatus, setFilterStatus] = useState<string>("all")
    const [filterStartDate, setFilterStartDate] = useState<Date | null>(null);
    const [filterEndDate, setFilterEndDate] = useState<Date | null>(null);
    const { data: bannersData, isLoading: isBannersLoading } = useShopBannerList({
        page: currentPage,
        limit: itemsPerPage,
        startDate: formatDateForAPI(filterStartDate),
        endDate: formatDateForAPI(filterEndDate),
        status: filterStatus !== "all" ? [filterStatus] : undefined,
    });
    //------------------------End------------------------//


    /**
     * Handle Filters
     */
    const handleClearFilters = () => {
        setFilterStartDate(null);
        setFilterEndDate(null);
        setFilterStatus("all");
        setCurrentPage(1);
    };

    const hasActiveFilters = filterStartDate || filterEndDate || filterStatus !== "all";
    //------------------------End------------------------//


    const handleViewBanner = (id: number) => {
        navigate(`${ROUTES.ADMIN.CONFIG_SHOP}/${id}`);
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

    return (
        <>
            <HeaderAdmin title={t('configShop.title')} description={t('configShop.description')} />

            <div className="p-8 mt-24">
                <Card className="bg-card border-border">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-foreground">{t('configShop.bannerList')}</CardTitle>
                            <div className="flex items-center gap-2">
                                <Button
                                    className="bg-primary text-primary-foreground hover:bg-primary/90"
                                    onClick={() => setIsCreateDialogOpen(true)}
                                >
                                    <Plus className="h-4 w-4 mr-2" />
                                    {t('configShop.createBanner')}
                                </Button>
                                <Button
                                    className="group relative overflow-hidden bg-gradient-to-r from-[hsl(var(--primary-hsl))] via-[hsl(var(--primary-hsl)/0.88)] to-[hsl(var(--primary-hsl)/0.72)] text-primary-foreground transition-all duration-300 hover:opacity-95 hover:scale-[1.01] active:scale-95 shadow-md"
                                    onClick={() => setIsUpdateRarityPriceDialogOpen(true)}
                                >
                                    <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-white/20 via-transparent to-white/20 transition-transform duration-700 group-hover:translate-x-full" />
                                    <span className="relative z-10 inline-flex items-center">
                                        <Sparkles className="h-4 w-4 mr-2 animate-pulse" />
                                        {t('configShop.updateRarityPrice')}
                                    </span>
                                </Button>
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent>
                        {/* Filters */}
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-6">
                            <div>
                                <label className="text-sm font-medium text-foreground mb-2 block">
                                    {t('configShop.filterStartDate')}
                                </label>
                                <CustomDatePicker
                                    value={filterStartDate}
                                    onChange={setFilterStartDate}
                                    placeholder={t('configShop.selectStartDate')}
                                    dayPickerProps={{
                                        disabled: false
                                    }}
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-foreground mb-2 block">
                                    {t('configShop.filterEndDate')}
                                </label>
                                <CustomDatePicker
                                    value={filterEndDate}
                                    onChange={setFilterEndDate}
                                    placeholder={t('configShop.selectEndDate')}
                                    dayPickerProps={{
                                        disabled: false
                                    }}
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-foreground mb-2 block">
                                    {t('configShop.filterStatus')}
                                </label>
                                <Select value={filterStatus} onValueChange={setFilterStatus}>
                                    <SelectTrigger className="bg-background border-input">
                                        <SelectValue placeholder={t('configShop.selectStatus')} />
                                    </SelectTrigger>
                                    <SelectContent className="bg-card border-border">
                                        <SelectItem value="all">{t('common.all')}</SelectItem>
                                        <SelectItem value={SHOP.ShopBannerStatus.PREVIEW}>{t('configShop.preview')}</SelectItem>
                                        <SelectItem value={SHOP.ShopBannerStatus.ACTIVE}>{t('common.active')}</SelectItem>
                                        <SelectItem value={SHOP.ShopBannerStatus.INACTIVE}>{t('common.inactive')}</SelectItem>
                                        <SelectItem value={SHOP.ShopBannerStatus.EXPIRED}>{t('configShop.expired')}</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        {hasActiveFilters && (
                            <div className="mb-4 flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleClearFilters}
                                    className="bg-muted hover:bg-muted/80"
                                >
                                    <X className="h-4 w-4 mr-1" />
                                    {t('configShop.clearFilters')}
                                </Button>
                            </div>
                        )}
                        {isBannersLoading ? (
                            <BannersSkeleton />
                        ) : bannersData?.data?.results?.length ? (
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                {bannersData.data.results.map((banner: IShopBannerSchema) => (
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
            <UpdateRarityPriceDialog
                isOpen={isUpdateRarityPriceDialogOpen}
                onClose={() => setIsUpdateRarityPriceDialogOpen(false)}
            />
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
