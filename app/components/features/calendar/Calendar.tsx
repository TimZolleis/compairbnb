import { DateTime, Interval } from 'luxon';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { cn } from '~/utils/utils';
import React from 'react';
import { datePlacement, dateVariants } from '~/components/features/calendar/dateVariants';
type WeekDay = 1 | 2 | 3 | 4 | 5 | 6 | 7;

const getStart = (day: Interval) => {
    const value = day.start;
    if (!value) {
        throw new Error('Invalid dates');
    }
    return value;
};

function isSameDay(date1: DateTime, date2: DateTime) {
    return date1.hasSame(date2, 'day');
}

interface CalendarProps {
    days: Interval;
    start: DateTime;
    selectedDate: DateTime;
    setSelectedDate: (d: DateTime) => void;
    setPreviousMonth: () => void;
    setNextMonth: () => void;
}
export const Calendar = ({
    days,
    start,
    selectedDate,
    setSelectedDate,
    setPreviousMonth,
    setNextMonth,
}: CalendarProps) => {
    return (
        <>
            <div className='flex items-center gap-3'>
                <h2 className='font-semibold text-gray-900'>
                    {start.startOf('month').toFormat('MMMM yyyy')}
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
            <div className='grid grid-cols-7 mt-2 text-sm'>
                {days
                    .splitBy({ day: 1 })
                    .map((day) => getStart(day))
                    .map((day, dayIdx) => (
                        <div
                            key={day.toString()}
                            className={cn(
                                dayIdx === 0 && datePlacement({ day: day.weekday as WeekDay }),
                                'py-1.5'
                            )}>
                            <button
                                onClick={() => setSelectedDate(day)}
                                type='button'
                                className={dateVariants({
                                    font: isSameDay(DateTime.now(), day) ? 'medium' : 'normal',
                                    bg:
                                        isSameDay(DateTime.now(), day) &&
                                        isSameDay(selectedDate, day)
                                            ? 'red'
                                            : isSameDay(selectedDate, day)
                                            ? 'dark'
                                            : 'transparent',
                                })}>
                                <time dateTime={day.toFormat('dd-mm-YYYY')}>{day.day}</time>
                            </button>
                            <div
                                className={cn(
                                    'mx-auto flex items-center justify-center rounded-full h-1 w-1 bg-green-500 mt-2'
                                )}></div>
                        </div>
                    ))}
            </div>
        </>
    );
};
