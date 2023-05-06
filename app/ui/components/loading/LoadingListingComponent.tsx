import { motion } from 'framer-motion';
export const LoadingListingComponent = () => {
    return (
        <div className={'animate-pulse'}>
            <div className={'h-44 w-72 rounded-xl bg-zinc-300 '} />
            <div className={''}>
                <div className={'h-4 w-64 bg-zinc-300 rounded-full mt-2'}></div>
                <div className={'h-4 w-32 bg-zinc-300 rounded-full mt-2'}></div>
            </div>
        </div>
    );
};

export const LoadingListingsComponentGrid = ({ length }: { length: number }) => {
    const array = Array(length).fill('');

    return (
        <div className={'flex items-center flex-wrap gap-5 mt-5'}>
            {array.map((a, i) => (
                <LoadingListingComponent key={i} />
            ))}
        </div>
    );
};
