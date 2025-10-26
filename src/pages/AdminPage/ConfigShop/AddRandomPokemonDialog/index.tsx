import { useState, useEffect } from "react";
import { Button } from '@ui/Button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@ui/Dialog';
import { Input } from '@ui/Input';
import { Badge } from "@ui/Badge";
import { useGetRandomPokemon, useCreateShopItems, useShopBannerById } from '@hooks/useShop';
import { IRandomPokemonResponse } from '@models/shop/response';
import { cn } from '@utils/CN';
import { Loader2, Sparkles } from "lucide-react";
import { useTranslation } from 'react-i18next';

interface AddRandomPokemonDialogProps {
    isOpen: boolean;
    onClose: () => void;
    bannerId: number;
}

const AddRandomPokemonDialog = ({ isOpen, onClose, bannerId }: AddRandomPokemonDialogProps) => {
    const { t } = useTranslation();
    const [amount, setAmount] = useState(8);
    const [randomPokemon, setRandomPokemon] = useState<IRandomPokemonResponse[]>([]);
    const [isLoadingRandom, setIsLoadingRandom] = useState(false);

    const { data: bannerDetail } = useShopBannerById(bannerId);
    const getRandomPokemonMutation = useGetRandomPokemon();
    const createShopItemsMutation = useCreateShopItems();

    useEffect(() => {
        if (isOpen && bannerDetail?.data) {
            setAmount(bannerDetail.data.max);
            setRandomPokemon([]);
        }
    }, [isOpen, bannerDetail]);

    const handleGetRandom = async () => {
        setIsLoadingRandom(true);
        try {
            const response = await getRandomPokemonMutation.mutateAsync({
                shopBannerId: bannerId,
                amount,
            });
            setRandomPokemon(response.data);
        } catch (error) {
            console.error('Error getting random Pokemon:', error);
        } finally {
            setIsLoadingRandom(false);
        }
    };

    const handleSubmit = async () => {
        if (randomPokemon.length === 0) {
            alert(t('configShop.getRandomFirstError'));
            return;
        }

        const items = randomPokemon.map((item) => ({
            shopBannerId: item.shopBannerId,
            pokemonId: item.pokemonId,
            price: item.price,
            purchaseLimit: item.purchaseLimit,
            isActive: item.isActive,
        }));

        try {
            await createShopItemsMutation.mutateAsync({ items });
            onClose();
        } catch (error) {
            console.error('Error creating shop items:', error);
        }
    };

    const getRarityColor = (rarity: string) => {
        const colorMap: Record<string, string> = {
            COMMON: "bg-gray-500",
            UNCOMMON: "bg-green-500",
            RARE: "bg-blue-500",
            EPIC: "bg-purple-500",
            LEGENDARY: "bg-yellow-500",
        };
        return colorMap[rarity] || "bg-gray-500";
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
            <DialogContent className="bg-white border-border max-w-4xl sm:max-w-5xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-foreground">
                        {t('configShop.addRandomPokemonTitle')}
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    {/* Amount input */}
                    <div className="flex items-center gap-4">
                        <div className="flex-1">
                            <label className="text-sm font-medium text-foreground mb-2 block">
                                {t('configShop.randomPokemonAmount')}
                            </label>
                            <Input
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(Number(e.target.value))}
                                className="bg-background border-input"
                                min={1}
                                max={bannerDetail?.data?.max || 8}
                            />
                        </div>
                        <Button
                            type="button"
                            onClick={handleGetRandom}
                            disabled={isLoadingRandom}
                            className="mt-6 bg-primary text-primary-foreground hover:bg-primary/90"
                        >
                            {isLoadingRandom ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    {t('configShop.loading')}
                                </>
                            ) : (
                                <>
                                    <Sparkles className="h-4 w-4 mr-2" />
                                    {t('configShop.randomPokemonButton')}
                                </>
                            )}
                        </Button>
                    </div>

                    {/* Random Pokemon List */}
                    {randomPokemon.length > 0 && (
                        <div>
                            <h3 className="text-sm font-medium text-foreground mb-3">
                                {t('configShop.randomPokemonList')} ({randomPokemon.length})
                            </h3>
                            <div className="grid gap-3 md:grid-cols-2 max-h-[400px] overflow-y-auto p-2">
                                {randomPokemon.map((item, index) => (
                                    <div
                                        key={index}
                                        className={cn(
                                            "border rounded-lg p-4 bg-muted/30 border-border",
                                            "hover:border-primary/50 transition-colors"
                                        )}
                                    >
                                        <div className="flex items-start justify-between mb-3">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <img
                                                        src={item.pokemon.imageUrl}
                                                        alt={item.pokemon.nameTranslations.vi}
                                                        className="w-16 h-16 rounded-lg bg-gray-200 object-contain"
                                                    />
                                                    <div>
                                                        <p className="font-semibold text-foreground">
                                                            {item.pokemon.nameTranslations.vi}
                                                        </p>
                                                        <p className="text-sm text-muted-foreground">
                                                            {item.pokemon.nameJp}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="space-y-1">
                                                    <div className="flex items-center justify-between text-sm">
                                                        <span className="text-muted-foreground">{t('configShop.price')}:</span>
                                                        <span className="font-medium text-foreground">
                                                            {item.price.toLocaleString()} đ
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center justify-between text-sm">
                                                        <span className="text-muted-foreground">{t('configShop.purchaseLimit')}:</span>
                                                        <span className="font-medium text-foreground">
                                                            {item.purchaseLimit}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border">
                                            <Badge className={getRarityColor(item.pokemon.rarity) + " text-white"}>
                                                {item.pokemon.rarity}
                                            </Badge>
                                            <Badge variant={item.isActive ? "default" : "secondary"}>
                                                {item.isActive ? t('common.active') : t('common.inactive')}
                                            </Badge>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {randomPokemon.length === 0 && !isLoadingRandom && (
                        <div className="text-center text-muted-foreground py-12">
                            {t('configShop.getRandomFirst')}
                        </div>
                    )}
                </div>

                <DialogFooter className="mt-6 pt-4 border-t border-border">
                    <Button type="button" variant="outline" onClick={onClose}>
                        {t('common.cancel')}
                    </Button>
                    <Button
                        type="button"
                        onClick={handleSubmit}
                        disabled={createShopItemsMutation.isPending || randomPokemon.length === 0}
                        className="bg-primary text-primary-foreground hover:bg-primary/90"
                    >
                        {createShopItemsMutation.isPending ? t('configShop.adding') : t('configShop.addToShop')}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default AddRandomPokemonDialog;

