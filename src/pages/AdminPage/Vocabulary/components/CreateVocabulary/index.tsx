import { Button } from '@ui/Button';
import { DialogContent, DialogFooter } from '@ui/Dialog';
import { DialogHeader, DialogTitle } from '@ui/Dialog';
import { Input } from '@ui/Input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@ui/Select';
import { Controller, useForm } from 'react-hook-form';
import { Textarea } from '@ui/Textarea';
import { useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import vocabularyService from '@services/vocabulary';
import { CreateVocabularyFullMultipartSchema, ICreateVocabularyFullMultipartType } from '@models/vocabulary/request';

interface CreateVocabularyProps {
    setIsAddDialogOpen: (value: boolean) => void;
}

const WORD_TYPES = [
    { id: 1, label: 'Noun' },
    { id: 2, label: 'Pronoun' },
    { id: 3, label: 'Particle' },
    { id: 4, label: 'Adverb' },
    { id: 5, label: 'Conjunction' },
    { id: 6, label: 'Interjection' },
    { id: 7, label: 'Numeral' },
    { id: 8, label: 'Counter' },
    { id: 9, label: 'Prefix' },
    { id: 10, label: 'Suffix' },
    { id: 11, label: 'I-adjective' },
    { id: 12, label: 'Na-adjective' },
    { id: 13, label: 'No-adjective' },
    { id: 14, label: 'Verb (Ichidan)' },
    { id: 15, label: 'Verb (Godan)' },
    { id: 16, label: 'Verb (Irregular)' },
    { id: 17, label: 'Verb (Suru)' },
    { id: 18, label: 'Verb (Kuru)' },
    { id: 19, label: 'Verb forms (19-31)' },
    { id: 32, label: 'Onomatopoeia' },
    { id: 33, label: 'Mimetic word' },
    { id: 34, label: 'Honorific' },
    { id: 35, label: 'Humble' },
    { id: 36, label: 'Polite' },
    { id: 37, label: 'Casual' },
];

const CreateVocabulary = ({ setIsAddDialogOpen }: CreateVocabularyProps) => {
    // Form setup
    // Keep form type broad to avoid resolver generic mismatch; Zod will validate and transform
    const { control, handleSubmit, formState: { errors }, reset, setValue, watch } = useForm<any>({
        resolver: zodResolver(CreateVocabularyFullMultipartSchema),
        defaultValues: {
            word_jp: '',
            reading: '',
            level_n: '',
            word_type_id: '',
            translations: '',
            image: undefined,
            audio: undefined,
        }
    });

    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [audioName, setAudioName] = useState<string | null>(null);

    // Friendlier translations UI state
    const [meanings, setMeanings] = useState<Array<{ language_code: string; value: string }>>([
        { language_code: 'vi', value: '' }
    ]);
    const [examples, setExamples] = useState<Array<{ language_code: string; sentence: string; original_sentence: string }>>([]);

    // Keep hidden translations JSON in sync for zod validation
    useEffect(() => {
        const payload = { meaning: meanings, examples: examples.length ? examples : [] };
        setValue('translations', JSON.stringify(payload));
    }, [meanings, examples, setValue]);

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
            // Ensure files are passed along (service builds FormData)
            const submitPayload: any = {
                ...data,
            };
            const imageFile: File | undefined = (watch('image') as any) as File | undefined;
            const audioFile: File | undefined = (watch('audio') as any) as File | undefined;
            if (imageFile) submitPayload.image = imageFile;
            if (audioFile) submitPayload.audio = audioFile;
            createVocabularyMutation.mutate(submitPayload as ICreateVocabularyFullMultipartType);
        } catch (error: any) {
            setIsSubmitting(false);
            console.error('Unexpected error:', error);
            toast.error(error.response?.data?.message || 'Đã có lỗi xảy ra.');
        }
    };

    return (
        <>
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
                                    <div className="flex flex-col gap-2">
                                        <label htmlFor="word_type_id">Loại từ</label>
                                        <Select onValueChange={field.onChange} defaultValue={field.value as unknown as string}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Chọn loại từ" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {WORD_TYPES.map((t) => (
                                                    <SelectItem key={t.id} value={String(t.id)}>{t.label} ({t.id})</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {errors.word_type_id && <p className="text-xs text-destructive mt-1">{errors.word_type_id.message as string}</p>}
                                    </div>
                                )}
                            />
                        </div>
                    </div>

                    {/* Translations friendly UI */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <label className="font-medium">Nghĩa (Meaning)</label>
                            <Button type="button" variant="outline" onClick={() => setMeanings((prev) => [...prev, { language_code: 'vi', value: '' }])}>Thêm nghĩa</Button>
                        </div>
                        <div className="space-y-3">
                            {meanings.map((m, idx) => (
                                <div key={idx} className="grid grid-cols-1 md:grid-cols-6 gap-3 items-end">
                                    <div className="md:col-span-2">
                                        <Input
                                            label="Mã ngôn ngữ"
                                            placeholder="vd: vi, en"
                                            value={m.language_code}
                                            onChange={(e) => setMeanings((prev) => prev.map((it, i) => i === idx ? { ...it, language_code: e.target.value } : it))}
                                        />
                                    </div>
                                    <div className="md:col-span-3">
                                        <Input
                                            label="Nội dung"
                                            placeholder="Nghĩa của từ"
                                            value={m.value}
                                            onChange={(e) => setMeanings((prev) => prev.map((it, i) => i === idx ? { ...it, value: e.target.value } : it))}
                                        />
                                    </div>
                                    <div className="md:col-span-1">
                                        <Button type="button" variant="outline" onClick={() => setMeanings((prev) => prev.filter((_, i) => i !== idx))}>Xóa</Button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="flex items-center justify-between pt-4">
                            <label className="font-medium">Ví dụ (Examples)</label>
                            <Button type="button" variant="outline" onClick={() => setExamples((prev) => [...prev, { language_code: 'vi', sentence: '', original_sentence: '' }])}>Thêm ví dụ</Button>
                        </div>
                        <div className="space-y-3">
                            {examples.map((ex, idx) => (
                                <div key={idx} className="grid grid-cols-1 md:grid-cols-6 gap-3 items-end">
                                    <div className="md:col-span-1">
                                        <Input
                                            label="Mã"
                                            placeholder="vi/en"
                                            value={ex.language_code}
                                            onChange={(e) => setExamples((prev) => prev.map((it, i) => i === idx ? { ...it, language_code: e.target.value } : it))}
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <Input
                                            label="Câu gốc"
                                            placeholder="日本語の文"
                                            value={ex.original_sentence}
                                            onChange={(e) => setExamples((prev) => prev.map((it, i) => i === idx ? { ...it, original_sentence: e.target.value } : it))}
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <Input
                                            label="Bản dịch"
                                            placeholder="Câu dịch"
                                            value={ex.sentence}
                                            onChange={(e) => setExamples((prev) => prev.map((it, i) => i === idx ? { ...it, sentence: e.target.value } : it))}
                                        />
                                    </div>
                                    <div className="md:col-span-1">
                                        <Button type="button" variant="outline" onClick={() => setExamples((prev) => prev.filter((_, i) => i !== idx))}>Xóa</Button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Hidden textarea to satisfy zod union (string -> JSON) */}
                        <Controller
                            name="translations"
                            control={control}
                            render={({ field }) => (
                                <Textarea {...field as any} className="hidden" />
                            )}
                        />
                        {errors.translations && (
                            <p className="text-xs text-destructive mt-1">{(errors.translations as any)?.message}</p>
                        )}
                    </div>

                    {/* Media upload */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="font-medium">Hình ảnh</label>
                            <Controller
                                name="image"
                                control={control}
                                render={({ field }) => (
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            field.onChange(file);
                                            if (file) {
                                                setImagePreview(URL.createObjectURL(file));
                                            } else {
                                                setImagePreview(null);
                                            }
                                        }}
                                    />
                                )}
                            />
                            {imagePreview && (
                                <img src={imagePreview} alt="preview" className="mt-2 h-24 w-24 object-cover rounded" />
                            )}
                        </div>
                        <div className="space-y-2">
                            <label className="font-medium">Audio</label>
                            <Controller
                                name="audio"
                                control={control}
                                render={({ field }) => (
                                    <input
                                        type="file"
                                        accept="audio/*"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            field.onChange(file);
                                            setAudioName(file ? file.name : null);
                                        }}
                                    />
                                )}
                            />
                            {audioName && (
                                <p className="text-xs text-muted-foreground mt-1">Đã chọn: {audioName}</p>
                            )}
                        </div>
                    </div>

                    <DialogFooter className="pt-4">
                        <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)} disabled={isSubmitting}>Hủy</Button>
                        <Button type="submit" className="bg-primary text-primary-foreground" disabled={isSubmitting}>
                            {isSubmitting ? 'Đang tạo...' : 'Tạo từ vựng'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </>
    );
};

export default CreateVocabulary;