import { useNavigate } from '@remix-run/react';
import { DataFunctionArgs, LinksFunction, redirect } from '@remix-run/node';
import { requireUser } from '~/utils/auth/session.server';
import { requireFormDataValue } from '~/utils/form/formdata.server';
import { createBalloon } from '~/models/balloon.server';
import { Modal } from '~/components/ui/Modal';
import { BalloonForm } from '~/components/features/balloon/input/BalloonForm';

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

export default NewBalloonPage;
