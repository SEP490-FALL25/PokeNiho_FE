import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@ui/Dialog";
import { Button } from "@ui/Button";
import { Input } from "@ui/Input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@ui/Select";
import { useTranslation } from "react-i18next";
import { useUpdateReward } from "@hooks/useReward";
import { toast } from "react-toastify";

interface UpdateRewardDialogProps {
    isOpen: boolean;
    onClose: () => void;
    editingReward: any;
}

const UpdateRewardDialog = ({ isOpen, onClose, editingReward }: UpdateRewardDialogProps) => {
    const { t } = useTranslation();
    const updateRewardMutation = useUpdateReward();

    const [formData, setFormData] = useState({
        nameVi: "",
        nameEn: "",
        nameJa: "",
        rewardType: "",
        rewardItem: "",
        rewardTarget: "",
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    // Reset form when dialog opens/closes
    useEffect(() => {
        if (isOpen && editingReward) {
            setFormData({
                nameVi: editingReward.name || "",
                nameEn: editingReward.name || "",
                nameJa: editingReward.name || "",
                rewardType: editingReward.rewardType,
                rewardItem: editingReward.rewardItem.toString(),
                rewardTarget: editingReward.rewardTarget,
            });
            setErrors({});
        }
    }, [isOpen, editingReward]);

    const rewardTypeOptions = [
        { value: "DAILY_REQUEST", label: "Daily Request" },
        { value: "LEVEL_UP", label: "Level Up" },
        { value: "ACHIEVEMENT", label: "Achievement" },
        { value: "SPECIAL_EVENT", label: "Special Event" },
    ];

    const rewardTargetOptions = [
        { value: "EXP", label: "Experience Points" },
        { value: "GEM", label: "Gems" },
        { value: "STAMINA", label: "Stamina" },
        { value: "COIN", label: "Coins" },
        { value: "ITEM", label: "Items" },
    ];

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.nameVi.trim()) {
            newErrors.nameVi = t('reward.nameViRequired');
        }

        if (!formData.nameEn.trim()) {
            newErrors.nameEn = t('reward.nameEnRequired');
        }

        if (!formData.nameJa.trim()) {
            newErrors.nameJa = t('reward.nameJaRequired');
        }

        if (!formData.rewardType) {
            newErrors.rewardType = t('reward.rewardTypeRequired');
        }

        if (!formData.rewardItem || isNaN(Number(formData.rewardItem)) || Number(formData.rewardItem) <= 0) {
            newErrors.rewardItem = t('reward.rewardItemRequired');
        }

        if (!formData.rewardTarget) {
            newErrors.rewardTarget = t('reward.rewardTargetRequired');
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        const submitData = {
            name: formData.nameVi.trim(), // Sử dụng tiếng Việt làm name chính
            rewardType: formData.rewardType,
            rewardItem: Number(formData.rewardItem),
            rewardTarget: formData.rewardTarget,
        };

        try {
            await updateRewardMutation.mutateAsync({ id: editingReward.id, data: submitData });
            toast.success(t('reward.updateSuccess'));
            onClose();
        } catch (error) {
            console.error("Error updating reward:", error);
            toast.error(t('reward.updateError'));
        }
    };

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: "" }));
        }
    };

    const isLoading = updateRewardMutation.isPending;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="bg-card border-border">
                <DialogHeader>
                    <DialogTitle className="text-foreground">
                        {t('reward.editTitle')}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Vietnamese Name */}
                    <div>
                        <Input
                            label={t('reward.nameVi')}
                            value={formData.nameVi}
                            onChange={(e) => handleInputChange('nameVi', e.target.value)}
                            error={errors.nameVi}
                            placeholder={t('reward.nameViPlaceholder')}
                            variant="original"
                        />
                    </div>

                    {/* English Name */}
                    <div>
                        <Input
                            label={t('reward.nameEn')}
                            value={formData.nameEn}
                            onChange={(e) => handleInputChange('nameEn', e.target.value)}
                            error={errors.nameEn}
                            placeholder={t('reward.nameEnPlaceholder')}
                            variant="original"
                        />
                    </div>

                    {/* Japanese Name */}
                    <div>
                        <Input
                            label={t('reward.nameJa')}
                            value={formData.nameJa}
                            onChange={(e) => handleInputChange('nameJa', e.target.value)}
                            error={errors.nameJa}
                            placeholder={t('reward.nameJaPlaceholder')}
                            variant="original"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            {t('reward.rewardType')}
                        </label>
                        <Select value={formData.rewardType} onValueChange={(value) => handleInputChange('rewardType', value)}>
                            <SelectTrigger className="bg-background border-border text-foreground">
                                <SelectValue placeholder={t('reward.rewardTypePlaceholder')} />
                            </SelectTrigger>
                            <SelectContent className="bg-card border-border">
                                {rewardTypeOptions.map((option) => (
                                    <SelectItem key={option.value} value={option.value}>
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.rewardType && (
                            <p className="mt-1 text-xs text-red-500">{errors.rewardType}</p>
                        )}
                    </div>

                    <div>
                        <Input
                            label={t('reward.rewardItem')}
                            type="number"
                            value={formData.rewardItem}
                            onChange={(e) => handleInputChange('rewardItem', e.target.value)}
                            error={errors.rewardItem}
                            placeholder={t('reward.rewardItemPlaceholder')}
                            variant="original"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            {t('reward.rewardTarget')}
                        </label>
                        <Select value={formData.rewardTarget} onValueChange={(value) => handleInputChange('rewardTarget', value)}>
                            <SelectTrigger className="bg-background border-border text-foreground">
                                <SelectValue placeholder={t('reward.rewardTargetPlaceholder')} />
                            </SelectTrigger>
                            <SelectContent className="bg-card border-border">
                                {rewardTargetOptions.map((option) => (
                                    <SelectItem key={option.value} value={option.value}>
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.rewardTarget && (
                            <p className="mt-1 text-xs text-red-500">{errors.rewardTarget}</p>
                        )}
                    </div>

                    <div className="flex justify-end space-x-2 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            disabled={isLoading}
                        >
                            {t('common.cancel')}
                        </Button>
                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="bg-primary text-primary-foreground hover:bg-primary/90"
                        >
                            {isLoading ? t('common.saving') : t('common.update')}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default UpdateRewardDialog;