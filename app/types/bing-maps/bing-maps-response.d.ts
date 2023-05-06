export interface BingMapsResponse<T> {
    authenticationResultCode: string;
    brandLogoUri: string;
    copyRight: string;
    statusCode: number;
    statusDescription: string;
    traceId: string;
    resourceSets: ResourceSet<T>[];
}

interface ResourceSet<T> {
    estimatedTotal: number;
    resources: T[];
}
