import { Form, useNavigate, useNavigation } from '@remix-run/react';
import { TextInput } from '~/ui/components/form/TextInput';
import { DataFunctionArgs, LinksFunction, redirect } from '@remix-run/node';
import { requireUser } from '~/utils/auth/session.server';
import { requireFormDataValue } from '~/utils/form/formdata.server';
import { createBalloon } from '~/models/balloon.server';
import { useEffect, useState } from 'react';
import { Modal, useModal } from '~/ui/components/modal/Modal';
import { Balloon } from '.prisma/client';
import { LatLng } from 'leaflet';
import { MapComponent } from '~/ui/components/map/MapComponent';
import { LoadingSpinner } from '~/ui/components/loading/LoadingComponent';
import { Loader2, Minus, Plus, Users2 } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { Button } from '~/ui/components/import/button';

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
    const [count, setCount] = useState(startingValue ? startingValue : 1);

    const reduceCount = () => {
        if (count >= 2) {
            setCount(count - 1);
        }
    };
    const increaseCount = () => {
        setCount(count + 1);
    };

    return (
        <div className='flex items-center space-x-4 rounded-md border p-4 justify-between select-none'>
            <div className={'flex items-center space-x-4'}>
                <Users2 />
                <div className='flex-1 space-y-1'>
                    <p className='text-sm font-medium leading-none'>Guests</p>
                    <p className='text-sm text-muted-foreground'>Select a number</p>
                </div>
            </div>
            <div className={'flex items-center space-x-4'}>
                <span
                    className={'rounded-full p-1 border-gray-200 border hover:cursor-pointer'}
                    onClick={reduceCount}>
                    <Minus size={20}></Minus>
                </span>
                <motion.p
                    key={count}
                    className={'font-medium text-lg'}
                    initial={{ scale: 1.2 }}
                    animate={{ scale: 1 }}>
                    {count}
                </motion.p>
                <input type='hidden' value={count} name={'guests'} />
                <span
                    className={'rounded-full p-1 border-gray-200 border hover:cursor-pointer'}
                    onClick={increaseCount}>
                    <Plus size={20}></Plus>
                </span>
            </div>
        </div>
    );
};
export const BalloonForm = ({ balloon }: { balloon?: Balloon }) => {
    const navigation = useNavigation();
    const navigate = useNavigate();
    return (
        <Form method={'post'}>
            <div className={'space-y-2'}>
                <TextInput
                    required={true}
                    placeholder={'Balloon name'}
                    name={'balloonName'}
                    defaultValue={balloon?.name}
                />

                <ParticipantsCounter startingValue={balloon?.guests} />
                <p className='text-sm font-medium leading-none'>Starting location</p>
                <BalloonMapComponent height={200}></BalloonMapComponent>
                <p className='text-sm font-medium leading-none'>Travel dates</p>
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
                <span className={'flex justify-end gap-2'}>
                    <Button type={'button'} onClick={() => navigate(-1)} variant={'ghost'}>
                        Cancel
                    </Button>
                    <Button disabled={navigation.state === 'submitting'}>
                        {navigation.state === 'submitting' ? (
                            <>
                                <p>Saving...</p>
                                <Loader2 className={'h-4 w-4 animate-spin'}></Loader2>
                            </>
                        ) : (
                            <p>Save</p>
                        )}
                    </Button>
                </span>
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
