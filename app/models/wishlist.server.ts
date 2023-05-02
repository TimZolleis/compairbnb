import { prisma } from '../../prisma/db';

export async function createWishlist(userId: string, wishlistName: string, participants: number) {
    return prisma.wishList.create({
        data: {
            name: wishlistName,
            ownerId: userId,
            participants,
        },
    });
}
