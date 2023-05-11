import { ClickableIconProps, icon, IconProps } from '~/components/icons/icon';

export const ChevronUpIcon = ({ color, size, direction }: IconProps) => {
    return (
        <svg
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            strokeWidth={1.5}
            stroke='currentColor'
            className={icon({ color, size, direction })}>
            <path strokeLinecap='round' strokeLinejoin='round' d='M19.5 8.25l-7.5 7.5-7.5-7.5' />
        </svg>
    );
};
