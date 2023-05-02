import type { ReactNode } from 'react';
import type { User } from '.prisma/client';
export const AppLayout = ({ children, user }: { children: ReactNode; user?: User }) => {
    return (
        <main className={''}>
            <div className={'w-full bg-white py-5 px-10 border-b border-grey-500 text-rose-500'}>
                <NavBar user={user} />
            </div>
            <section className={'px-10 mt-5'}>{children}</section>
        </main>
    );
};
const NavBar = ({ user }: { user?: User }) => {
    return (
        <nav className={'flex w-full items-center justify-between'}>
            <div className={'font-semibold text-title-medium'}>compairbnb</div>
            <div>
                {user ? (
                    <p className={'font-semibold'}>{user.name}</p>
                ) : (
                    <button className={'bg-rose-500 rounded-md text-white font-medium py-2 px-4'}>
                        Log in
                    </button>
                )}
            </div>
        </nav>
    );
};
