import { motion } from 'framer-motion';
import { useState } from 'react';

const spring = {
    type: 'spring',
    stiffness: 700,
    damping: 30,
};

export const Toggle = ({ name }: { name: string }) => {
    const [isOn, setIsOn] = useState(false);
    return (
        <div
            className={`w-10 h-6 flex justify-start py-2 px-1 rounded-full items-center ${
                isOn
                    ? 'bg-red-500/30 justify-end'
                    : 'bg-transparent border border-rose-500/30 justify-start'
            }`}
            onClick={() => setIsOn(!isOn)}>
            <motion.div className={'w-4 h-4 rounded-full bg-rose-500'} layout transition={spring} />
            <input type={'hidden'} name={name} value={isOn ? 'true' : 'false'} />
        </div>
    );
};
