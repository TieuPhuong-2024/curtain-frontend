'use client';

import { usePathname } from 'next/navigation';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FloatingContact from '@/components/FloatingContact';

export default function SiteChrome({ children }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');

  if (isAdmin) {
    return <main className="flex min-h-screen flex-col">{children}</main>;
  }

  return (
    <>
      <Navbar />
      <main className="flex-grow pt-24">{children}</main>
      <Footer />
      <FloatingContact />
    </>
  );
}
