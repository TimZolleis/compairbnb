import { ClickableIconProps, icon, IconProps } from '~/ui/icons/icon';

export const PlusIcon = ({ size, hover, onClick }: ClickableIconProps) => {
    return (
        <svg
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            strokeWidth={1.5}
            stroke='currentColor'
            onClick={() => onClick()}
            className={icon({ size, hover })}>
            <path strokeLinecap='round' strokeLinejoin='round' d='M12 4.5v15m7.5-7.5h-15' />
        </svg>
    );
};
