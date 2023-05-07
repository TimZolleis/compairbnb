import bcrypt from 'bcrypt';
import { json } from '@remix-run/node';
import { GPStaysDeferredSections } from '~/types/airbnb-listing-price';
import { createListingArguments, getClient } from '~/utils/axios/api/listing.server';

export const loader = async () => {
    const url = 'https://api.airbnb.com/v3/GPStaysDeferredSections';
    const { variables, extensions } = createListingArguments({
        guests: 9,
        checkIn: '2023-06-19',
        checkOut: '2023-06-24',
        listingId: '1162690',
    });
    const client = getClient();
    const response = await client.get<GPStaysDeferredSections>(url, {
        params: {
            operationType: 'query',
            variables: variables,
            extensions: extensions,
            operationName: 'GPStaysDeferredSections',
        },
    });
    const bookingSection =
        response.data.data?.presentation?.stayProductDetailPage?.sections?.sections?.find(
            (section) => section.sectionId === 'BOOK_IT_FLOATING_FOOTER'
        );
    const totalPriceDetail =
        bookingSection?.section?.structuredDisplayPrice?.explanationData?.priceDetails?.find(
            (detail) => detail.items.some((item) => item.description === 'Total')
        );

    const totalPrice = totalPriceDetail?.items[0]?.priceString || '0';
    console.log(response.request.headers);
    return json({ response: response.data });
};
