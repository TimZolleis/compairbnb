import { Await, useLoaderData } from '@remix-run/react';
import { DataFunctionArgs, defer, LinksFunction } from '@remix-run/node';
import { requireParameter } from '~/utils/form/formdata.server';
import { requireReadPermission } from '~/utils/auth/permission.server';
import { getListingDetails } from '~/utils/axios/api/listing.server';
import { Suspense, useState } from 'react';
import { MapComponent, StaticMapComponent } from '~/ui/components/map/MapComponent';

export const loader = async ({ request, params }: DataFunctionArgs) => {
    const listingId = requireParameter('listingId', params);
    const balloonId = requireParameter('balloonId', params);
    await requireReadPermission(request, { balloonId });
    const details = getListingDetails(listingId);
    return defer({ details });
};

export const links: LinksFunction = () => [
    {
        rel: 'stylesheet',
        href: 'https://unpkg.com/leaflet@1.8.0/dist/leaflet.css',
    },
];
const ListingMapPage = () => {
    const { details } = useLoaderData<typeof loader>();

    return (
        <div className={'p-5'}>
            <Suspense>
                <Await resolve={details}>
                    {(resolvedDetails) => (
                        <StaticMapComponent
                            rounded={'lg'}
                            height={400}
                            lat={resolvedDetails.listing.lat}
                            long={resolvedDetails.listing.lng}
                        />
                    )}
                </Await>
            </Suspense>
        </div>
    );
};
export default ListingMapPage;
