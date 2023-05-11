import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/Card';
import { isRouteErrorResponse, Link } from '@remix-run/react';
import { buttonVariants } from '~/components/ui/Button';

export const ErrorContainer = ({ error }: { error: unknown }) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>An error has occurred</CardTitle>
                <CardDescription>
                    {isRouteErrorResponse(error)
                        ? error.data.message
                        : error instanceof Error
                        ? error.message
                        : 'UNKNOWN ERROR'}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Link className={buttonVariants()} to={'/'}>
                    Home
                </Link>
            </CardContent>
        </Card>
    );
};
