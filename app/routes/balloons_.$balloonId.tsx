import { DataFunctionArgs, defer } from '@remix-run/node';
import {
    Await,
    Link,
    Outlet,
    useLoaderData,
    useRouteError,
    useSearchParams,
} from '@remix-run/react';
import { NoItems } from '~/components/features/error/NoItems';
import { HouseIllustration } from '~/components/illustrations/HouseIllustration';
import { deleteListing, requireResult } from '~/models/listing.server';
import { Balloon, Listing, Tag } from '.prisma/client';
import { PageHeader } from '~/components/ui/PageHeader';
import { requireParameter } from '~/utils/form/formdata.server';
import { prisma } from '../../prisma/db';
import { getListing } from '~/utils/airbnb-api/listing.server';
import React, { Suspense } from 'react';
import { ListingSkeletonGrid } from '~/components/features/listing/ListingSkeleton';
import { buttonVariants } from '~/components/ui/Button';
import { requireReadPermission, requireWritePermission } from '~/utils/auth/permission.server';
import { Share } from 'lucide-react';
import { ListingCard } from '~/components/features/listing/ListingCard';
import { BalloonSettings } from '~/components/features/balloon/BalloonSettings';
import { Sorting } from '~/components/features/balloon/Sorting';
import { ErrorContainer } from '~/components/features/error/ErrorContainer';

type ListingWithDetails = {
    listing: Listing & { tags: Tag[] };
    details: Awaited<ReturnType<typeof getListing>>;
};

function getPrice(price: string) {
    return parseFloat(price.replace(/[^0-9.-]+/g, ''));
}

function sortListings(listings: ListingWithDetails[], sorting: string) {
    const sortNumberAscending = (a: number | null, b: number | null) => {
        if (!a || !b || a === b) {
            return 0;
        }
        return a - b;
    };
    const sortNameAscending = (a: string, b: string) => {
        return a.localeCompare(b);
    };

    return listings.sort((a, b) => {
        if (sorting === 'distance') {
            return sortNumberAscending(a.listing?.distance, b.listing?.distance);
        }
        if (sorting === 'price') {
            return sortNumberAscending(
                getPrice(a.details.pricing.totalPrice),
                getPrice(b.details.pricing.totalPrice)
            );
        }
        if (sorting === 'locationName') {
            return sortNameAscending(a.listing.locationName, b.listing.locationName);
        }
        return 0;
    });
}

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
    const sort = new URL(request.url).searchParams.get('sort') ?? '';
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
    ).then((listings) => sortListings(listings, sort));
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
    const [searchParams] = useSearchParams();
    return (
        <>
            <span className={'flex flex-wrap items-center justify-between'}>
                <div className={'flex items-center gap-2'}>
                    <PageHeader>{balloon.name}</PageHeader>
                    <Link
                        to={'share'}
                        className={'bg-white rounded-full border border-gray-200 p-2'}>
                        <Share size={18}></Share>
                    </Link>
                </div>
                <span className={'flex items-center gap-2'}>
                    <Link
                        to={{ pathname: 'edit', search: searchParams.toString() }}
                        className={buttonVariants({ variant: 'secondary' })}>
                        Edit
                    </Link>
                    <Link
                        to={{ pathname: 'listing/add', search: searchParams.toString() }}
                        className={buttonVariants()}>
                        Add
                    </Link>
                </span>
            </span>
            <div className={'flex items-center gap-2 flex-wrap pt-2'}>
                <BalloonSettings balloon={balloon} />
                <Sorting />
            </div>
            <Suspense fallback={<ListingSkeletonGrid length={length} />}>
                <Await
                    resolve={listingsWithDetails}
                    errorElement={'An error occurred with suspense 1'}>
                    {(listings) =>
                        listings.length > 0 ? (
                            <div className={'mt-5 flex gap-5 flex-wrap'}>
                                {listings.map((listing) => (
                                    <ListingCard
                                        guests={balloon.guests}
                                        details={listing.details}
                                        listing={listing.listing}
                                        key={listing.listing.id}
                                    />
                                ))}
                            </div>
                        ) : (
                            <NoItems
                                title={'There are no listings in this balloon'}
                                subtext={
                                    'Add listings to this balloon by pasting valid AirBNB links'
                                }>
                                <HouseIllustration className={'w-40'} />
                            </NoItems>
                        )
                    }
                </Await>
            </Suspense>
            <Outlet />
        </>
    );
};

export const ErrorBoundary = () => {
    const error = useRouteError();
    return (
        <>
            <ErrorContainer error={error} />
        </>
    );
};

export default BalloonDetailsPage;
