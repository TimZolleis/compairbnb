import { Balloon } from '.prisma/client';
import { Popover } from '@headlessui/react';

export const BalloonDetailBadge = ({ name, value }: { name: string; value: string }) => {
    return (
        <div className={'flex'}>
            <div
                className={
                    'rounded-full py-1 px-3 flex items-center gap-2 bg-white shadow-md border text-sm'
                }>
                <p className={'text-gray-600'}>{name}:</p>
                <p className={'font-medium'}>{value}</p>
            </div>
        </div>
    );
};

export const BalloonSettings = ({ balloon }: { balloon: Balloon }) => {
    const calculateNights = () => {
        const startDate = new Date(balloon.startDate);
        const endDate = new Date(balloon.endDate);
        const diff = endDate.getTime() - startDate.getTime();
        return Math.floor(diff / (1000 * 60 * 60 * 24));
    };
    return (
        <div className={'flex items-center gap-2 flex-wrap'}>
            <BalloonDetailBadge name={'Guests'} value={balloon.guests.toString()} />
            <Popover className={'relative'}>
                <Popover.Button>
                    <BalloonDetailBadge name={'Start date'} value={balloon.startDate.toString()} />
                </Popover.Button>
                <Popover.Panel className={'absolute z-10 bg-white'}>Calendar here</Popover.Panel>
            </Popover>
            <BalloonDetailBadge name={'End date'} value={balloon.endDate.toString()} />
            <BalloonDetailBadge name={'Nights'} value={calculateNights().toString()} />
            <BalloonDetailBadge name={'Starting location'} value={balloon.locationName} />
        </div>
    );
};
