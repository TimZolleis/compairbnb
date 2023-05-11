import { useLocation, useMatches, useNavigate } from '@remix-run/react';

export function useRelative(delta: number) {
    const matches = useMatches();
    const currentUrl = matches.pop()?.pathname;
    const urlParts = currentUrl?.split('/');
    if (!urlParts) {
        throw new Error('Error parsing url when using relative navigation');
    }
    const slicedParts = urlParts.slice(0, -delta);
    return slicedParts.join('/').trim();
}

//This fancy function is for using parametizedRoutes such as /location/$locationId in a navigation function
export function useParameters(route: string, preserveSearch: boolean = true) {
    const routeParts = route.split('/');
    const parameters = routeParts
        .map((part) => {
            if (part.includes('$')) {
                return part.split('$')[1];
            }
        })
        .filter((element) => element) as string[];
    const activeRoute = useMatches().pop();
    if (!activeRoute) throw new Error('Error parsing active url');
    const location = useLocation();
    const parameterValues = parameters
        .map((parameter) => {
            return { [parameter]: activeRoute.params[parameter] };
        })
        .reduce((parameters, currentParameter) => {
            const objectKey = Object.keys(currentParameter)[0];
            parameters[objectKey] = currentParameter[objectKey];
            return parameters;
        }, {});
    return routeParts
        .map((part) => {
            if (part.includes('$')) {
                const parameter = part.split('$')[1];
                return parameterValues[parameter];
            }
            return part;
        })
        .join('/')
        .trim()
        .concat(preserveSearch ? location.search : '');
}
