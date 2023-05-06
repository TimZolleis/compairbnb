import { Listing } from '.prisma/client';
import { getBingMapsClient } from '~/utils/map/map.server';
import { BingMapsResponse } from '~/types/bing-maps/bing-maps-response';
import { DistanceMatrix } from '~/types/bing-maps/bing-maps-route-d';

export async function calculateDistanceForListings({
    startLat,
    startLong,
    listings,
}: {
    startLong: number;
    startLat: number;
    listings: Listing[];
}) {
    const client = getBingMapsClient();
    const destinationString = listings
        .map((listing) => {
            return `${listing.lat},${listing.long}`;
        })
        .join(';');

    const response = await client.get<BingMapsResponse<DistanceMatrix>>('Routes/DistanceMatrix', {
        params: {
            origins: `${startLat},${startLong}`,
            destinations: destinationString,
            travelMode: 'driving',
        },
    });
    const destinationCoordinates = response.data.resourceSets[0]?.resources[0]?.destinations;
    return response.data.resourceSets[0]?.resources[0]?.results.map((result) => {
        const listing = listings.find(
            (listing) =>
                listing.lat === destinationCoordinates[result.destinationIndex].latitude &&
                listing.long === destinationCoordinates[result.destinationIndex].longitude
        );
        return { listing, distance: result.travelDistance };
    });
}

export async function calculateDistance({
    startLat,
    startLong,
    endLat,
    endLong,
}: {
    startLat: number;
    startLong: number;
    endLat: number;
    endLong: number;
}) {
    const client = getBingMapsClient();
    const response = await client.get<BingMapsResponse<DistanceMatrix>>('Routes/DistanceMatrix', {
        params: {
            origins: `${startLat},${startLong}`,
            destinations: `${endLat},${endLong}`,
            travelMode: 'driving',
        },
    });
    return response.data.resourceSets[0]?.resources[0].results[0].travelDistance;
}
