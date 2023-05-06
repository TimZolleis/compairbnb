import { DataFunctionArgs } from '@remix-run/node';
import { requireParameter } from '~/utils/form/formdata.server';

export const loader = async ({ request, params }: DataFunctionArgs) => {
    const listingId = requireParameter('listingId', params);
};
