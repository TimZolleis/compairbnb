import { prisma } from '../../prisma/db';
import { Balloon } from '.prisma/client';
import bcrypt from 'bcrypt';
import { findLocationByCoordinates } from '~/utils/map/location.server';
import { getLocation } from 'jsonc-parser';
import { calculateDistanceForListings } from '~/utils/map/distance.server';
import { requireResult } from '~/models/listing.server';

export type Optional<T, N extends keyof T> = Partial<Omit<T, N>> & Required<Pick<T, N>>;

interface BalloonProps {
    userId: string;
    balloonName: string;
    guests: number;
    startDate: string;
    endDate: string;
    lat: number;
    long: number;
}

export async function createBalloon({
    userId,
    balloonName,
    guests,
    startDate,
    endDate,
    lat,
    long,
}: BalloonProps) {
    const location = await findLocationByCoordinates({ lat, long });
    const city = location.data.resourceSets[0]?.resources[0]?.address?.locality;
    return prisma.balloon.create({
        data: {
            name: balloonName,
            ownerId: userId,
            guests,
            startDate,
            endDate,
            lat,
            long,
            locationName: city || 'UNKNOWN',
        },
    });
}

interface UpdateBalloonProps extends BalloonProps {
    balloonId: string;
}

async function hasPositionChanged({
    lat,
    long,
    balloonId,
}: {
    lat: number;
    long: number;
    balloonId: string;
}) {
    const balloon = await prisma.balloon
        .findUnique({ where: { id: balloonId } })
        .then((result) => requireResult<Balloon>(result));
    return balloon.lat !== lat && balloon.long !== long;
}

export async function updateBalloon({
    balloonId,
    balloonName,
    guests,
    startDate,
    endDate,
    lat,
    long,
}: Optional<UpdateBalloonProps, 'balloonId'>) {
    if (lat && long) {
        const hasChanged = await hasPositionChanged({ lat, long, balloonId });
        if (hasChanged) {
            const listings = await prisma.listing.findMany({ where: { balloonId } });
            const distances = await calculateDistanceForListings({
                startLat: lat,
                startLong: long,
                listings,
            });
            for (const entry of distances) {
                if (entry.listing) {
                    await prisma.listing.update({
                        where: {
                            id: entry.listing.id,
                        },
                        data: {
                            distance: entry.distance,
                        },
                    });
                }
            }
        }
    }
    return prisma.balloon.update({
        where: {
            id: balloonId,
        },
        data: {
            name: balloonName,
            guests: guests,
            startDate: startDate,
            endDate: endDate,
            lat,
            long,
            locationName:
                lat && long
                    ? await findLocationByCoordinates({
                          lat,
                          long,
                      }).then((r) => r.data.resourceSets[0]?.resources[0]?.address?.locality)
                    : undefined,
        },
    });
}
