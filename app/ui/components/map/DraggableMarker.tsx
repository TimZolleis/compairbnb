import { useEffect, useMemo, useRef, useState } from 'react';
import { Marker, useMap } from 'react-leaflet';
import { LatLng, Marker as LeafletMarker } from 'leaflet';

export const DraggableMarker = ({
    long,
    lat,
    setMarkerPosition,
}: {
    long: number;
    lat: number;
    setMarkerPosition: (v: LatLng) => void;
}) => {
    const position = { lat: lat, lng: long };
    const ref = useRef<LeafletMarker>(null);
    const map = useMap();
    const eventHandlers = useMemo(
        () => ({
            dragend() {
                const marker = ref.current;
                if (marker != null) {
                    setMarkerPosition(marker.getLatLng());
                    map.flyTo(marker.getLatLng());
                }
            },
        }),
        []
    );
    return (
        <Marker
            draggable={true}
            eventHandlers={eventHandlers}
            position={position}
            ref={ref}></Marker>
    );
};
