import { Popover } from '@headlessui/react';
import { Link } from '@remix-run/react';
import { AnimatePresence, motion } from 'framer-motion';
import { User } from '.prisma/client';

export const UserMenuComponent = ({ user }: { user: User | undefined }) => {
    return (
        <Popover className='relative min-w-fit'>
            {({ open }) => (
                <>
                    <Popover.Button className={'focus:outline-none'}>
                        {user ? (
                            <span className={'flex items-center gap-2'}>
                                <div
                                    className={
                                        'w-7 h-7 rounded-full bg-gradient-to-br from-[#9cecfb] via-[#65c7f7] to-[#0052d4]'
                                    }></div>
                                <p className={'font-semibold'}>{user.name}</p>
                            </span>
                        ) : (
                            <Link
                                to={'/login'}
                                className={
                                    'inline-flex items-center rounded-md bg-rose-500 px-3 py-2 text-base font-medium text-white'
                                }>
                                Log in
                            </Link>
                        )}
                    </Popover.Button>
                    <AnimatePresence>
                        {open && (
                            <motion.div
                                initial={{ opacity: 0, y: 50 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 50 }}>
                                <Popover.Panel
                                    static
                                    className={
                                        'absolute  z-10 mt-3 -translate-x-1/2 transform px-4 sm:px-0 min-w-max'
                                    }>
                                    <div className='overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5'>
                                        <div className='relative grid gap-2 bg-white px-2 py-3'>
                                            <PopoverItem
                                                name={'Balloons'}
                                                description={'See and edit your balloons'}
                                                href={'/balloons'}
                                            />
                                            <PopoverItem
                                                name={'Account'}
                                                description={'See and edit your balloons'}
                                                href={'/balloons'}
                                            />
                                        </div>
                                        <div className='bg-gray-50 px-2 py-3'>
                                            <Link
                                                to={'/logout'}
                                                className='flow-root rounded-md p-2 transition duration-150 ease-in-out'>
                                                <span className='flex items-center'>
                                                    <span className='text-sm font-medium text-gray-900'>
                                                        Sign out
                                                    </span>
                                                </span>
                                            </Link>
                                        </div>
                                    </div>
                                </Popover.Panel>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </>
            )}
        </Popover>
    );
};

const PopoverItem = ({
    name,
    description,
    href,
}: {
    name: string;
    description: string;
    href: string;
}) => {
    return (
        <Link
            key={name}
            to={href}
            className='flex items-center rounded-lg p-2 transition duration-150 ease-in-out hover:bg-gray-50 focus:outline-none focus-visible:ring focus-visible:ring-orange-500 focus-visible:ring-opacity-50'>
            <div className=''>
                <p className='text-sm font-medium text-gray-900'>{name}</p>
                <p className='text-sm text-gray-500'>{description}</p>
            </div>
        </Link>
    );
};
