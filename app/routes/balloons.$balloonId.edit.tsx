import { DataFunctionArgs, json, LinksFunction, redirect } from '@remix-run/node';
import { requireUser } from '~/utils/auth/session.server';
import { useLoaderData, useNavigate } from '@remix-run/react';
import { Modal, useModal } from '~/ui/components/modal/Modal';
import { requireParameter } from '~/utils/form/formdata.server';
import { updateBalloon } from '~/models/balloon.server';
import { prisma } from '../../prisma/db';
import { BalloonForm } from '~/routes/balloons.add';

export const loader = async ({ request, params }: DataFunctionArgs) => {
    const user = await requireUser(request);
    const balloonId = requireParameter('balloonId', params);
    const balloon = await prisma.balloon.findUnique({
        where: {
            id_ownerId: {
                id: balloonId,
                ownerId: user.id,
            },
        },
    });
    if (!balloon) {
        throw new Error('The requested balloon could not be found');
    }
    return json({ balloon, user });
};
export const links: LinksFunction = () => [
    {
        rel: 'stylesheet',
        href: 'https://unpkg.com/leaflet@1.8.0/dist/leaflet.css',
    },
];

export function getOptionalBalloonFormValues(formData: FormData) {
    const balloonName = formData.get('balloonName')?.toString();
    const guests = parseInt(formData.get('guests')?.toString() ?? '') || undefined;
    const startDate = formData.get('startDate')?.toString();
    const endDate = formData.get('endDate')?.toString();
    const lat = parseFloat(formData.get('lat')?.toString() ?? '') || undefined;
    const long = parseFloat(formData.get('long')?.toString() ?? '') || undefined;
    return { balloonName, guests, startDate, endDate, lat, long };
}

export const action = async ({ request, params }: DataFunctionArgs) => {
    const formData = await request.formData();
    const balloonId = requireParameter('balloonId', params);
    const { balloonName, guests, startDate, endDate, lat, long } =
        getOptionalBalloonFormValues(formData);
    const balloon = await updateBalloon({
        balloonId,
        balloonName,
        guests,
        startDate,
        endDate,
        lat,
        long,
    });
    return redirect(`/balloons/${balloon.id}`);
};

const EditBalloonPage = () => {
    const { balloon, user } = useLoaderData<typeof loader>();
    const { showModal } = useModal(true);
    const navigate = useNavigate();
    const toggleModal = () => {
        navigate('/');
    };

    return (
        <Modal showModal={true} toggleModal={toggleModal}>
            <main className={'w-full flex flex-col items-center gap-2 mt-10'}>
                <h1 className={'font-semibold text-rose-500 text-2xl'}>
                    Edit balloon: {balloon.name}
                </h1>
                <BalloonForm balloon={balloon} />
            </main>
        </Modal>
    );
};

export default EditBalloonPage;
