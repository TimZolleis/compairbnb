import { ClientOnly } from '~/ui/components/common/ClientOnly';
import { map, Map, MapProps } from '~/ui/components/map/map.client';

export const MapComponent = ({ height, lat, long, setPosition, rounded }: MapProps) => {
    return (
        <div className={'flex-1'}>
            <ClientOnly
                fallback={
                    <div
                        className={`h-[${height}px] bg-gray-500 rounded-xl`}
                        id='skeleton'
                        style={{ height: `${height}px`, background: '#d1d1d1' }}
                    />
                }>
                {() => (
                    <Map
                        setPosition={setPosition}
                        height={height}
                        lat={lat}
                        long={long}
                        rounded={rounded}
                    />
                )}
            </ClientOnly>
        </div>
    );
};
