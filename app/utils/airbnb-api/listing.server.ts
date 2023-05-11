import axios from 'axios';
import { GPStaysDeferredSections } from '~/types/airbnb-listing-price';
import { ListingDetails } from '~/types/airbnb-listing-details';
import { ListingAvailability } from '~/types/airbnb-listing-availability';
import { handleCacheError, readFromCache, writeToCache } from '~/utils/cache/cache.server';
import { DateTime, Interval } from 'luxon';

export function getClient(baseUrl?: string, locale?: string) {
    return axios.create({
        baseURL: baseUrl,
        headers: {
            'user-agent':
                'Airbnb/23.17.1 Name/GLOBAL_TRAVEL AppVersion/23.17.1 ReleaseStage/live iPhone/16.4.1 Type/Phone',
            'x-airbnb-currency': 'EUR',
            'x-airbnb-api-key': 'd306zoyjsyarp7ifhu67rjxn52tv0t20',
            'x-user-is-auto-translation-enabled': true,
            'x-airbnb-locale': locale ?? 'en-US',
        },
    });
}
function encodeListingId(listingId: string) {
    return Buffer.from(`StayListing:${listingId}`).toString('base64');
}

interface ListingDetailsProps {
    guests: number;
    checkIn: string;
    checkOut: string;
    listingId: string;
}

export async function getListing({ guests, checkIn, checkOut, listingId }: ListingDetailsProps) {
    const availability = await checkAvailability({
        checkIn: checkIn,
        checkOut: checkOut,
        listingId: listingId,
    });

    const pricing = await getListingPrice({
        guests: guests,
        checkIn: checkIn,
        checkOut: checkOut,
        listingId: listingId,
    });

    return { pricing, availability };
}

export async function checkAvailability({
    checkIn,
    checkOut,
    listingId,
}: Omit<ListingDetailsProps, 'guests'>) {
    const url = 'https://api.airbnb.com/v2';
    const checkInDate = DateTime.fromISO(checkIn);
    const checkOutDate = DateTime.fromISO(checkOut);
    const stayInterval = Interval.fromDateTimes(checkInDate, checkOutDate);
    const client = getClient(url);
    const response = await client.get<ListingAvailability>('homes_pdp_availability_calendar', {
        params: {
            listing_id: listingId,
            month: checkInDate.month,
            year: checkInDate.year,
            count: 2,
        },
    });
    const data = response.data;
    const months = stayInterval.splitBy({ month: 1 });
    const monthlyAvailability = months.map((month) => {
        const start = month.start;
        if (!start) {
            throw new Error('Error parsing monthly availability interval');
        }
        const days = month.splitBy({ day: 1 });
        const calendarMonth = data.calendar_months.find(
            (calendarMonth) => calendarMonth.month === start.month
        );
        const dailyAvailability = days
            .map((day) => {
                if (!day.start) {
                    throw new Error('Error parsing daily availability interval');
                }
                return day.start;
            })
            .map((day) => {
                const availabilityDay = calendarMonth?.days.find((availabilityDay) => {
                    return DateTime.fromISO(availabilityDay.date).hasSame(day, 'day');
                });
                return { day: day.toFormat('yyyy-MM-dd'), available: !!availabilityDay?.available };
            });
        return { month: start.month, dailyAvailability };
    });
    const isAvailableDuringRequestedTimeframe = monthlyAvailability.every((month) => {
        return month.dailyAvailability.every((day) => day?.available);
    });

    return { isAvailableDuringRequestedTimeframe, monthlyAvailability };
}

export async function getYearlyAvailability(listingId: string) {
    const url = 'https://api.airbnb.com/v2';
    const client = getClient(url);
    const response = await client.get<ListingAvailability>('homes_pdp_availability_calendar', {
        params: {
            listing_id: listingId,
            month: DateTime.now().month,
            year: DateTime.now().year,
            count: 12,
        },
    });
    return response.data;
}

export async function getListingDetails(listingId: string) {
    const key = `listing-details-${listingId}`;
    try {
        return await readFromCache<ListingDetails>(key);
    } catch (e) {
        handleCacheError(e);
        const url = 'https://api.airbnb.com/v1/listings';
        const client = getClient(url);
        const listingDetails = await client.get<ListingDetails>(listingId).then((res) => res.data);
        await writeToCache(key, JSON.stringify(listingDetails), 86400);
        return listingDetails;
    }
}

export async function getListingPrice({
    guests,
    checkIn,
    checkOut,
    listingId,
}: ListingDetailsProps) {
    const key = `listing-price-${listingId}-checkin:${checkIn}-checkout:${checkOut}-guests:${guests}`;
    try {
        return await readFromCache<{ totalPrice: string }>(key);
    } catch (e) {
        handleCacheError(e);
        const { variables, extensions } = createListingArguments({
            guests,
            checkIn,
            checkOut,
            listingId,
        });
        const url = 'https://api.airbnb.com/v3/GPStaysDeferredSections';
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
        await writeToCache(key, JSON.stringify({ totalPrice }), 86400);
        return { totalPrice };
    }
}

export function createListingArguments({
    guests,
    checkIn,
    checkOut,
    listingId,
}: ListingDetailsProps) {
    const listingOptions = {
        id: encodeListingId(listingId),
        request: {
            adults: guests,
            checkIn: checkIn,
            checkOut: checkOut,
            children: '0',
            federatedSearchId: '929e4bff-3fd2-490a-ab6e-c9a05fd839b5',
            infants: '0',
            interactionType: 'pageload',
            isChinaPrefillFlexibleDateFlow: false,
            layouts: ['SINGLE_COLUMN'],
            p3ImpressionId: 'pdp_ios_4DB732C6-B4DE-443B-973E-626DA293B89C',
            pets: 0,
            searchId: '',
            sectionIds: ['BOOK_IT_FLOATING_FOOTER'],
        },
    };
    const extensionOptions = {
        persistedQuery: {
            sha256Hash: '1a4fc9390f7097a8b0bb131ac23be2d99fc9045a9bc4cf215448756ea4d7aa69',
            version: 1,
        },
    };
    const variables = JSON.stringify(listingOptions);
    const extensions = JSON.stringify(extensionOptions);
    return { variables, extensions };
}
