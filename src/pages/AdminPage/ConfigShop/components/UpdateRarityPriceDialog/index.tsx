import { useState, useEffect } from "react";
import { Button } from '@ui/Button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@ui/Dialog';
import { Input } from '@ui/Input';
import { Card, CardContent } from '@ui/Card';
import { Checkbox } from '@ui/Checkbox';
import { Separator } from '@ui/Separator';
import { Skeleton } from '@ui/Skeleton';
import { useShopRarityPrice, useUpdateShopRarityPrice } from '@hooks/useShopRarityPrice';
import { useTranslation } from 'react-i18next';
import { IShopRarityPriceEntityType } from '@models/shopRarityPrice/entity';
import { RarityBadge } from '@atoms/BadgeRarity';

interface UpdateRarityPriceDialogProps {
    isOpen: boolean;
    onClose: () => void;
}

const UpdateRarityPriceDialog = ({ isOpen, onClose }: UpdateRarityPriceDialogProps) => {
    const { t } = useTranslation();
    const { data: rarityPrices, isLoading } = useShopRarityPrice();
    const updateMutation = useUpdateShopRarityPrice();

    const [prices, setPrices] = useState<Record<string, number>>({});
    const [isChangeAllShopPreview, setIsChangeAllShopPreview] = useState<boolean>(false);
    const [hasChanges, setHasChanges] = useState<boolean>(false);

    // Initialize prices from data
    useEffect(() => {
        if (rarityPrices?.results) {
            const initialPrices: Record<string, number> = {};
            rarityPrices.results.forEach((item: IShopRarityPriceEntityType) => {
                initialPrices[item.rarity] = item.price;
            });
            setPrices(initialPrices);
            setHasChanges(false);
        }
    }, [rarityPrices]);

    // Reset form when dialog opens/closes
    useEffect(() => {
        if (isOpen) {
            setIsChangeAllShopPreview(false);
        }
    }, [isOpen]);

    // Track changes
    const handlePriceChange = (rarity: string, value: string) => {
        const numValue = parseInt(value) || 0;
        setPrices(prev => ({ ...prev, [rarity]: numValue }));
        setHasChanges(true);
    };

    const handleSubmit = async () => {
        if (!rarityPrices?.results) return;

        try {
            // Update each rarity price
            const updatePromises = rarityPrices.results.map((item: IShopRarityPriceEntityType) => {
                const newPrice = prices[item.rarity];
                if (newPrice !== undefined && newPrice !== item.price) {
                    return updateMutation.mutateAsync({
                        id: item.id,
                        data: {
                            rarity: item.rarity as "COMMON" | "UNCOMMON" | "RARE" | "EPIC" | "LEGENDARY",
                            price: newPrice,
                            isChangeAllShopPreview,
                        },
                    });
                }
                return Promise.resolve();
            });

            await Promise.all(updatePromises);
            onClose();
        } catch (error) {
            console.error('Error updating rarity prices:', error);
        }
    };


    return (
        <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
            <DialogContent className="bg-white border-border max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-foreground">
                        {t('configShop.updateRarityPriceTitle')}
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    <div>
                        <p className="text-sm text-muted-foreground">
                            {t('configShop.updateRarityPriceDescription')}
                        </p>
                    </div>

                    {isLoading ? (
                        <div className="space-y-4">
                            {Array.from({ length: 5 }).map((_, index) => (
                                <Card key={`skeleton-${index}`} className="bg-muted/50 border-border">
                                    <CardContent className="p-4">
                                        <div className="flex items-center justify-between">
                                            <div className="space-y-2 flex-1">
                                                <Skeleton className="h-5 w-32" />
                                                <Skeleton className="h-4 w-24" />
                                            </div>
                                            <Skeleton className="h-10 w-40" />
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ) : rarityPrices?.results && rarityPrices.results.length > 0 ? (
                        <div className="space-y-4">
                            {rarityPrices.results.map((item: IShopRarityPriceEntityType) => (
                                <Card
                                    key={item.id}
                                    className="bg-muted/30 border-border hover:border-primary/50 transition-colors"
                                >
                                    <CardContent className="p-4">
                                        <div className="flex items-center justify-between gap-4">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <RarityBadge level={item.rarity as any} />
                                                </div>
                                                <p className="text-sm text-muted-foreground">
                                                    {t('configShop.currentPrice')}: {item.price.toLocaleString()} points
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="space-y-1">
                                                    <label className="text-sm font-medium text-foreground">
                                                        {t('configShop.newPrice')}
                                                    </label>
                                                    <Input
                                                        type="number"
                                                        min={0}
                                                        value={prices[item.rarity] || ''}
                                                        onChange={(e) => handlePriceChange(item.rarity, e.target.value)}
                                                        placeholder={item.price.toString()}
                                                        className="w-32"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center text-muted-foreground py-12">
                            {t('configShop.noRarityPricesFound')}
                        </div>
                    )}

                    <Separator className="my-4" />

                    <Card className="bg-muted/30 p-4">
                        <div className="flex items-start space-x-3">
                            <Checkbox
                                id="changeAllShopPreview"
                                checked={isChangeAllShopPreview}
                                onCheckedChange={(checked) => setIsChangeAllShopPreview(checked as boolean)}
                            />
                            <div className="flex-1 space-y-1">
                                <label
                                    htmlFor="changeAllShopPreview"
                                    className="text-sm font-medium text-foreground cursor-pointer"
                                >
                                    {t('configShop.changeAllShopPreview')}
                                </label>
                                <p className="text-xs text-muted-foreground">
                                    {t('configShop.changeAllShopPreviewDescription')}
                                </p>
                            </div>
                        </div>
                    </Card>

                    <DialogFooter className="mt-6 pt-4 border-t border-border">
                        <Button type="button" variant="outline" onClick={onClose}>
                            {t('common.cancel')}
                        </Button>
                        <Button
                            type="button"
                            onClick={handleSubmit}
                            disabled={updateMutation.isPending || !hasChanges}
                            className="bg-primary text-primary-foreground hover:bg-primary/90"
                        >
                            {updateMutation.isPending ? t('common.loading') : t('common.update')}
                        </Button>
                    </DialogFooter>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default UpdateRarityPriceDialog;
