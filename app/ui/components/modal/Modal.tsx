import React, { ReactNode, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CloseIcon } from '~/ui/icons/CloseIcon';

export const Modal = ({
    showModal,
    toggleModal,
    children,
}: {
    showModal: boolean;
    toggleModal: () => void;
    children: ReactNode;
}) => {
    useEffect(() => {
        if (showModal) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
    }, [showModal]);

    const closeModal = () => {
        if (document !== undefined) {
            document.body.style.overflow = 'auto';
            toggleModal();
        }
    };

    return (
        <>
            <AnimatePresence>
                {showModal ? (
                    <motion.div
                        key={showModal.toString()}
                        onClick={() => closeModal()}
                        className={
                            'fixed bottom-0 left-0 right-0 top-0 z-50 flex flex-col items-center justify-center backdrop-blur-sm bg-white/30 p-3 '
                        }
                        initial={{
                            opacity: 0,
                        }}
                        animate={{
                            opacity: 1,
                            transition: {
                                duration: 0.1,
                                type: 'spring',
                                damping: 25,
                                stiffness: 500,
                            },
                        }}
                        exit={{ opacity: 0 }}>
                        <motion.section
                            initial={{
                                opacity: 0,
                                y: 500,
                            }}
                            animate={{
                                opacity: 1,
                                y: 0,
                                transition: {
                                    duration: 0.05,
                                    type: 'spring',
                                    damping: 25,
                                    stiffness: 500,
                                },
                            }}
                            exit={{ y: 500, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className={
                                'relative overflow-y-scroll text-center rounded-xl w-full border border-gray-500/30 bg-white shadow-xl ring-1 ring-gray-900/5 backdrop-blur-lg max-w-xl mx-auto px-5 py-3'
                            }>
                            <span className={'absolute right-0 p-3'}>
                                <CloseIcon
                                    onClick={() => closeModal()}
                                    hover={'pointer'}
                                    size={'sm'}
                                />
                            </span>

                            <div className={'px-5 py-5'}>{children}</div>
                        </motion.section>
                    </motion.div>
                ) : null}
            </AnimatePresence>
        </>
    );
};

export function useModal(showInitial: boolean = false) {
    const [showModal, setShowModal] = useState(showInitial);

    function toggleModal() {
        setShowModal(!showModal);
    }

    return { showModal, toggleModal, setShowModal };
}
