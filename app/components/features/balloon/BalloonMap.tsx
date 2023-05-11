import { useEffect, useState } from 'react';
import { LatLng } from 'leaflet';
import { MapComponent } from '~/components/features/map/MapComponent';

export const BalloonMap = ({
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
