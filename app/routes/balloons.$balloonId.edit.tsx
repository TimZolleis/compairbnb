import { DataFunctionArgs, json, redirect } from '@remix-run/node';
import { requireUser } from '~/utils/auth/session.server';
import { findBalloon, requireBalloon, updateBalloon } from '~/models/balloon.server';
import { useLoaderData, useNavigate } from '@remix-run/react';
import { Modal, useModal } from '~/ui/components/modal/Modal';
import { BalloonForm } from '~/routes/balloons.new';
import { requireParameter } from '~/utils/form/formdata.server';

export const loader = async ({ request, params }: DataFunctionArgs) => {
    const user = await requireUser(request);
    const balloonId = requireParameter('balloonId', params);
    const balloon = await requireBalloon(balloonId, { requireOwnership: true, userId: user.id });
    return json({ balloon, user });
};

export const action = async ({ request, params }: DataFunctionArgs) => {
    const formData = await request.formData();
    const balloonId = requireParameter('balloonId', params);
    const balloonName = formData.get('balloonName')?.toString();
    const guests = parseInt(formData.get('guests')?.toString() ?? '') || undefined;
    const startDate = formData.get('startDate')?.toString();
    const endDate = formData.get('endDate')?.toString();
    const balloon = await updateBalloon(balloonId, balloonName, guests, startDate, endDate);
    return redirect(`/balloon/${balloon.id}`);
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
