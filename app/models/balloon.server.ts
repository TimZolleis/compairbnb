import { prisma } from '../../prisma/db';
import { Balloon } from '.prisma/client';
import bcrypt from 'bcrypt';

export async function getUserBalloons(userId: string) {
    return prisma.balloon.findMany({
        where: {
            ownerId: userId,
        },
    });
}

export async function createBalloon(
    userId: string,
    balloonName: string,
    guests: number,
    startDate: string,
    endDate: string
) {
    return prisma.balloon.create({
        data: {
            name: balloonName,
            ownerId: userId,
            guests,
            startDate,
            endDate,
        },
    });
}

export async function updateBalloon(
    balloonId: string,
    balloonName?: string,
    guests?: number,
    startDate?: string,
    endDate?: string
) {
    return prisma.balloon.update({
        where: {
            id: balloonId,
        },
        data: {
            name: balloonName,
            guests: guests,
            startDate: startDate,
            endDate: endDate,
        },
    });
}

export async function updateStartLocation({
    balloonId,
    locationLat,
    locationLong,
    locationName,
}: {
    balloonId: string;
    locationLat: number;
    locationLong: number;
    locationName: string;
}) {
    return prisma.balloon.update({
        where: {
            id: balloonId,
        },
        data: {
            startLocationLat: locationLat,
            startLocationLong: locationLong,
            startLocationName: locationName,
        },
    });
}

export async function findBalloon(
    balloonId: string,
    {
        requireOwnership,
        userId,
    }: {
        requireOwnership?: boolean;
        userId?: string;
    }
) {
    const balloon = await prisma.balloon.findUnique({
        where: {
            id: balloonId,
        },
    });
    if (requireOwnership && userId) {
        if (balloon?.ownerId !== userId) {
            throw new Error('The user does not have ownership of this balloon');
        }
    }
    return balloon;
}

export async function requireBalloon(
    balloonId: string,
    {
        requireOwnership,
        userId,
    }: {
        requireOwnership?: boolean;
        userId?: string;
    }
) {
    const balloon = await findBalloon(balloonId, { requireOwnership, userId });
    if (!balloon) {
        throw new Error('The requested balloon could not be found');
    }
    return balloon;
}

export async function createBalloonHash(balloon: Balloon) {
    const string = `${balloon.startLocationLong}-${balloon.startLocationLat}`;
    return await bcrypt.hash(string, 1);
}
