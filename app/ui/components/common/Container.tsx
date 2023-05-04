import { ReactNode } from 'react';
import { cva } from 'class-variance-authority';

const container = cva(
    'bg-white/30 p-12 shadow-xl ring-1 ring-gray-900/5 rounded-lg backdrop-blur-lg mx-auto w-full mt-5',
    {
        variants: {
            width: {
                default: 'max-w-xl',
                large: 'max-w-2xl',
            },
        },
    }
);

export const Container = ({ children, className }: { children: ReactNode; className: string }) => {
    return (
        <section
            className={`bg-white/30 p-12 shadow-xl ring-1 ring-gray-900/5 rounded-lg backdrop-blur-lg max-w-xl mx-auto w-full mt-5 ${className}`}>
            {children}
        </section>
    );
};
