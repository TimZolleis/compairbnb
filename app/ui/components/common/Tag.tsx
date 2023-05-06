import { cva, VariantProps } from 'class-variance-authority';
import { ReactNode } from 'react';

const tag = cva('rounded-full px-3 py-1 text-white font-medium leading-none', {
    variants: {
        color: {
            green: 'bg-green-500',
            red: 'bg-red-500',
            fuchsia: 'bg-fuchsia-500',
            amber: 'bg-amber-500',
        },
        text: {
            xs: 'text-xs',
            sm: 'text-sm',
            normal: 'text-base',
        },
    },
    defaultVariants: {
        color: 'green',
        text: 'xs',
    },
});

interface TagProps extends VariantProps<typeof tag> {
    children: ReactNode | string;
}

export const Tag = ({ children, color, text }: TagProps) => {
    return (
        <div className={'flex items-center'}>
            <div className={tag({ color, text })}>{children}</div>
        </div>
    );
};
