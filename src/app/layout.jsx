import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import { AuthProvider } from '@/lib/AuthContext';
import { Quicksand } from 'next/font/google';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './globals.css';
import JsonLd from './jsonLd';
import './styles/cozy-theme.css';

const quicksand = Quicksand({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-quicksand',
});

export const metadata = {
  title: 'Tuấn Rèm - Rèm Cửa Cao Cấp',
  description:
    'Cửa hàng rèm cửa với đa dạng mẫu mã, chất liệu và màu sắc. Chuyên cung cấp rèm cửa cao cấp cho nhà ở, văn phòng với dịch vụ tư vấn, đo đạc và lắp đặt tận nhà.',
  keywords:
    'rèm cửa, rèm cửa cao cấp, rèm cửa sổ, rèm phòng khách, rèm phòng ngủ, rèm văn phòng, mua rèm cửa cao cấp',
  viewport:
    'width=device-width, initial-scale=1, maximum-scale=5, shrink-to-fit=no',
  robots: 'index, follow',
  // Standard SEO
  applicationName: 'Tuấn Rèm',
  referrer: 'origin-when-cross-origin',
  authors: [{ name: 'Tuấn Rèm' }],
  creator: 'Tuấn Rèm',
  publisher: 'Tuấn Rèm',
  // Open Graph
  openGraph: {
    title: 'Tuấn Rèm - Rèm Cửa Cao Cấp Cho Không Gian Của Bạn',
    description:
      'Cửa hàng rèm cửa với đa dạng mẫu mã, chất liệu và màu sắc. Chuyên cung cấp rèm cửa cao cấp cho nhà ở, văn phòng.',
    url: 'https://curtain-frontend.vercel.app',
    siteName: 'Tuấn Rèm',
    images: [
      {
        url: '/images/logo.png',
        width: 800,
        height: 600,
        alt: 'Tuấn Rèm - Rèm Cửa Cao Cấp',
      },
    ],
    locale: 'vi_VN',
    type: 'website',
  },
  // Twitter
  twitter: {
    card: 'summary_large_image',
    title: 'Tuấn Rèm - Rèm Cửa Cao Cấp',
    description: 'Cửa hàng rèm cửa với đa dạng mẫu mã, chất liệu và màu sắc',
    images: ['/images/logo.png'],
  },
  // Verification for search engines
  verification: {
    google: 'google-site-verification=YOUR_CODE', // Replace with your actual Google verification code
  },
  category: 'home decor',
};

export default function RootLayout({ children }) {
  return (
    <html lang="vi" className={quicksand.variable}>
      <body
        className={`${quicksand.className} flex flex-col min-h-screen cozy-bg`}
      >
        <JsonLd />
        <AuthProvider>
          <Navbar />
          <main className="flex-grow pt-24">{children}</main>
          <Footer />
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
