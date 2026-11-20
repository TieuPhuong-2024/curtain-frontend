import { Playfair_Display, Quicksand } from 'next/font/google';
import { ToastContainer } from 'react-toastify';

import SiteChrome from '@/components/SiteChrome';
import { AuthProvider } from '@/lib/AuthContext';
import { SettingsProvider } from '@/lib/SettingsContext';
import { SITE_DESCRIPTION, SITE_NAME } from '@/utils/constant';
import { getDefaultOgImage, getSiteUrl } from '@/utils/seo';

import './globals.css';
import './styles/cozy-theme.css';
import 'react-toastify/dist/ReactToastify.css';

const quicksand = Quicksand({
  subsets: ['latin', 'vietnamese'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-quicksand',
});

const playfair = Playfair_Display({
  subsets: ['latin', 'vietnamese'],
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-display',
});

const siteUrl = getSiteUrl();
const seoKeywords =
  process.env.NEXT_PUBLIC_SEO_KEYWORDS ||
  process.env.NEXT_PUPLIC_SEO_KEYWORDS ||
  'rèm cửa, rèm cửa đẹp, rèm cửa cao cấp, rèm cửa Bình Dương, rèm cửa Thủ Đức, rèm cửa TPHCM, Tuấn Rèm';

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    template: `%s | ${SITE_NAME}`,
    default: SITE_NAME,
  },
  description: SITE_DESCRIPTION,
  keywords: seoKeywords,
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    type: 'website',
    locale: 'vi_VN',
    siteName: SITE_NAME,
    url: siteUrl,
    images: [getDefaultOgImage(SITE_NAME)],
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    images: [`${siteUrl}/logo.png`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
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
    <html lang="vi" className={`${quicksand.variable} ${playfair.variable}`}>
      <body className={`${quicksand.className} flex flex-col min-h-screen cozy-bg`}>
        <SettingsProvider>
          <AuthProvider>
            <SiteChrome>{children}</SiteChrome>
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
        </SettingsProvider>
      </body>
    </html>
  );
}
