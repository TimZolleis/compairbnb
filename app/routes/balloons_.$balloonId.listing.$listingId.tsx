import { Modal } from '~/ui/components/modal/Modal';
import {
    Await,
    Link,
    useFetcher,
    useLoaderData,
    useNavigate,
    useNavigation,
} from '@remix-run/react';
import { DataFunctionArgs, defer } from '@remix-run/node';
import { requireParameter } from '~/utils/form/formdata.server';
import { prisma } from '../../prisma/db';
import { requireUser } from '~/utils/auth/session.server';
import { getListing, getListingDetails } from '~/utils/axios/api/listing.server';
import { requireResult } from '~/models/listing.server';
import { Balloon, Listing, Tag } from '.prisma/client';
import React, { Suspense, useEffect, useRef, useState } from 'react';
import { Badge } from '~/ui/components/common/Tag';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '~/ui/components/import/card';
import { Button, buttonVariants } from '~/ui/components/import/button';
import { ExternalLink, Loader2, X } from 'lucide-react';
import { TextInput } from '~/ui/components/form/TextInput';
import { cn } from '~/utils/utils';
import { requireReadPermission, requireWritePermission } from '~/utils/auth/permission.server';
import { ListingDetails } from '~/types/airbnb-listing-details';
import { element } from 'prop-types';
import { AnimatePresence, motion, wrap } from 'framer-motion';

type ListingWithTags = Listing & { tags: Tag[] };

export const loader = async ({ request, params }: DataFunctionArgs) => {
    const listingId = requireParameter('listingId', params);
    const balloonId = requireParameter('balloonId', params);
    const balloon = await prisma.balloon
        .findUnique({
            where: { id: balloonId },
        })
        .then(requireResult<Balloon>);
    await requireReadPermission(request, { balloon });
    const bookingDetails = getListing({
        guests: balloon.guests,
        checkIn: balloon.startDate,
        checkOut: balloon.endDate,
        listingId,
    });
    const listing = prisma.listing
        .findUnique({ where: { id: listingId }, include: { tags: true } })
        .then(requireResult<ListingWithTags>);
    const listingDetails = getListingDetails(listingId);

    const listingWithDetailsAndBookingDetailsPromise = Promise.all([
        listing,
        bookingDetails,
        listingDetails,
    ]);

    return defer({ balloon, listingWithDetailsAndBookingDetailsPromise });
};

export const action = async ({ request, params }: DataFunctionArgs) => {
    const formData = await request.formData();
    const balloonId = requireParameter('balloonId', params);
    await requireWritePermission(request, { balloonId });
    const listingId = requireParameter('listingId', params);
    const intent = formData.get('intent')?.toString();
    if (intent === 'addTag') {
        const tagValue = formData.get('tagValue')?.toString();
        const tagColor = formData.get('tagColor')?.toString();
        if (!tagValue || !tagColor) {
            return null;
        }
        await prisma.tag.create({
            data: {
                listingId,
                value: tagValue,
                color: tagColor,
            },
        });
    }
    if (intent === 'deleteTag') {
        const tagId = formData.get('tagId')?.toString();
        await prisma.tag.delete({
            where: {
                id: tagId,
            },
        });
    }

    return null;
};

const ListingDetailsComponent = () => {
    const navigate = useNavigate();
    const { balloon, listingWithDetailsAndBookingDetailsPromise } = useLoaderData<typeof loader>();

    return (
        <Modal width={'4xl'} showModal={true} toggleModal={() => navigate(-1)}>
            <div className={'flex flex-col md:flex-row'}>
                <Suspense
                    fallback={
                        <div className={'flex flex-col md:flex-row gap-5'}>
                            <div className={'bg-gray-200 w-96 h-64 rounded-xl animate-pulse'}></div>
                            <LoadingListingDetailsComponent />
                        </div>
                    }>
                    <Await resolve={listingWithDetailsAndBookingDetailsPromise}>
                        {([listing, bookingDetails, listingDetails]) => (
                            <>
                                <ListingImageComponent listing={listing} details={listingDetails} />
                                <Card className={'border-none shadow-none'}>
                                    <CardHeader>
                                        <Badge
                                            className={'self-start'}
                                            variant={
                                                bookingDetails.availability
                                                    .isAvailableDuringRequestedTimeframe
                                                    ? 'positive'
                                                    : 'destructive'
                                            }>
                                            {bookingDetails.availability
                                                .isAvailableDuringRequestedTimeframe
                                                ? 'Available'
                                                : 'Not available'}
                                        </Badge>
                                        <CardTitle>{listing.name}</CardTitle>
                                        <div className={'space-x-2 flex items-center'}>
                                            <CardDescription>
                                                {listing.locationName}
                                            </CardDescription>
                                            <Badge variant={'outline'}>
                                                {listing.distance?.toFixed(2)}km
                                            </Badge>
                                        </div>
                                        <p className={'font-bold text-2xl'}>
                                            {bookingDetails.pricing.totalPrice}
                                        </p>
                                        <div className={'flex gap-x-2'}>
                                            <Link
                                                target={'_blank'}
                                                to={`https://airbnb.com/rooms/${listing.id}`}
                                                className={buttonVariants({
                                                    size: 'sm',
                                                })}>
                                                <span className={'gap-2 flex items-center'}>
                                                    <ExternalLink size={14}></ExternalLink>
                                                    Airbnb
                                                </span>
                                            </Link>
                                            <Link
                                                target={'_blank'}
                                                to={`https://www.google.com/maps/dir/?api=1&origin=${balloon.locationName}&destination=${listing.lat},${listing.long}&travelmode=driving`}
                                                className={buttonVariants({
                                                    variant: 'secondary',
                                                    size: 'sm',
                                                })}>
                                                <span className={'gap-2 flex items-center'}>
                                                    <ExternalLink size={14}></ExternalLink>
                                                    Google Maps
                                                </span>
                                            </Link>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <TagsComponent tags={listing.tags} />
                                    </CardContent>
                                </Card>
                            </>
                        )}
                    </Await>
                </Suspense>
            </div>
        </Modal>
    );
};

const ListingImageComponent = ({
    listing,
    details,
}: {
    listing: Listing;
    details: ListingDetails;
}) => {
    const [selectedImage, setSelectedImage] = useState(listing.thumbnailImageUrl);
    const imageRef = useRef<HTMLImageElement>(null);
    const scrollRef = useRef<HTMLDivElement>(null);

    return (
        <div className={'p-5 md:p-0  w-full md:w-96 overflow-scroll flex flex-col items-center'}>
            <img
                key={selectedImage}
                className={'md:w-96 w-full h-44 md:h-64 rounded-md object-cover'}
                src={selectedImage}
                alt=''
            />
            <div ref={scrollRef} className={'flex items-center mt-2 gap-2 overflow-scroll'}>
                {details.listing.xl_picture_urls.map((url, index) => (
                    <img
                        key={url}
                        ref={imageRef}
                        onClick={() => {
                            if (scrollRef.current && imageRef.current) {
                                scrollRef.current.scrollLeft =
                                    (index - 1) * (imageRef.current.clientWidth + 8);
                            }
                            setSelectedImage(url);
                        }}
                        className={cn(
                            'rounded-md bg-gray-200 object-cover hover:cursor-pointer',
                            url === selectedImage ? 'h-20' : 'h-16'
                        )}
                        src={url}
                    />
                ))}
            </div>
        </div>
    );
};

const TagsComponent = ({ tags }: { tags: Tag[] }) => {
    const fetcher = useFetcher();
    const deleteTagFetcher = useFetcher();
    const ref = useRef<HTMLFormElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const navigation = useNavigation();
    useEffect(() => {
        if (navigation.state !== 'submitting') {
            ref.current?.reset();
            inputRef.current?.focus();
        }
    }, [navigation.state === 'submitting']);

    return (
        <>
            <span className={'flex items-center gap-3 rounded-md hover:cursor-pointer'}>
                <p className={'font-medium'}>Tags</p>
            </span>
            <div className={'flex items-center flex-wrap gap-x-2 gap-y-1'}>
                {tags.map((tag) => (
                    <deleteTagFetcher.Form method={'POST'} key={tag.id}>
                        <button name={'intent'} value={'deleteTag'}>
                            <Badge
                                className={'flex items-center justify-between gap-2'}
                                style={{
                                    backgroundColor: tag.color,
                                    opacity:
                                        deleteTagFetcher.state !== 'idle' &&
                                        deleteTagFetcher.formData?.get('tagId') === tag.id
                                            ? 0.2
                                            : 1,
                                }}>
                                <p
                                    style={{
                                        color: tagColors.find((c) => c.color === tag.color)
                                            ?.textColor,
                                    }}>
                                    {tag.value}
                                </p>
                                <X
                                    color={tagColors.find((c) => c.color === tag.color)?.textColor}
                                    size={16}></X>
                            </Badge>
                        </button>
                        <input type='hidden' name={'tagId'} value={tag.id} />
                    </deleteTagFetcher.Form>
                ))}
            </div>
            <div className={'mt-4'}>
                <fetcher.Form
                    ref={ref}
                    className={'flex flex-col items-start w-full'}
                    method={'POST'}>
                    <TextInput size={'md'} innerRef={inputRef} name={'tagValue'} />
                    <span className={'flex justify-between items-start w-full mt-4'}>
                        <ColorPicker />
                        <Button
                            name={'intent'}
                            value={'addTag'}
                            disabled={fetcher.state !== 'idle'}
                            size={'sm'}>
                            {fetcher.state !== 'idle' ? (
                                <>
                                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                                    Adding
                                </>
                            ) : (
                                'Add'
                            )}
                        </Button>
                    </span>
                </fetcher.Form>
            </div>
        </>
    );
};

export const tagColors = [
    {
        displayColor: '#667c8b',
        color: '#dce3e8',
        textColor: '#506472',
    },
    {
        displayColor: '#186ade',
        color: '#d4e4fa',
        textColor: '#5484c4',
    },
    {
        displayColor: '#d91f11',
        color: '#fadcd9',
        textColor: '#a8271b',
    },
    {
        displayColor: '#077d55',
        color: '#c7ebd1',
        textColor: '#2f7b62',
    },
    {
        displayColor: '#f5c518',
        color: '#faf6cf',
        textColor: '#3f4c4e',
    },
    {
        displayColor: '#e86427',
        color: '#fcddc7',
        textColor: '#ad6246',
    },
    {
        displayColor: '#3c7d0e',
        color: '#d5f0b1',
        textColor: '#729850',
    },
    {
        displayColor: '#167b7d',
        color: '#beebe7',
        textColor: '#468586',
    },
    {
        displayColor: '#067a91',
        color: '#c7e8ed',
        textColor: '#67a0ab',
    },
    {
        displayColor: '#0073ba',
        color: '#c9e7f5',
        textColor: '#528cb2',
    },
    {
        displayColor: '#535fe8',
        color: '#dee0fa',
        textColor: '#4c55b8',
    },
    {
        displayColor: '#8f49de',
        color: '#eadcfc',
        textColor: '#ab87d4',
    },
    {
        displayColor: '#cc1d91',
        color: '#f7daed',
        textColor: '#a83b8b',
    },
];
const ColorPicker = () => {
    const [selectedColor, setSelectedColor] = useState(tagColors[0]);
    return (
        <div className={'flex items-center gap-2 flex-wrap'}>
            {tagColors.map((color) => (
                <div
                    onClick={() => setSelectedColor(color)}
                    key={color.color}
                    style={{ backgroundColor: color.displayColor }}
                    className={cn(
                        'rounded-full h-6 w-6 hover:cursor-pointer',
                        selectedColor === color
                            ? 'ring-2 ring-gray-500 ring-offset-2 ring-offset-white'
                            : ''
                    )}
                />
            ))}
            <input type='hidden' name={'tagColor'} value={selectedColor.color} />
        </div>
    );
};

const LoadingListingDetailsComponent = () => {
    return (
        <div className={'space-y-2'}>
            <div className={'bg-gray-200 w-40 rounded-full h-4 animate-pulse'}></div>
            <div className={'bg-gray-200 w-96 rounded-full h-6 animate-pulse'}></div>
            <span className={'flex gap-2 w-96'}>
                <div className={'bg-gray-200 w-full rounded-full h-6 animate-pulse'}></div>
                <div className={'bg-gray-200 w-full rounded-full h-6 animate-pulse'}></div>
            </span>
            <div className={'bg-gray-200 w-24 rounded-full h-6 animate-pulse'}></div>
            <span className={'flex items-center gap-3'}>
                <div className={'rounded-md h-10 w-40 bg-gray-200 animate-pulse'}></div>
                <div className={'rounded-md h-10 0 w-40 bg-gray-200 animate-pulse'}></div>
            </span>
            <div className={'bg-gray-200 w-20 rounded-full h-6 animate-pulse'}></div>
        </div>
    );
};

export default ListingDetailsComponent;
