export const PageHeader = ({ children }: { children: string | undefined }) => {
    return <h2 className={'font-semibold text-headline-large leading-none'}>{children}</h2>;
};
