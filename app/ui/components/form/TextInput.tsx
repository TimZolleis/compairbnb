interface TextInputProps {
    label?: string;
    name: string;
    placeholder?: string;
    type?: 'text' | 'password';
    required?: boolean;
}

export const TextInput = ({ name, label, placeholder, type, required }: TextInputProps) => {
    return (
        <div className={'flex flex-col'}>
            <label className={'font-medium text-gray-800'} htmlFor={name}>
                {label}
            </label>
            <input
                required={required}
                className={
                    'border border-grey-500 rounded-md py-2 px-3 focus:outline-none focus:border-rose-500'
                }
                placeholder={placeholder}
                name={name}
                type={type}
            />
        </div>
    );
};
