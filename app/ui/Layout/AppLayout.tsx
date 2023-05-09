import type { ReactNode } from 'react';
import type { User } from '.prisma/client';
import { UserMenuComponent } from '~/ui/components/user/UserMenuComponent';
import { Link } from '@remix-run/react';
export const AppLayout = ({ children, user }: { children: ReactNode; user?: User }) => {
    return (
        <main
            className={
                'bg-gradient-to-b from-transparent to-white bg-background-start/40 relative'
            }>
            <div className={' bg-white bg-opacity-75 py-5 px-5 md:px-10 border-b border-grey-500 '}>
                <NavBar user={user} />
            </div>
            <section className={'px-5 sm:px-10 mt-5'}>{children}</section>
        </main>
    );
};
const NavBar = ({ user }: { user?: User }) => {
    return (
        <nav className={'flex w-full items-center justify-between'}>
            <Link to={'/'} className={'font-semibold text-title-medium'}>
                compairbnb
            </Link>
            <UserMenuComponent user={user}></UserMenuComponent>
        </nav>
    );
};
