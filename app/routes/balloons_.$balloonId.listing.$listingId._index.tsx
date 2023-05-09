import { Modal } from '~/ui/components/modal/Modal';
import { Await, Link, Outlet, useLoaderData, useNavigate } from '@remix-run/react';
import { DataFunctionArgs, defer } from '@remix-run/node';
import { requireParameter } from '~/utils/form/formdata.server';
import { getListing, getListingDetails } from '~/utils/axios/api/listing.server';
import { requireResult } from '~/models/listing.server';
import { Balloon, Listing, Tag } from '.prisma/client';
import React, { Suspense } from 'react';
import { Badge } from '~/ui/components/common/Tag';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '~/ui/components/import/card';
import { buttonVariants } from '~/ui/components/import/button';
import { ExternalLink } from 'lucide-react';
import { requireReadPermission, requireWritePermission } from '~/utils/auth/permission.server';
import { prisma } from '../../prisma/db';
import { ListingDetailsSkeleton } from '~/components/features/listing/ListingDetailsSkeleton';
import { ListingTags } from '~/components/features/listing/ListingTags';
import { ListingImageCarousel } from '~/components/features/listing/ListingImageCarousel';

type ListingWithTags = Listing & { tags: Tag[] };

export const loader = async ({ request, params }: DataFunctionArgs) => {
    const listingId = requireParameter('listingId', params);
    const balloonId = requireParameter('balloonId', params);
    const balloon = await prisma.balloon
        .findUnique({
            where: { id: balloonId },
        })
        .then(requireResult<Balloon>);
    await requireReadPermission(request, { balloon });
    const bookingDetails = getListing({
        guests: balloon.guests,
        checkIn: balloon.startDate,
        checkOut: balloon.endDate,
        listingId,
    });
    const listing = prisma.listing
        .findUnique({ where: { id: listingId }, include: { tags: true } })
        .then(requireResult<ListingWithTags>);
    const listingDetails = getListingDetails(listingId);

    const listingWithDetailsAndBookingDetailsPromise = Promise.all([
        listing,
        bookingDetails,
        listingDetails,
    ]);

    return defer({ balloon, listingWithDetailsAndBookingDetailsPromise });
};

export const action = async ({ request, params }: DataFunctionArgs) => {
    const formData = await request.formData();
    const balloonId = requireParameter('balloonId', params);
    await requireWritePermission(request, { balloonId });
    const listingId = requireParameter('listingId', params);
    const intent = formData.get('intent')?.toString();
    if (intent === 'addTag') {
        const tagValue = formData.get('tagValue')?.toString();
        const tagColor = formData.get('tagColor')?.toString();
        if (!tagValue || !tagColor) {
            return null;
        }
        await prisma.tag.create({
            data: {
                listingId,
                value: tagValue,
                color: tagColor,
            },
        });
    }
    if (intent === 'deleteTag') {
        const tagId = formData.get('tagId')?.toString();
        await prisma.tag.delete({
            where: {
                id: tagId,
            },
        });
    }

    return null;
};

const ListingDetailsComponent = () => {
    const navigate = useNavigate();
    const { balloon, listingWithDetailsAndBookingDetailsPromise } = useLoaderData<typeof loader>();

    return (
        <div className={'flex flex-col md:flex-row'}>
            <Suspense fallback={<ListingDetailsSkeleton />}>
                <Await resolve={listingWithDetailsAndBookingDetailsPromise}>
                    {([listing, bookingDetails, listingDetails]) => (
                        <>
                            <ListingImageCarousel listing={listing} details={listingDetails} />
                            <Card className={'border-none shadow-none'}>
                                <CardHeader>
                                    <Badge
                                        className={'self-start'}
                                        variant={
                                            bookingDetails.availability
                                                .isAvailableDuringRequestedTimeframe
                                                ? 'positive'
                                                : 'destructive'
                                        }>
                                        {bookingDetails.availability
                                            .isAvailableDuringRequestedTimeframe
                                            ? 'Available'
                                            : 'Not available'}
                                    </Badge>
                                    <CardTitle>{listing.name}</CardTitle>
                                    <div className={'space-x-2 flex items-center'}>
                                        <CardDescription>{listing.locationName}</CardDescription>
                                        <Badge variant={'outline'}>
                                            {listing.distance?.toFixed(2)}km
                                        </Badge>
                                    </div>
                                    <p className={'font-bold text-2xl'}>
                                        {bookingDetails.pricing.totalPrice}
                                    </p>
                                    <div className={'flex gap-x-2'}>
                                        <Link
                                            target={'_blank'}
                                            to={`https://airbnb.com/rooms/${listing.id}`}
                                            className={buttonVariants({
                                                size: 'sm',
                                            })}>
                                            <span className={'gap-2 flex items-center'}>
                                                <ExternalLink size={14}></ExternalLink>
                                                Airbnb
                                            </span>
                                        </Link>
                                        <Link
                                            target={'_blank'}
                                            to={`https://www.google.com/maps/dir/?api=1&origin=${balloon.locationName}&destination=${listing.lat},${listing.long}&travelmode=driving`}
                                            className={buttonVariants({
                                                variant: 'secondary',
                                                size: 'sm',
                                            })}>
                                            <span className={'gap-2 flex items-center'}>
                                                <ExternalLink size={14}></ExternalLink>
                                                Google Maps
                                            </span>
                                        </Link>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <ListingTags tags={listing.tags} />
                                </CardContent>
                            </Card>
                        </>
                    )}
                </Await>
            </Suspense>
        </div>
    );
};

export default ListingDetailsComponent;
