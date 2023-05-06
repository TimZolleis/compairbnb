import type { DataFunctionArgs, V2_MetaFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import { requireUser } from '~/utils/auth/session.server';
import { Link, Outlet, useLoaderData } from '@remix-run/react';
import { NoItemsComponent } from '~/ui/components/error/NoItemsComponent';
import { BalloonIllustration } from '~/ui/illustrations/BalloonIllustration';
import { Balloon } from '.prisma/client';
import { ChevronUpIcon } from '~/ui/icons/ChevronUpIcon';
import { PageHeader } from '~/ui/components/common/PageHeader';
import { prisma } from '../../prisma/db';

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
                <NoItemsComponent
                    title={'You do not have any balloons'}
                    subtext={'To compare airbnbs, please put them in a balloon or use QuickCompare'}
                    ctaLink={'/balloons/add'}
                    ctaLinkName={'Create Balloon'}>
                    <BalloonIllustration className={'w-24'} />
                </NoItemsComponent>
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
                <BalloonDetailsComponent balloon={balloon} />
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

export const BalloonDetailBadge = ({ name, value }: { name: string; value: string }) => {
    return (
        <div className={'flex'}>
            <div
                className={
                    'rounded-full py-1 px-3 flex items-center gap-2 bg-white shadow-md border text-sm'
                }>
                <p className={'text-gray-600'}>{name}:</p>
                <p className={'font-medium'}>{value}</p>
            </div>
        </div>
    );
};
export const BalloonDetailsComponent = ({ balloon }: { balloon: Balloon }) => {
    const calculateNights = () => {
        const startDate = new Date(balloon.startDate);
        const endDate = new Date(balloon.endDate);
        const diff = endDate.getTime() - startDate.getTime();
        return Math.floor(diff / (1000 * 60 * 60 * 24));
    };
    return (
        <div className={'mt-2 flex items-center gap-2 flex-wrap'}>
            <BalloonDetailBadge name={'Guests'} value={balloon.guests.toString()} />
            <BalloonDetailBadge name={'Start date'} value={balloon.startDate.toString()} />
            <BalloonDetailBadge name={'End date'} value={balloon.endDate.toString()} />
            <BalloonDetailBadge name={'Nights'} value={calculateNights().toString()} />
            <BalloonDetailBadge name={'Starting location'} value={balloon.locationName} />
        </div>
    );
};
