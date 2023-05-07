import React from 'react';
import { cva, VariantProps } from 'class-variance-authority';

const textInput = cva(
    'flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
    {
        variants: {
            size: {
                sm: 'h-4',
                md: 'h-6',
                lg: 'h-10',
            },
        },
        defaultVariants: {
            size: 'lg',
        },
    }
);

interface TextInputProps extends VariantProps<typeof textInput> {
    label?: string;
    name: string;
    placeholder?: string;
    type?: 'text' | 'password';
    required?: boolean;
    defaultValue?: string | number;
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    value?: string;
    innerRef?: React.Ref<HTMLInputElement>;
}

export const TextInput = ({
    name,
    label,
    placeholder,
    type,
    required,
    defaultValue,
    onChange,
    value,
    size,
    innerRef,
}: TextInputProps) => {
    return (
        <div className={'flex flex-col w-full'}>
            <label className={'font-medium text-gray-800'} htmlFor={name}>
                {label}
            </label>
            <input
                ref={innerRef}
                onChange={onChange}
                defaultValue={defaultValue}
                required={required}
                className={textInput({ size })}
                placeholder={placeholder}
                name={name}
                type={type}
                value={value}
            />
        </div>
    );
};
