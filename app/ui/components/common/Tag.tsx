import { cva, VariantProps } from 'class-variance-authority';
import { ReactNode } from 'react';

const tag = cva('px-3 py-1 leading-none', {
    variants: {
        color: {
            green: 'bg-green-500/30 text-green-500',
            red: 'bg-red-500/30 text-red-500',
            fuchsia: 'bg-fuchsia-500/30 text-fuchsia-500',
            amber: 'bg-amber-500/30 text-amber-500',
            pink: 'bg-pink-500/30 text-pink-500',
            'solid-green': 'bg-green-500 text-white ',
            'solid-red': 'bg-red-500 text-white ',
            'solid-fuchsia': 'bg-fuchsia-500 text-white ',
            'solid-amber': 'bg-amber-500 text-white ',
        },
        text: {
            xs: 'text-xs',
            sm: 'text-sm',
            normal: 'text-base',
        },
        rounding: {
            full: 'rounded-full',
            medium: 'rounded-md',
            normal: 'rounded',
            large: 'rounded-lg',
            small: 'rounded-sm',
        },
        font: {
            medium: 'font-medium',
        },
    },
    defaultVariants: {
        color: 'solid-green',
        text: 'xs',
        rounding: 'full',
    },
});

interface TagProps extends VariantProps<typeof tag> {
    children: ReactNode | string;
}

export const Tag = ({ children, color, text, rounding }: TagProps) => {
    return (
        <div className={'flex items-center'}>
            <div className={tag({ color, text, rounding })}>{children}</div>
        </div>
    );
};
