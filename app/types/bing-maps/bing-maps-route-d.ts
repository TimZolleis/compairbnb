export interface DistanceMatrix {
    __type: string;
    destinations: Destination[];
    origins: Origin[];
    results: Result[];
}

interface Destination {
    latitude: number;
    longitude: number;
}

interface Origin {
    latitude: number;
    longitude: number;
}

interface Result {
    destinationIndex: number;
    originIndex: number;
    totalWalkDuration: number;
    travelDistance: number;
    travelDuration: number;
}
