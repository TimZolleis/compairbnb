import { DataFunctionArgs, json } from '@remix-run/node';
import { requireParameter } from '~/utils/form/formdata.server';
import { prisma } from '../../prisma/db';
import { calculateDistanceForListings } from '~/utils/map/distance.server';

export const loader = async ({ request, params }: DataFunctionArgs) => {
    const balloonId = requireParameter('balloonId', params);
    const balloon = await prisma.balloon.findUnique({ where: { id: balloonId } }).then((r) => {
        if (!r) {
            throw new Error('Error');
        }
        return r;
    });
    const listings = await prisma.listing.findMany({
        where: {
            balloonId,
        },
    });
    const data = await calculateDistanceForListings({
        startLat: balloon.lat,
        startLong: balloon.long,
        listings,
    });
    for (const entry of data) {
        await prisma.listing.update({
            where: {
                id: entry?.listing?.id,
            },
            data: {
                distance: entry.distance,
            },
        });
    }
    return json({ message: 'Works!', data });
};
