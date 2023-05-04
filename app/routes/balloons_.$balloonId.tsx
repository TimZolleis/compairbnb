import { DataFunctionArgs, json, redirect } from '@remix-run/node';
import { requireUser } from '~/utils/auth/session.server';
import { findBalloon, requireBalloon } from '~/models/balloon.server';
import { Form, Link, Outlet, useLoaderData } from '@remix-run/react';
import { NoItemsComponent } from '~/ui/components/error/NoItemsComponent';
import { HouseIllustration } from '~/ui/illustrations/HouseIllustration';
import { findListings, removeListingFromBalloon } from '~/models/listing.server';
import { Listing } from '.prisma/client';
import { BalloonDetailsComponent } from '~/routes/balloons';
import { PageHeader } from '~/ui/components/common/PageHeader';
import { CloseIcon } from '~/ui/icons/CloseIcon';
import { requireParameter } from '~/utils/form/formdata.server';

export const loader = async ({ request, params }: DataFunctionArgs) => {
    const user = await requireUser(request);
    const balloonId = requireParameter('balloonId', params);
    const balloon = await requireBalloon(balloonId, { requireOwnership: true, userId: user.id });
    const listings = await findListings(balloonId);
    return json({ balloon, user, listings });
};

export const action = async ({ request }: DataFunctionArgs) => {
    const formData = await request.formData();
    const listingId = formData.get('deleteListing')?.toString();
    if (listingId) {
        await removeListingFromBalloon(listingId);
    }
    return null;
};

const BalloonDetailsPage = () => {
    const { balloon, user, listings } = useLoaderData<typeof loader>();
    return (
        <>
            <span className={'flex items-center justify-between'}>
                <PageHeader>{balloon.name}</PageHeader>
                <span className={'flex items-center gap-2'}>
                    <Link
                        to={'edit'}
                        className={
                            'rounded-full border border-rose-500 py-2 px-5 font-medium text-rose-500'
                        }>
                        Edit Balloon
                    </Link>
                    <Link
                        to={'listing/add'}
                        className={
                            'rounded-full shadow-md bg-rose-500 py-2 px-5 font-medium text-white shadow-rose-500/30'
                        }>
                        Add Listing
                    </Link>
                </span>
            </span>
            <BalloonDetailsComponent balloon={balloon} />
            {listings.length > 0 ? (
                <div className={'mt-5 inline-flex gap-5 flex-wrap'}>
                    {listings.map((listing) => (
                        <ListingComponent listing={listing} key={listing.id} />
                    ))}
                </div>
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

const ListingComponent = ({ listing }: { listing: Listing }) => {
    const link = `https://airbnb.com/rooms/${listing.id}`;
    return (
        <Link
            target={'_blank'}
            to={link}
            className={'relative w-72 transition hover:scale-105 ease-in-out duration-200'}>
            <Form method={'post'} className={'absolute right-0 bg-white rounded-full p-2 m-2'}>
                <button className={'flex items-center'} name={'deleteListing'} value={listing.id}>
                    <CloseIcon onClick={() => void 0}></CloseIcon>
                </button>
            </Form>
            <img
                alt={'listing-thumbnail'}
                src={listing.thumbnailImageUrl}
                className={'bg-red-500 rounded-xl object-cover h-44 w-72'}
            />
            <p className={'mt-2 font-medium'}>{listing.name}</p>
            <p className={'text-sm text-gray-600'}>{listing.locationName}</p>
        </Link>
    );
};

export default BalloonDetailsPage;
