import { Loading } from '~/components/ui/Loading';

export const CalendarSkeleton = () => {
    return (
        <div>
            {/*Navigation */}
            <div className={'flex items-center gap-2'}>
                <Loading rounding={'full'} maxWidth={100} height={20} />
                <Loading rounding={'full'} maxWidth={20} height={20} />
                <Loading rounding={'full'} maxWidth={20} height={20} />
            </div>

            {/*Dates*/}
            <div className={'grid grid-cols-7 justify-items-center gap-2 mt-10'}>
                {Array(31)
                    .fill('')
                    .map((value, index, array) => (
                        <Loading key={index} height={40} rounding={'full'} maxWidth={40} />
                    ))}
            </div>
        </div>
    );
};
