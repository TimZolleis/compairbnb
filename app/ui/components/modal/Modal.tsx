import React, { ReactNode, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CloseIcon } from '~/ui/icons/CloseIcon';
import { cva, VariantProps } from 'class-variance-authority';
import { X } from 'lucide-react';

const modal = cva(
    'relative overflow-y-scroll w-full bg-white shadow-xl rounded-xl border bg-card text-card-foreground shadow-sm backdrop-blur-lg mx-auto ',
    {
        variants: {
            width: {
                lg: 'max-w-lg',
                xl: 'max-w-xl',
                '2xl': 'max-w-2xl',
                '3xl': 'max-w-3xl',
                '4xl': 'max-w-4xl',
                '5xl': 'max-w-5xl',
                '6xl': 'max-w-6xl',
                '7xl': 'max-w-7xl',
                '8xl': 'max-w-8xl',
            },
        },
        defaultVariants: {
            width: 'xl',
        },
    }
);

interface ModalProps extends VariantProps<typeof modal> {
    showModal: boolean;
    toggleModal: () => void;
    children: ReactNode;
}

export const Modal = ({ showModal, toggleModal, children, width }: ModalProps) => {
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
                            'fixed bottom-0 left-0 right-0 top-0 z-50 flex flex-col items-center justify-center backdrop-blur-md bg-white/30 p-3 '
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
                            className={modal({ width })}>
                            <div className={'md:px-5 md:py-5 relative'}>
                                <div
                                    className={'pt-2 pr-2 absolute top-0 right-0'}
                                    onClick={() => closeModal()}>
                                    <X className={'stroke-gray-400 stroke-2'}></X>
                                </div>
                                <section className={'pt-5 md:p-0'}>{children}</section>
                            </div>
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
