import { DataFunctionArgs, json, LinksFunction, redirect } from '@remix-run/node';
import { requireUser } from '~/utils/auth/session.server';
import { useLoaderData, useNavigate } from '@remix-run/react';
import { Modal, useModal } from '~/ui/components/modal/Modal';
import { requireParameter } from '~/utils/form/formdata.server';
import { updateBalloon } from '~/models/balloon.server';
import { prisma } from '../../prisma/db';
import { BalloonForm } from '~/routes/balloons.add';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '~/ui/components/import/card';
import { requireReadPermission, requireWritePermission } from '~/utils/auth/permission.server';

export const loader = async ({ request, params }: DataFunctionArgs) => {
    const balloonId = requireParameter('balloonId', params);
    const balloon = await prisma.balloon.findUnique({
        where: {
            id: balloonId,
        },
    });
    await requireReadPermission(request, { balloon });
    if (!balloon) {
        throw new Error('The requested balloon could not be found');
    }
    return json({ balloon });
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
    await requireWritePermission(request, { balloonId });
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
    const { balloon } = useLoaderData<typeof loader>();
    const navigate = useNavigate();
    const toggleModal = () => {
        navigate(-1);
    };

    return (
        <Modal showModal={true} toggleModal={toggleModal}>
            <Card className={'border-none shadow-none'}>
                <CardHeader>
                    <CardTitle>{balloon.name}</CardTitle>
                    <CardDescription>Adjust your balloon settings</CardDescription>
                </CardHeader>

                <CardContent>
                    <BalloonForm balloon={balloon} />
                </CardContent>
            </Card>
        </Modal>
    );
};

export default EditBalloonPage;
