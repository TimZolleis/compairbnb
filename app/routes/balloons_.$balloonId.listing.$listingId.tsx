import { NavLink, Outlet, useMatches, useNavigate, useSearchParams } from '@remix-run/react';
import React, { ReactNode } from 'react';
import { Modal } from '~/components/ui/Modal';
import { cn } from '~/utils/utils';
import { useRouteParameters } from '~/utils/client-side-hooks/nav';

const ListingDetailsPage = () => {
    const navigate = useNavigate();
    const url = useRouteParameters('/balloons/$balloonId');
    return (
        <Modal width={'4xl'} showModal={true} toggleModal={() => navigate(url)}>
            <nav className={'px-5 md:px-0 mt-2 mb-5'}>
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
            end={true}
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
