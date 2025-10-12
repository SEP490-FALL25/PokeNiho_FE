import { Button } from '@ui/Button';
import { Dialog, DialogContent, DialogFooter, DialogTrigger } from '@ui/Dialog';
import { DialogHeader, DialogTitle } from '@ui/Dialog';
import { Input } from '@ui/Input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@ui/Select';
import { Switch } from '@ui/Switch';
import { Controller, useForm } from 'react-hook-form';
import { RarityPokemon } from '@constants/pokemon';
import { Textarea } from '@ui/Textarea';
import { Plus, UploadCloud, Trash2 } from 'lucide-react';
import { ICreatePokemonFormData, CreatePokemonFormSchema, ICreatePokemonRequest } from '@models/pokemon/request';
import { useState } from 'react';
import { cn } from '@utils/CN';
import { zodResolver } from '@hookform/resolvers/zod';
import mediaService from '@services/media';
import pokemonService from '@services/pokemon';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-toastify';

interface CreatePokemonProps {
    isAddDialogOpen: boolean;
    setIsAddDialogOpen: (value: boolean) => void;
    typesData: any;
}

const CreatePokemon = ({ isAddDialogOpen, setIsAddDialogOpen, typesData }: CreatePokemonProps) => {

    /**
     * Handle form
     */
    const { control, handleSubmit, formState: { errors }, reset } = useForm<ICreatePokemonFormData>({
        resolver: zodResolver(CreatePokemonFormSchema),
        defaultValues: {
            isStarted: false,
            typeIds: [],
            nameTranslations: {
                ja: '',
                en: '',
                vi: '',
            },
            description: '',
            imageUrl: '',
            rarity: RarityPokemon.COMMON,
            pokedex_number: '',
        }
    });


    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const createPokemonMutation = useMutation({
        mutationFn: pokemonService.createPokemon,
        onSuccess: () => {
            reset();
            setIsAddDialogOpen(false);
            setSelectedFile(null);
            setImagePreview(null);
            setIsSubmitting(false);
            toast.success("Tạo Pokémon thành công.");
        },
        onError: (error: any) => {
            setIsSubmitting(false);
            console.error('Error creating Pokemon:', error);
            console.error('Error response:', error.response?.data.message);

            // Handle validation errors (422)
            if (error.response?.status === 422) {
                const messages = error.response?.data.message;
                if (Array.isArray(messages)) {
                    toast.error(`Validation errors: ${messages.join(', ')}`);
                } else {
                    toast.error(messages || "Validation error");
                }
            } else {
                toast.error(error.response?.data?.message || "Đã có lỗi xảy ra.");
            }
        }
    });

    const [creationMode, setCreationMode] = useState<'manual' | 'import'>('manual');
    const [imageInputMode, setImageInputMode] = useState<'url' | 'file'>('url');
    const onSubmit = async (data: ICreatePokemonFormData) => {
        setIsSubmitting(true);

        try {
            let imageUrl = data.imageUrl;

            //#region Validation
            if (creationMode === 'manual') {
                if (imageInputMode === 'file') {
                    if (!selectedFile) {
                        toast.error('Vui lòng chọn file để tải lên');
                        setIsSubmitting(false);
                        return;
                    }
                }

                if (imageInputMode === 'url') {
                    if (!data.imageUrl) {
                        toast.error('Vui lòng nhập URL hình ảnh');
                        setIsSubmitting(false);
                        return;
                    }
                    // Validate URL format
                    try {
                        new URL(data.imageUrl);
                    } catch {
                        toast.error('URL không hợp lệ');
                        setIsSubmitting(false);
                        return;
                    }
                }
            } else if (creationMode === 'import') {
                if (!selectedFile) {
                    toast.error('Vui lòng chọn file để import');
                    setIsSubmitting(false);
                    return;
                }
                // TODO: Handle file import logic here
                toast.error('Chức năng import từ file đang được phát triển');
                setIsSubmitting(false);
                return;
            }
            //#endregion


            //#region Upload file
            if (creationMode === 'manual' && imageInputMode === 'file' && selectedFile) {
                try {
                    const uploadResponse = await mediaService.uploadFile({
                        folderName: 'pokemon',
                        file: selectedFile,
                        type: 'image'
                    });

                    imageUrl = uploadResponse.data.url;
                } catch (uploadError: any) {
                    console.error('Upload error:', uploadError);

                    const errorMessage = uploadError?.response?.data?.message || uploadError?.message || 'Upload failed';
                    const statusCode = uploadError?.response?.status;

                    if (statusCode >= 400 && statusCode < 600) {
                        console.error('Backend upload error, stopping Pokemon creation:', errorMessage);
                        setIsSubmitting(false);
                        toast.error(errorMessage);
                        return;
                    }

                    console.warn('Network/Cloud upload error, continuing with original URL:', errorMessage);
                    if (!imageUrl) {
                        console.error('No fallback URL available');
                        setIsSubmitting(false);
                        return;
                    }
                }
            }


            //#region Create Pokemon
            if (creationMode === 'manual') {
                const pokemonData = {
                    ...data,
                    pokedex_number: Number(data.pokedex_number),
                    nameTranslations: {
                        ja: data.nameTranslations?.ja,
                        en: data.nameTranslations?.en,
                        vi: data.nameTranslations?.vi,
                    },
                    nameJp: data.nameTranslations?.ja,
                    imageUrl: imageUrl
                };

                createPokemonMutation.mutate(pokemonData as unknown as ICreatePokemonRequest);
            }
            //#endregion

        } catch (error: any) {
            setIsSubmitting(false);
            console.error('Unexpected error:', error);
            toast.error(error.response?.data?.message || "Đã có lỗi xảy ra.");
        }
    };
    //-----------------------End-----------------------//


    return (
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                    <Plus className="h-4 w-4 mr-2" /> Thêm
                </Button>
            </DialogTrigger>
            <DialogContent className="bg-white border-border max-w-4xl">
                <DialogHeader>
                    <DialogTitle className="text-foreground text-2xl">Thêm Pokémon mới</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-4 max-h-[70vh] overflow-y-auto pr-6">
                    {/* Creation Mode Toggle */}
                    <div className="flex items-center justify-center mb-6">
                        <div className="flex items-center gap-1 rounded-lg bg-muted p-1">
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className={cn(
                                    "px-6 py-2 rounded-md transition-all duration-200",
                                    creationMode === 'manual'
                                        ? "bg-white text-foreground shadow-sm"
                                        : "text-muted-foreground hover:text-foreground"
                                )}
                                onClick={() => setCreationMode('manual')}
                            >
                                <Plus className="h-4 w-4 mr-2" />
                                Tạo thủ công
                            </Button>
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className={cn(
                                    "px-6 py-2 rounded-md transition-all duration-200",
                                    creationMode === 'import'
                                        ? "bg-white text-foreground shadow-sm"
                                        : "text-muted-foreground hover:text-foreground"
                                )}
                                onClick={() => setCreationMode('import')}
                            >
                                <UploadCloud className="h-4 w-4 mr-2" />
                                Import từ file
                            </Button>
                        </div>
                    </div>

                    {creationMode === 'manual' ? (
                        /* Manual Creation Mode */
                        <div className="space-y-6">
                            <div className="text-center mb-6">
                                <h3 className="text-lg font-semibold text-foreground mb-2">Tạo Pokémon thủ công</h3>
                                <p className="text-sm text-muted-foreground">Nhập thông tin chi tiết để tạo Pokémon mới</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                                {/* Left Column */}
                                <div className="space-y-4">
                                    <Controller name="pokedex_number" control={control} render={({ field }) => <Input label="Pokedex Number" type="number" placeholder="eg: 25" error={errors.pokedex_number?.message} {...field} />} />
                                    <Controller name="nameTranslations.ja" control={control} render={({ field }) => <Input label="Tên (tiếng Nhật)" placeholder="ピカチュウ" error={errors.nameTranslations?.ja?.message} {...field} />} />
                                    <Controller name="nameTranslations.en" control={control} render={({ field }) => <Input label="Tên (tiếng Anh)" placeholder="Pikachu" error={errors.nameTranslations?.en?.message} {...field} />} />
                                    <Controller name="nameTranslations.vi" control={control} render={({ field }) => <Input label="Tên (tiếng Việt)" placeholder="Pikachu" error={errors.nameTranslations?.vi?.message} {...field} />} />

                                    <div>
                                        <div className="flex items-center gap-4 mb-2">
                                            <label className='text-sm font-medium'>Hình ảnh</label>
                                            <div className="flex w-fit items-center gap-1 rounded-full bg-muted p-1">
                                                <Button type="button" variant="ghost" size="sm" onClick={() => setImageInputMode('url')} className={cn("rounded-full px-4 py-1 h-auto text-sm transition-colors duration-200", imageInputMode === 'url' ? "bg-white text-foreground shadow-sm" : "bg-transparent text-muted-foreground hover:text-foreground")}>
                                                    <UploadCloud className="h-4 w-4 mr-2" /> URL
                                                </Button>
                                                <Button type="button" variant="ghost" size="sm" onClick={() => setImageInputMode('file')} className={cn("rounded-full px-4 py-1 h-auto text-sm transition-colors duration-200", imageInputMode === 'file' ? "bg-white text-foreground shadow-sm" : "bg-transparent text-muted-foreground hover:text-foreground")}>
                                                    <UploadCloud className="h-4 w-4 mr-2" /> Tải lên
                                                </Button>
                                            </div>
                                        </div>

                                        {imageInputMode === 'url' ? (
                                            <Controller name="imageUrl" control={control} render={({ field }) => <Input placeholder="https://..." error={errors.imageUrl?.message as string} {...field} />} />
                                        ) : (
                                            <Controller
                                                name="imageUrl"
                                                control={control}
                                                render={({ field: { onChange, value, ...rest } }) => (
                                                    <div>
                                                        {!value && !imagePreview ? (
                                                            <label htmlFor="pokemon-image-upload" className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted hover:bg-muted/50 transition-colors">
                                                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                                    <UploadCloud className="w-8 h-8 mb-4 text-muted-foreground" />
                                                                    <p className="mb-2 text-sm text-muted-foreground"><span className="font-semibold">Nhấn để tải lên</span> hoặc kéo thả</p>
                                                                    <p className="text-xs text-muted-foreground">PNG, JPG, WEBP (Tối đa 2MB)</p>
                                                                </div>
                                                                <input
                                                                    id="pokemon-image-upload"
                                                                    type="file"
                                                                    className="hidden"
                                                                    accept="image/*"
                                                                    onChange={(e) => {
                                                                        const file = e.target.files?.[0];
                                                                        if (file) {
                                                                            setSelectedFile(file);
                                                                            if (imagePreview) URL.revokeObjectURL(imagePreview); // Dọn dẹp preview cũ
                                                                            setImagePreview(URL.createObjectURL(file));
                                                                        }
                                                                    }}
                                                                    {...rest}
                                                                />
                                                            </label>
                                                        ) : (
                                                            <div className="relative w-32 h-32">
                                                                <img src={imagePreview || (value && typeof value === 'object' && 'size' in value ? URL.createObjectURL(value as File) : (value as string) || '')} alt="Xem trước" className="object-contain w-full h-full rounded-lg border bg-muted" />
                                                                <Button type="button" variant="destructive" size="icon" className="absolute top-1 right-1 h-6 w-6 rounded-full"
                                                                    onClick={() => {
                                                                        setSelectedFile(null);
                                                                        if (imagePreview) URL.revokeObjectURL(imagePreview);
                                                                        setImagePreview(null);
                                                                    }}
                                                                >
                                                                    <Trash2 className="h-4 w-4" />
                                                                </Button>
                                                            </div>
                                                        )}
                                                        {imageInputMode === 'file' && !selectedFile && (
                                                            <p className="text-xs text-destructive mt-1">Please select a file to upload</p>
                                                        )}
                                                    </div>
                                                )}
                                            />
                                        )}
                                    </div>
                                </div>

                                {/* Right Column */}
                                <div className="space-y-4">
                                    <Controller name="rarity" control={control} render={({ field }) => (
                                        <div className="flex flex-col gap-2">
                                            <label htmlFor="rarity">Độ hiếm</label>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <SelectTrigger><SelectValue placeholder="Chọn độ hiếm" /></SelectTrigger>
                                                <SelectContent>{Object.values(RarityPokemon).map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent>
                                            </Select>
                                            {errors.rarity && <p className="text-xs text-destructive mt-1">{errors.rarity.message}</p>}
                                        </div>
                                    )} />

                                    <Controller name="typeIds" control={control} render={({ field }) => {
                                        const isMaxSelected = field.value.length >= 2;
                                        const isTypeSelected = (typeId: number) => field.value.includes(typeId);

                                        return (
                                            <div className="flex flex-col gap-2">
                                                <label htmlFor="typeIds">Hệ (chọn tối đa 2)</label>
                                                <div className="grid grid-cols-3 gap-2 p-2 border rounded-md max-h-40 overflow-y-auto">
                                                    {typesData?.results?.map((type: any) => {
                                                        const isDisabled = !isTypeSelected(type.id) && isMaxSelected;
                                                        return (
                                                            <label key={type.id} className={cn(
                                                                "flex items-center gap-2 p-2 rounded-md cursor-pointer text-sm transition-colors",
                                                                isDisabled
                                                                    ? "cursor-not-allowed opacity-50 bg-muted/30"
                                                                    : "hover:bg-muted"
                                                            )}>
                                                                <input
                                                                    type="checkbox"
                                                                    value={type.id}
                                                                    checked={isTypeSelected(type.id)}
                                                                    disabled={isDisabled}
                                                                    onChange={e => {
                                                                        const selectedId = parseInt(e.target.value);
                                                                        const newIds = e.target.checked
                                                                            ? [...field.value, selectedId]
                                                                            : field.value.filter(id => id !== selectedId);
                                                                        field.onChange(newIds);
                                                                    }}
                                                                    className="cursor-pointer form-checkbox h-4 w-4 rounded text-primary focus:ring-primary disabled:cursor-not-allowed"
                                                                />
                                                                <span className={cn(isDisabled && "text-muted-foreground")}>
                                                                    {type.display_name.vi}
                                                                </span>
                                                            </label>
                                                        );
                                                    })}
                                                </div>
                                                {errors.typeIds && <p className="text-xs text-destructive mt-1">{errors.typeIds.message}</p>}
                                            </div>
                                        );
                                    }} />

                                    <Controller name="description" control={control} render={({ field }) => (
                                        <div className="flex flex-col gap-2">
                                            <label htmlFor="description">Mô tả</label>
                                            <Textarea id="description" placeholder="Nhập mô tả về Pokémon..." {...field} />
                                            {errors.description && <p className="text-xs text-destructive mt-1">{errors.description.message}</p>}
                                        </div>
                                    )} />

                                    <Controller name="isStarted" control={control} render={({ field }) => (
                                        <div className="flex items-center space-x-2 pt-2">
                                            <Switch checked={field.value} onCheckedChange={field.onChange} id="is-started" />
                                            <label htmlFor="is-started">Là Pokémon khởi đầu?</label>
                                        </div>
                                    )} />
                                </div>
                            </div>
                        </div>
                    ) : (
                        /* Import from File Mode */
                        <div className="space-y-6">
                            <div className="text-center mb-6">
                                <h3 className="text-lg font-semibold text-foreground mb-2">Import Pokémon từ file</h3>
                                <p className="text-sm text-muted-foreground">Tải lên file CSV hoặc JSON để import nhiều Pokémon cùng lúc</p>
                            </div>

                            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 bg-muted/20">
                                <label htmlFor="file-upload-main" className="flex flex-col items-center justify-center cursor-pointer group">
                                    <div className="flex flex-col items-center justify-center">
                                        <div className="p-4 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors mb-4">
                                            <UploadCloud className="w-12 h-12 text-primary" />
                                        </div>
                                        <h4 className="text-lg font-semibold text-foreground mb-2">Chọn file để import</h4>
                                        <p className="text-sm text-muted-foreground mb-4">
                                            <span className="font-medium">Nhấn để chọn file</span> hoặc kéo thả file vào đây
                                        </p>
                                        <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                                            <span className="px-2 py-1 bg-muted rounded">CSV</span>
                                            <span className="px-2 py-1 bg-muted rounded">JSON</span>
                                            <span className="px-2 py-1 bg-muted rounded">Tối đa 5MB</span>
                                        </div>
                                    </div>
                                    <Input
                                        id="file-upload-main"
                                        type="file"
                                        className="hidden"
                                        accept=".csv,.json"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) {
                                                setSelectedFile(file);
                                                if (imagePreview) URL.revokeObjectURL(imagePreview);
                                                setImagePreview(URL.createObjectURL(file));
                                            }
                                        }}
                                    />
                                </label>

                                {selectedFile && (
                                    <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-green-100 rounded-full">
                                                <UploadCloud className="w-5 h-5 text-green-600" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-medium text-green-800">{selectedFile.name}</p>
                                                <p className="text-sm text-green-600">
                                                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                                                </p>
                                            </div>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => {
                                                    setSelectedFile(null);
                                                    if (imagePreview) URL.revokeObjectURL(imagePreview);
                                                    setImagePreview(null);
                                                }}
                                                className="text-green-600 hover:text-green-700"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <h4 className="font-medium text-blue-800 mb-2">Định dạng file hỗ trợ:</h4>
                                <ul className="text-sm text-blue-700 space-y-1">
                                    <li>• <strong>CSV:</strong> File Excel được xuất dưới dạng CSV</li>
                                    <li>• <strong>JSON:</strong> File JSON với cấu trúc dữ liệu Pokémon</li>
                                </ul>
                            </div>
                        </div>
                    )}

                    <DialogFooter className="pt-4">
                        <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)} disabled={isSubmitting}>Hủy</Button>
                        <Button type="submit" className="bg-primary text-primary-foreground" disabled={isSubmitting}>
                            {isSubmitting
                                ? (creationMode === 'manual' ? 'Đang tạo...' : 'Đang import...')
                                : (creationMode === 'manual' ? 'Tạo Pokémon' : 'Import Pokémon')
                            }
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default CreatePokemon;