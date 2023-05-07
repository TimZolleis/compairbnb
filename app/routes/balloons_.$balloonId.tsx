import { DataFunctionArgs, defer } from '@remix-run/node';
import {
    Await,
    Form,
    isRouteErrorResponse,
    Link,
    Outlet,
    useLoaderData,
    useNavigation,
    useRouteError,
} from '@remix-run/react';
import { NoItemsComponent } from '~/ui/components/error/NoItemsComponent';
import { HouseIllustration } from '~/ui/illustrations/HouseIllustration';
import { deleteListing, requireResult } from '~/models/listing.server';
import { Balloon, Listing, Tag } from '.prisma/client';
import { BalloonDetailsComponent } from '~/routes/balloons';
import { PageHeader } from '~/ui/components/common/PageHeader';
import { CloseIcon } from '~/ui/icons/CloseIcon';
import { requireParameter } from '~/utils/form/formdata.server';
import { prisma } from '../../prisma/db';
import { getListing } from '~/utils/axios/api/listing.server';
import React, { Suspense } from 'react';
import { LoadingListingsComponentGrid } from '~/ui/components/loading/LoadingListingComponent';
import { LoadingSpinner } from '~/ui/components/loading/LoadingComponent';
import { buttonVariants } from '~/ui/components/import/button';
import { Badge } from '~/ui/components/common/Tag';
import { tagColors } from '~/routes/balloons_.$balloonId.listing.$listingId';
import { requireReadPermission, requireWritePermission } from '~/utils/auth/permission.server';
import { Container } from '~/ui/components/common/Container';
import { Card, CardHeader } from '~/ui/components/import/card';
import { ErrorComponent } from '~/ui/components/error/ErrorComponent';
import { Share } from 'lucide-react';

export const loader = async ({ request, params }: DataFunctionArgs) => {
    const balloonId = requireParameter('balloonId', params);
    const balloon = await prisma.balloon
        .findUnique({
            where: {
                id: balloonId,
            },
        })
        .then(requireResult<Balloon>);
    await requireReadPermission(request, { balloon });
    const listings = await prisma.listing.findMany({ where: { balloon }, include: { tags: true } });
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
    return defer({ length: listings.length, balloon, listingsWithDetails });
};

export const action = async ({ request, params }: DataFunctionArgs) => {
    const balloonId = requireParameter('balloonId', params);
    await requireWritePermission(request, { balloonId });
    const formData = await request.formData();
    const listingId = formData.get('deleteListing')?.toString();
    if (listingId) {
        await deleteListing(listingId);
    }
    return null;
};

const BalloonDetailsPage = () => {
    const { balloon, length, listingsWithDetails } = useLoaderData<typeof loader>();
    return (
        <>
            <span className={'flex items-center justify-between'}>
                <div className={'flex items-center gap-2'}>
                    <PageHeader>{balloon.name}</PageHeader>
                    <Link
                        to={'share'}
                        className={'bg-white rounded-full border border-gray-200 p-2'}>
                        <Share size={18}></Share>
                    </Link>
                </div>
                <span className={'flex items-center gap-2'}>
                    <Link to={'edit'} className={buttonVariants({ variant: 'secondary' })}>
                        Edit Balloon
                    </Link>
                    <Link to={'listing/add'} className={buttonVariants()}>
                        Add Listing
                    </Link>
                </span>
            </span>
            <BalloonDetailsComponent balloon={balloon} />
            <Suspense fallback={<LoadingListingsComponentGrid length={length} />}>
                <Await
                    resolve={listingsWithDetails}
                    errorElement={'An error occurred with suspense 1'}>
                    {(listings) =>
                        listings.length > 0 ? (
                            <div className={'mt-5 inline-flex gap-5 flex-wrap'}>
                                {listings.map((listing) => (
                                    <ListingComponent
                                        guests={balloon.guests}
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
    guests,
}: {
    listing: Listing & { tags: Tag[] };
    details: Awaited<ReturnType<typeof getListing>>;
    guests: number;
}) => {
    const navigation = useNavigation();
    return (
        <>
            <div className={'relative w-72 transition hover:scale-105 ease-in-out duration-200'}>
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
                <Link to={`listing/${listing.id}`}>
                    <img
                        alt={'listing-thumbnail'}
                        src={listing.thumbnailImageUrl}
                        className={'bg-gray-200 rounded-xl object-cover h-44 w-72'}
                    />
                    <div className={'mt-2'}>
                        <p
                            className={`text-xs ${
                                details.availability.isAvailableDuringRequestedTimeframe
                                    ? 'text-green-500'
                                    : 'text-red-500'
                            }`}>
                            {details.availability.isAvailableDuringRequestedTimeframe
                                ? 'Available'
                                : 'Not available'}
                        </p>
                        <p className={'font-medium'}>{listing.locationName}</p>
                    </div>
                    <span className={'flex gap-x-2 items-center'}>
                        <p className={'text-sm text-gray-600 truncate'}>{listing.name}</p>
                        <Badge>{listing.distance?.toFixed(2) || 0}km</Badge>
                    </span>
                    <div className={'mt-1 flex items-center gap-x-2'}>
                        <p className={'font-medium'}>{details.pricing.totalPrice}</p>
                        <p className={'text-gray-500 text-sm'}>
                            €{' '}
                            {(
                                parseFloat(details.pricing.totalPrice.replace(/[^0-9.-]+/g, '')) /
                                guests
                            )
                                .toFixed(2)
                                .toLocaleString()}
                            /person
                        </p>
                    </div>
                    {listing.tags.length > 0 && (
                        <div className={'flex items-center gap-x-2 mt-2'}>
                            {listing.tags.slice(0, 2).map((tag) => (
                                <Badge
                                    key={tag.id}
                                    style={{
                                        backgroundColor: tag.color,
                                    }}>
                                    <p
                                        style={{
                                            color: tagColors.find((c) => c.color === tag.color)
                                                ?.textColor,
                                        }}>
                                        {tag.value}
                                    </p>
                                </Badge>
                            ))}
                            {listing.tags.length > 2 && (
                                <p className={'text-sm text-gray-400'}>
                                    +{listing.tags.length - 2}
                                </p>
                            )}
                        </div>
                    )}
                </Link>
            </div>
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

export const ErrorBoundary = () => {
    const error = useRouteError();

    return (
        <>
            <ErrorComponent error={error} />
        </>
    );
};

export default BalloonDetailsPage;
