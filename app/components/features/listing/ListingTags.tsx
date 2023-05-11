import { Tag } from '.prisma/client';
import { useFetcher, useNavigation } from '@remix-run/react';
import React, { useEffect, useRef, useState } from 'react';
import { Badge } from '~/components/ui/Badge';
import { Loader2, X } from 'lucide-react';
import { Input } from '~/components/ui/Input';
import { Button } from '~/components/ui/Button';
import { cn } from '~/utils/utils';

export const ListingTags = ({ tags }: { tags: Tag[] }) => {
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
                    <Input size={'md'} innerRef={inputRef} name={'tagValue'} />
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
