import { useState } from 'react';
import { Minus, Plus, Users2 } from 'lucide-react';
import { motion } from 'framer-motion';

export const GuestCount = ({ startingValue }: { startingValue?: number }) => {
    const [count, setCount] = useState(startingValue ? startingValue : 1);
    const reduceCount = () => {
        if (count >= 2) {
            setCount(count - 1);
        }
    };
    const increaseCount = () => {
        setCount(count + 1);
    };

    return (
        <div className='flex items-center space-x-4 rounded-md border p-4 justify-between select-none'>
            <div className={'flex items-center space-x-4'}>
                <Users2 />
                <div className='flex-1 space-y-1'>
                    <p className='text-sm font-medium leading-none'>Guests</p>
                    <p className='text-sm text-muted-foreground'>Select a number</p>
                </div>
            </div>
            <div className={'flex items-center space-x-4'}>
                <span
                    className={'rounded-full p-1 border-gray-200 border hover:cursor-pointer'}
                    onClick={reduceCount}>
                    <Minus size={20}></Minus>
                </span>
                <motion.p
                    key={count}
                    className={'font-medium text-lg'}
                    initial={{ scale: 1.2 }}
                    animate={{ scale: 1 }}>
                    {count}
                </motion.p>
                <input type='hidden' value={count} name={'guests'} />
                <span
                    className={'rounded-full p-1 border-gray-200 border hover:cursor-pointer'}
                    onClick={increaseCount}>
                    <Plus size={20}></Plus>
                </span>
            </div>
        </div>
    );
};
