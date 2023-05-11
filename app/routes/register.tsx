import { Form, Link } from '@remix-run/react';
import { Input } from '~/components/ui/Input';
import { DataFunctionArgs, json, redirect } from '@remix-run/node';
import { requireFormDataValue } from '~/utils/form/formdata.server';
import { createUser } from '~/utils/auth/user.server';
import { setUser } from '~/utils/auth/session.server';

export const loader = async ({ request, params }: DataFunctionArgs) => {
    return null;
};

export const action = async ({ request, params }: DataFunctionArgs) => {
    try {
        const formData = await request.formData();
        const username = requireFormDataValue('username', formData);
        const email = requireFormDataValue('email', formData);
        const password = requireFormDataValue('password', formData);
        const confirmPassword = requireFormDataValue('password', formData);
        if (!(password === confirmPassword)) {
            throw new Error('The passwords do not match!');
        }
        const user = await createUser({ name: username, email, password });
        return redirect('/', {
            headers: {
                'Set-Cookie': await setUser(request, user),
            },
        });
    } catch (e) {
        if (e instanceof Error) {
            return json({ error: e.message });
        }
        return json({ error: 'Unknown error' });
    }
};
const RegistrationPage = () => {
    return (
        <main className={'w-full flex flex-col items-center gap-2 mt-10'}>
            <h1 className={'font-semibold text-rose-500 text-2xl'}>Sign up</h1>
            <div
                className={
                    'bg-white/30 p-12 shadow-xl ring-1 ring-gray-900/5 rounded-lg backdrop-blur-lg max-w-xl mx-auto w-full'
                }>
                <Form method={'post'}>
                    <div className={'grid gap-2'}>
                        <Input required={true} placeholder={'Name'} name={'username'} />
                        <Input required={true} placeholder={'Email'} name={'email'} />
                        <Input
                            required={true}
                            placeholder={'Password'}
                            type={'password'}
                            name={'password'}
                        />
                        <Input
                            required={true}
                            placeholder={'Confirm password'}
                            type={'password'}
                            name={'confirmPassword'}
                        />
                        <button
                            className={
                                'rounded-md bg-rose-500 py-2 px-5 text-white font-medium mt-2'
                            }>
                            Sign up now
                        </button>
                        <Link to={'/login'} className={'text-center'}>
                            <p className={'text-rose-500 font-medium'}>
                                Already have an account? Log in here
                            </p>
                        </Link>
                    </div>
                </Form>
            </div>
        </main>
    );
};
export default RegistrationPage;
