import { prisma } from '../../prisma/db';
import { getListingDetails } from '~/utils/axios/api/listing.server';
import bcrypt from 'bcrypt';
import { Listing } from '.prisma/client';

interface ListingProps {
    balloonId: string;
    listingId: string;
}

export async function createListing({ balloonId, listingId }: ListingProps) {
    const details = await getListingDetails(listingId);
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
