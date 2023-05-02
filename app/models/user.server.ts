import { prisma } from '../../prisma/db';

export async function getWishlists(userId: string) {
    return prisma.wishList.findMany({
        where: {
            ownerId: userId,
        },
    });
}
