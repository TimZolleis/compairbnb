import type { LatLng } from 'leaflet';
import { MapContainer, Marker, TileLayer, useMapEvent } from 'react-leaflet';
import { DraggableMarker } from '~/ui/components/map/DraggableMarker';
import { useEffect, useRef } from 'react';
import { cva, VariantProps } from 'class-variance-authority';

export const map = cva('h-full', {
    variants: {
        rounded: {
            md: 'rounded-md',
            xl: 'rounded-xl',
            lg: 'rounded-lg',
        },
    },
});

const AnimateMap = ({ innerRef, lat, long }: { innerRef: any; lat: number; long: number }) => {
    useEffect(() => {
        map.flyTo({ lat, lng: long });
    }, [lat, long]);

    const map = useMapEvent('click', (e) => {
        map.flyTo(e.latlng, map.getZoom(), {
            animate: innerRef.current || false,
        });
    });
    return null;
};

export interface MapProps extends VariantProps<typeof map> {
    height: number;
    lat: number;
    long: number;
    setPosition: (position: LatLng) => void;
}

export function Map({ height, lat, long, setPosition, rounded }: MapProps) {
    const animationRef = useRef(true);
    return (
        <div style={{ height: `${height}px` }}>
            <MapContainer
                className={map({ rounded })}
                center={[lat, long]}
                zoom={13}
                scrollWheelZoom={true}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
                />
                <DraggableMarker
                    setMarkerPosition={setPosition}
                    long={long}
                    lat={lat}></DraggableMarker>
                <AnimateMap innerRef={animationRef} lat={lat} long={long} />
            </MapContainer>
        </div>
    );
}

export function StaticMap({
    height,
    lat,
    long,
    rounded,
    zoom = 12,
}: Omit<MapProps, 'setPosition'> & { zoom?: number }) {
    const position = { lat, lng: long };
    return (
        <div style={{ height: `${height}px` }}>
            <MapContainer
                className={map({ rounded })}
                center={[lat, long]}
                zoom={zoom}
                scrollWheelZoom={true}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
                />
                <Marker draggable={false} position={position}></Marker>
            </MapContainer>
        </div>
    );
}
