import { prisma } from '../../prisma/db';

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
    participants: number,
    startDate: string,
    endDate: string
) {
    return prisma.balloon.create({
        data: {
            name: balloonName,
            ownerId: userId,
            participants,
            startDate,
            endDate,
        },
    });
}

export async function updateBalloon(
    balloonId: string,
    balloonName?: string,
    participants?: number,
    startDate?: string,
    endDate?: string
) {
    return prisma.balloon.update({
        where: {
            id: balloonId,
        },
        data: {
            name: balloonName,
            participants: participants,
            startDate: startDate,
            endDate: endDate,
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
