import { prisma } from '../../prisma/db';
import { getListingDetails } from '~/utils/airbnb-api/listing.server';
import bcrypt from 'bcrypt';
import { Listing } from '.prisma/client';
import { calculateDistance, calculateDistanceForListings } from '~/utils/map/distance.server';
import { EntityNotFoundException } from '~/exception/EntityNotFoundException';

interface ListingProps {
    balloonId: string;
    listingId: string;
}

export function requireResult<T>(result: T | null) {
    if (!result) {
        throw new Error('A result is required');
    }
    return result;
}

export async function createListing({ balloonId, listingId }: ListingProps) {
    const details = await getListingDetails(listingId);
    const balloon = await prisma.balloon.findUnique({ where: { id: balloonId } }).then((result) => {
        if (!result) {
            throw new EntityNotFoundException(' balloon');
        }
        return result;
    });
    const distance = await calculateDistance({
        startLat: balloon.lat,
        startLong: balloon.long,
        endLat: details.listing.lat,
        endLong: details.listing.lng,
    });

    return prisma.listing.upsert({
        where: {
            id: listingId,
        },
        create: {
            id: listingId,
            name: details.listing.name,
            thumbnailImageUrl: details.listing.xl_picture_url,
            locationName: `${details.listing.city} - ${details.listing.country}`,
            lat: details.listing.lat,
            long: details.listing.lng,
            balloonId: balloonId,
            roomType: details.listing.room_type,
            distance,
        },
        update: {},
    });
}

async function updateListing(listing: Listing) {}

export async function deleteListing(listingId: string) {
    return prisma.listing.delete({
        where: {
            id: listingId,
        },
    });
}
