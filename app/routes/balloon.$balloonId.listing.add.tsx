import { BalloonForm } from '~/routes/balloon.new';
import { Modal, useModal } from '~/ui/components/modal/Modal';
import { Form, useNavigate, useNavigation } from '@remix-run/react';
import { TextInput } from '~/ui/components/form/TextInput';
import { DataFunctionArgs, redirect } from '@remix-run/node';
import { requireUser } from '~/utils/auth/session.server';
import { requireFormDataValue, requireParameter } from '~/utils/form/formdata.server';
import { LoadingComponent } from '~/ui/components/loading/LoadingComponent';
import { addListingToBalloon } from '~/models/listing.server';
import { useState } from 'react';
import { Toggle } from '~/ui/components/form/Toggle';
import { updateBalloon } from '~/models/balloon.server';

function parseAirbnbLink(link: string) {
    const url = new URL(link);
    const listingId = url.pathname.match(/\d+$/);
    if (!listingId) {
        throw new Error('Error parsing given link');
    }
    return { listingId: listingId[0], searchParams: url.searchParams };
}

//TODO: Fix funky UI (framer motion stretching stuff)
export const action = async ({ request, params }: DataFunctionArgs) => {
    const user = await requireUser(request);
    const balloonId = requireParameter('balloonId', params);
    const formData = await request.formData();
    const airbnbLink = requireFormDataValue('airbnbLink', formData);
    const shouldUpdateBalloon = formData.get('updateBalloon');
    if (shouldUpdateBalloon && shouldUpdateBalloon === 'true') {
        const guestValue = formData.get('guests')?.toString();
        const guests = guestValue ? parseInt(guestValue.toString()) : undefined;
        const checkIn = formData.get('checkIn')?.toString();
        const checkOut = formData.get('checkOut')?.toString();
        await updateBalloon(balloonId, undefined, guests, checkIn, checkOut);
    }
    const { listingId, searchParams } = parseAirbnbLink(airbnbLink);
    const listing = await addListingToBalloon(balloonId, listingId);
    return redirect(`/balloon/${balloonId}`);
};

const AddListingToBalloonPage = () => {
    const [guests, setGuests] = useState<string | undefined>(undefined);
    const [checkIn, setCheckIn] = useState<string | undefined>(undefined);
    const [checkOut, setCheckOut] = useState<string | undefined>(undefined);
    const navigate = useNavigate();
    const toggleModal = () => {
        navigate(-1);
    };
    const navigation = useNavigation();
    const checkLink = (link: string) => {
        try {
            const { searchParams } = parseAirbnbLink(link);
            const guests = searchParams.get('adults') || undefined;
            const checkIn = searchParams.get('check_in') || undefined;
            const checkOut = searchParams.get('check_out') || undefined;
            setGuests(guests);
            setCheckIn(checkIn);
            setCheckOut(checkOut);
        } catch (e) {
            setGuests(undefined);
            setCheckIn(undefined);
            setCheckOut(undefined);
        }
    };

    return (
        <Modal showModal={true} toggleModal={toggleModal}>
            <main className={'w-full flex flex-col items-center gap-2 mt-10'}>
                {navigation.state === 'idle' ? (
                    <>
                        <h1 className={'font-semibold text-rose-500 text-2xl'}>Add listing</h1>
                        <Form method={'POST'} className={'w-full'}>
                            <span className={'leading-none w-full flex justify-start py-2'}>
                                <p className={'text-gray-600 font-medium'}>AirBNB Link</p>
                            </span>
                            <TextInput
                                onChange={(event) => checkLink(event.target.value)}
                                name={'airbnbLink'}
                                placeholder={'https://airbnb.com/listings/123456'}></TextInput>
                            <span className={'leading-none w-full flex justify-start py-2'}>
                                <p className={'text-gray-600 font-medium'}>
                                    Custom listing name (optional)
                                </p>
                            </span>
                            <TextInput name={'listingName'} placeholder={'Fancy beach house'} />
                            <div>
                                {guests ? (
                                    <>
                                        <span
                                            className={
                                                'leading-none w-full flex justify-start py-2'
                                            }>
                                            <p className={'text-gray-600 font-medium'}>Guests</p>
                                        </span>
                                        <TextInput
                                            name={'guests'}
                                            defaultValue={guests}></TextInput>
                                    </>
                                ) : null}
                                {checkIn ? (
                                    <>
                                        <span
                                            className={
                                                'leading-none w-full flex justify-start py-2'
                                            }>
                                            <p className={'text-gray-600 font-medium'}>
                                                Check in Date
                                            </p>
                                        </span>
                                        <TextInput
                                            name={'guests'}
                                            defaultValue={checkIn}></TextInput>
                                    </>
                                ) : null}
                                {checkOut ? (
                                    <>
                                        <span
                                            className={
                                                'leading-none w-full flex justify-start py-2'
                                            }>
                                            <p className={'text-gray-600 font-medium'}>
                                                Check out date
                                            </p>
                                        </span>
                                        <TextInput
                                            name={'checkOut'}
                                            defaultValue={checkOut}></TextInput>
                                    </>
                                ) : null}
                            </div>

                            {guests || checkIn || checkOut ? (
                                <>
                                    <Label
                                        text={
                                            'Update balloon with detected values (guest number, dates)'
                                        }
                                    />
                                    <Toggle name={'updateBalloon'}></Toggle>
                                </>
                            ) : null}
                            <button
                                className={
                                    'w-full mt-5 rounded-md shadow-md bg-rose-500 py-2 px-5 font-medium text-white shadow-rose-500/30'
                                }>
                                Find listing
                            </button>
                        </Form>
                    </>
                ) : (
                    <LoadingComponent loadingTitle={'Adding your listing...'} />
                )}
            </main>
        </Modal>
    );
};

const Label = ({ text }: { text: string }) => {
    return (
        <span className={'leading-none w-full flex justify-start py-2'}>
            <p className={'text-gray-600 font-medium'}>{text}</p>
        </span>
    );
};

export default AddListingToBalloonPage;
