import { Loading } from '~/components/ui/Loading';
import React from 'react';

export const ListingDetailsSkeleton = () => {
    const colorArray = Array(10).fill('');

    return (
        <div className={'p-5 flex flex-col md:flex-row gap-2 w-full'}>
            {/*Image container*/}
            <section className={'w-full'}>
                <Loading height={180} rounding={'md'} />
                <div className={'flex items-center gap-2 mt-3'}>
                    <Loading height={50} rounding={'md'} />
                    <Loading height={50} rounding={'md'} />
                    <Loading height={50} rounding={'md'} />
                </div>
            </section>
            <section className={'w-full space-y-2'}>
                {/*Text container*/}
                <div className={'flex flex-col gap-2'}>
                    <Loading rounding={'full'} height={20} maxWidth={100} />
                    <Loading rounding={'full'} height={25} maxWidth={200} />
                    <Loading rounding={'full'} height={25} maxWidth={80} />
                </div>
                {/*Button container*/}
                <div className={'flex items-center gap-2'}>
                    <Loading height={40} rounding={'md'} maxWidth={100} />
                    <Loading height={40} rounding={'md'} maxWidth={100} />
                </div>
                {/*Tag container*/}
                <div className={'flex flex-col gap-2'}>
                    <Loading height={20} rounding={'full'} maxWidth={50} />
                    <Loading height={20} rounding={'full'} />
                    <div className={'flex items-center gap-2 flex-wrap'}>
                        {colorArray.map((value, index) => (
                            <Loading key={index} height={30} rounding={'full'} maxWidth={30} />
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};
