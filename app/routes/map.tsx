import { MapComponent } from '~/ui/components/map/MapComponent';
import { LinksFunction } from '@remix-run/node';
import { useEffect, useState } from 'react';
import { LatLng } from 'leaflet';

export const links: LinksFunction = () => [
    {
        rel: 'stylesheet',
        href: 'https://unpkg.com/leaflet@1.8.0/dist/leaflet.css',
    },
];

const MapPage = () => {
    const [position, setPosition] = useState({ long: 0, lat: 0 });

    const updateMarkerPosition = (markerPosition: LatLng) => {
        setPosition({ lat: markerPosition.lat, long: markerPosition.lng });
    };
    const checkPosition = () => {
        navigator.geolocation.getCurrentPosition((position) => {
            setPosition({ lat: position.coords.latitude, long: position.coords.longitude });
        });
    };

    useEffect(() => {
        checkPosition();
    }, []);

    return (
        <div className={'flex items-center justify-center'}>
            <div onClick={() => checkPosition()}>Locate</div>
            <div className={'flex-1 max-w-xl rounded-md'}>
                <MapComponent
                    rounded={'xl'}
                    setPosition={updateMarkerPosition}
                    long={position.long}
                    lat={position.lat}
                    height={400}></MapComponent>
            </div>
        </div>
    );
};
export default MapPage;
