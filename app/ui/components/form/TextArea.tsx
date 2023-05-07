import * as React from 'react';
import { cn } from '~/utils/utils';
import { cva, VariantProps } from 'class-variance-authority';

const textArea = cva(
    'flex h-20 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
    {
        variants: {
            size: {
                xs: 'h-8',
                sm: 'h-12',
                md: 'h-16',
                lg: 'h-20',
            },
        },
        defaultVariants: {
            size: 'lg',
        },
    }
);

export interface TextareaProps
    extends React.TextareaHTMLAttributes<HTMLTextAreaElement>,
        VariantProps<typeof textArea> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
    ({ className, size, ...props }, ref) => {
        return <textarea className={cn(textArea({ size }), className)} ref={ref} {...props} />;
    }
);
Textarea.displayName = 'Textarea';

export { Textarea };
