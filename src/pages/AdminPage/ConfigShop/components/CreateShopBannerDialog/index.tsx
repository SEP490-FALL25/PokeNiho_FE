import { useEffect, useState } from "react";
import { Button } from '@ui/Button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@ui/Dialog';
import { Input } from '@ui/Input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@ui/Select';
import MultilingualInput from '@ui/MultilingualInput';
import CustomDatePicker from '@ui/DatePicker';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { useCreateShopBanner } from '@hooks/useShop';
import { createCreateShopBannerSchema, ICreateShopBannerRequest } from '@models/shop/request';
import { useTranslation } from 'react-i18next';
import { zodResolver } from "@hookform/resolvers/zod";
import { SHOP } from '@constants/shop';

interface CreateShopBannerDialogProps {
    isOpen: boolean;
    onClose: () => void;
}

const CreateShopBannerDialog = ({ isOpen, onClose }: CreateShopBannerDialogProps) => {
    const { t } = useTranslation();
    const [selectedStartDate, setSelectedStartDate] = useState<Date | null>(null);
    const [selectedEndDate, setSelectedEndDate] = useState<Date | null>(null);

    /**
     * Handle Create Shop Banner
     * @returns useMutation to create shop banner
     */
    const createShopBannerMutation = useCreateShopBanner();
    const {
        control,
        handleSubmit,
        register,
        formState: { errors },
        reset,
        setValue,
    } = useForm<ICreateShopBannerRequest>({
        resolver: zodResolver(createCreateShopBannerSchema(t)),
        defaultValues: {
            startDate: "",
            endDate: "",
            min: 4,
            max: 8,
            status: SHOP.ShopBannerStatus.PREVIEW,
            nameTranslations: [
                { key: "en" as const, value: "" },
                { key: "ja" as const, value: "" },
                { key: "vi" as const, value: "" },
            ],
        },
    });

    /**
     * Field arrays
     */
    const { fields: nameFields } = useFieldArray({ control, name: "nameTranslations" });
    //------------------------End------------------------//

    /**
     * Format Date to YYYY-MM-DD for API
     */
    const formatDateForForm = (date: Date | null) => {
        if (!date) return "";
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    /**
     * Reset form when dialog opens/closes
     */
    useEffect(() => {
        if (isOpen) {
            setSelectedStartDate(null);
            setSelectedEndDate(null);
            reset({
                startDate: "",
                endDate: "",
                min: 4,
                max: 8,
                status: SHOP.ShopBannerStatus.PREVIEW,
                nameTranslations: [
                    { key: "en" as const, value: "" },
                    { key: "ja" as const, value: "" },
                    { key: "vi" as const, value: "" },
                ],
            });
        }
    }, [isOpen, reset]);

    const handleFormSubmit = async (data: ICreateShopBannerRequest) => {
        try {
            await createShopBannerMutation.mutateAsync(data);
            onClose();
        } catch (error) {
            console.error('Error creating shop banner:', error);
        }
    };
    //-------------------End-------------------//

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
                            <div>
                                <CustomDatePicker
                                    value={selectedStartDate}
                                    onChange={(date) => {
                                        setSelectedStartDate(date);
                                        if (date) {
                                            const formattedDate = formatDateForForm(date);
                                            setValue("startDate", formattedDate);

                                            // Auto-set end date to 7 days later
                                            const endDate = new Date(date);
                                            endDate.setDate(endDate.getDate() + 7);
                                            setSelectedEndDate(endDate);
                                            setValue("endDate", formatDateForForm(endDate));
                                        }
                                    }}
                                    placeholder={t('configShop.startDate')}
                                    dayPickerProps={{
                                        disabled: { before: new Date() }
                                    }}
                                />
                            </div>
                            <input
                                type="hidden"
                                {...register("startDate")}
                            />
                            {errors.startDate && <p className="text-xs mt-1" style={{ color: 'var(--color-error)' }}>{errors.startDate.message as string}</p>}
                        </div>
                        <div className="space-y-1.5">
                            <label htmlFor="endDate" className="text-sm font-medium text-foreground">
                                {t('configShop.endDate')}
                            </label>
                            <div>
                                <CustomDatePicker
                                    value={selectedEndDate}
                                    onChange={(date) => {
                                        setSelectedEndDate(date);
                                        if (date) {
                                            setValue("endDate", formatDateForForm(date));
                                        }
                                    }}
                                    placeholder={t('configShop.endDate')}
                                    dayPickerProps={{
                                        disabled: selectedStartDate ? { before: selectedStartDate } : { before: new Date() }
                                    }}
                                />
                            </div>
                            <input
                                type="hidden"
                                {...register("endDate")}
                            />
                            {errors.endDate && <p className="text-xs mt-1" style={{ color: 'var(--color-error)' }}>{errors.endDate.message as string}</p>}
                        </div>
                    </div>

                    {/* Min Max */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label htmlFor="min" className="text-sm font-medium text-foreground">
                                {t('configShop.minQuantity')}
                            </label>
                            <Controller
                                name="min"
                                control={control}
                                render={({ field }) => (
                                    <>
                                        <Input
                                            id="min"
                                            type="number"
                                            value={field.value}
                                            onChange={(e) => field.onChange(Number(e.target.value))}
                                            variant={errors.min ? "destructive" : "default"}
                                            min={4}
                                            max={7}
                                        />
                                        {errors.min && <p className="text-xs mt-1" style={{ color: 'var(--color-error)' }}>{errors.min.message as string}</p>}
                                    </>
                                )}
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label htmlFor="max" className="text-sm font-medium text-foreground">
                                {t('configShop.maxQuantity')}
                            </label>
                            <Controller
                                name="max"
                                control={control}
                                render={({ field }) => (
                                    <>
                                        <Input
                                            id="max"
                                            type="number"
                                            value={field.value}
                                            onChange={(e) => field.onChange(Number(e.target.value))}
                                            variant={errors.max ? "destructive" : "default"}
                                            min={5}
                                            max={8}
                                        />
                                        {errors.max && <p className="text-xs mt-1" style={{ color: 'var(--color-error)' }}>{errors.max.message as string}</p>}
                                    </>
                                )}
                            />
                        </div>
                    </div>

                    {/* Status */}
                    <div className="space-y-1.5">
                        <label htmlFor="status" className="text-sm font-medium text-foreground">
                            {t('configShop.status')}
                        </label>
                        <Controller
                            name="status"
                            control={control}
                            render={({ field }) => (
                                <Select value={field.value} onValueChange={field.onChange}>
                                    <SelectTrigger className="bg-background border-input">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="bg-card border-border">
                                        <SelectItem value={SHOP.ShopBannerStatus.PREVIEW}>{t('configShop.preview')}</SelectItem>
                                        <SelectItem value={SHOP.ShopBannerStatus.ACTIVE}>{t('common.active')}</SelectItem>
                                        <SelectItem value={SHOP.ShopBannerStatus.INACTIVE}>{t('common.inactive')}</SelectItem>
                                        <SelectItem value={SHOP.ShopBannerStatus.EXPIRED}>{t('configShop.expired')}</SelectItem>
                                    </SelectContent>
                                </Select>
                            )}
                        />
                    </div>

                    {/* Multilingual Input */}
                    <MultilingualInput
                        label={t('configShop.bannerName')}
                        fields={nameFields}
                        register={register}
                        errors={errors.nameTranslations}
                        placeholderKey="dailyQuest.taskNamePlaceholder"
                        requiredKey="configShop.nameRequiredVi"
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

