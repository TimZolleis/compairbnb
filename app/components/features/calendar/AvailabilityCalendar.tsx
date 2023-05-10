import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { cn } from '~/utils/utils';
import { datePlacement } from '~/components/features/calendar/dateVariants';
import { DateTime, Interval } from 'luxon';
import React, { useState } from 'react';
import { ListingAvailability } from '~/types/airbnb-listing-availability';
import { cva } from 'class-variance-authority';
import { checkAvailability } from '~/routes/balloons_.$balloonId.listing.$listingId.calendar';

type WeekDay = 1 | 2 | 3 | 4 | 5 | 6 | 7;

const AvailabilityIndicator = ({ status }: { status: 'available' | 'unavailable' | 'unknown' }) => {
    return (
        <div>
            <div
                className={cn(
                    'mx-auto flex items-center justify-center rounded-full h-1 w-1 mt-2',
                    status === 'available'
                        ? 'bg-green-500'
                        : status === 'unavailable'
                        ? 'bg-red-500'
                        : status === 'unknown'
                        ? 'bg-gray-400'
                        : 'bg-transparent'
                )}
            />
        </div>
    );
};

const availabilityVariants = cva('', {
    variants: {
        status: {
            available: 'bg-green-500',
            unavailable: 'bg-red-500',
            unknown: 'bg-gray-200',
        },
        opacity: {
            full: 'bg-opacity-100',
            10: 'bg-opacity-10',
        },
    },
});

export function getCurrentAvailabilityMonth(month: number, availability: ListingAvailability) {
    return availability.calendar_months.find((calendarMonth) => calendarMonth.month === month);
}

export const AvailabilityCalendar = ({
    availability,
    selectedDays,
}: {
    availability: ListingAvailability;
    selectedDays?: DateTime[];
}) => {
    const [currentMonth, setCurrentMonth] = useState(DateTime.now());
    const setPreviousMonth = () => {
        if (currentMonth.month <= DateTime.now().month) return;
        setCurrentMonth(currentMonth.minus({ month: 1 }));
    };
    const setNextMonth = () => {
        if (currentMonth.plus({ month: 1 }).year !== DateTime.now().year) return;
        setCurrentMonth(currentMonth.plus({ month: 1 }));
    };
    const days = Interval.fromDateTimes(currentMonth.startOf('month'), currentMonth.endOf('month'));
    const currentAvailabilityMonth = getCurrentAvailabilityMonth(currentMonth.month, availability);

    return (
        <>
            <div className='flex items-center gap-3'>
                <h2 className='font-semibold text-gray-900'>
                    {currentMonth.startOf('month').toFormat('MMMM yyyy')}
                </h2>
                <button
                    type='button'
                    onClick={setPreviousMonth}
                    className='-my-1.5 flex flex-none items-center justify-center p-1.5 text-gray-400 hover:text-gray-500'>
                    <span className='sr-only'>Previous month</span>
                    <ChevronLeftIcon className='w-5 h-5' aria-hidden='true' />
                </button>
                <button
                    onClick={setNextMonth}
                    type='button'
                    className='-my-1.5 -mr-1.5 ml-2 flex flex-none items-center justify-center p-1.5 text-gray-400 hover:text-gray-500'>
                    <span className='sr-only'>Next month</span>
                    <ChevronRightIcon className='w-5 h-5' aria-hidden='true' />
                </button>
            </div>
            <div className='grid grid-cols-7 mt-10 text-xs leading-6 text-center text-gray-800 font-medium'>
                <div>M</div>
                <div>T</div>
                <div>W</div>
                <div>T</div>
                <div>F</div>
                <div>S</div>
                <div>S</div>
            </div>
            <div className='grid grid-cols-7 mt-2 text-xs'>
                {days
                    .splitBy({ day: 1 })
                    .map((day) => day.start as DateTime)
                    .map((day, dayIdx) => (
                        <div
                            key={day.toString()}
                            className={cn(
                                dayIdx === 0 && datePlacement({ day: day.weekday as WeekDay }),
                                'py-1.5'
                            )}>
                            <div
                                className={cn(
                                    'mx-auto flex h-8 w-8 items-center justify-center rounded-full',
                                    availabilityVariants({
                                        status: checkAvailability(
                                            day.day,
                                            currentAvailabilityMonth
                                        ),
                                        opacity: 10,
                                    })
                                )}>
                                <time dateTime={day.toFormat('dd-mm-YYYY')}>{day.day}</time>
                            </div>
                            <AvailabilityIndicator
                                status={checkAvailability(
                                    day.day,
                                    currentAvailabilityMonth
                                )}></AvailabilityIndicator>
                        </div>
                    ))}
            </div>
        </>
    );
};
