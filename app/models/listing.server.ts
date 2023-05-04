import { prisma } from '../../prisma/db';
import { getListingDetails } from '~/utils/axios/api/listing.server';
import { createBalloonHash, findBalloon, requireBalloon } from '~/models/balloon.server';
import bcrypt from 'bcrypt';
import { Listing } from '.prisma/client';

export async function addListingToBalloon(
    balloonId: string,
    listingId: string,
    listingName?: string
) {
    const listingDetails = await getListingDetails(listingId);
    const balloon = await requireBalloon(balloonId, { requireOwnership: false });
    const hash = await createBalloonHash(balloon);
    return prisma.listing.upsert({
        where: {
            id: listingId,
        },
        create: {
            id: listingId,
            customName: listingName,
            thumbnailImageUrl: listingDetails.listing.medium_url,
            locationName: `${listingDetails.listing.city} - ${listingDetails.listing.country}`,
            name: listingDetails.listing.name,
            lat: listingDetails.listing.lat,
            long: listingDetails.listing.lng,
            balloonId: balloonId,
        },
        update: {
            customName: listingName,
            balloonId: balloonId,
        },
    });
}

async function updateListing(listing: Listing) {}

export async function removeListingFromBalloon(listingId: string) {
    return prisma.listing.delete({
        where: {
            id: listingId,
        },
    });
}

export async function findListings(balloonId: string) {
    const listings = await prisma.listing.findMany({ where: { balloonId: balloonId } });
    const balloon = await findBalloon(balloonId, { requireOwnership: false });
    if (!balloon) {
        return listings;
    }

    return listings;
}
