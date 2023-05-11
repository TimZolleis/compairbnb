import { motion } from 'framer-motion';
import { useState } from 'react';
import { Switch } from 'react-aria-components';

const spring = {
    type: 'spring',
    stiffness: 700,
    damping: 30,
};

export const Toggle = ({ name }: { name: string }) => {
    const [isOn, setIsOn] = useState(false);
    return (
        <span className={'flex justify-start'}>
            <Switch
                name={name}
                isSelected={isOn}
                onChange={setIsOn}
                className='group inline-flex touch-none items-center'
                style={{ WebkitTapHighlightColor: 'transparent' }}>
                <span className='group-data-[selected]:bg-rose-500 group-data-[focus-visible]:ring-2 mr-4 h-6 w-9 cursor-pointer rounded-full border-2 border-transparent bg-zinc-200 ring-offset-2 ring-offset-zinc-900 transition duration-200'>
                    <span className='group-data-[selected]:ml-3 group-data-[selected]:group-data-[pressed]:ml-2 group-data-[pressed]:w-6 block h-5 w-5 origin-right rounded-full bg-white shadow transition-all duration-200' />
                </span>
            </Switch>
        </span>
    );
};
