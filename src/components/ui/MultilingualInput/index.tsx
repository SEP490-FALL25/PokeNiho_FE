import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@ui/Tabs";
import { Input } from "@ui/Input";
import { Textarea } from "@ui/Textarea";
import { cn } from "@utils/CN";
import { useTranslation } from "react-i18next";

interface MultilingualField {
    id: string;
    key: string;
}

interface MultilingualInputProps {
    label: string;
    fields: MultilingualField[];
    values?: Record<string, string>;
    onChange?: (field: string, value: string) => void;
    register?: any;
    errors?: any;
    placeholderKey: string;
    requiredKey?: string;
    isTextarea?: boolean;
    className?: string;
}

const MultilingualInput: React.FC<MultilingualInputProps> = ({
    label,
    fields,
    values,
    onChange,
    register,
    errors,
    placeholderKey,
    requiredKey,
    isTextarea = false,
    className = ""
}) => {
    const { t } = useTranslation();

    const InputComponent = isTextarea ? Textarea : Input;

    // Check if using react-hook-form (has register) or state management (has values/onChange)
    const isReactHookForm = !!register;

    return (
        <div className={cn("space-y-1.5", className)}>
            <label className={cn("text-sm font-medium text-foreground", errors && "text-destructive")}>
                {label}
            </label>
            <Tabs defaultValue="vi" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="vi">
                        {t('dailyQuest.languages.vi')}
                        {(isReactHookForm ? errors?.[2]?.value : errors?.nameVi) && <span className="text-destructive ml-1">*</span>}
                    </TabsTrigger>
                    <TabsTrigger value="en">{t('dailyQuest.languages.en')}</TabsTrigger>
                    <TabsTrigger value="ja">{t('dailyQuest.languages.ja')}</TabsTrigger>
                </TabsList>
                {fields.map((field, index) => (
                    <TabsContent key={field.id} value={field.key} className="mt-2">
                        {isReactHookForm ? (
                            <InputComponent
                                placeholder={t(placeholderKey, { lang: field.key.toUpperCase() })}
                                className={cn(
                                    "bg-background border-input",
                                    isTextarea && "min-h-[80px]",
                                    errors?.[index]?.value && "border-destructive focus-visible:ring-destructive"
                                )}
                                {...register(`${field.key}Translations.${index}.value` as const, {
                                    required: field.key === 'vi' ? t(requiredKey || 'common.required') : false,
                                })}
                            />
                        ) : (
                            <InputComponent
                                placeholder={t(placeholderKey, { lang: field.key.toUpperCase() })}
                                value={values?.[`name${field.key.charAt(0).toUpperCase() + field.key.slice(1)}`] || ""}
                                onChange={(e) => onChange?.(`name${field.key.charAt(0).toUpperCase() + field.key.slice(1)}`, e.target.value)}
                                className={cn(
                                    "bg-background border-input",
                                    isTextarea && "min-h-[80px]",
                                    errors?.[`name${field.key.charAt(0).toUpperCase() + field.key.slice(1)}`] && "border-destructive focus-visible:ring-destructive"
                                )}
                            />
                        )}
                        {isReactHookForm ? (
                            errors?.[index]?.value && (
                                <p className="text-xs text-destructive mt-1">
                                    {errors[index]?.value?.message}
                                </p>
                            )
                        ) : (
                            errors?.[`name${field.key.charAt(0).toUpperCase() + field.key.slice(1)}`] && (
                                <p className="text-xs text-destructive mt-1">
                                    {errors[`name${field.key.charAt(0).toUpperCase() + field.key.slice(1)}`]}
                                </p>
                            )
                        )}
                        {isReactHookForm && (
                            <input type="hidden" {...register(`${field.key}Translations.${index}.key` as const)} />
                        )}
                    </TabsContent>
                ))}
            </Tabs>
            {isReactHookForm && errors && !errors[2]?.value && errors[2]?.type === 'required' && (
                <p className="text-xs text-destructive mt-1">
                    {t(requiredKey || 'common.required')}
                </p>
            )}
        </div>
    );
};

export default MultilingualInput;
