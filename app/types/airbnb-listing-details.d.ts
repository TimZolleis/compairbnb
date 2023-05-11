export interface ListingDetails {
    listing: Listing;
}

interface Listing {
    id: number;
    city: string;
    thumbnail_url: string;
    medium_url: string;
    user_id: number;
    picture_url: string;
    xl_picture_url: string;
    price: number;
    native_currency: string;
    price_native: number;
    price_formatted: string;
    lat: number;
    lng: number;
    country: string;
    name: string;
    smart_location: string;
    has_double_blind_reviews: boolean;
    instant_bookable: boolean;
    bathrooms: number;
    bedrooms: number;
    beds: number;
    market: string;
    min_nights: number;
    neighborhood?: string;
    person_capacity: number;
    state: string;
    zipcode?: string;
    user: User;
    hosts: Host[];
    primary_host: PrimaryHost;
    address: string;
    country_code: string;
    cancellation_policy: string;
    property_type: string;
    reviews_count: number;
    room_type: string;
    room_type_category: string;
    bathroom_type: string;
    picture_urls: string[];
    thumbnail_urls: string[];
    xl_picture_urls: string[];
    picture_count: number;
    currency_symbol_left: string;
    currency_symbol_right?: string;
    picture_captions: string[];
    bed_type: string;
    bed_type_category: string;
    require_guest_profile_picture: boolean;
    require_guest_phone_verification: boolean;
    force_mobile_legal_modal: boolean;
    allowed_currencies: string[];
    cancel_policy: number;
    check_in_time: number;
    check_in_time_ends_at: number;
    check_out_time: number;
    guests_included: number;
    license?: string;
    max_nights: number;
    square_feet?: number;
    locale: string;
    has_viewed_terms?: string;
    has_viewed_cleaning?: string;
    has_agreed_to_legal_terms: boolean;
    has_viewed_ib_perf_dashboard_panel?: string;
    localized_city: string;
    language: string;
    public_address: string;
    map_image_url: string;
    has_license: boolean;
    experiences_offered: string;
    max_nights_input_value: number;
    min_nights_input_value: number;
    requires_license: boolean;
    property_type_id: number;
    house_rules: string;
    security_deposit_formatted: string;
    description: string;
    description_locale: string;
    summary: string;
    space: string;
    access: string;
    interaction: string;
    neighborhood_overview: string;
    notes: string;
    transit: string;
    amenities: string[];
    amenities_ids: number[];
    is_location_exact: boolean;
    in_building: boolean;
    in_landlord_partnership: boolean;
    in_toto_area: boolean;
    recent_review: RecentReview;
    calendar_updated_at: string;
    cancel_policy_short_str: string;
    photos: Photo[];
    star_rating: number;
    price_for_extra_person_native: number;
    time_zone_name: string;
    weekly_price_factor?: string;
    monthly_price_factor: number;
    guest_controls: GuestControls;
    check_in_time_start: string;
    check_in_time_end: string;
    formatted_check_out_time: string;
    localized_check_in_time_window: string;
    localized_check_out_time: string;
}

interface User {
    user: {
        id: number;
        first_name: string;
        picture_url: string;
        thumbnail_url: string;
        has_profile_pic: boolean;
        created_at: string;
        reviewee_count: number;
        recommendation_count: number;
        last_name: string;
        thumbnail_medium_url: string;
        picture_large_url: string;
        response_time: string;
        response_rate: string;
        acceptance_rate: string;
        wishlists_count: number;
        publicly_visible_wishlists_count: number;
        is_superhost: boolean;
    };
}

interface Host {
    id: number;
    first_name: string;
    picture_url: string;
    thumbnail_url: string;
    has_profile_pic: boolean;
}

interface PrimaryHost {
    id: number;
    first_name: string;
    picture_url: string;
    thumbnail_url: string;
    has_profile_pic: boolean;
    created_at: string;
    reviewee_count: number;
    recommendation_count: number;
    last_name: string;
    thumbnail_medium_url: string;
    picture_large_url: string;
    response_time: string;
    response_rate: string;
    acceptance_rate: string;
    wishlists_count: number;
    publicly_visible_wishlists_count: number;
    is_superhost: boolean;
}

interface RecentReview {
    review: Review;
}

interface Review {
    id: number;
    reviewer_id: number;
    reviewee_id: number;
    created_at: string;
    reviewer: Reviewer;
    comments: string;
    listing_id: number;
}

interface Reviewer {
    user: ReviewUser;
}

interface ReviewUser {
    id: number;
    first_name: string;
    picture_url: string;
    thumbnail_url: string;
    has_profile_pic: boolean;
}

interface Photo {
    xl_picture: string;
    picture: string;
    thumbnail: string;
    caption: string;
    id: number;
    sort_order: number;
}

interface GuestControls {
    allows_children_as_host: boolean;
    allows_infants_as_host: boolean;
    allows_pets_as_host: boolean;
    allows_smoking_as_host: boolean;
    allows_events_as_host: boolean;
    children_not_allowed_details?: string;
    id: number;
    structured_house_rules: string[];
}
