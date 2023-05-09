import { cva, VariantProps } from 'class-variance-authority';
import { cn } from '~/utils/utils';

const loading = cva('bg-gray-300 animate-pulse w-full', {
    variants: {
        rounding: {
            md: 'rounded-md',
            xl: 'rounded-xl',
            full: 'rounded-full',
        },
    },
});

interface LoadingProps extends VariantProps<typeof loading> {
    maxWidth?: number;
    height: number;
}

export const Loading = ({ maxWidth, height, rounding }: LoadingProps) => {
    return (
        <div
            style={{
                maxWidth: `${maxWidth}px`,
                height: `${height}px`,
            }}
            className={loading({ rounding })}></div>
    );
};
