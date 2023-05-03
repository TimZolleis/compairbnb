import type { DataFunctionArgs, V2_MetaFunction } from '@remix-run/node';
import { requireUser } from '~/utils/auth/session.server';
import { json } from '@remix-run/node';
import { Outlet, useLoaderData } from '@remix-run/react';
import { NoItemsComponent } from '~/ui/components/error/NoItemsComponent';
import { getListing } from '~/utils/axios/api/listing.server';
import { getUserBalloons } from '~/models/balloon.server';
import { BalloonIllustration } from '~/ui/illustrations/BalloonIllustration';

export const meta: V2_MetaFunction = () => {
    return [{ title: 'React leaflet example' }];
};

export const loader = async ({ request }: DataFunctionArgs) => {
    const user = await requireUser(request);
    const balloons = await getUserBalloons(user.id);
    return json({ balloons });
};

export default function Index() {
    const { balloons } = useLoaderData<typeof loader>();
    return (
        <>
            <h2 className={'font-semibold text-rose-500 text-headline-medium'}>Balloons</h2>
            {balloons.length > 0 ? (
                <p>Here</p>
            ) : (
                <NoItemsComponent
                    title={'You do not have any balloons'}
                    subtext={'To compare airbnbs, please put them in a balloon or use QuickCompare'}
                    ctaLink={'/balloon/new'}
                    ctaLinkName={'Create Balloon'}>
                    <BalloonIllustration className={'w-24'} />
                </NoItemsComponent>
            )}
            <Outlet />
        </>
    );
}
