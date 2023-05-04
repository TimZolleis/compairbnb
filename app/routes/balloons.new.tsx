import { Form, Link, useNavigate } from '@remix-run/react';
import { TextInput } from '~/ui/components/form/TextInput';
import { DataFunctionArgs, redirect } from '@remix-run/node';
import { requireUser } from '~/utils/auth/session.server';
import { requireFormDataValue } from '~/utils/form/formdata.server';
import { createBalloon } from '~/models/balloon.server';
import { useState } from 'react';
import { Modal, useModal } from '~/ui/components/modal/Modal';
import { PlusIcon } from '~/ui/icons/PlusIcon';
import { MinusIcon } from '~/ui/icons/MinusIcon';
import { Balloon } from '.prisma/client';
import { MapComponent } from '~/ui/components/map/MapComponent';

export const action = async ({ request }: DataFunctionArgs) => {
    const user = await requireUser(request);
    const formData = await request.formData();
    const wishlistName = requireFormDataValue('balloonName', formData);
    const guests = parseInt(requireFormDataValue('guests', formData));
    const startDate = requireFormDataValue('startDate', formData);
    const endDate = requireFormDataValue('endDate', formData);
    const balloon = await createBalloon(user.id, wishlistName, guests, startDate, endDate);
    return redirect(`/balloons/${balloon.id}`);
};
const CreateWishlistPage = () => {
    const { showModal } = useModal(true);
    const navigate = useNavigate();
    const toggleModal = () => {
        navigate('/');
    };

    return (
        <Modal showModal={true} toggleModal={toggleModal}>
            <main className={'w-full flex flex-col items-center gap-2 mt-10'}>
                <h1 className={'font-semibold text-rose-500 text-2xl'}>Create new Balloon</h1>
                <BalloonForm />
            </main>
        </Modal>
    );
};

const ParticipantsCounter = ({ startingValue }: { startingValue?: number }) => {
    const [count, setCount] = useState(startingValue ? startingValue : 0);

    const reduceCount = () => {
        if (count >= 2) {
            setCount(count - 1);
        }
    };
    const increaseCount = () => {
        setCount(count + 1);
    };

    return (
        <div className={'rounded-full bg-white px-5 py-2 border flex items-center justify-center'}>
            <div className={'flex items-center gap-3'}>
                <span
                    className={
                        'rounded-full p-1 border border-gray-300 flex justify-center items-center'
                    }>
                    <MinusIcon size={'sm'} hover={'pointer'} onClick={reduceCount} />
                </span>

                <p className={'font-semibold text-gray-600 text-xl pointer-events-none'}>{count}</p>
                <input type={'hidden'} name={'guests'} value={count} />
                <span
                    className={
                        'rounded-full p-1 border border-gray-300 flex justify-center items-center'
                    }>
                    <PlusIcon onClick={increaseCount} size={'sm'} hover={'pointer'} />
                </span>
            </div>
        </div>
    );
};

export const BalloonForm = ({ balloon }: { balloon?: Balloon }) => {
    return (
        <Form className={'w-full'} method={'post'}>
            <div className={'grid gap-2'}>
                <TextInput
                    required={true}
                    placeholder={'Balloon name'}
                    name={'balloonName'}
                    defaultValue={balloon?.name}
                />
                <span className={'leading-none'}>
                    <p className={'text-gray-600 font-medium'}>Guests</p>
                </span>
                <ParticipantsCounter startingValue={balloon?.guests} />
                <span className={'leading-none'}>
                    <p className={'text-gray-600 font-medium'}>Destination</p>
                    <p className={'text-sm text-gray-400 px-10'}>
                        The destination is used for distance calculation
                    </p>
                </span>
                <MapComponent />
                <span className={'leading-none'}>
                    <p className={'text-gray-600 font-medium'}>Travel dates</p>
                    <p className={'text-sm text-gray-400 px-10'}>
                        Please enter the dates in the format "yyyy-mm-dd"
                    </p>
                </span>
                <span className={'grid md:grid-cols-2 gap-2'}>
                    <TextInput
                        name={'startDate'}
                        required={true}
                        placeholder={'2023-01-10'}
                        defaultValue={balloon?.startDate}
                    />
                    <TextInput
                        name={'endDate'}
                        required={true}
                        placeholder={'2023-01-19'}
                        defaultValue={balloon?.endDate}
                    />
                </span>
                <button className={'rounded-md bg-rose-500 py-2 px-5 text-white font-medium mt-2'}>
                    Save
                </button>
            </div>
        </Form>
    );
};

export default CreateWishlistPage;
