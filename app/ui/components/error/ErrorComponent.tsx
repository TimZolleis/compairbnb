import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '~/ui/components/import/card';
import { isRouteErrorResponse, Link } from '@remix-run/react';
import { buttonVariants } from '~/ui/components/import/button';

export const ErrorComponent = ({ error }: { error: unknown }) => {
    console.log('Error', error);
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
