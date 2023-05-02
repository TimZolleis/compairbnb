export type BootstrapPaymentsJSON = {
    fxMessage: {
        status: {
            statusCode: string;
        };
    };
    structuredDisplayPriceBreakdown: {
        productPriceQuoteToken: string;
        structuredDisplayPrice: {};
        status: {
            statusCode: string;
        };
    };
    visiblePaymentModuleTypes: Array<string>;
    paymentOptions: {
        paymentOptions: Array<{
            isDefault: boolean;
            isCvvRequiredForPayment: boolean;
            isValidForCurrency: boolean;
            isVerified: boolean;
            paymentMethodWithProvider: {
                paymentProvider: string;
                paymentMethodType: string;
            };
            displayName: string;
            isExistingInstrument: boolean;
            gibraltarInstrumentType: string;
            idealDetails?: {
                idealIssuers: Array<{
                    issuerId: string;
                    logoAssetUrl: string;
                    displayName: string;
                    logoAssetUrlPng: string;
                }>;
            };
        }>;
        isInlineDisplay: boolean;
        isPayByBank: boolean;
        status: {
            statusCode: string;
        };
        selectedPaymentOption: {
            isDefault: boolean;
            isCvvRequiredForPayment: boolean;
            isValidForCurrency: boolean;
            isVerified: boolean;
            paymentMethodWithProvider: {
                paymentProvider: string;
                paymentMethodType: string;
            };
            displayName: string;
            isExistingInstrument: boolean;
            gibraltarInstrumentType: string;
        };
    };
    checkoutTokens: {
        paymentCheckoutId: string;
        stepstonesToken: string;
    };
    paymentPlanSchedule: {
        creditPriceItems: Array<any>;
        priceSchedule: {
            priceItems: Array<{
                total: {
                    amountMicros: number;
                    currency: string;
                    amountFormatted: string;
                };
                type: string;
                localizedTitle: string;
            }>;
        };
        billQuoteToken: string;
        status: {
            statusCode: string;
        };
    };
    quickPayConfiguration: {
        trebuchets: Array<{
            isTrebuchetOn: boolean;
            trebuchetName: string;
        }>;
        creditCardFieldCredentials: {
            digitalRiverMerchantId: string;
            shouldFetchBraintreeNonce: boolean;
            adyenIndiaClientToken: string;
            braintreeClientToken: string;
            adyenClientToken: string;
            adyenIndiaClientEncryptionPublicKey: string;
            digitalRiverPublicKey: string;
            disableEncryptedPayload: boolean;
            stripePublishableKey: string;
            iframeSha: string;
            adyenClientEncryptionPublicKey: string;
            iframeUrl: string;
        };
        currencyCountries: Array<{
            isEligibleForLys: boolean;
            symbol: string;
            code: string;
            unicodeSymbol: string;
            isEligibleForGuest: boolean;
            name: string;
            localizedFullName: string;
            id: string;
        }>;
        experiments: {};
        rolloutConfigurations: {
            mstRolloutConfiguration: {
                isRolledOut: boolean;
            };
            instrumentVaultingSoaRolloutConfiguration: {
                isRolledOutByType: {
                    apple_pay: boolean;
                    adyen_apple_pay: boolean;
                    credit_card: boolean;
                    adyen_ideal: boolean;
                    alipay: boolean;
                    digital_river_credit_card: boolean;
                    adyen_google_pay: boolean;
                    braintree_paypal: boolean;
                    adyen_credit_card: boolean;
                    android_pay: boolean;
                    bank_account: boolean;
                };
            };
        };
    };
    regionalCheckoutData: {
        shouldShowCurrencyErrorForNonIDR: boolean;
        isBrazilianDomesticTravel: boolean;
        shouldShowBrazilianLongForm: boolean;
    };
    productPriceBreakdown: {
        productPriceQuoteToken: string;
        priceBreakdown: {
            total: {
                localizedExplanation: string;
                total: {
                    amountMicros: number;
                    currency: string;
                    amountFormatted: string;
                };
                type: string;
                localizedTitle: string;
            };
            priceItems: Array<{
                total: {
                    amountMicros: number;
                    currency: string;
                    amountFormatted: string;
                };
                type: string;
                localizedTitle: string;
                nestedPriceItems: Array<any>;
                localizedExplanation?: string;
            }>;
            pricingDiscountDataForTotal: {};
            subtotalItems: Array<any>;
            totalSeparate: boolean;
        };
        status: {
            statusCode: string;
        };
    };
    paymentPlans: {
        paymentPlanOptions: Array<{
            localizedAmount: string;
            paymentPlanOption: {
                displayString: string;
                paymentPlanType: string;
                eligibleGibraltarInstrumentTypes: Array<string>;
                paymentPlanSubtype: string;
            };
            subtitle: string;
            paymentPlanType: string;
            title: string;
        }>;
        status: {
            statusCode: string;
        };
    };
    billData: {
        productPriceQuoteToken: string;
        billingDataRolloutStage: string;
        billQuoteToken: string;
        tenderPriceQuoteTokens: Array<string>;
    };
    status: {
        statusCode: string;
    };
};

export interface AirbnbListingPriceDetails {
    data: Data;
    extensions: Extensions;
}

export interface Data {
    presentation: Presentation;
}

export interface Presentation {
    __typename: string;
    stayCheckout: StayCheckout;
}

export interface StayCheckout {
    __typename: string;
    sections: Sections;
}

export interface Sections {
    __typename: string;
    sections: Section[];
    sectionsV2: any;
    screens: Screen[];
    screensV2: any;
    flows: any;
    metadata: Metadata;
    stateMutation: StateMutation;
    temporaryQuickPayData: TemporaryQuickPayData;
}

export interface Section {
    __typename: string;
    id: string;
    sectionComponentType: string;
    sectionContentStatus: any;
    sectionId: string;
    errors?: any[];
    sectionDependencies: any;
    enableDependencies?: string[];
    disableDependencies: any;
    loggingData: LoggingData;
    e2eLoggingSession: any;
    mutationMetadata: any;
    pluginPointId: string;
    section: Section2;
}

export interface LoggingData {
    __typename: string;
    loggingId: string;
    experiments: any;
    eventData: any;
    eventDataSchemaName: any;
    section: any;
    component: any;
}

export interface Section2 {
    __typename: string;
    childrenAllowed?: boolean;
    childrenAndInfantsWarning: any;
    guestCountSummary?: string;
    guestPickerDisplayPrices: any;
    includeInfantsInGuestCount: any;
    infantsAllowed?: boolean;
    linkCopy?: string;
    maxAge: any;
    maxGuestCapacity?: number;
    maxPlusValue?: number;
    minAge: any;
    petDetails?: PetDetails;
    petDisclaimerText: any;
    petsAllowed?: boolean;
    readonly?: boolean;
    subtitle?: string;
    title?: string;
    backText?: string;
    pageHeading?: string;
    titleSize: any;
    calendarSubtitle?: string;
    calendarTitle?: string;
    details?: string[];
    subtitleDetails: any;
    subtitleDetailsIcon: any;
    placeholderName?: string;
    logoData?: LogoData;
    kickerText?: string;
    imageUrl?: string;
    linkUrl: any;
    kicker?: string;
    localizedTitle?: string;
    rating?: string;
    ratingCount?: string;
    superhost?: boolean;
}

export interface PetDetails {
    __typename: string;
    maxPetCount: number;
    petDisclaimerText: string;
}

export interface LogoData {
    __typename: string;
    id: string;
    aspectRatio: number;
    orientation: any;
    onPressAction: any;
    accessibilityLabel: string;
    baseUrl: string;
    displayAspectRatio: any;
    imageMetadata: any;
    previewEncodedPng: any;
    overlay: any;
    loggingEventData: any;
}

export interface Screen {
    __typename: string;
    screenId: string;
    screenProperties: any;
    e2eLoggingSessions: any;
    screenContentStatus: any;
    screenContext: any;
    onLoadScreenAction: any;
    sectionPlacements: SectionPlacement[];
}

export interface SectionPlacement {
    __typename: string;
    placement: string;
    layout: string;
    sectionDetails: SectionDetail[];
    style?: Style;
    formFactor: string;
    mediaType: any;
}

export interface SectionDetail {
    __typename: string;
    sectionId: string;
    divider: Divider;
    border: any;
    topMarginPoints?: number;
    topPaddingPoints?: number;
    bottomPaddingPoints?: number;
    bottomMarginPoints: any;
    backgroundColorNew: any;
    horizontalPadding: string;
    maxWidth: any;
}

export interface Divider {
    __typename: string;
    lineStyle: string;
    lineWidth?: string;
    lineColor?: LineColor;
    topPadding: any;
    paddingBelowDivider: any;
}

export interface LineColor {
    __typename: string;
    dls19: string;
    dls19Gradient: any;
    gradient: any;
    hex: string;
    type: any;
}

export interface Style {
    __typename: string;
    backgroundColor: any;
    border?: Border;
    bottomMarginPoints?: number;
    bottomPadding: any;
    bottomPaddingPoints: any;
    fixedWidthPoints: any;
    span?: number;
    topMarginPoints: any;
    topPadding: any;
    topPaddingPoints?: number;
}

export interface Border {
    __typename: string;
    lineStyle: string;
    shadow: any;
    color: any;
    hoverColor: any;
    paddingPoints: any;
    leftOnly: any;
    rightOnly: any;
    topRounded: any;
    sides: any;
    bottomRounded: any;
    cornerRadiusPoints: any;
    padding: any;
}

export interface Metadata {
    __typename: string;
    pageTitle: string;
    theme: any;
    errorData: any;
    windowTitle: string;
    animationTitle: any;
    bookingAttemptId: any;
    confirmationCode: any;
    clientLoggingContext: ClientLoggingContext;
    misaId: any;
    tierId: string;
}

export interface ClientLoggingContext {
    __typename: string;
    clientActionId: any;
    errorCode: any;
    errorMessage: any;
    guestId: any;
    hostId: any;
    productId: string;
    staysData: StaysData;
    splitStaysData: any;
    guestCheckoutSteps: any[];
}

export interface StaysData {
    __typename: string;
    checkinDate: string;
    checkoutDate: string;
    checkoutProductVersion: string;
    checkoutRequestType: number;
    inventoryType: number;
    isEligibleForWorkTrip: any;
    isWorkTrip: boolean;
    numAdults: number;
    numChildren: number;
    numInfants: number;
    numPets: number;
    airbnbOrgData: AirbnbOrgData;
}

export interface AirbnbOrgData {
    __typename: string;
    bookerCauseId: any;
    bookerDisasterId: any;
    isCauseIdApplicableToListing: any;
    isDisasterIdApplicableToListing: any;
    openHomesAffiliated: any;
    airbnbOrgGuestType: any;
    airbnbOrgResponseId: any;
}

export interface StateMutation {
    __typename: string;
    modals: any;
    checkin: string;
    checkout: string;
    isWaitToPay: any;
    isWorkTrip: any;
    messageToHost: any;
    numberOfAdults: number;
    numberOfChildren: number;
    numberOfGuests: number;
    numberOfPets: any;
    numberOfInfants: number;
    openHomesAffiliated: any;
    tripPurpose: any;
}

export interface TemporaryQuickPayData {
    __typename: string;
    billInfo: BillInfo;
    bootstrapPaymentsJSON: string;
}

export interface BillInfo {
    __typename: string;
    billItemProductId: any;
    billItemProductType: string;
    isBusinessTravel: boolean;
    productInfos: ProductInfo[];
}

export interface ProductInfo {
    __typename: string;
    billItemProductId: any;
    billItemProductType: string;
}

export interface Extensions {
    traceId: string;
}
