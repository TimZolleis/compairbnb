import { Link } from '@remix-run/react';
import { ReactNode } from 'react';

export const NoItemsComponent = ({
    title,
    subtext,
    ctaLink,
    ctaLinkName,
    children,
}: {
    title: string;
    subtext: string;
    ctaLink?: string;
    ctaLinkName?: string;
    children?: ReactNode;
}) => {
    return (
        <section
            className={
                'text-center rounded-md w-full mt-10 px-5 py-10 border border-rose-500 bg-white/30 shadow-xl ring-1 ring-gray-900/5 backdrop-blur-lg max-w-xl mx-auto'
            }>
            <div className={'flex justify-center'}>{children}</div>
            <p className={'text-title-medium font-semibold mt-4'}>{title}</p>
            <p className={'text-sm '}>{subtext}</p>
            <div className={'mt-5'}>
                {ctaLink ? (
                    <Link
                        className={'rounded-md text-white bg-rose-500 px-3 py-2 shadow-xl'}
                        to={ctaLink}>
                        {ctaLinkName}
                    </Link>
                ) : null}
            </div>
        </section>
    );
};
