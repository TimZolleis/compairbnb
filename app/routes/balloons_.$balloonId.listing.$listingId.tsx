import { NavLink, Outlet, useMatches, useNavigate, useSearchParams } from '@remix-run/react';
import React, { ReactNode } from 'react';
import { Modal } from '~/ui/components/modal/Modal';
import { cn } from '~/utils/utils';

const ListingDetailsPage = () => {
    const navigate = useNavigate();
    return (
        <Modal width={'4xl'} showModal={true} toggleModal={() => navigate(-1)}>
            <nav className={'px-5 mt-2'}>
                <div
                    className={
                        'w-full flex items-center p-1 justify-between bg-secondary/50 rounded-full'
                    }>
                    <TabLink preserveSearch={true} to={''}>
                        Details
                    </TabLink>
                    <TabLink preserveSearch={true} to={'calendar'}>
                        Calendar
                    </TabLink>
                    <TabLink preserveSearch={true} to={'map'}>
                        Map
                    </TabLink>
                </div>
            </nav>
            <Outlet />
        </Modal>
    );
};

const TabLink = ({
    to,
    children,
    preserveSearch,
}: {
    to: string;
    children?: ReactNode | string;
    preserveSearch?: boolean;
}) => {
    const [search] = useSearchParams();
    const matches = useMatches();
    const { id } = matches[matches.length - 2];

    return (
        <NavLink
            className={({ isActive, isPending }) =>
                cn(
                    'flex w-full justify-center items-center p-2 rounded-full text-sm',
                    isActive ? 'bg-white font-medium' : 'text-gray-600'
                )
            }
            to={{ pathname: to, search: preserveSearch ? search.toString() : '' }}>
            {children}
        </NavLink>
    );
};

export default ListingDetailsPage;
