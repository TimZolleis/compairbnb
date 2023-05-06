import { cva } from 'class-variance-authority';

export const LoadingSpinner = ({ color }: { color: string }) => {
    return (
        <svg
            className='animate-spin -ml-1 mr-3 h-8 w-8 text-white'
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'>
            <circle
                className={`opacity-25 ${color}`}
                cx='12'
                cy='12'
                r='10'
                stroke='currentColor'
                strokeWidth='4'></circle>
            <path
                className='opacity-75'
                fill='currentColor'
                d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'></path>
        </svg>
    );
};

export const LoadingComponent = ({ loadingTitle }: { loadingTitle: string }) => {
    return (
        <div className={'rounded-md p-5 flex items-center flex-col gap-3'}>
            <p className={'font-semibold text-rose-500 text-title-medium'}>{loadingTitle}</p>
            <LoadingSpinner color={'stroke-rose-500'} />
        </div>
    );
};
