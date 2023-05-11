import { Link } from '@remix-run/react';
import { ReactNode } from 'react';
import { Container } from '~/components/ui/Container';

export const NoItems = ({
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
        <Container className={'text-center '}>
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
        </Container>
    );
};
