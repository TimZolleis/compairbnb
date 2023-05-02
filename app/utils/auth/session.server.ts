import type { Session } from '@remix-run/node';
import { createCookieSessionStorage, redirect } from '@remix-run/node';
import * as process from 'process';
import type { User } from '.prisma/client';

if (!process.env.APPLICATION_SECRET) {
    throw new Error('ENV: APPLICATION SECRET MISSING');
}

const { getSession, commitSession, destroySession } = createCookieSessionStorage({
    cookie: {
        name: 'compairbnb-session',
        path: '/',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 30, //30 day login
        secrets: [process.env.APPLICATION_SECRET],
    },
});

export async function getLoginSession(request: Request) {
    return await getSession(request.headers.get('Cookie'));
}

export async function commitLoginSession(session: Session) {
    return await commitSession(session);
}

export async function requireUser(request: Request) {
    const user = await getUser(request);
    if (!user) {
        throw redirect('/login');
    }
    return user;
}

export async function getUser(request: Request) {
    const session = await getLoginSession(request);
    return session.get('user') as User | undefined;
}

export async function setUser(request: Request, user: User) {
    const session = await getLoginSession(request);
    session.set('user', user);
    return commitLoginSession(session);
}

export async function unsetUser(request: Request) {
    const session = await getLoginSession(request);
    return destroySession(session);
}
