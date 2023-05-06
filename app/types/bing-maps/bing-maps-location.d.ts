export interface MapLocation {
    __type: string;
    bbox: number[];
    name: string;
    point: Point;
    address: Address;
    confidence: string;
    entityType: string;
    geocodePoints: GeocodePoint[];
    matchCodes: string[];
}

export interface Point {
    type: string;
    coordinates: number[];
}

interface Address {
    addressLine: string;
    adminDistrict: string;
    adminDistrict2: string;
    countryRegion: string;
    formattedAddress: string;
    locality: string;
    postalCode: string;
}

interface GeocodePoint {
    type: string;
    coordinates: number[];
    calculationMethod: string;
    usageTypes: string[];
}
