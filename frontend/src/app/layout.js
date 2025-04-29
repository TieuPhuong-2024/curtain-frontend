import {Quicksand} from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { AuthProvider } from '@/lib/AuthContext';

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
        <body className={`${quicksand.className} flex flex-col min-h-screen`}>
            <AuthProvider>
                <Navbar/>
                <main className="flex-grow pt-24">
                    {children}
                </main>
                <Footer/>
            </AuthProvider>
        </body>
        </html>
    );
}
