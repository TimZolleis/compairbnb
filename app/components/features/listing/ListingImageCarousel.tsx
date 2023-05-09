import { Listing } from '.prisma/client';
import { ListingDetails } from '~/types/airbnb-listing-details';
import React, { useEffect, useRef, useState } from 'react';
import { cn } from '~/utils/utils';
import { motion } from 'framer-motion';

export const ListingImageCarousel = ({
    listing,
    details,
}: {
    listing: Listing;
    details: ListingDetails;
}) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedImage, setSelectedImage] = useState(
        details.listing.xl_picture_urls[currentIndex]
    );
    return (
        <div className={'p-5 md:p-0  w-full md:w-96 overflow-hidden flex flex-col items-center'}>
            <img
                key={selectedImage}
                className={'md:w-96 w-full h-44 md:h-64 rounded-md object-cover'}
                src={details.listing.xl_picture_urls[currentIndex]}
                alt=''
            />
            <ImageNavigation
                setIndex={(index) => {
                    setCurrentIndex(index);
                }}
                index={currentIndex}
                imageUrls={details.listing.thumbnail_urls}
            />
        </div>
    );
};
interface NavigationProps {
    index: number;
    imageUrls: string[];
    setIndex: (index: number) => void;
}

const ImageNavigation = ({ index, imageUrls, setIndex }: NavigationProps) => {
    const ref = useRef<HTMLDivElement>(null);
    const imageRefs: Array<HTMLImageElement | null> = [];

    const calculateScrollPosition = () => {
        const imageRef = imageRefs[index];
        if (ref.current && imageRef) {
            const screenCenter = window.innerWidth / 2;
            const bounds = imageRef.getBoundingClientRect();
            const elementWidth = bounds.width;
            const center = bounds.x + elementWidth / 2;
            ref.current.scrollLeft += center - screenCenter;
        }
    };
    useEffect(() => {
        calculateScrollPosition();
    }, [index]);

    return (
        <motion.div
            ref={ref}
            initial={false}
            className={'mt-2 flex items-center gap-2 overflow-scroll'}>
            {imageUrls.map((url, imageIndex) => (
                <img
                    key={url}
                    ref={(ref) => imageRefs.push(ref)}
                    onClick={() => {
                        setIndex(imageIndex);
                    }}
                    alt='small photos on the bottom'
                    className={cn(
                        'object-cover rounded-md  aspect-video',
                        imageIndex === index ? 'w-36' : 'w-32'
                    )}
                    src={url}
                />
            ))}
        </motion.div>
    );
};
