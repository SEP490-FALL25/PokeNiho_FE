import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@utils/CN';
import { Button } from '@ui/Button';
import EyeShowPassword from '@atoms/EyeShowPassword';
import React from 'react';

const inputContainerVariants = cva(
    'relative flex items-center rounded-md border h-12',
    {
        variants: {
            variant: {
                default: 'bg-white/20 border-white/50',
                destructive: 'bg-white/20 border-red-500',
                original: 'bg-white border-[#d1d5db]',
            },
        },
        defaultVariants: {
            variant: 'default',
        },
    }
);



const textInputVariants = cva(
    'flex-1 h-full bg-transparent px-5 text-sm outline-none',
    {
        variants: {
            variant: {
                default: 'text-black placeholder:text-black/60',
                destructive: 'text-black placeholder:text-black/60',
                original: 'text-[#111827] placeholder:text-[#9ca3af]',
            },
        },
        defaultVariants: {
            variant: 'default',
        },
    }
);

interface InputProps
    extends React.InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof inputContainerVariants> {
    label?: string;
    error?: string;
    containerClassName?: string;
    isPassword?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    (
        {
            label,
            error,
            containerClassName,
            className,
            variant,
            isPassword,
            id,
            ...props
        },
        ref
    ) => {
        const [showPassword, setShowPassword] = React.useState(false);
        const activeVariant = error ? 'destructive' : variant;
        const inputId = id || React.useId();

        return (
            <div className={cn('mb-4', containerClassName)}>
                {label && (
                    <label
                        htmlFor={inputId}
                        className="mb-2 block text-sm font-medium text-gray-700"
                    >
                        {label}
                    </label>
                )}
                <div className={cn(inputContainerVariants({ variant: activeVariant }))}>
                    <input
                        id={inputId}
                        ref={ref}
                        className={cn(
                            textInputVariants({ variant: activeVariant }),
                            isPassword && 'pr-12',
                            className
                        )}
                        type={isPassword ? (showPassword ? 'text' : 'password') : 'text'}
                        {...props}
                    />

                    {isPassword && (
                        <Button
                            variant="ghost"
                            className="absolute inset-y-0 right-0 flex items-center justify-center w-12 h-full text-black"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            <EyeShowPassword showPassword={showPassword} size={20} color="black" />
                        </Button>
                    )}
                </div>
                {error && (
                    <p className="mt-1 text-xs text-red-500">
                        {error}
                    </p>
                )}
            </div>
        );
    }
);

Input.displayName = 'Input';

export { Input, inputContainerVariants as inputVariants };

export type { InputProps };

