import type { Metadata } from 'next';
import { NavBar } from '@/components/ui';

export const metadata: Metadata = {
  title: 'Bamboo',
  description: 'Bamboo app help getting things done',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
        <NavBar />
        {children}
    </>
  );
}
