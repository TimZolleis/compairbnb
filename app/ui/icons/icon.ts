import { cva, VariantProps } from 'class-variance-authority';

export const icon = cva('', {
    variants: {
        size: {
            xs: 'h-4',
            sm: 'h-6',
            normal: 'h-8',
            lg: 'h-12',
            xl: 'h-20',
        },
        color: {
            primary: 'stroke-gray-600',
        },
        hover: {
            pointer: 'hover:cursor-pointer',
        },
        direction: {
            down: 'rotate-0',
            up: 'rotate-180',
            left: 'rotate-90',
            right: '-rotate-90',
        },
    },
    defaultVariants: {
        size: 'xs',
        color: 'primary',
    },
});

export interface IconProps extends VariantProps<typeof icon> {}
export interface ClickableIconProps extends IconProps {
    onClick: () => any;
}
