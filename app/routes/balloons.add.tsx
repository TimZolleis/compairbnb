import { Form, Link, useNavigate, useNavigation } from '@remix-run/react';
import { TextInput } from '~/ui/components/form/TextInput';
import { DataFunctionArgs, LinksFunction, redirect } from '@remix-run/node';
import { requireUser } from '~/utils/auth/session.server';
import { requireFormDataValue } from '~/utils/form/formdata.server';
import { createBalloon } from '~/models/balloon.server';
import { useEffect, useState } from 'react';
import { Modal, useModal } from '~/ui/components/modal/Modal';
import { PlusIcon } from '~/ui/icons/PlusIcon';
import { MinusIcon } from '~/ui/icons/MinusIcon';
import { Balloon } from '.prisma/client';
import { LatLng } from 'leaflet';
import { MapComponent } from '~/ui/components/map/MapComponent';
import { LoadingSpinner } from '~/ui/components/loading/LoadingComponent';

export const links: LinksFunction = () => [
    {
        rel: 'stylesheet',
        href: 'https://unpkg.com/leaflet@1.8.0/dist/leaflet.css',
    },
];

export const action = async ({ request }: DataFunctionArgs) => {
    const user = await requireUser(request);
    const formData = await request.formData();
    const balloonName = requireFormDataValue('balloonName', formData);
    const guests = parseInt(requireFormDataValue('guests', formData));
    const startDate = requireFormDataValue('startDate', formData);
    const endDate = requireFormDataValue('endDate', formData);
    const lat = parseFloat(requireFormDataValue('lat', formData));
    const long = parseFloat(requireFormDataValue('long', formData));
    const balloon = await createBalloon({
        userId: user.id,
        balloonName,
        guests,
        startDate,
        endDate,
        lat,
        long,
    });
    return redirect(`/balloons/${balloon.id}`);
};
const NewBalloonPage = () => {
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
//TODO: Integrate map pick with start location
export const BalloonForm = ({ balloon }: { balloon?: Balloon }) => {
    const navigation = useNavigation();
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
                    <p className={'text-gray-600 font-medium'}>Starting location</p>
                    <p className={'text-sm text-gray-400 px-10'}>
                        The starting location is used for distance calculation
                    </p>
                </span>
                <BalloonMapComponent height={200}></BalloonMapComponent>
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
                <button
                    className={
                        'rounded-md bg-rose-500 py-2 px-5 text-white font-medium mt-2 flex justify-center'
                    }>
                    {navigation.state === 'idle' ? (
                        'Save'
                    ) : (
                        <LoadingSpinner size={'medium'} color={'stroke-white'} />
                    )}
                </button>
            </div>
        </Form>
    );
};

const BalloonMapComponent = ({
    height,
    lat,
    long,
}: {
    height: number;
    lat?: number;
    long?: number;
}) => {
    const [position, setPosition] = useState<{ lat: number; long: number }>({
        long: long || 0,
        lat: lat || 0,
    });

    const updateMarkerPosition = (markerPosition: LatLng) => {
        setPosition({ lat: markerPosition.lat, long: markerPosition.lng });
    };
    const checkPosition = () => {
        navigator.geolocation.getCurrentPosition((position) => {
            setPosition({ lat: position.coords.latitude, long: position.coords.longitude });
        });
    };
    useEffect(() => {
        if (!lat && !long) {
            checkPosition();
        }
    }, []);
    return (
        <div className={'flex-1 max-w-xl rounded-md'}>
            <input type='hidden' name={'lat'} value={position.lat} />
            <input type='hidden' name={'long'} value={position.long} />
            <MapComponent
                rounded={'xl'}
                setPosition={updateMarkerPosition}
                long={position.long}
                lat={position.lat}
                height={height}></MapComponent>
        </div>
    );
};

export default NewBalloonPage;
