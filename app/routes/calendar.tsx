import { Modal } from '~/components/ui/Modal';
import { DateTime, Interval } from 'luxon';
import React, { useState } from 'react';
import { Calendar } from '~/components/features/calendar/Calendar';
import { checkAvailability, getYearlyAvailability } from '~/utils/airbnb-api/listing.server';
import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { AvailabilityCalendar } from '~/components/features/calendar/AvailabilityCalendar';

export const loader = async () => {
    const listingId = '37004694';
    const availability = await getYearlyAvailability(listingId);
    return json({ availability });
};

const CalendarPage = () => {
    const { availability } = useLoaderData<typeof loader>();
    const [currentMonth, setCurrentMonth] = useState(DateTime.now());
    const [selectedDate, setSelectedDate] = useState(DateTime.now());
    const setNextMonth = () => {
        setCurrentMonth(currentMonth.plus({ month: 1 }));
    };
    const setPreviousMonth = () => {
        setCurrentMonth(currentMonth.minus({ month: 1 }));
    };

    const interval = Interval.fromDateTimes(
        currentMonth.startOf('month'),
        currentMonth.endOf('month')
    );

    return (
        <Modal showModal={true} toggleModal={() => console.log('Toggle')}>
            <AvailabilityCalendar availability={availability} />
        </Modal>
    );
};

export default CalendarPage;
