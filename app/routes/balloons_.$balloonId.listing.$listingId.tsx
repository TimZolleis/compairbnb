import { LoadingListingComponent } from '~/ui/components/loading/LoadingListingComponent';
import { Modal } from '~/ui/components/modal/Modal';
import { Await, Link, useLoaderData, useNavigate } from '@remix-run/react';
import { DataFunctionArgs, defer, json } from '@remix-run/node';
import { requireParameter } from '~/utils/form/formdata.server';
import { prisma } from '../../prisma/db';
import { requireUser } from '~/utils/auth/session.server';
import { getListing } from '~/utils/axios/api/listing.server';
import { requireResult } from '~/models/listing.server';
import { Balloon, Listing } from '.prisma/client';
import { Tag } from '~/ui/components/common/Tag';
import { PlusIcon } from '~/ui/icons/PlusIcon';
import { log } from '@remix-run/dev/dist/logging';
import { Suspense } from 'react';

export const loader = async ({ request, params }: DataFunctionArgs) => {
    const user = await requireUser(request);
    const listingId = requireParameter('listingId', params);
    const balloonId = requireParameter('balloonId', params);
    const balloon = await prisma.balloon
        .findUnique({
            where: { id_ownerId: { id: balloonId, ownerId: user.id } },
        })
        .then(requireResult<Balloon>);

    const details = getListing({
        guests: balloon.guests,
        checkIn: balloon.startDate,
        checkOut: balloon.endDate,
        listingId,
    });
    const listing = prisma.listing
        .findUnique({ where: { id: listingId } })
        .then(requireResult<Listing>);

    return defer({ details, listing, balloon });
};

//TODO: Add functionality for adding tags

const ListingDetailsComponent = () => {
    const navigate = useNavigate();
    const { details, listing, balloon } = useLoaderData<typeof loader>();

    return (
        <Modal width={'4xl'} showModal={true} toggleModal={() => navigate(-1)}>
            <div className={'flex gap-5'}>
                <Suspense
                    fallback={
                        <div className={'flex gap-5'}>
                            <div className={'bg-gray-200 w-96 h-64 rounded-xl animate-pulse'}></div>
                            <LoadingListingDetailsComponent />
                        </div>
                    }>
                    <Await resolve={listing}>
                        {(listingResult) => (
                            <>
                                <img
                                    className={'w-96 h-64 rounded-xl object-cover'}
                                    src={listingResult.thumbnailImageUrl}
                                    alt=''
                                />
                                <Suspense fallback={<LoadingListingDetailsComponent />}>
                                    <Await resolve={details}>
                                        {(detailsResult) => (
                                            <div className={'text-left'}>
                                                <p
                                                    className={
                                                        detailsResult.availability
                                                            .isAvailableDuringRequestedTimeframe
                                                            ? 'text-green-500'
                                                            : 'text-red-500'
                                                    }>
                                                    {detailsResult.availability
                                                        .isAvailableDuringRequestedTimeframe
                                                        ? 'Available'
                                                        : 'Not available'}
                                                </p>
                                                <p className={'text-gray-600 font-medium text-xl'}>
                                                    {listingResult.name}
                                                </p>
                                                <span className={'flex items-center gap-x-2 mt-1'}>
                                                    <p className={'text-gray-400'}>
                                                        {listingResult.locationName}
                                                    </p>
                                                    <Tag
                                                        rounding={'medium'}
                                                        text={'sm'}
                                                        color={'pink'}>
                                                        {listingResult.distance?.toFixed(2)}km
                                                    </Tag>
                                                </span>
                                                <p className={'font-medium text-xl'}>
                                                    {detailsResult.pricing.totalPrice}
                                                </p>
                                                <div className={'mt-3 flex gap-x-2'}>
                                                    <Link
                                                        to={`https://airbnb.com/rooms/${listingResult.id}`}
                                                        className={
                                                            'rounded-md px-3 py-2 bg-rose-500 text-white text-sm'
                                                        }>
                                                        View on airbnb
                                                    </Link>
                                                    <Link
                                                        target={'_blank'}
                                                        to={`https://www.google.com/maps/dir/?api=1&origin=${balloon.locationName}&destination=${listingResult.lat},${listingResult.long}&travelmode=driving`}
                                                        className={
                                                            'rounded-md px-3 py-2 bg-amber-500 text-white text-sm'
                                                        }>
                                                        View on Google Maps
                                                    </Link>
                                                </div>
                                                <div className={'mt-2'}>
                                                    <span
                                                        className={
                                                            'flex items-center gap-3 rounded-md hover:cursor-pointer'
                                                        }>
                                                        <p className={'font-medium text-gray-600'}>
                                                            Tags
                                                        </p>
                                                        <button
                                                            className={
                                                                'text-xs border border-rose-500 text-rose-500 rounded-full px-3 py-1'
                                                            }>
                                                            Add
                                                        </button>
                                                    </span>
                                                </div>
                                            </div>
                                        )}
                                    </Await>
                                </Suspense>
                            </>
                        )}
                    </Await>
                </Suspense>
            </div>
        </Modal>
    );
};

const LoadingListingDetailsComponent = () => {
    return (
        <div className={'space-y-2'}>
            <div className={'bg-gray-200 w-40 rounded-full h-4 animate-pulse'}></div>
            <div className={'bg-gray-200 w-96 rounded-full h-6 animate-pulse'}></div>
            <span className={'flex gap-2 w-96'}>
                <div className={'bg-gray-200 w-full rounded-full h-6 animate-pulse'}></div>
                <div className={'bg-gray-200 w-full rounded-full h-6 animate-pulse'}></div>
            </span>
            <div className={'bg-gray-200 w-24 rounded-full h-6 animate-pulse'}></div>
            <span className={'flex items-center gap-3'}>
                <div className={'rounded-md h-10 w-40 bg-gray-200 animate-pulse'}></div>
                <div className={'rounded-md h-10 0 w-40 bg-gray-200 animate-pulse'}></div>
            </span>
            <div className={'bg-gray-200 w-20 rounded-full h-6 animate-pulse'}></div>
        </div>
    );
};

export default ListingDetailsComponent;
