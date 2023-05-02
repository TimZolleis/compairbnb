import type { DataFunctionArgs, V2_MetaFunction } from '@remix-run/node';
import { requireUser } from '~/utils/auth/session.server';
import { getWishlists } from '~/models/user.server';
import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { NoItemsComponent } from '~/ui/components/error/NoItemsComponent';
import { getListing } from '~/utils/axios/api/listing.server';

export const meta: V2_MetaFunction = () => {
    return [{ title: 'React leaflet example' }];
};

export const loader = async ({ request }: DataFunctionArgs) => {
    const user = await requireUser(request);
    const wishLists = await getWishlists(user.id);
    await getListing();
    return json({ wishLists });
};

export default function Index() {
    const { wishLists } = useLoaderData<typeof loader>();
    return (
        <>
            <h2 className={'font-semibold text-rose-500 text-headline-medium'}>Wishlists</h2>
            {wishLists.length > 0 ? (
                <p>Here</p>
            ) : (
                <NoItemsComponent
                    title={'You do not have any wishlists'}
                    subtext={
                        'To compare airbnbs, please put them in a wishlist or use QuickCompare'
                    }
                    ctaLink={'/wishlist/new'}
                    ctaLinkName={'Create Wishlist'}
                />
            )}
        </>
    );
}
