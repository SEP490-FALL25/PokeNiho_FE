import { Button } from '@ui/Button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@ui/Command';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@ui/Dialog';
import { Input } from '@ui/Input';
import { Popover, PopoverContent, PopoverTrigger } from '@ui/Popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@ui/Select';
import { Switch } from '@ui/Switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@ui/Tabs';
import { Textarea } from '@ui/Textarea';
import { Check, ChevronsUpDown } from 'lucide-react';
import React from 'react';
import { Controller, useForm, useFieldArray } from 'react-hook-form';
import { cn } from '@utils/CN';

// --- Định nghĩa kiểu dữ liệu ---
interface TranslationInput {
    key: "en" | "ja" | "vi";
    value: string;
}

interface ConditionType {
    value: string;
    label: string;
    createdAt?: string;
}

interface DailyQuest {
    id: string;
    conditionType: string;
    conditionValue: number;
    rewardId: number;
    rewardName?: string;
    isActive: boolean;
    nameTranslations: TranslationInput[];
    descriptionTranslations: TranslationInput[];
    createdAt?: string;
}

interface CreateDailyQuestDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: DailyQuest) => void;
    editingQuest: DailyQuest | null;
    isLoading: boolean;
    conditionTypes: ConditionType[];
    mockRewards: Array<{ id: number; name: string }>;
}

const CreateDailyQuestDialog: React.FC<CreateDailyQuestDialogProps> = ({
    isOpen,
    onClose,
    onSubmit,
    editingQuest,
    isLoading,
    conditionTypes,
    mockRewards
}) => {
    const [openConditionSelect, setOpenConditionSelect] = React.useState(false);

    const {
        control,
        handleSubmit,
        register,
        formState: { errors },
        watch,
        reset,
    } = useForm<DailyQuest>({
        defaultValues: {
            id: "",
            conditionType: conditionTypes.length > 0 ? conditionTypes[0].value : '',
            conditionValue: 1,
            rewardId: mockRewards.length > 0 ? mockRewards[0].id : 0,
            isActive: true,
            nameTranslations: [
                { key: "en", value: "" },
                { key: "ja", value: "" },
                { key: "vi", value: "" },
            ],
            descriptionTranslations: [
                { key: "en", value: "" },
                { key: "ja", value: "" },
                { key: "vi", value: "" },
            ],
        },
    });

    const { fields: nameFields } = useFieldArray({ control, name: "nameTranslations" });
    const { fields: descriptionFields } = useFieldArray({ control, name: "descriptionTranslations" });

    const isActive = watch("isActive");

    // Reset form when editingQuest changes
    React.useEffect(() => {
        if (editingQuest) {
            const defaultConditionType = conditionTypes.find(c => c.value === editingQuest.conditionType)?.value || (conditionTypes.length > 0 ? conditionTypes[0].value : '');
            const defaultRewardId = mockRewards.find(r => r.id === editingQuest.rewardId)?.id || (mockRewards.length > 0 ? mockRewards[0].id : 0);
            reset({
                ...editingQuest,
                conditionType: defaultConditionType,
                rewardId: defaultRewardId,
                nameTranslations: ["en", "ja", "vi"].map(
                    (lang) => editingQuest.nameTranslations.find((t) => t.key === lang) || { key: lang as "en" | "ja" | "vi", value: "" },
                ),
                descriptionTranslations: ["en", "ja", "vi"].map(
                    (lang) =>
                        editingQuest.descriptionTranslations.find((t) => t.key === lang) || { key: lang as "en" | "ja" | "vi", value: "" },
                ),
            });
        } else {
            reset({
                id: "",
                conditionType: conditionTypes.length > 0 ? conditionTypes[0].value : '',
                conditionValue: 1,
                rewardId: mockRewards.length > 0 ? mockRewards[0].id : 0,
                isActive: true,
                nameTranslations: [
                    { key: "en", value: "" },
                    { key: "ja", value: "" },
                    { key: "vi", value: "" },
                ],
                descriptionTranslations: [
                    { key: "en", value: "" },
                    { key: "ja", value: "" },
                    { key: "vi", value: "" },
                ],
            });
        }
    }, [editingQuest, conditionTypes, mockRewards, reset]);

    return (
        <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
            <DialogContent className="bg-white border-border max-w-2xl sm:max-w-3xl">
                <DialogHeader>
                    <DialogTitle className="text-foreground">
                        {editingQuest ? "Chỉnh sửa Nhiệm vụ hàng ngày" : "Thêm Nhiệm vụ hàng ngày"}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4 max-h-[65vh] overflow-y-auto px-1 sm:px-6">
                    {/* Loại điều kiện & Giá trị */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Combobox Loại điều kiện */}
                        <div className="space-y-1.5">
                            {/* --- THAY ĐỔI: Sử dụng <label> --- */}
                            <label htmlFor="conditionType" className={cn("text-sm font-medium text-foreground", errors.conditionType && "text-destructive")}>Loại điều kiện</label>
                            <Controller
                                name="conditionType"
                                control={control}
                                rules={{ required: "Vui lòng chọn loại điều kiện." }}
                                render={({ field }) => (
                                    <Popover open={openConditionSelect} onOpenChange={setOpenConditionSelect}>
                                        <PopoverTrigger asChild>
                                            <Button
                                                id="conditionType" // ID cho label
                                                variant="outline"
                                                role="combobox"
                                                aria-expanded={openConditionSelect}
                                                className={cn(
                                                    "w-full justify-between bg-background border-input text-foreground hover:bg-accent hover:text-accent-foreground",
                                                    errors.conditionType && "border-destructive focus-visible:ring-destructive"
                                                )}
                                            >
                                                {field.value
                                                    ? conditionTypes.find((ct) => ct.value === field.value)?.label ?? "Chọn..."
                                                    : "Chọn loại điều kiện..."}
                                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                                            <Command>
                                                <CommandInput placeholder="Tìm kiếm loại..." />
                                                <CommandList>
                                                    <CommandEmpty>Không tìm thấy.</CommandEmpty>
                                                    <CommandGroup>
                                                        {conditionTypes.map((conditionType) => (
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
                            {errors.conditionType && <p className="text-xs text-destructive mt-1">{errors.conditionType.message}</p>}
                        </div>
                        {/* Giá trị điều kiện */}
                        <div className="space-y-1.5">
                            {/* --- THAY ĐỔI: Sử dụng <label> --- */}
                            <label htmlFor="conditionValue" className={cn("text-sm font-medium text-foreground", errors.conditionValue && "text-destructive")}>Giá trị điều kiện</label>
                            <Input
                                id="conditionValue"
                                type="number"
                                placeholder="Ví dụ: 7"
                                className={cn("bg-background border-input", errors.conditionValue && "border-destructive focus-visible:ring-destructive")}
                                {...register("conditionValue", {
                                    required: "Vui lòng nhập giá trị.",
                                    valueAsNumber: true,
                                    min: { value: 1, message: "Giá trị phải lớn hơn 0." },
                                })}
                            />
                            {errors.conditionValue && <p className="text-xs text-destructive mt-1">{errors.conditionValue.message}</p>}
                        </div>
                    </div>

                    {/* Phần thưởng */}
                    <div className="space-y-1.5">
                        {/* --- THAY ĐỔI: Sử dụng <label> --- */}
                        <label htmlFor="rewardId" className={cn("text-sm font-medium text-foreground", errors.rewardId && "text-destructive")}>Phần thưởng</label>
                        <Controller
                            name="rewardId"
                            control={control}
                            rules={{ required: "Vui lòng chọn phần thưởng." }}
                            render={({ field }) => (
                                <Select onValueChange={(value) => field.onChange(Number(value))} value={field.value?.toString()}>
                                    <SelectTrigger id="rewardId" className={cn("bg-background border-input", errors.rewardId && "border-destructive focus-visible:ring-destructive")}>
                                        <SelectValue placeholder="Chọn phần thưởng" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {mockRewards.map((reward) => (
                                            <SelectItem key={reward.id} value={reward.id.toString()}>
                                                {reward.name} (ID: {reward.id})
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        {errors.rewardId && <p className="text-xs text-destructive mt-1">{errors.rewardId.message}</p>}
                    </div>

                    {/* Tên nhiệm vụ */}
                    <div className="space-y-1.5">
                        {/* --- THAY ĐỔI: Sử dụng <label> --- */}
                        <label className={cn("text-sm font-medium text-foreground", errors.nameTranslations && "text-destructive")}>Tên nhiệm vụ (đa ngôn ngữ)</label>
                        <Tabs defaultValue="vi" className="w-full">
                            <TabsList className="grid w-full grid-cols-3">
                                <TabsTrigger value="vi">Tiếng Việt {errors.nameTranslations?.[2]?.value && <span className="text-destructive ml-1">*</span>}</TabsTrigger>
                                <TabsTrigger value="en">Tiếng Anh</TabsTrigger>
                                <TabsTrigger value="ja">Tiếng Nhật</TabsTrigger>
                            </TabsList>
                            {nameFields.map((field, index) => (
                                <TabsContent key={field.id} value={field.key} className="mt-2"> {/* Thêm mt-2 */}
                                    <Input
                                        placeholder={`Tên nhiệm vụ (${field.key.toUpperCase()})${field.key === 'vi' ? ' *' : ''}`}
                                        className={cn("bg-background border-input", errors.nameTranslations?.[index]?.value && "border-destructive focus-visible:ring-destructive")}
                                        {...register(`nameTranslations.${index}.value` as const, {
                                            required: field.key === 'vi' ? `Tên nhiệm vụ (Tiếng Việt) là bắt buộc.` : false,
                                        })}
                                    />
                                    {errors.nameTranslations?.[index]?.value && (
                                        <p className="text-xs text-destructive mt-1">{errors.nameTranslations[index]?.value?.message}</p>
                                    )}
                                    <input type="hidden" {...register(`nameTranslations.${index}.key` as const)} />
                                </TabsContent>
                            ))}
                        </Tabs>
                        {errors.nameTranslations && !errors.nameTranslations[2]?.value && errors.nameTranslations[2]?.type === 'required' && (
                            <p className="text-xs text-destructive mt-1">Vui lòng nhập tên nhiệm vụ Tiếng Việt.</p>
                        )}
                    </div>

                    {/* Mô tả nhiệm vụ */}
                    <div className="space-y-1.5">
                        {/* --- THAY ĐỔI: Sử dụng <label> --- */}
                        <label className={cn("text-sm font-medium text-foreground", errors.descriptionTranslations && "text-destructive")}>Mô tả nhiệm vụ (đa ngôn ngữ)</label>
                        <Tabs defaultValue="vi" className="w-full">
                            <TabsList className="grid w-full grid-cols-3">
                                <TabsTrigger value="vi">Tiếng Việt {errors.descriptionTranslations?.[2]?.value && <span className="text-destructive ml-1">*</span>}</TabsTrigger>
                                <TabsTrigger value="en">Tiếng Anh</TabsTrigger>
                                <TabsTrigger value="ja">Tiếng Nhật</TabsTrigger>
                            </TabsList>
                            {descriptionFields.map((field, index) => (
                                <TabsContent key={field.id} value={field.key} className="mt-2"> {/* Thêm mt-2 */}
                                    <Textarea
                                        placeholder={`Mô tả (${field.key.toUpperCase()})${field.key === 'vi' ? ' *' : ''}`}
                                        className={cn("bg-background border-input min-h-[80px]", errors.descriptionTranslations?.[index]?.value && "border-destructive focus-visible:ring-destructive")}
                                        {...register(`descriptionTranslations.${index}.value` as const, {
                                            required: field.key === 'vi' ? `Mô tả (Tiếng Việt) là bắt buộc.` : false,
                                        })}
                                    />
                                    {errors.descriptionTranslations?.[index]?.value && (
                                        <p className="text-xs text-destructive mt-1">{errors.descriptionTranslations[index]?.value?.message}</p>
                                    )}
                                    <input type="hidden" {...register(`descriptionTranslations.${index}.key` as const)} />
                                </TabsContent>
                            ))}
                        </Tabs>
                        {errors.descriptionTranslations && !errors.descriptionTranslations[2]?.value && errors.descriptionTranslations[2]?.type === 'required' && (
                            <p className="text-xs text-destructive mt-1">Vui lòng nhập mô tả nhiệm vụ Tiếng Việt.</p>
                        )}
                    </div>

                    {/* Kích hoạt */}
                    <div className="flex items-center space-x-2 pt-2">
                        <Controller
                            name="isActive"
                            control={control}
                            render={({ field }) => (
                                <Switch id="form-isActive" checked={field.value} onCheckedChange={field.onChange} />
                            )}
                        />
                        {/* --- THAY ĐỔI: Sử dụng <label> --- */}
                        <label htmlFor="form-isActive" className="text-sm font-medium text-foreground cursor-pointer">
                            Kích hoạt ({isActive ? "Đang bật" : "Đang tắt"})
                        </label>
                    </div>

                    {/* Nút Submit/Cancel */}
                    <DialogFooter className="mt-6 pt-4 border-t border-border">
                        <Button type="button" variant="outline" onClick={onClose}>Hủy</Button>
                        <Button type="submit" disabled={isLoading} className="bg-primary text-primary-foreground hover:bg-primary/90">
                            {isLoading ? "Đang lưu..." : editingQuest ? "Cập nhật" : "Thêm mới"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default CreateDailyQuestDialog