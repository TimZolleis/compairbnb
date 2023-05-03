import { DataFunctionArgs, json, redirect } from '@remix-run/node';
import { requireUser } from '~/utils/auth/session.server';
import { findBalloon } from '~/models/balloon.server';
import { Link, Outlet, useLoaderData } from '@remix-run/react';
import { NoItemsComponent } from '~/ui/components/error/NoItemsComponent';
import { HouseIllustration } from '~/ui/illustrations/HouseIllustration';
import { findListings } from '~/models/listing.server';
import { Listing } from '.prisma/client';

export const loader = async ({ request, params }: DataFunctionArgs) => {
    const user = await requireUser(request);
    const balloonId = params.balloonId;
    if (!balloonId) {
        throw redirect('/');
    }
    const balloon = await findBalloon(balloonId, { requireOwnership: true, userId: user.id });
    if (!balloon) {
        throw redirect('/');
    }
    const listings = await findListings(balloonId);
    return json({ balloon, user, listings });
};

const BalloonDetailsPage = () => {
    const { balloon, user, listings } = useLoaderData<typeof loader>();
    const calculateNights = () => {
        const startDate = new Date(balloon.startDate);
        const endDate = new Date(balloon.endDate);
        const diff = endDate.getTime() - startDate.getTime();
        return Math.floor(diff / (1000 * 60 * 60 * 24));
    };

    return (
        <>
            <span className={'flex items-center justify-between'}>
                <h2 className={'font-semibold text-rose-500 text-headline-medium'}>
                    {balloon.name}
                </h2>
                <span className={'flex items-center gap-2'}>
                    <Link
                        to={'edit'}
                        className={
                            'rounded-md border border-rose-500 py-2 px-5 font-medium text-rose-500'
                        }>
                        Edit Balloon
                    </Link>
                    <Link
                        to={'listing/add'}
                        className={
                            'rounded-md shadow-md bg-rose-500 py-2 px-5 font-medium text-white shadow-rose-500/30'
                        }>
                        Add Listing
                    </Link>
                </span>
            </span>
            <div className={'mt-2 flex items-center gap-2'}>
                <BalloonDetailBadge name={'Guests'} value={balloon.participants.toString()} />
                <BalloonDetailBadge name={'Start date'} value={balloon.startDate.toString()} />
                <BalloonDetailBadge name={'End date'} value={balloon.endDate.toString()} />
                <BalloonDetailBadge name={'Nights'} value={calculateNights().toString()} />
            </div>
            {listings.length > 0 ? (
                <ListingsComponent listings={listings} />
            ) : (
                <NoItemsComponent
                    title={'There are no listings in this balloon'}
                    subtext={'Add listings to this balloon by pasting valid AirBNB links'}>
                    <HouseIllustration className={'w-40'} />
                </NoItemsComponent>
            )}
            <Outlet />
        </>
    );
};

const ListingsComponent = ({ listings }: { listings: Listing[] }) => {
    return <p>Listings here</p>;
};

const BalloonDetailBadge = ({ name, value }: { name: string; value: string }) => {
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

export default BalloonDetailsPage;
