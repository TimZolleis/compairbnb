import {
    Links,
    LiveReload,
    Meta,
    Outlet,
    Scripts,
    ScrollRestoration,
    useLoaderData,
} from '@remix-run/react';

import stylesheet from '~/tailwind.css';
import type { DataFunctionArgs, LinksFunction } from '@remix-run/node';
import { AppLayout } from '~/ui/Layout/AppLayout';
import { getUser } from '~/utils/auth/session.server';
import { json } from '@remix-run/node';

export const links: LinksFunction = () => [{ rel: 'stylesheet', href: stylesheet }];

export const loader = async ({ request }: DataFunctionArgs) => {
    const user = await getUser(request);
    console.log('User', user);
    return json({ user });
};
export default function App() {
    const { user } = useLoaderData<typeof loader>();
    return (
        <html lang='en'>
            <head>
                <meta charSet='utf-8' />
                <meta name='viewport' content='width=device-width,initial-scale=1' />
                <Meta />
                <Links />
            </head>
            <body>
                <AppLayout user={user}>
                    <Outlet />
                    <ScrollRestoration />
                    <Scripts />
                    <LiveReload />
                </AppLayout>
            </body>
        </html>
    );
}
