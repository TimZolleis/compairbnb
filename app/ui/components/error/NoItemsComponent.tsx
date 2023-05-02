import { Link } from '@remix-run/react';

export const NoItemsComponent = ({
    title,
    subtext,
    ctaLink,
    ctaLinkName,
}: {
    title: string;
    subtext: string;
    ctaLink?: string;
    ctaLinkName?: string;
}) => {
    return (
        <section
            className={
                'text-center rounded-md w-full px-5 py-10 border border-rose-500 bg-white/30 shadow-xl ring-1 ring-gray-900/5 backdrop-blur-lg max-w-xl mx-auto'
            }>
            <p className={'text-title-medium font-semibold'}>{title}</p>
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
