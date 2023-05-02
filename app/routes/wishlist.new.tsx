import { Form, Link } from '@remix-run/react';
import { TextInput } from '~/ui/components/form/TextInput';
import { DataFunctionArgs, redirect } from '@remix-run/node';
import { requireUser } from '~/utils/auth/session.server';
import { requireFormDataValue } from '~/utils/form/formdata.server';
import { createWishlist } from '~/models/wishlist.server';
import { useState } from 'react';

export const action = async ({ request }: DataFunctionArgs) => {
    const user = await requireUser(request);
    const formData = await request.formData();
    const wishlistName = requireFormDataValue('wishlistName', formData);
    const participants = parseInt(requireFormDataValue('participants', formData));
    const wishList = await createWishlist(user.id, wishlistName, participants);
    return redirect(`/wishlists/${wishList.id}`);
};
const CreateWishlistPage = () => {
    return (
        <main className={'w-full flex flex-col items-center gap-2 mt-10'}>
            <h1 className={'font-semibold text-rose-500 text-2xl'}>Create new wishlist</h1>

            <Form className={'max-w-xl mx-auto w-full'} method={'post'}>
                <div className={'grid gap-2'}>
                    <span className={'flex items-center gap-2'}>
                        <TextInput
                            required={true}
                            placeholder={'List name'}
                            name={'wishlistName'}
                        />
                    </span>
                    <button
                        className={'rounded-md bg-rose-500 py-2 px-5 text-white font-medium mt-2'}>
                        Create wishlist
                    </button>
                </div>
            </Form>
        </main>
    );
};

const ParticipantsCounter = () => {
    const [count, setCount] = useState(0);

    return <div></div>;
};

export default CreateWishlistPage;
