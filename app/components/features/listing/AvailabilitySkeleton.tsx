import { Loading } from '~/components/ui/Loading';

export const AvailabilitySkeleton = () => {
    return (
        <div className={'space-y-2'}>
            {Array(5)
                .fill('')
                .map((value, index, array) => (
                    <Loading key={index} height={40} rounding={'md'} />
                ))}
        </div>
    );
};
