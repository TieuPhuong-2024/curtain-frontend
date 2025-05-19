import {Quicksand} from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingContact from "@/components/FloatingContact";
import { AuthProvider } from '@/lib/AuthContext';
import "./styles/cozy-theme.css";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const quicksand = Quicksand({
    subsets: ["latin"],
    weight: ['300', '400', '500', '600', '700'],
    display: 'swap',
    variable: '--font-quicksand',
});

export const metadata = {
    title: "Tuấn Rèm - Rèm Cửa Cao Cấp",
    description: "Cửa hàng rèm cửa với đa dạng mẫu mã, chất liệu và màu sắc",
    keywords: "rèm cửa, rèm cửa cao cấp, rèm cửa sổ, rèm phòng khách, rèm phòng ngủ",
    viewport: "width=device-width, initial-scale=1, maximum-scale=5, shrink-to-fit=no",
};

export default function RootLayout({children}) {
    return (
        <html lang="vi" className={quicksand.variable}>
        <body className={`${quicksand.className} flex flex-col min-h-screen cozy-bg`}>
            <AuthProvider>
                <Navbar/>
                <main className="flex-grow pt-24">
                    {children}
                </main>
                <Footer/>
                <FloatingContact />
                <ToastContainer position="top-center" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
            </AuthProvider>
        </body>
        </html>
    );
} 