export interface GPStaysDeferredSections {
    data: Data;
    extensions: Extensions;
}

interface Data {
    presentation: Presentation;
}

interface Presentation {
    stayProductDetailPage: StayProductDetailPage;
}

interface StayProductDetailPage {
    sections: Sections;
}

interface Sections {
    metadata: Metadata;
    screens: Screen[];
    sections: Section[];
    sbuiData: SbuiData;
}

interface Metadata {
    __typename: string;
    pdpType: string;
    sharingConfig: SharingConfig;
    loggingContext: LoggingContext;
    bookingPrefetchData: BookingPrefetchData;
    clientLoggingContext: ClientLoggingContext;
    initialTranslationState: any;
    productCountry: string;
}

interface SharingConfig {
    __typename: string;
    title: string;
    propertyType: string;
    location: string;
    personCapacity: number;
    imageUrl: string;
    pdpLink: string;
}

interface LoggingContext {
    __typename: string;
    eventDataLogging: EventDataLogging;
}

interface EventDataLogging {
    __typename: string;
    descriptionLanguage: string;
    listingLat: number;
    listingLng: number;
    homeTier: number;
    roomType: string;
    visibleReviewCount: string;
    valueRating: number;
    locationRating: number;
    pictureCount: number;
    communicationRating: number;
    checkinRating: number;
    accuracyRating: number;
    cleanlinessRating: number;
    guestSatisfactionOverall: number;
    personCapacity: number;
}

interface BookingPrefetchData {
    __typename: string;
    allowsChildren: boolean;
    allowsInfants: boolean;
    allowsPets: boolean;
    hostId: string;
    hostName: string;
    hostProfilePhotoUrl: string;
    isHotelRatePlanEnabled: boolean;
    isSuperhost: boolean;
    maxNights: number;
    minNights: number;
    reviewsCount: string;
    reviewsRating: string;
    roomAndPropertyType: string;
    barPrice: any;
    chinaDiscountModalData: ChinaDiscountModalData;
    canInstantBook: boolean;
    price: Price;
    textWithDefaultToggleRows: TextWithDefaultToggleRow[];
    bookItButtonByPlacement: BookItButtonByPlacement;
    chinaBookItButton: any;
    cancellationPolicies: CancellationPolicy[];
    p3DepositData: any;
    tpointContent: any;
    structuredDisplayPrice: any;
    productItemDetail: any;
}

interface Price {
    __typename: string;
    discountData: {
        __typename: string;
        tieredPricingDiscountData: any;
        chinaDiscountPromotionData: any;
    };
    promotionBadgeDiscountDisplays: any;
    total: {
        __typename: string;
        amount: number;
        amountFormatted: string;
        currency: string;
        amountMicros: number;
        isMicrosAccuracy: boolean;
    };
    priceItems: Array<{
        __typename: string;
        total: {
            __typename: string;
            amount: number;
            amountFormatted: string;
            currency: string;
            amountMicros: number;
            isMicrosAccuracy: boolean;
        };
        type: string;
        localizedTitle: string;
        localizedExplanation: string;
    }>;
}

interface ChinaDiscountModalData {
    __typename: string;
    title: string;
    discountPanels: DiscountPanel[];
}

interface DiscountPanel {
    __typename: string;
    title: string;
    discounts: any;
}

interface TextWithDefaultToggleRow {
    __typename: string;
    type: string;
    title: string;
    subtitle: any;
    hideToggle: any;
    defaultValue: any;
    disabled: any;
}

interface BookItButtonByPlacement {
    __typename: string;
    calendarFooterButton: CalendarFooterButton;
    footerButton: FooterButton;
}

interface CalendarFooterButton {
    __typename: string;
    title: string;
    loggingEventData: LoggingEventData;
}

interface LoggingEventData {
    __typename: string;
    loggingId: string;
    component: string;
    section: string;
    eventData: any;
    eventDataSchemaName: any;
}

interface FooterButton {
    __typename: string;
    title: string;
    loggingEventData: LoggingEventData;
}

interface CancellationPolicy {
    __typename: string;
    cancellationPolicyId: number;
    linkText: string;
    milestones: any[];
    cancellationOverrideRules: any;
    subtitle: string;
    subtitles: any[];
    title: string;
    localizedCancellationPolicyName: string;
    cancellationPolicyPriceType: any;
    cancellationPolicyPriceFactor: number;
    highlightedCancellationTip: any;
}

interface ClientLoggingContext {
    __typename: string;
    pdpType: string;
    productId: string;
    hostId: any;
    photoIds: any;
    rating: any;
    utcOffset: any;
    experiencesData: any;
    guestCheckoutSteps: any[];
}

interface Screen {
    __typename: string;
    id: string;
    name: string;
    screenId: string;
    sectionPlacements: SectionPlacement[];
    screenProperties?: ScreenProperties;
}

interface SectionPlacement {
    __typename: string;
    placement: string;
    layout: string;
    formFactor: string;
    sectionDetails: SectionDetail[];
}

interface SectionDetail {
    __typename: string;
    sectionId: string;
    divider?: Divider;
    topPaddingPoints?: number;
    bottomPaddingPoints?: number;
}

interface Divider {
    __typename: string;
    lineStyle: string;
    lineWidth: string;
    lineColor: any;
}

interface ScreenProperties {
    modalType: string;
    transitionType?: string;
}

interface Section {
    __typename: string;
    id: string;
    loggingData: LoggingData;
    sectionComponentType: string;
    sectionDependencies: string[];
    sectionId: string;
    sectionContentStatus: string;
    section?: SectionPart;
}

interface LoggingData {
    __typename: string;
    loggingId: string;
    experiments?: Experiment[];
}

interface Experiment {
    __typename: string;
    experiment: string;
    treatment: string;
    allTreatmentNames: string[];
}

interface SectionPart {
    __typename: string;
    pdpEducationContentData: any;
    action: any;
    available?: boolean;
    title?: string;
    subpageIdToOpen: any;
    bookItPlacement?: string;
    showPriceBreakdown?: boolean;
    cancellationPolicyLoggingEventData: any;
    calendarTitle: any;
    calendarSubtitle: any;
    descriptionItems: any;
    discountCopy: any;
    maxGuestCapacity: any;
    barPrice: any;
    bookItButtonByPlacement?: BookItButtonByPlacement;
    reviewItem?: ReviewItem;
    structuredDisplayPrice?: StructuredDisplayPrice;
    selectedDatesLink?: SelectedDatesLink;
    selectedNights: any;
    productId?: string;
    promotionBanner: any;
    localizedUnavailabilityMessagePositionString: any;
    maxPlusValue: any;
    additionalHouseRules: any;
    additionalHouseRulesTitle: any;
    additionalRulesTranslationDisclaimer: any;
    cancellationPolicyForDisplay?: CancellationPolicyForDisplay;
    cancellationPolicies?: CancellationPolicy[];
    cancellationPolicyTitle?: string;
    discountData: any;
    houseRules?: HouseRule[];
    houseRulesTitle?: string;
    houseRulesSubtitle?: string;
    houseRulesSections?: HouseRulesSection[];
    houseRulesTranslationDisclaimer: any;
    listingExpectations: any;
    listingExpectationsTitle: any;
    reportButton: any;
    seeAllHouseRulesButton?: SeeAllHouseRulesButton;
    seeCancellationPolicyButton?: SeeCancellationPolicyButton;
    safetyAndPropertyTitle?: string;
    safetyAndPropertySubtitle?: string;
    previewSafetyAndProperties?: PreviewSafetyAndProperty[];
    seeAllSafetyAndPropertyButton?: SeeAllSafetyAndPropertyButton;
    safetyExpectationsAndAmenities: any;
    safetyAndPropertiesSections?: SafetyAndPropertiesSection[];
    safetyAndPropertiesTranslationDisclaimer: any;
}

interface ReviewItem {
    __typename: string;
    accessibilityLabel: string;
    title: string;
    subtitle: string;
}

interface StructuredDisplayPrice {
    __typename: string;
    primaryLine: PrimaryLine;
    secondaryLine: any;
    explanationData: ExplanationData;
}

interface PrimaryLine {
    __typename: string;
    accessibilityLabel: string;
    price: string;
    qualifier: string;
}

interface ExplanationData {
    __typename: string;
    title?: any;
    priceDetails: PriceDetail[];
}

interface PriceDetail {
    __typename: string;
    content?: string;
    items: Item[];
}

interface Item {
    __typename: string;
    description: string;
    priceString: string;
    explanationData?: ExplanationData;
}

interface SelectedDatesLink {
    __typename: string;
    title: string;
    action: Action;
}

interface Action {
    __typename: string;
    loggingData: LoggingData;
}

interface CancellationPolicyForDisplay {
    __typename: string;
    id: number;
    subtitles: string[];
    title: any;
}

interface HouseRule {
    __typename: string;
    action: any;
    anchor: any;
    accessibilityLabel: any;
    icon: any;
    loggingEventData: any;
    title: string;
    screenNavigation: any;
    subtitle: any;
    button: any;
    html: any;
}

interface HouseRulesSection {
    __typename: string;
    title: string;
    subtitle: any;
    items: Item[];
    loggingEventData: any;
}

interface SeeAllHouseRulesButton {
    __typename: string;
    action: any;
    anchor: any;
    accessibilityLabel: any;
    icon: any;
    loggingEventData: LoggingEventData;
    title: string;
    screenNavigation: any;
    subtitle: any;
    button: any;
    html: any;
}

interface SeeCancellationPolicyButton {
    __typename: string;
    action: any;
    anchor: any;
    accessibilityLabel: any;
    icon: any;
    loggingEventData: LoggingEventData;
    title: string;
    screenNavigation: any;
    subtitle: any;
    button: any;
    html: any;
}

interface PreviewSafetyAndProperty {
    __typename: string;
    title: string;
    subtitle: any;
    icon: any;
    learnMoreButton: any;
}

interface SeeAllSafetyAndPropertyButton {
    __typename: string;
    action: any;
    anchor: any;
    accessibilityLabel: any;
    icon: any;
    loggingEventData: LoggingEventData8;
    title: string;
    screenNavigation: any;
    subtitle: any;
    button: any;
    html: any;
}

interface LoggingEventData8 {
    __typename: string;
    loggingId: string;
    component: any;
    section: any;
    eventData: any;
    eventDataSchemaName: any;
}

interface SafetyAndPropertiesSection {
    __typename: string;
    title: string;
    subtitle: any;
    items: Item[];
    loggingEventData: any;
}

interface SbuiData {
    sectionConfiguration: SectionConfiguration;
}

interface SectionConfiguration {
    root: Root;
}

interface Root {
    sections: any[];
}

interface Extensions {
    traceId: string;
}
