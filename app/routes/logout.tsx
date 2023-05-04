import { DataFunctionArgs, redirect } from '@remix-run/node';
import { unsetUser } from '~/utils/auth/session.server';

export const loader = async ({ request }: DataFunctionArgs) => {
    return redirect('/', {
        headers: {
            'Set-Cookie': await unsetUser(request),
        },
    });
};
