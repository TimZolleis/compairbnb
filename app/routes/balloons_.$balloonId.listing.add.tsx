import { Modal } from '~/ui/components/modal/Modal';
import { Form, useNavigate, useNavigation } from '@remix-run/react';
import { TextInput } from '~/ui/components/form/TextInput';
import { DataFunctionArgs, redirect } from '@remix-run/node';
import { requireFormDataValue, requireParameter } from '~/utils/form/formdata.server';
import { LoadingComponent } from '~/ui/components/loading/LoadingComponent';
import { useState } from 'react';
import { Toggle } from '~/ui/components/form/Toggle';
import { updateBalloon } from '~/models/balloon.server';
import { createListing } from '~/models/listing.server';
import { BalloonDetailBadge } from '~/routes/balloons';
import { Button } from '~/ui/components/import/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '~/ui/components/import/card';
import { getOptionalBalloonFormValues } from '~/routes/balloons_.$balloonId.edit';
import { requireWritePermission } from '~/utils/auth/permission.server';

function parseAirbnbLink(link: string) {
    const url = new URL(link);
    const listingId = url.pathname.match(/\d+$/);
    if (!listingId) {
        throw new Error('Error parsing given link');
    }
    return { listingId: listingId[0], searchParams: url.searchParams };
}

export const action = async ({ request, params }: DataFunctionArgs) => {
    const sort = new URL(request.url).searchParams.get('sort');
    const balloonId = requireParameter('balloonId', params);
    await requireWritePermission(request, { balloonId });
    const formData = await request.formData();
    const airbnbLink = requireFormDataValue('airbnbLink', formData);
    if (formData.get('updateBalloon')) {
        const { balloonName, guests, startDate, endDate } = getOptionalBalloonFormValues(formData);
        await updateBalloon({ balloonName, balloonId, guests, startDate, endDate });
    }
    const { listingId, searchParams } = parseAirbnbLink(airbnbLink);
    const listing = await createListing({ balloonId, listingId });
    return redirect(`/balloons/${balloonId}?sort=${sort}`);
};

const AddListingToBalloonPage = () => {
    const [guests, setGuests] = useState<string | undefined>(undefined);
    const [checkIn, setCheckIn] = useState<string | undefined>(undefined);
    const [checkOut, setCheckOut] = useState<string | undefined>(undefined);
    const navigate = useNavigate();
    const toggleModal = () => {
        navigate(-1);
    };
    const navigation = useNavigation();
    const checkLink = (link: string) => {
        try {
            const { searchParams } = parseAirbnbLink(link);
            const guests = searchParams.get('adults') || undefined;
            const checkIn = searchParams.get('check_in') || undefined;
            const checkOut = searchParams.get('check_out') || undefined;
            setGuests(guests);
            setCheckIn(checkIn);
            setCheckOut(checkOut);
        } catch (e) {
            setGuests(undefined);
            setCheckIn(undefined);
            setCheckOut(undefined);
        }
    };

    return (
        <Modal showModal={true} toggleModal={toggleModal}>
            {navigation.state === 'idle' ? (
                <>
                    <Card className={'border-none shadow-none'}>
                        <CardHeader>
                            <CardTitle>Add listing</CardTitle>
                            <CardDescription>
                                Paste an airbnb link below to get started.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Form method={'POST'} className={'w-full'}>
                                <TextInput
                                    required={true}
                                    onChange={(event) => checkLink(event.target.value)}
                                    name={'airbnbLink'}
                                    placeholder={'https://airbnb.com/listings/123456'}></TextInput>

                                <div
                                    className={`flex items-center flex-wrap gap-2 ${
                                        guests || checkIn || checkOut ? 'mt-3' : ''
                                    }`}>
                                    {guests ? (
                                        <DetectedValueComponent
                                            description={'Guests'}
                                            value={guests}
                                            name={'guests'}
                                        />
                                    ) : null}
                                    {checkIn ? (
                                        <DetectedValueComponent
                                            description={'Check in date'}
                                            value={checkIn}
                                            name={'checkOut'}
                                        />
                                    ) : null}
                                    {checkOut ? (
                                        <DetectedValueComponent
                                            description={'Check Out date'}
                                            value={checkOut}
                                            name={'checkout'}
                                        />
                                    ) : null}
                                </div>

                                {guests || checkIn || !checkOut ? (
                                    <>
                                        <Label
                                            text={
                                                'Update balloon with detected values (guest number, dates)'
                                            }
                                        />
                                        <Toggle name={'updateBalloon'}></Toggle>
                                    </>
                                ) : null}
                                <span className={'flex items-center justify-between mt-5'}>
                                    <Button
                                        type={'button'}
                                        onClick={() => navigate(-1)}
                                        variant={'ghost'}>
                                        Cancel
                                    </Button>
                                    <Button>Add listing</Button>
                                </span>
                            </Form>
                        </CardContent>
                    </Card>
                </>
            ) : (
                <LoadingComponent loadingTitle={'Adding your listing...'} />
            )}
        </Modal>
    );
};

const Label = ({ text }: { text: string }) => {
    return (
        <span className={'leading-none w-full flex justify-start py-2'}>
            <p className={'text-sm text-muted-foreground'}>{text}</p>
        </span>
    );
};

const DetectedValueComponent = ({
    description,
    value,
    name,
}: {
    description: string;
    value: string;
    name: string;
}) => {
    return (
        <>
            <BalloonDetailBadge name={description} value={value} />
            <input type='hidden' name={name} value={value} />
        </>
    );
};

export default AddListingToBalloonPage;
