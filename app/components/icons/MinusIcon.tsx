import { ClickableIconProps, icon, IconProps } from '~/components/icons/icon';

export const MinusIcon = ({ size, hover, onClick }: ClickableIconProps) => {
    return (
        <svg
            onClick={onClick}
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            strokeWidth={1.5}
            stroke='currentColor'
            className={icon({ size, hover })}>
            <path strokeLinecap='round' strokeLinejoin='round' d='M19.5 12h-15' />
        </svg>
    );
};
