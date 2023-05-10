import { cva } from 'class-variance-authority';

export const datePlacement = cva('', {
    variants: {
        day: {
            1: '',
            2: 'col-start-2',
            3: 'col-start-3',
            4: 'col-start-4',
            5: 'col-start-5',
            6: 'col-start-6',
            7: 'col-start-7',
        },
    },
});

export const dateVariants = cva('mx-auto flex h-8 w-8 items-center justify-center rounded-full', {
    variants: {
        font: {
            medium: 'font-medium',
            normal: 'font-normal',
        },
        text: {
            red: 'text-red-500',
            white: 'text-white',
            gray: 'text-gray-600',
        },
        bg: {
            dark: 'bg-gray-900',
            red: 'bg-red-500',
            transparent: 'bg-transparent',
        },
    },
    compoundVariants: [
        {
            font: 'medium',
            bg: 'red',
            className: 'text-white',
        },
        {
            font: 'medium',
            bg: 'transparent',
            className: 'text-red-500',
        },
        {
            bg: 'dark',
            className: 'text-white font-medium',
        },
    ],
    defaultVariants: {
        font: 'normal',
        text: 'gray',
        bg: 'transparent',
    },
});
