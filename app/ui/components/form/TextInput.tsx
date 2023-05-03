import React from 'react';

interface TextInputProps {
    label?: string;
    name: string;
    placeholder?: string;
    type?: 'text' | 'password';
    required?: boolean;
    defaultValue?: string | number;
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    value?: string;
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
}: TextInputProps) => {
    return (
        <div className={'flex flex-col'}>
            <label className={'font-medium text-gray-800'} htmlFor={name}>
                {label}
            </label>
            <input
                onChange={onChange}
                defaultValue={defaultValue}
                required={required}
                className={
                    'border border-grey-500 rounded-md py-2 px-3 focus:outline-none focus:border-rose-500'
                }
                placeholder={placeholder}
                name={name}
                type={type}
                value={value}
            />
        </div>
    );
};
