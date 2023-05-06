import { DataFunctionArgs, defer, json } from '@remix-run/node';
import { requireUser } from '~/utils/auth/session.server';
import {
    Await,
    Form,
    Link,
    Outlet,
    useLoaderData,
    useNavigation,
    useSubmit,
} from '@remix-run/react';
import { NoItemsComponent } from '~/ui/components/error/NoItemsComponent';
import { HouseIllustration } from '~/ui/illustrations/HouseIllustration';
import { deleteListing } from '~/models/listing.server';
import { Listing } from '.prisma/client';
import { BalloonDetailsComponent } from '~/routes/balloons';
import { PageHeader } from '~/ui/components/common/PageHeader';
import { CloseIcon } from '~/ui/icons/CloseIcon';
import { requireParameter } from '~/utils/form/formdata.server';
import { prisma } from '../../prisma/db';
import { EntityNotFoundException } from '~/exception/EntityNotFoundException';
import { getListing, getListingPrice } from '~/utils/axios/api/listing.server';
import { Suspense, useEffect } from 'react';
import {
    LoadingListingComponent,
    LoadingListingsComponentGrid,
} from '~/ui/components/loading/LoadingListingComponent';
import { Tag } from '~/ui/components/common/Tag';
import { LoadingComponent, LoadingSpinner } from '~/ui/components/loading/LoadingComponent';

export const loader = async ({ request, params }: DataFunctionArgs) => {
    const user = await requireUser(request);
    const balloonId = requireParameter('balloonId', params);
    const balloon = await prisma.balloon
        .findUnique({
            where: {
                id_ownerId: {
                    ownerId: user.id,
                    id: balloonId,
                },
            },
        })
        .then((balloon) => {
            if (!balloon) {
                throw new EntityNotFoundException('balloon');
            }
            return balloon;
        });
    const listings = await prisma.listing.findMany({ where: { balloon } });
    const listingsWithDetails = Promise.all(
        listings.map(async (listing) => {
            const details = await getListing({
                guests: balloon.guests,
                checkIn: balloon.startDate,
                checkOut: balloon.endDate,
                listingId: listing.id,
            });
            return { listing, details };
        })
    );
    return defer({ balloon, user, listingsWithDetails });
};

export const action = async ({ request }: DataFunctionArgs) => {
    const formData = await request.formData();
    const listingId = formData.get('deleteListing')?.toString();
    if (listingId) {
        await deleteListing(listingId);
    }
    return null;
};

const BalloonDetailsPage = () => {
    const { balloon, user, listingsWithDetails } = useLoaderData<typeof loader>();
    return (
        <>
            <span className={'flex items-center justify-between'}>
                <PageHeader>{balloon.name}</PageHeader>
                <span className={'flex items-center gap-2'}>
                    <Link
                        to={'edit'}
                        className={
                            'rounded-full border border-rose-500 bg-white py-2 px-5 font-medium text-rose-500'
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
            <Suspense fallback={<LoadingListingsComponentGrid />}>
                <Await resolve={listingsWithDetails}>
                    {(listings) =>
                        listings.length > 0 ? (
                            <div className={'mt-5 inline-flex gap-5 flex-wrap'}>
                                {listings.map((listing) => (
                                    <ListingComponent
                                        details={listing.details}
                                        listing={listing.listing}
                                        key={listing.listing.id}
                                    />
                                ))}
                            </div>
                        ) : (
                            <NoItemsComponent
                                title={'There are no listings in this balloon'}
                                subtext={
                                    'Add listings to this balloon by pasting valid AirBNB links'
                                }>
                                <HouseIllustration className={'w-40'} />
                            </NoItemsComponent>
                        )
                    }
                </Await>
            </Suspense>
            <Outlet />
        </>
    );
};

const ListingComponent = ({
    listing,
    details,
}: {
    listing: Listing;
    details: Awaited<ReturnType<typeof getListing>>;
}) => {
    const link = `https://airbnb.com/rooms/${listing.id}`;
    const navigation = useNavigation();

    return (
        <>
            <Link
                target={'_blank'}
                to={link}
                className={'relative w-72 transition hover:scale-105 ease-in-out duration-200'}>
                {navigation.formData?.get('deleteListing') === listing.id && (
                    <RemovingLinkAnimation />
                )}
                <Form
                    name={'hello'}
                    method={'post'}
                    className={'absolute right-0 bg-white rounded-full p-2 m-2'}>
                    <button
                        className={'flex items-center'}
                        name={'deleteListing'}
                        value={listing.id}>
                        <CloseIcon onClick={() => void 0}></CloseIcon>
                    </button>
                </Form>
                <img
                    alt={'listing-thumbnail'}
                    src={listing.thumbnailImageUrl}
                    className={'bg-gray-200 rounded-xl object-cover h-44 w-72'}
                />
                <p className={'mt-2 font-medium'}>{listing.name}</p>
                <span className={'flex items-center gap-2'}>
                    <p className={'text-sm text-gray-600'}>{listing.locationName}</p>
                    <Tag
                        color={
                            details.availability.isAvailableDuringRequestedTimeframe
                                ? 'green'
                                : 'red'
                        }>
                        {details.availability.isAvailableDuringRequestedTimeframe
                            ? 'Available'
                            : 'Not available'}
                    </Tag>
                </span>
                <div className={'mt-1'}>
                    <Tag color={'amber'} text={'sm'}>
                        {details.pricing.totalPrice}
                    </Tag>
                </div>
            </Link>
        </>
    );
};

const RemovingLinkAnimation = () => {
    return (
        <div
            className={
                'absolute w-72 h-44 backdrop-blur-xl bg-white/15 rounded-xl flex items-center justify-center'
            }>
            <LoadingSpinner color={'stroke-white'} />
        </div>
    );
};

export default BalloonDetailsPage;
