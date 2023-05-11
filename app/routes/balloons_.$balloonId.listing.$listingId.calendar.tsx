//TODO: Add availability calendar

import { DataFunctionArgs, defer } from '@remix-run/node';
import { getYearlyAvailability } from '~/utils/axios/api/listing.server';
import { requireParameter } from '~/utils/form/formdata.server';
import { Await, useLoaderData } from '@remix-run/react';
import { Suspense } from 'react';
import {
    AvailabilityCalendar,
    getCurrentAvailabilityMonth,
} from '~/components/features/calendar/AvailabilityCalendar';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '~/ui/components/import/card';
import { prisma } from '../../prisma/db';
import { requireResult } from '~/models/listing.server';
import { Balloon } from '.prisma/client';
import { DateTime, Interval } from 'luxon';
import { ListingAvailability } from '~/types/airbnb-listing-availability';
import { cn } from '~/utils/utils';
import { CalendarSkeleton } from '~/components/features/calendar/CalendarSkeleton';
import { AvailabilitySkeleton } from '~/components/features/listing/AvailabilitySkeleton';
import { useRelative } from '~/utils/hooks/nav';

export const loader = async ({ request, params }: DataFunctionArgs) => {
    const listingId = requireParameter('listingId', params);
    const balloonId = requireParameter('balloonId', params);
    const balloon = await prisma.balloon
        .findUnique({ where: { id: balloonId } })
        .then(requireResult<Balloon>);
    const availability = getYearlyAvailability(listingId);
    return defer({ availability, balloon });
};

function getSelectedDays(startDate: string, endDate: string) {
    return Interval.fromDateTimes(DateTime.fromISO(startDate), DateTime.fromISO(endDate));
}

export function checkAvailability(
    day: number,
    availability: ReturnType<typeof getCurrentAvailabilityMonth>
) {
    const availableDay = availability?.days.find((availabilityDay, index) => {
        const parsedDay = DateTime.fromISO(availabilityDay.date);
        return parsedDay.day === day;
    });
    return availableDay ? (availableDay.available ? 'available' : 'unavailable') : 'unknown';
}

function getDay(date: DateTime, availability: ListingAvailability) {
    const month = availability.calendar_months.find((month) => {
        return month.month === date.month;
    });
    return month?.days.find((day) => {
        return DateTime.fromISO(day.date).hasSame(date, 'day');
    });
}

const ListingCalendarPage = () => {
    const { availability, balloon } = useLoaderData<typeof loader>();
    const selectedDays = getSelectedDays(balloon.startDate, balloon.endDate)
        .splitBy({ day: 1 })
        .map((interval) => {
            const start = interval.start;
            if (!start) {
                throw new Error('Error parsing balloon dates');
            }
            return start;
        });
    return (
        <div className={'w-full flex flex-col gap-2 px-5 md:flex-row md:px-0'}>
            <Card className={'p-4 w-full grow'}>
                <Suspense fallback={<CalendarSkeleton />}>
                    <Await resolve={availability}>
                        {(availabilityResult) => (
                            <AvailabilityCalendar availability={availabilityResult} />
                        )}
                    </Await>
                </Suspense>
            </Card>
            <Card className={'w-full grow-0'}>
                <CardHeader>
                    <CardTitle>Selected days</CardTitle>
                    <CardDescription>The days you decided to stay</CardDescription>
                </CardHeader>
                <CardContent>
                    <Suspense fallback={<AvailabilitySkeleton />}>
                        <Await resolve={availability}>
                            {(availabilityResult) => (
                                <div className={'grid gap-1 overflow-y-scroll max-h-72'}>
                                    {selectedDays.map((day) => (
                                        <div
                                            className={'px-3 py-1.5 rounded-md border'}
                                            key={day.day}>
                                            <p className={'font-medium text-gray-900'}>
                                                {day.toFormat('dd.MM.yyyy')}
                                            </p>
                                            <p
                                                className={cn(
                                                    'text-sm',
                                                    getDay(day, availabilityResult)?.available
                                                        ? 'text-green-500'
                                                        : 'text-red-500'
                                                )}>
                                                {getDay(day, availabilityResult)?.available
                                                    ? 'Available'
                                                    : 'Not available'}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </Await>
                    </Suspense>
                </CardContent>
            </Card>
        </div>
    );
};
export default ListingCalendarPage;
