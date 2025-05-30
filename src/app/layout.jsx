import { Quicksand } from 'next/font/google';
import { ToastContainer } from 'react-toastify';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FloatingContact from '@/components/FloatingContact';
import { AuthProvider } from '@/lib/AuthContext';
import { SITE_DESCRIPTION, SITE_NAME } from '@/utils/constant';

import './globals.css';
import './styles/cozy-theme.css';
import 'react-toastify/dist/ReactToastify.css';

const quicksand = Quicksand({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-quicksand',
});

export const metadata = {
  title: {
    template: `%s | ${SITE_NAME}`,
    default: SITE_NAME,
  },
  description: SITE_DESCRIPTION,
  keywords: process.env.NEXT_PUPLIC_SEO_KEYWORDS,
  url: `${process.env.NEXT_PUBLIC_URL}`,

  // Add the following SEO-related metadata
  openGraph: {
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    type: 'website',
    SITE_NAME: SITE_NAME,
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_URL}/logo.png`,
        width: 1200,
        height: 630,
        alt: SITE_NAME,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_URL}/logo.png`,
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }) {
  return (
    <html lang="vi" className={quicksand.variable}>
      <body className={`${quicksand.className} flex flex-col min-h-screen cozy-bg`}>
        <AuthProvider>
          <Navbar />
          <main className="flex-grow pt-24">{children}</main>
          <Footer />
          <FloatingContact />
          <ToastContainer
            position="top-center"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
        </AuthProvider>
      </body>
    </html>
  );
}
