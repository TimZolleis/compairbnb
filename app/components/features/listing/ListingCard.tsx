import { Tag, Listing } from '.prisma/client';
import { getListing } from '~/utils/airbnb-api/listing.server';
import { Form, Link, useNavigation, useSearchParams } from '@remix-run/react';
import { CloseIcon } from '~/components/icons/CloseIcon';
import { tagColors } from '~/components/features/listing/ListingTags';
import React from 'react';
import { LoadingSpinner } from '~/components/features/loading/LoadingSpinner';
import { Badge } from '~/components/ui/Badge';

export const ListingCard = ({
    listing,
    details,
    guests,
}: {
    listing: Listing & { tags: Tag[] };
    details: Awaited<ReturnType<typeof getListing>>;
    guests: number;
}) => {
    const navigation = useNavigation();
    const [searchParams] = useSearchParams();

    return (
        <div
            className={
                'relative w-full md:w-72 transition hover:scale-105 ease-in-out duration-200 min-w-0'
            }>
            {navigation.formData?.get('deleteListing') === listing.id && <RemoveAnimation />}
            <Form
                name={'hello'}
                method={'post'}
                className={'absolute right-0 bg-white rounded-full p-2 m-2'}>
                <button className={'flex items-center'} name={'deleteListing'} value={listing.id}>
                    <CloseIcon onClick={() => void 0}></CloseIcon>
                </button>
            </Form>
            <Link to={{ pathname: `listing/${listing.id}`, search: searchParams.toString() }}>
                <img
                    alt={'listing-thumbnail'}
                    src={listing.thumbnailImageUrl}
                    className={'bg-gray-200 rounded-xl object-cover h-44 w-full md:w-72'}
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
                <div className={'flex gap-x-2 items-center max-w-full'}>
                    <div className={'text-sm text-gray-600 min-w-0 truncate'}>{listing.name}</div>
                    <Badge>{listing.distance?.toFixed(2) || 0}km</Badge>
                </div>
                <Badge variant={'secondary'}>{listing.roomType}</Badge>
                <div className={'mt-1 flex items-center gap-x-2'}>
                    <p className={'font-medium'}>{details.pricing.totalPrice}</p>
                    <p className={'text-gray-500 text-sm'}>
                        €{' '}
                        {(parseFloat(details.pricing.totalPrice.replace(/[^0-9.-]+/g, '')) / guests)
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
                            <p className={'text-sm text-gray-400'}>+{listing.tags.length - 2}</p>
                        )}
                    </div>
                )}
            </Link>
        </div>
    );
};
const RemoveAnimation = () => {
    return (
        <div
            className={
                'absolute w-72 h-44 backdrop-blur-xl bg-white/15 rounded-xl flex items-center justify-center'
            }>
            <LoadingSpinner color={'stroke-white'} />
        </div>
    );
};
