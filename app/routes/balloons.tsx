import type { DataFunctionArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import { requireUser } from '~/utils/auth/session.server';
import { Link, Outlet, useLoaderData } from '@remix-run/react';
import { NoItems } from '~/components/features/error/NoItems';
import { BalloonIllustration } from '~/components/illustrations/BalloonIllustration';
import { Balloon } from '.prisma/client';
import { ChevronUpIcon } from '~/components/icons/ChevronUpIcon';
import { PageHeader } from '~/components/ui/PageHeader';
import { prisma } from '../../prisma/db';
import { BalloonSettings } from '~/components/features/balloon/BalloonSettings';

export const loader = async ({ request }: DataFunctionArgs) => {
    const user = await requireUser(request);
    const balloons = await prisma.balloon.findMany({ where: { ownerId: user.id } });
    return json({ balloons });
};

export default function BalloonPage() {
    const { balloons } = useLoaderData<typeof loader>();
    return (
        <>
            <PageHeader>My Balloons</PageHeader>
            {balloons.length > 0 ? (
                <div className={'flex flex-wrap'}>
                    {balloons.map((balloon) => (
                        <BalloonComponent key={balloon.id} balloon={balloon} />
                    ))}
                </div>
            ) : (
                <NoItems
                    title={'You do not have any balloons'}
                    subtext={'To compare airbnbs, please put them in a balloon or use QuickCompare'}
                    ctaLink={'/balloons/add'}
                    ctaLinkName={'Create Balloon'}>
                    <BalloonIllustration className={'w-24'} />
                </NoItems>
            )}
            <Outlet />
        </>
    );
}

const BalloonComponent = ({ balloon }: { balloon: Balloon }) => {
    return (
        <div
            className={
                'shadow-xl flex items-center ring-1 ring-gray-900/5 rounded-md p-5 backdrop-blur-lg mt-2 max-w-sm transition ease-in-out hover:scale-105 duration-300'
            }>
            <span>
                <p className={'font-medium'}>{balloon.name}</p>
                <BalloonSettings balloon={balloon} />
            </span>
            <Link
                to={balloon.id}
                className={
                    'rounded-full ring-1 ring-gray-600/10 p-2 hover:bg-gray-100 hover:scale-105'
                }>
                <ChevronUpIcon direction={'right'} size={'sm'}></ChevronUpIcon>
            </Link>
        </div>
    );
};
