import { useState, useEffect } from "react";
import { Button } from '@ui/Button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@ui/Dialog';
import { Input } from '@ui/Input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@ui/Select';
import MultilingualInput from '@ui/MultilingualInput';
import { useForm, useFieldArray } from 'react-hook-form';
import { useCreateShopBanner } from '@hooks/useShop';
import { ICreateShopBannerRequest } from '@models/shop/request';
import { useTranslation } from 'react-i18next';

interface CreateShopBannerDialogProps {
    isOpen: boolean;
    onClose: () => void;
}

const CreateShopBannerDialog = ({ isOpen, onClose }: CreateShopBannerDialogProps) => {
    const { t } = useTranslation();
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [min, setMin] = useState(4);
    const [max, setMax] = useState(8);
    const [status, setStatus] = useState<"PREVIEW" | "EXPIRED" | "INACTIVE" | "ACTIVE">("PREVIEW");

    const createShopBannerMutation = useCreateShopBanner();

    const {
        control,
        handleSubmit,
        register,
        formState: { errors },
        reset,
    } = useForm<{ nameTranslations: Array<{ key: "en" | "ja" | "vi"; value: string }> }>({
        defaultValues: {
            nameTranslations: [
                { key: "en" as const, value: "" },
                { key: "ja" as const, value: "" },
                { key: "vi" as const, value: "" },
            ],
        },
    });

    const { fields: nameFields } = useFieldArray({ control, name: "nameTranslations" });

    useEffect(() => {
        if (isOpen) {
            reset({
                nameTranslations: [
                    { key: "en" as const, value: "" },
                    { key: "ja" as const, value: "" },
                    { key: "vi" as const, value: "" },
                ],
            });
            setStartDate("");
            setEndDate("");
            setMin(4);
            setMax(8);
            setStatus("PREVIEW");
        }
    }, [isOpen, reset]);

    const handleFormSubmit = async (data: { nameTranslations: Array<{ key: "en" | "ja" | "vi"; value: string }> }) => {
        if (!startDate || !endDate) {
            alert(t('configShop.selectDates'));
            return;
        }

        const requestData: ICreateShopBannerRequest = {
            startDate: new Date(startDate).toISOString(),
            endDate: new Date(endDate).toISOString(),
            min,
            max,
            status,
            nameTranslations: data.nameTranslations,
        };

        try {
            await createShopBannerMutation.mutateAsync(requestData);
            onClose();
        } catch (error) {
            console.error('Error creating shop banner:', error);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
            <DialogContent className="bg-white border-border max-w-2xl sm:max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-foreground">
                        {t('configShop.createBannerTitle')}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4 py-4">
                    {/* Date Range */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label htmlFor="startDate" className="text-sm font-medium text-foreground">
                                {t('configShop.startDate')}
                            </label>
                            <Input
                                id="startDate"
                                type="datetime-local"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="bg-background border-input"
                                required
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label htmlFor="endDate" className="text-sm font-medium text-foreground">
                                {t('configShop.endDate')}
                            </label>
                            <Input
                                id="endDate"
                                type="datetime-local"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="bg-background border-input"
                                required
                            />
                        </div>
                    </div>

                    {/* Min Max */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label htmlFor="min" className="text-sm font-medium text-foreground">
                                {t('configShop.minQuantity')}
                            </label>
                            <Input
                                id="min"
                                type="number"
                                value={min}
                                onChange={(e) => setMin(Number(e.target.value))}
                                className="bg-background border-input"
                                min={1}
                                required
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label htmlFor="max" className="text-sm font-medium text-foreground">
                                {t('configShop.maxQuantity')}
                            </label>
                            <Input
                                id="max"
                                type="number"
                                value={max}
                                onChange={(e) => setMax(Number(e.target.value))}
                                className="bg-background border-input"
                                min={min}
                                required
                            />
                        </div>
                    </div>

                    {/* Status */}
                    <div className="space-y-1.5">
                        <label htmlFor="status" className="text-sm font-medium text-foreground">
                            {t('configShop.status')}
                        </label>
                        <Select value={status} onValueChange={(value) => setStatus(value as any)}>
                            <SelectTrigger className="bg-background border-input">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-card border-border">
                                <SelectItem value="PREVIEW">{t('configShop.preview')}</SelectItem>
                                <SelectItem value="ACTIVE">{t('common.active')}</SelectItem>
                                <SelectItem value="INACTIVE">{t('common.inactive')}</SelectItem>
                                <SelectItem value="EXPIRED">{t('configShop.expired')}</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Multilingual Input */}
                    <MultilingualInput
                        label={t('configShop.bannerName')}
                        fields={nameFields}
                        register={register}
                        errors={errors.nameTranslations as any}
                        placeholderKey=""
                        requiredKey=""
                        fieldName="name"
                    />

                    <DialogFooter className="mt-6 pt-4 border-t border-border">
                        <Button type="button" variant="outline" onClick={onClose}>
                            {t('common.cancel')}
                        </Button>
                        <Button type="submit" disabled={createShopBannerMutation.isPending} className="bg-primary text-primary-foreground hover:bg-primary/90">
                            {createShopBannerMutation.isPending ? t('configShop.creating') : t('common.create')}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default CreateShopBannerDialog;

