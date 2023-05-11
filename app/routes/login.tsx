import { DataFunctionArgs, json, redirect } from '@remix-run/node';
import { Form, Link, useActionData } from '@remix-run/react';
import { Input } from '~/components/ui/Input';
import { requireFormDataValue } from '~/utils/form/formdata.server';
import { loginUser } from '~/utils/auth/user.server';
import { setUser } from '~/utils/auth/session.server';

export const loader = async ({ request, params }: DataFunctionArgs) => {
    return null;
};

export const action = async ({ request, params }: DataFunctionArgs) => {
    try {
        const formData = await request.formData();
        const username = requireFormDataValue('username', formData);
        const password = requireFormDataValue('password', formData);
        const user = await loginUser(username, password);
        return redirect('/', {
            headers: {
                'Set-Cookie': await setUser(request, user),
            },
        });
    } catch (e) {
        if (e instanceof Error) {
            return json({ error: e.message });
        }
        return json({ error: 'An unknown error occured' });
    }
};

const LoginPage = () => {
    const data = useActionData<typeof action>();

    return (
        <main className={'w-full flex flex-col items-center gap-2 mt-10'}>
            <h1 className={'font-semibold text-rose-500 text-2xl'}>Login</h1>
            <div
                className={
                    'bg-white/30 p-12 shadow-xl ring-1 ring-gray-900/5 rounded-lg backdrop-blur-lg max-w-xl mx-auto w-full'
                }>
                <Form method={'post'}>
                    <div className={'grid gap-2'}>
                        <Input required={true} placeholder={'Username'} name={'username'} />
                        <Input
                            required={true}
                            placeholder={'Password'}
                            type={'password'}
                            name={'password'}
                        />
                        {data?.error ? (
                            <p className={'text-center py-2 text-sm text-red-500'}>{data.error}</p>
                        ) : null}
                        <button
                            className={
                                'rounded-md bg-rose-500 py-2 px-5 text-white font-medium mt-2'
                            }>
                            Login
                        </button>
                        <Link to={'/register'} className={'text-center'}>
                            <p className={'text-rose-500 font-medium'}>
                                Dont have an account? Register here
                            </p>
                        </Link>
                    </div>
                </Form>
            </div>
        </main>
    );
};

export default LoginPage;
