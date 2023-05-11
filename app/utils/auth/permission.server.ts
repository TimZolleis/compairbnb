import { commitLoginSession, getLoginSession, getUser } from '~/utils/auth/session.server';
import { Balloon } from '.prisma/client';
import { prisma } from '../../../prisma/db';

class InsufficientPermissionException extends Error {
    constructor() {
        super(`You have insufficient permissions to perform this action`);
    }
}

export async function checkPermissions(request: Request) {
    const session = await getLoginSession(request);
    const readPermissions = session.get('readPermissions') as string[] | undefined;
    const writePermissions = session.get('writePermissions') as string[] | undefined;
    return { readPermissions, writePermissions };
}

export async function assignPermission(
    request: Request,
    balloonId: string,
    type: 'READ' | 'WRITE'
) {
    const permissions = await checkPermissions(request);
    const session = await getLoginSession(request);
    if (type === 'READ') {
        const newPermissions = [...new Set([...(permissions.readPermissions ?? []), balloonId])];
        session.set('readPermissions', newPermissions);
    }
    if (type === 'WRITE') {
        const newPermissions = [...new Set([...(permissions.writePermissions ?? []), balloonId])];
        session.set('writePermissions', newPermissions);
    }
    return commitLoginSession(session);
}

function hasPermission(permissions: string[] | undefined, id: string | undefined) {
    const has = !!permissions?.find((permission) => permission === id);

    return !!permissions?.find((permission) => permission === id);
}

function isOwner(balloon: Balloon | null | undefined, userId: string | undefined) {
    return balloon?.ownerId === userId;
}

export async function requireReadPermission(
    request: Request,
    { balloon, balloonId }: { balloon?: Balloon | null; balloonId?: string }
) {
    const { readPermissions, writePermissions } = await checkPermissions(request);
    const user = await getUser(request);
    //Check if the user has permissions or owns the balloon
    if (
        hasPermission(readPermissions, balloonId ?? balloon?.id) ||
        hasPermission(writePermissions, balloonId ?? balloon?.id) ||
        (balloon && isOwner(balloon, user?.id))
    ) {
        return true;
    }
    if (!balloonId) {
        throw new InsufficientPermissionException();
    }
    const foundBalloon = await prisma.balloon.findUnique({ where: { id: balloonId } });
    if (isOwner(foundBalloon, user?.id)) {
        return true;
    }
    throw new InsufficientPermissionException();
}

export async function requireWritePermission(
    request: Request,
    { balloon, balloonId }: { balloon?: Balloon | null; balloonId?: string }
) {
    const { writePermissions } = await checkPermissions(request);
    const user = await getUser(request);
    //Check if the user has permissions or owns the balloon
    if (hasPermission(writePermissions, balloonId) || (balloon && isOwner(balloon, user?.id))) {
        return true;
    }
    if (!balloonId) {
        throw new Error('Please provide a balloon to check permissions');
    }
    const foundBalloon = await prisma.balloon.findUnique({ where: { id: balloonId } });
    if (isOwner(foundBalloon, user?.id)) {
        return true;
    }
    throw new InsufficientPermissionException();
}

export async function requireOwnership({
    balloon,
    balloonId,
    userId,
}: {
    balloon?: Balloon | null;
    balloonId?: string;
    userId: string;
}) {
    if (balloon && isOwner(balloon, userId)) {
        return true;
    }
    const foundBalloon = await prisma.balloon.findUnique({ where: { id: balloonId } });
    if (isOwner(foundBalloon, userId)) {
        return true;
    }
    throw new InsufficientPermissionException();
}
