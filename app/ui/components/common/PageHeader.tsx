export const PageHeader = ({ children }: { children: string | undefined }) => {
    return <h2 className={'font-semibold text-headline-large'}>{children}</h2>;
};
