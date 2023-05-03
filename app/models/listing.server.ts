import { prisma } from '../../prisma/db';

export async function addListingToBalloon(
    balloonId: string,
    listingId: string,
    listingName?: string
) {
    return prisma.listing.upsert({
        where: {
            id: listingId,
        },
        create: {
            id: listingId,
            customName: listingName,
            balloonId: balloonId,
        },
        update: {
            customName: listingName,
            balloonId: balloonId,
        },
    });
}

export async function findListings(balloonId: string) {
    return prisma.listing.findMany({ where: { balloonId: balloonId } });
}
