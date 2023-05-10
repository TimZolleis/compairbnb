export interface ListingAvailability {
    calendar_months: CalendarMonth[];
    metadata: Metadata;
}

export interface CalendarMonth {
    month: number;
    year: number;
    days: Day[];
    listing_id: number;
    condition_ranges: ConditionRange[];
    listing_id_str: string;
}

interface Day {
    date: string;
    available: boolean;
    max_nights: number;
    min_nights: number;
    price: Price;
    available_for_checkin: boolean;
    available_for_checkout: boolean;
    bookable?: boolean;
}

interface Price {}

interface ConditionRange {
    conditions: Conditions;
    start_date: string;
    end_date: string;
}

interface Conditions {
    closed_to_arrival: boolean;
    closed_to_departure: boolean;
    max_nights: number;
    min_nights: number;
    end_day_of_week?: number;
}

interface Metadata {
    only_show_available_for_checkin_on_datepicker: boolean;
    enable_availability_for_previous_day: boolean;
    first_bookable_day: string;
}
