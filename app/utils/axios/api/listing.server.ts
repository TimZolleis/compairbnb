import axios from 'axios';
import type { AirbnbListingPriceDetails, BootstrapPaymentsJSON } from '~/types/airbnb-listing';

function encodeListingId(listingId: string) {
    return Buffer.from(`StayListing:${listingId}`).toString('base64url');
}

function buildListingDetailVariables({
    checkinDate,
    checkoutDate,
    numberOfGuests,
    listingId,
}: {
    checkinDate: string;
    checkoutDate: string;
    numberOfGuests: number;
    listingId: string;
}) {
    return `%7B%22input%22%3A%7B%22businessTravel%22%3A%7B%22workTrip%22%3Afalse%7D%2C%22checkinDate%22%3A%22${checkinDate}%22%2C%22checkoutDate%22%3A%22${checkoutDate}%22%2C%22guestCounts%22%3A%7B%22numberOfAdults%22%3A${numberOfGuests}%2C%22numberOfChildren%22%3A0%2C%22numberOfInfants%22%3A0%2C%22numberOfPets%22%3A0%7D%2C%22guestCurrencyOverride%22%3A%22EUR%22%2C%22listingDetail%22%3A%7B%7D%2C%22lux%22%3A%7B%7D%2C%22metadata%22%3A%7B%22internalFlags%22%3A%5B%22LAUNCH_LOGIN_PHONE_AUTH%22%5D%7D%2C%22org%22%3A%7B%7D%2C%22productId%22%3A%22${encodeListingId(
        listingId
    )}%22%2C%22china%22%3A%7B%7D%2C%22quickPayData%22%3Anull%7D%2C%22isLeanFragment%22%3Afalse%2C%22shouldFetchTypedPaymentsData%22%3Afalse%7D&extensions=%7B%22persistedQuery%22%3A%7B%22version%22%3A1%2C%22sha256Hash%22%3A%22f009be17a08f85e064e9a0de51ef2102e482fb5ad1bcd2d9f50ab46276aca809%22%7D%7D`;
}

export async function getListing() {
    const requestVariables = buildListingDetailVariables({
        checkinDate: '2023-05-03',
        checkoutDate: '2023-05-08',
        listingId: '24496518',
        numberOfGuests: 9,
    });
    console.log('ProductId', encodeListingId('24496518'));
    const url = `https://www.airbnb.de/api/v3/StayCheckoutSections?operationName=StayCheckoutSections&locale=de&currency=EUR&variables=${requestVariables}`;
    const response = await axios.get<AirbnbListingPriceDetails>(url, {
        headers: {
            'X-Airbnb-API-Key': 'd306zoyjsyarp7ifhu67rjxn52tv0t20',
        },
    });
    const data = JSON.parse(
        response.data.data.presentation.stayCheckout.sections.temporaryQuickPayData
            .bootstrapPaymentsJSON
    ) as BootstrapPaymentsJSON;
    console.log(data.productPriceBreakdown.priceBreakdown);
    console.log(data.paymentPlans.paymentPlanOptions);
}
