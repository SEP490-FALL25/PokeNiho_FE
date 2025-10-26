import { Button } from '@ui/Button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@ui/Command';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@ui/Dialog';
import { Input } from '@ui/Input';
import { Popover, PopoverContent, PopoverTrigger } from '@ui/Popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@ui/Select';
import { Switch } from '@ui/Switch';
import MultilingualInput from '@ui/MultilingualInput';
import { Check, ChevronsUpDown } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Controller, useForm, useFieldArray } from 'react-hook-form';
import { cn } from '@utils/CN';
import { useTranslation } from 'react-i18next';
import { useCreateDailyRequest } from '@hooks/useDailyRequest';
import { ICreateDailyRequestRequest } from '@models/dailyRequest/request';
import { toast } from 'react-toastify';
import { DAILY_REQUEST } from '@constants/dailyRequest';
import { useGetRewardList } from '@hooks/useReward';
import { IRewardEntityType } from '@models/reward/entity';


interface CreateDailyQuestDialogProps {
    isOpen: boolean;
    onClose: () => void;
    mockRewards: Array<{ id: number; name: string }>;
}

const CreateDailyQuestDialog = ({
    isOpen,
    onClose,
    mockRewards
}: CreateDailyQuestDialogProps) => {
    const { t } = useTranslation();
    const [openConditionSelect, setOpenConditionSelect] = useState<boolean>(false);

    const createDailyRequestMutation = useCreateDailyRequest();

    const { data: rewardList } = useGetRewardList();
    const rewards = rewardList?.results || [];


    const {
        control,
        handleSubmit,
        register,
        formState: { errors },
        watch,
        reset,
    } = useForm<ICreateDailyRequestRequest>({
        defaultValues: {
            dailyRequestType: 'DAILY_LOGIN',
            conditionValue: 1,
            rewardId: mockRewards.length > 0 ? mockRewards[0].id : 1,
            isActive: true,
            isStreak: false,
            nameTranslations: [
                { key: "en" as const, value: "" },
                { key: "ja" as const, value: "" },
                { key: "vi" as const, value: "" },
            ],
            descriptionTranslations: [
                { key: "en" as const, value: "" },
                { key: "ja" as const, value: "" },
                { key: "vi" as const, value: "" },
            ],
        },
    });

    const { fields: nameFields } = useFieldArray({ control, name: "nameTranslations" });
    const { fields: descriptionFields } = useFieldArray({ control, name: "descriptionTranslations" });

    const isActive = watch("isActive");

    // Reset form when editingQuest changes
    useEffect(() => {

        reset({
            dailyRequestType: 'DAILY_LOGIN',
            conditionValue: 1,
            rewardId: mockRewards.length > 0 ? mockRewards[0].id : 1,
            isActive: true,
            isStreak: false,
            nameTranslations: [
                { key: "en" as const, value: "" },
                { key: "ja" as const, value: "" },
                { key: "vi" as const, value: "" },
            ],
            descriptionTranslations: [
                { key: "en" as const, value: "" },
                { key: "ja" as const, value: "" },
                { key: "vi" as const, value: "" },
            ],
        });
    }, [mockRewards, reset]);


    /**
     * Handle form submit
     * @param data ICreateDailyRequestRequest
     */
    const handleFormSubmit = async (data: ICreateDailyRequestRequest) => {
        try {
            const response = await createDailyRequestMutation.mutateAsync(data);
            toast.success(response.data?.message || t('dailyQuest.createSuccess'));
            onClose();
        } catch (error: any) {
            console.error('Error creating daily quest:', error);
            toast.error(error.response?.data?.message || t('dailyQuest.createError'));
        }
    };
    //------------------------End------------------------//

    return (
        <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
            <DialogContent className="bg-white border-border max-w-2xl sm:max-w-3xl">
                <DialogHeader>
                    <DialogTitle className="text-foreground">
                        {t('dailyQuest.addTitle')}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4 py-4 max-h-[65vh] overflow-y-auto px-1 sm:px-6">
                    {/* Loại điều kiện & Giá trị */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Combobox Loại điều kiện */}
                        <div className="space-y-1.5">
                            <label htmlFor="dailyRequestType" className={cn("text-sm font-medium text-foreground", errors.dailyRequestType && "text-destructive")}>{t('dailyQuest.conditionTypeLabel')}</label>
                            <Controller
                                name="dailyRequestType"
                                control={control}
                                rules={{ required: t('dailyQuest.conditionRequired') }}
                                render={({ field }) => (
                                    <Popover open={openConditionSelect} onOpenChange={setOpenConditionSelect}>
                                        <PopoverTrigger asChild>
                                            <Button
                                                id="dailyRequestType" // ID cho label
                                                variant="outline"
                                                role="combobox"
                                                aria-expanded={openConditionSelect}
                                                className={cn(
                                                    "w-full justify-between bg-background border-input text-foreground hover:bg-accent hover:text-accent-foreground",
                                                    errors.dailyRequestType && "border-destructive focus-visible:ring-destructive"
                                                )}
                                            >
                                                {field.value
                                                    ? DAILY_REQUEST.DAILY_REQUEST_TYPE[field.value as keyof typeof DAILY_REQUEST.DAILY_REQUEST_TYPE]?.label ?? t('dailyQuest.selectCondition')
                                                    : t('dailyQuest.selectCondition')}
                                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                                            <Command>
                                                <CommandInput placeholder={t('dailyQuest.searchCondition')} />
                                                <CommandList>
                                                    <CommandEmpty>{t('common.notFound')}</CommandEmpty>
                                                    <CommandGroup>
                                                        {Object.values(DAILY_REQUEST.DAILY_REQUEST_TYPE).map((conditionType) => (
                                                            <CommandItem
                                                                key={conditionType.value}
                                                                value={`${conditionType.label} ${conditionType.value}`}
                                                                onSelect={() => {
                                                                    field.onChange(conditionType.value);
                                                                    setOpenConditionSelect(false);
                                                                }}
                                                            >
                                                                <Check
                                                                    className={cn(
                                                                        "mr-2 h-4 w-4",
                                                                        field.value === conditionType.value ? "opacity-100" : "opacity-0"
                                                                    )}
                                                                />
                                                                {conditionType.label} ({conditionType.value})
                                                            </CommandItem>
                                                        ))}
                                                    </CommandGroup>
                                                </CommandList>
                                            </Command>
                                        </PopoverContent>
                                    </Popover>
                                )}
                            />
                            {errors.dailyRequestType && <p className="text-xs text-destructive mt-1">{errors.dailyRequestType.message}</p>}
                        </div>
                        {/* Giá trị điều kiện */}
                        <div className="space-y-1.5">
                            <label htmlFor="conditionValue" className={cn("text-sm font-medium text-foreground", errors.conditionValue && "text-destructive")}>{t('dailyQuest.conditionValueLabel')}</label>
                            <Input
                                id="conditionValue"
                                type="number"
                                placeholder={t('dailyQuest.conditionValuePlaceholder')}
                                className={cn("bg-background border-input", errors.conditionValue && "border-destructive focus-visible:ring-destructive")}
                                {...register("conditionValue", {
                                    required: t('dailyQuest.valueRequired'),
                                    valueAsNumber: true,
                                    min: { value: 1, message: t('dailyQuest.valueMin') },
                                })}
                            />
                            {errors.conditionValue && <p className="text-xs text-destructive mt-1">{errors.conditionValue.message}</p>}
                        </div>
                    </div>

                    {/* Phần thưởng */}
                    <div className="space-y-1.5">
                        <label htmlFor="rewardId" className={cn("text-sm font-medium text-foreground", errors.rewardId && "text-destructive")}>{t('dailyQuest.rewardLabel')}</label>
                        <Controller
                            name="rewardId"
                            control={control}
                            rules={{ required: t('dailyQuest.rewardRequired') }}
                            render={({ field }) => (
                                <Select onValueChange={(value) => field.onChange(Number(value))} value={field.value?.toString()}>
                                    <SelectTrigger id="rewardId" className={cn("bg-background border-input", errors.rewardId && "border-error focus-visible:ring-error")}>
                                        <SelectValue placeholder={t('dailyQuest.selectReward')} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {rewards.map((reward: IRewardEntityType) => (
                                            <SelectItem key={reward.id} value={reward.id.toString()}>
                                                {reward.nameTranslation}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        {errors.rewardId && <p className="text-xs text-destructive mt-1">{errors.rewardId.message}</p>}
                    </div>

                    {/* Tên nhiệm vụ */}
                    <MultilingualInput
                        label={t('dailyQuest.nameLabel')}
                        fields={nameFields}
                        register={register}
                        errors={errors.nameTranslations as Record<string, string>}
                        placeholderKey="dailyQuest.taskNamePlaceholder"
                        requiredKey="dailyQuest.nameRequiredVi"
                        fieldName="name"
                    />

                    {/* Mô tả nhiệm vụ */}
                    <MultilingualInput
                        label={t('dailyQuest.descriptionLabel')}
                        fields={descriptionFields}
                        register={register}
                        errors={errors.descriptionTranslations}
                        placeholderKey="dailyQuest.descriptionPlaceholder"
                        requiredKey="dailyQuest.descriptionRequiredVi"
                        isTextarea={true}
                        fieldName="description"
                    />

                    {/* Kích hoạt & Streak */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center space-x-2">
                            <Controller
                                name="isActive"
                                control={control}
                                render={({ field }) => (
                                    <Switch id="form-isActive" checked={field.value} onCheckedChange={field.onChange} />
                                )}
                            />
                            <label htmlFor="form-isActive" className="text-sm font-medium text-foreground cursor-pointer">
                                {t('dailyQuest.isActive')} ({isActive ? t('dailyQuest.isActiveOn') : t('dailyQuest.isActiveOff')})
                            </label>
                        </div>

                        <div className="flex items-center space-x-2">
                            <Controller
                                name="isStreak"
                                control={control}
                                render={({ field }) => (
                                    <Switch id="form-isStreak" checked={field.value} onCheckedChange={field.onChange} />
                                )}
                            />
                            <label htmlFor="form-isStreak" className="text-sm font-medium text-foreground cursor-pointer">
                                {t('dailyQuest.isStreak')}
                            </label>
                        </div>
                    </div>

                    {/* Nút Submit/Cancel */}
                    <DialogFooter className="mt-6 pt-4 border-t border-border">
                        <Button type="button" variant="outline" onClick={onClose}>{t('common.cancel')}</Button>
                        <Button type="submit" disabled={createDailyRequestMutation.isPending} className="bg-primary text-primary-foreground hover:bg-primary/90">
                            {createDailyRequestMutation.isPending ? t('common.loading') : t('common.add')}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default CreateDailyQuestDialog