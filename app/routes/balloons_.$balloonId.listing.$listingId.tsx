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
import { getListing } from '~/utils/axios/api/listing.server';
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
    const details = getListing({
        guests: balloon.guests,
        checkIn: balloon.startDate,
        checkOut: balloon.endDate,
        listingId,
    });
    const listing = prisma.listing
        .findUnique({ where: { id: listingId }, include: { tags: true } })
        .then(requireResult<ListingWithTags>);

    return defer({ details, listing, balloon });
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
    const { details, listing, balloon } = useLoaderData<typeof loader>();

    return (
        <Modal width={'4xl'} showModal={true} toggleModal={() => navigate(-1)}>
            <div className={'flex'}>
                <Suspense
                    fallback={
                        <div className={'flex gap-5'}>
                            <div className={'bg-gray-200 w-96 h-64 rounded-xl animate-pulse'}></div>
                            <LoadingListingDetailsComponent />
                        </div>
                    }>
                    <Await resolve={listing}>
                        {(listingResult) => (
                            <>
                                <img
                                    className={'w-96 h-64 rounded-md object-cover mt-5'}
                                    src={listingResult.thumbnailImageUrl}
                                    alt=''
                                />
                                <Suspense
                                    fallback={
                                        <div className={'ml-5'}>
                                            <LoadingListingDetailsComponent />
                                        </div>
                                    }>
                                    <Await resolve={details}>
                                        {(detailsResult) => (
                                            <Card className={'border-none w-full shadow-none'}>
                                                <CardHeader>
                                                    <Badge
                                                        className={'self-start'}
                                                        variant={
                                                            detailsResult.availability
                                                                .isAvailableDuringRequestedTimeframe
                                                                ? 'positive'
                                                                : 'destructive'
                                                        }>
                                                        {detailsResult.availability
                                                            .isAvailableDuringRequestedTimeframe
                                                            ? 'Available'
                                                            : 'Not available'}
                                                    </Badge>
                                                    <CardTitle>{listingResult.name}</CardTitle>
                                                    <div className={'space-x-2 flex items-center'}>
                                                        <CardDescription>
                                                            {listingResult.locationName}
                                                        </CardDescription>
                                                        <Badge variant={'outline'}>
                                                            {listingResult.distance?.toFixed(2)}km
                                                        </Badge>
                                                    </div>
                                                    <p className={'font-bold text-2xl'}>
                                                        {detailsResult.pricing.totalPrice}
                                                    </p>
                                                    <div className={'flex gap-x-2'}>
                                                        <Link
                                                            to={`https://airbnb.com/rooms/${listingResult.id}`}
                                                            className={buttonVariants({
                                                                size: 'sm',
                                                            })}>
                                                            <span
                                                                className={
                                                                    'gap-2 flex items-center'
                                                                }>
                                                                <ExternalLink
                                                                    size={14}></ExternalLink>
                                                                View on airbnb
                                                            </span>
                                                        </Link>
                                                        <Link
                                                            target={'_blank'}
                                                            to={`https://www.google.com/maps/dir/?api=1&origin=${balloon.locationName}&destination=${listingResult.lat},${listingResult.long}&travelmode=driving`}
                                                            className={buttonVariants({
                                                                variant: 'secondary',
                                                                size: 'sm',
                                                            })}>
                                                            <span
                                                                className={
                                                                    'gap-2 flex items-center'
                                                                }>
                                                                <ExternalLink
                                                                    size={14}></ExternalLink>
                                                                View on Google Maps
                                                            </span>
                                                        </Link>
                                                    </div>
                                                </CardHeader>
                                                <CardContent>
                                                    <TagsComponent tags={listingResult.tags} />
                                                </CardContent>
                                            </Card>
                                        )}
                                    </Await>
                                </Suspense>
                            </>
                        )}
                    </Await>
                </Suspense>
            </div>
        </Modal>
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
