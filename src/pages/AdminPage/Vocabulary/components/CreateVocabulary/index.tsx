import { Button } from '@ui/Button';
import { Dialog, DialogContent, DialogFooter, DialogTrigger } from '@ui/Dialog';
import { DialogHeader, DialogTitle } from '@ui/Dialog';
import { Input } from '@ui/Input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@ui/Select';
import { Controller, useForm } from 'react-hook-form';
import { Textarea } from '@ui/Textarea';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import vocabularyService from '@services/vocabulary';
import { CreateVocabularyFullMultipartSchema, ICreateVocabularyFullMultipartType } from '@models/vocabulary/request';

interface CreateVocabularyProps {
    isAddDialogOpen: boolean;
    setIsAddDialogOpen: (value: boolean) => void;
}

const CreateVocabulary = ({ isAddDialogOpen, setIsAddDialogOpen }: CreateVocabularyProps) => {
    // Form setup
    // Keep form type broad to avoid resolver generic mismatch; Zod will validate and transform
    const { control, handleSubmit, formState: { errors }, reset } = useForm<any>({
        resolver: zodResolver(CreateVocabularyFullMultipartSchema),
        defaultValues: {
            word_jp: '',
            reading: '',
            level_n: '',
            word_type_id: '',
            // Provide JSON string; zod will transform string -> object via union
            translations: JSON.stringify({
                meaning: [
                    { language_code: 'vi', value: '' }
                ],
                examples: []
                // examples: [{ language_code: 'vi', sentence: '', original_sentence: '' }]
            })
        }
    });

    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const createVocabularyMutation = useMutation({
        mutationFn: vocabularyService.createVocabulary,
        onSuccess: () => {
            reset();
            setIsAddDialogOpen(false);
            setIsSubmitting(false);
            toast.success('Tạo từ vựng thành công.');
        },
        onError: (error: any) => {
            setIsSubmitting(false);
            console.error('Error creating Vocabulary:', error);
            console.error('Error response:', error.response?.data?.message);

            if (error.response?.status === 422) {
                const messages = error.response?.data?.message;
                if (Array.isArray(messages)) {
                    toast.error(`Validation errors: ${messages.join(', ')}`);
                } else {
                    toast.error(messages || 'Validation error');
                }
            } else {
                toast.error(error.response?.data?.message || 'Đã có lỗi xảy ra.');
            }
        }
    });

    const onSubmit = async (data: ICreateVocabularyFullMultipartType) => {
        setIsSubmitting(true);
        try {
            createVocabularyMutation.mutate(data as ICreateVocabularyFullMultipartType);
        } catch (error: any) {
            setIsSubmitting(false);
            console.error('Unexpected error:', error);
            toast.error(error.response?.data?.message || 'Đã có lỗi xảy ra.');
        }
    };

    return (
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                    <Plus className="h-4 w-4 mr-2" /> Thêm
                </Button>
            </DialogTrigger>
            <DialogContent className="bg-white border-border max-w-3xl">
                <DialogHeader>
                    <DialogTitle className="text-foreground text-2xl">Thêm Từ vựng</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-4 max-h-[70vh] overflow-y-auto pr-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                        {/* Left column */}
                        <div className="space-y-4">
                            <Controller
                                name="word_jp"
                                control={control}
                                render={({ field }) => (
                                    <Input label="Từ tiếng Nhật" placeholder="例: 食べる" error={errors.word_jp?.message as string} {...field} />
                                )}
                            />

                            <Controller
                                name="reading"
                                control={control}
                                render={({ field }) => (
                                    <Input label="Cách đọc" placeholder="たべる" error={errors.reading?.message as string} {...field} />
                                )}
                            />
                        </div>

                        {/* Right column */}
                        <div className="space-y-4">
                            <Controller
                                name="level_n"
                                control={control}
                                render={({ field }) => (
                                    <div className="flex flex-col gap-2">
                                        <label htmlFor="level_n">Cấp độ JLPT</label>
                                        <Select onValueChange={field.onChange} defaultValue={field.value as unknown as string}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Chọn cấp độ (N5 → N1)" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="5">N5</SelectItem>
                                                <SelectItem value="4">N4</SelectItem>
                                                <SelectItem value="3">N3</SelectItem>
                                                <SelectItem value="2">N2</SelectItem>
                                                <SelectItem value="1">N1</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        {errors.level_n && <p className="text-xs text-destructive mt-1">{errors.level_n.message as string}</p>}
                                    </div>
                                )}
                            />

                            <Controller
                                name="word_type_id"
                                control={control}
                                render={({ field }) => (
                                    <Input label="Loại từ (ID)" type="number" placeholder="Ví dụ: 1" error={errors.word_type_id?.message as string} {...field} />
                                )}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label>Translations (JSON)</label>
                        <p className="text-xs text-muted-foreground">Điền theo cấu trúc: {`{ meaning: [{ language_code, value }], examples: [{ language_code, sentence, original_sentence }] }`}</p>
                        <Controller
                            name="translations"
                            control={control}
                            render={({ field }) => (
                                <Textarea rows={8} placeholder='{"meaning":[{"language_code":"vi","value":"..."}],"examples":[]}' {...field as any} />
                            )}
                        />
                        {errors.translations && (
                            <p className="text-xs text-destructive mt-1">{(errors.translations as any)?.message}</p>
                        )}
                    </div>

                    <DialogFooter className="pt-4">
                        <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)} disabled={isSubmitting}>Hủy</Button>
                        <Button type="submit" className="bg-primary text-primary-foreground" disabled={isSubmitting}>
                            {isSubmitting ? 'Đang tạo...' : 'Tạo từ vựng'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default CreateVocabulary;