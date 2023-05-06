import { prisma } from '../../prisma/db';
import { Balloon } from '.prisma/client';
import bcrypt from 'bcrypt';
import { findLocationByCoordinates } from '~/utils/map/location.server';
import { getLocation } from 'jsonc-parser';

export type Optional<T, N extends keyof T> = Partial<Omit<T, N>> & Required<Pick<T, N>>;

interface FindBalloonConfig {
    require: boolean;
    requireOwnership: boolean;
    ownerId?: string;
    include?: {
        listings: boolean;
    };
}

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

export async function updateBalloon({
    balloonId,
    balloonName,
    guests,
    startDate,
    endDate,
    lat,
    long,
}: Optional<UpdateBalloonProps, 'balloonId'>) {
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

export async function deleteBalloon(id: string) {
    return prisma.balloon.delete({
        where: {
            id,
        },
    });
}
