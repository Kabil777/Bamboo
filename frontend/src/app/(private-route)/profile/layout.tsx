import { NavBar } from '@/components/ui';


export default function Layout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
            <div>
                layout
                {children}
            </div>
        </>
    );
}
