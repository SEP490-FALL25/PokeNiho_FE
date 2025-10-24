import { DialogContent, DialogHeader, DialogTitle } from '@ui/Dialog';
import { Input } from '@ui/Input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@ui/Select';
import { Button } from '@ui/Button';
import { Switch } from '@ui/Switch';
import { Card, CardContent, CardHeader, CardTitle } from '@ui/Card';
import { Badge } from '@ui/Badge';
import { Separator } from '@ui/Separator';
import { useCreateLesson } from '@hooks/useLesson';
import { ICreateLessonRequest } from '@models/lesson/request';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import {
    BookOpen,
    Clock,
    Hash,
    Globe,
    Gift,
    Layers,
    FileText,
    Save,
    Send,
    X,
    Languages
} from 'lucide-react';

interface CreateLessonProps {
    setIsAddDialogOpen: (value: boolean) => void;
}

const CreateLesson = ({ setIsAddDialogOpen }: CreateLessonProps) => {
    const { t } = useTranslation();
    const createLessonMutation = useCreateLesson();

    const [formData, setFormData] = useState<ICreateLessonRequest>({
        titleJp: '',
        levelJlpt: 5,
        estimatedTimeMinutes: 45,
        lessonOrder: 1,
        isPublished: false,
        version: '1.0.0',
        lessonCategoryId: 1,
        rewardId: 1,
        translations: {
            meaning: [
                { language_code: 'vi', value: '' },
                { language_code: 'en', value: '' }
            ]
        }
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleInputChange = (field: string, value: any) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({
                ...prev,
                [field]: ''
            }));
        }
    };

    const handleTranslationChange = (index: number, field: 'language_code' | 'value', value: string) => {
        setFormData(prev => ({
            ...prev,
            translations: {
                ...prev.translations,
                meaning: prev.translations.meaning.map((item, i) =>
                    i === index ? { ...item, [field]: value } : item
                )
            }
        }));
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.titleJp.trim()) {
            newErrors.titleJp = t('createLesson.titleJpRequired');
        }
        if (formData.levelJlpt < 1 || formData.levelJlpt > 5) {
            newErrors.levelJlpt = t('createLesson.levelJlptRange');
        }
        if (formData.estimatedTimeMinutes < 1) {
            newErrors.estimatedTimeMinutes = t('createLesson.estimatedTimeRequired');
        }
        if (formData.lessonOrder < 1) {
            newErrors.lessonOrder = t('createLesson.lessonOrderRequired');
        }
        if (!formData.version.trim()) {
            newErrors.version = t('createLesson.versionRequired');
        }
        if (formData.lessonCategoryId < 1) {
            newErrors.lessonCategoryId = t('createLesson.categoryRequired');
        }
        if (formData.rewardId < 1) {
            newErrors.rewardId = t('createLesson.rewardIdRequired');
        }

        formData.translations.meaning.forEach((translation, index) => {
            if (!translation.value.trim()) {
                newErrors[`translation_${index}`] = t('createLesson.translationRequired');
            }
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (isPublish: boolean = false) => {
        if (!validateForm()) {
            toast.error(t('createLesson.checkInfo'));
            return;
        }

        const submitData = {
            ...formData,
            isPublished: isPublish
        };

        try {
            await createLessonMutation.mutateAsync(submitData);
            toast.success(isPublish ? t('createLesson.publishedSuccess') : t('createLesson.draftSuccess'));
            setIsAddDialogOpen(false);
        } catch (error) {
            toast.error(t('createLesson.createError'));
        }
    };

    return (
        <>
            <DialogContent className="bg-gradient-to-br from-white to-gray-50 border-border max-w-4xl max-h-[95vh] overflow-hidden">
                <DialogHeader className="pb-6">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                            <BookOpen className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                            <DialogTitle className="text-2xl font-bold text-foreground">
                                {t('createLesson.title')}
                            </DialogTitle>
                            <p className="text-sm text-muted-foreground mt-1">
                                {t('createLesson.description')}
                            </p>
                        </div>
                    </div>
                </DialogHeader>

                <div className="overflow-y-auto max-h-[calc(95vh-200px)] pr-2">
                    <div className="space-y-6">
                        {/* Thông tin cơ bản */}
                        <Card className="border-0 shadow-sm bg-white/80 backdrop-blur-sm">
                            <CardHeader className="pb-4">
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <FileText className="h-5 w-5 text-primary" />
                                    {t('createLesson.basicInfo')}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {/* Tiêu đề tiếng Nhật */}
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                                        <Globe className="h-4 w-4 text-primary" />
                                        {t('createLesson.titleJp')} *
                                    </label>
                                    <Input
                                        placeholder="挨拶の基本"
                                        className="bg-background border-border text-foreground h-11 text-base"
                                        value={formData.titleJp}
                                        onChange={(e) => handleInputChange('titleJp', e.target.value)}
                                    />
                                    {errors.titleJp && <p className="text-sm text-red-500 flex items-center gap-1">
                                        <X className="h-3 w-3" />
                                        {errors.titleJp}
                                    </p>}
                                </div>

                                {/* Dịch thuật */}
                                <div className="space-y-3">
                                    <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                                        <Languages className="h-4 w-4 text-primary" />
                                        {t('createLesson.translations')} *
                                    </label>
                                    <div className="space-y-3">
                                        {formData.translations.meaning.map((translation, index) => (
                                            <div key={index} className="flex gap-3">
                                                <div className="flex-1">
                                                    <Input
                                                        placeholder="vi, en, ja..."
                                                        value={translation.language_code}
                                                        onChange={(e) => handleTranslationChange(index, 'language_code', e.target.value)}
                                                        className="bg-background border-border text-foreground h-10"
                                                    />
                                                </div>
                                                <div className="flex-[3]">
                                                    <Input
                                                        placeholder={index === 0 ? "Cách chào hỏi cơ bản" : "Basic Greetings"}
                                                        value={translation.value}
                                                        onChange={(e) => handleTranslationChange(index, 'value', e.target.value)}
                                                        className="bg-background border-border text-foreground h-10"
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    {errors.translation_0 && <p className="text-sm text-red-500 flex items-center gap-1">
                                        <X className="h-3 w-3" />
                                        {errors.translation_0}
                                    </p>}
                                    {errors.translation_1 && <p className="text-sm text-red-500 flex items-center gap-1">
                                        <X className="h-3 w-3" />
                                        {errors.translation_1}
                                    </p>}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Cấu hình bài học */}
                        <Card className="border-0 shadow-sm bg-white/80 backdrop-blur-sm">
                            <CardHeader className="pb-4">
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <Layers className="h-5 w-5 text-primary" />
                                    {t('createLesson.lessonConfig')}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Cấp độ JLPT */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                                            <Badge variant="outline" className="text-xs">JLPT</Badge>
                                            {t('createLesson.level')} *
                                        </label>
                                        <Select value={formData.levelJlpt.toString()} onValueChange={(value) => handleInputChange('levelJlpt', parseInt(value))}>
                                            <SelectTrigger className="bg-background border-border text-foreground h-11">
                                                <SelectValue placeholder={t('createLesson.selectLevel')} />
                                            </SelectTrigger>
                                            <SelectContent className="bg-card border-border">
                                                <SelectItem value="5">
                                                    <div className="flex items-center gap-2">
                                                        <Badge variant="secondary" className="text-xs">N5</Badge>
                                                        <span>Bắt đầu</span>
                                                    </div>
                                                </SelectItem>
                                                <SelectItem value="4">
                                                    <div className="flex items-center gap-2">
                                                        <Badge variant="secondary" className="text-xs">N4</Badge>
                                                        <span>Cơ bản</span>
                                                    </div>
                                                </SelectItem>
                                                <SelectItem value="3">
                                                    <div className="flex items-center gap-2">
                                                        <Badge variant="secondary" className="text-xs">N3</Badge>
                                                        <span>Trung cấp</span>
                                                    </div>
                                                </SelectItem>
                                                <SelectItem value="2">
                                                    <div className="flex items-center gap-2">
                                                        <Badge variant="secondary" className="text-xs">N2</Badge>
                                                        <span>Trung thượng</span>
                                                    </div>
                                                </SelectItem>
                                                <SelectItem value="1">
                                                    <div className="flex items-center gap-2">
                                                        <Badge variant="secondary" className="text-xs">N1</Badge>
                                                        <span>Cao cấp</span>
                                                    </div>
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                        {errors.levelJlpt && <p className="text-sm text-red-500 flex items-center gap-1">
                                            <X className="h-3 w-3" />
                                            {errors.levelJlpt}
                                        </p>}
                                    </div>

                                    {/* Danh mục bài học */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                                            <Hash className="h-4 w-4 text-primary" />
                                            Danh mục *
                                        </label>
                                        <Select value={formData.lessonCategoryId.toString()} onValueChange={(value) => handleInputChange('lessonCategoryId', parseInt(value))}>
                                            <SelectTrigger className="bg-background border-border text-foreground h-11">
                                                <SelectValue placeholder="Chọn danh mục" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-card border-border">
                                                <SelectItem value="1">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-lg">あ</span>
                                                        <span>Chữ cái</span>
                                                    </div>
                                                </SelectItem>
                                                <SelectItem value="2">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-lg">漢</span>
                                                        <span>Kanji</span>
                                                    </div>
                                                </SelectItem>
                                                <SelectItem value="3">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-lg">文</span>
                                                        <span>Ngữ pháp</span>
                                                    </div>
                                                </SelectItem>
                                                <SelectItem value="4">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-lg">話</span>
                                                        <span>Hội thoại</span>
                                                    </div>
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                        {errors.lessonCategoryId && <p className="text-sm text-red-500 flex items-center gap-1">
                                            <X className="h-3 w-3" />
                                            {errors.lessonCategoryId}
                                        </p>}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {/* Thời lượng */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                                            <Clock className="h-4 w-4 text-primary" />
                                            Thời lượng (phút) *
                                        </label>
                                        <Input
                                            type="number"
                                            placeholder="45"
                                            className="bg-background border-border text-foreground h-11"
                                            value={formData.estimatedTimeMinutes}
                                            onChange={(e) => handleInputChange('estimatedTimeMinutes', parseInt(e.target.value) || 0)}
                                        />
                                        {errors.estimatedTimeMinutes && <p className="text-sm text-red-500 flex items-center gap-1">
                                            <X className="h-3 w-3" />
                                            {errors.estimatedTimeMinutes}
                                        </p>}
                                    </div>

                                    {/* Thứ tự bài học */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                                            <Hash className="h-4 w-4 text-primary" />
                                            Thứ tự *
                                        </label>
                                        <Input
                                            type="number"
                                            placeholder="1"
                                            className="bg-background border-border text-foreground h-11"
                                            value={formData.lessonOrder}
                                            onChange={(e) => handleInputChange('lessonOrder', parseInt(e.target.value) || 0)}
                                        />
                                        {errors.lessonOrder && <p className="text-sm text-red-500 flex items-center gap-1">
                                            <X className="h-3 w-3" />
                                            {errors.lessonOrder}
                                        </p>}
                                    </div>

                                    {/* ID phần thưởng */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                                            <Gift className="h-4 w-4 text-primary" />
                                            ID phần thưởng *
                                        </label>
                                        <Input
                                            type="number"
                                            placeholder="1"
                                            className="bg-background border-border text-foreground h-11"
                                            value={formData.rewardId}
                                            onChange={(e) => handleInputChange('rewardId', parseInt(e.target.value) || 0)}
                                        />
                                        {errors.rewardId && <p className="text-sm text-red-500 flex items-center gap-1">
                                            <X className="h-3 w-3" />
                                            {errors.rewardId}
                                        </p>}
                                    </div>
                                </div>

                                {/* Phiên bản */}
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                                        <FileText className="h-4 w-4 text-primary" />
                                        Phiên bản *
                                    </label>
                                    <Input
                                        placeholder="1.0.0"
                                        className="bg-background border-border text-foreground h-11"
                                        value={formData.version}
                                        onChange={(e) => handleInputChange('version', e.target.value)}
                                    />
                                    {errors.version && <p className="text-sm text-red-500 flex items-center gap-1">
                                        <X className="h-3 w-3" />
                                        {errors.version}
                                    </p>}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Trạng thái xuất bản */}
                        <Card className="border-0 shadow-sm bg-white/80 backdrop-blur-sm">
                            <CardContent className="pt-6">
                                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-blue-100 rounded-lg">
                                            <Send className="h-5 w-5 text-blue-600" />
                                        </div>
                                        <div>
                                            <label htmlFor="isPublished" className="text-sm font-semibold text-foreground cursor-pointer">
                                                Xuất bản ngay
                                            </label>
                                            <p className="text-xs text-muted-foreground">
                                                Bài học sẽ được hiển thị cho người dùng ngay lập tức
                                            </p>
                                        </div>
                                    </div>
                                    <Switch
                                        id="isPublished"
                                        checked={formData.isPublished}
                                        onCheckedChange={(checked) => handleInputChange('isPublished', checked)}
                                        className="data-[state=checked]:bg-blue-600"
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                <Separator className="my-4" />

                <div className="flex justify-between items-center pt-4">
                    <div className="text-xs text-muted-foreground">
                        * {t('createLesson.requiredFields')}
                    </div>
                    <div className="flex gap-3">
                        <Button
                            variant="outline"
                            onClick={() => setIsAddDialogOpen(false)}
                            className="border-border text-foreground hover:bg-gray-50 h-10 px-6"
                        >
                            <X className="h-4 w-4 mr-2" />
                            {t('common.cancel')}
                        </Button>
                        <Button
                            variant="outline"
                            className="border-border text-foreground bg-transparent hover:bg-gray-50 h-10 px-6"
                            onClick={() => handleSubmit(false)}
                            disabled={createLessonMutation.isPending}
                        >
                            <Save className="h-4 w-4 mr-2" />
                            {createLessonMutation.isPending ? t('common.loading') : t('createLesson.saveDraft')}
                        </Button>
                        <Button
                            className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground hover:from-primary/90 hover:to-primary/70 h-10 px-6 shadow-lg"
                            onClick={() => handleSubmit(true)}
                            disabled={createLessonMutation.isPending}
                        >
                            <Send className="h-4 w-4 mr-2" />
                            {createLessonMutation.isPending ? t('createLesson.publishing') : t('createLesson.publish')}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </>
    )
}

export default CreateLesson