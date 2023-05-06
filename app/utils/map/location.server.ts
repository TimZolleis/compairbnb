import { getBingMapsClient } from '~/utils/map/map.server';
import { BingMapsResponse } from '~/types/bing-maps/bing-maps-response';
import { MapLocation } from '~/types/bing-maps/bing-maps-location';

export async function findLocationByCoordinates({ lat, long }: { lat: number; long: number }) {
    const client = getBingMapsClient();
    return await client.get<BingMapsResponse<MapLocation>>(`locations/${lat},${long}`);
}
