import { ROUTES_PATH } from "@/utils/constant";

export const metadata = {
    title: 'Liên Hệ',
    description: 'Liên hệ với Tuấn Rèm để được tư vấn và báo giá về sản phẩm rèm cửa cao cấp. Chúng tôi sẵn sàng hỗ trợ bạn.',
    keywords: 'liên hệ rèm cửa, tư vấn rèm cửa, báo giá rèm cửa',
    url: `${process.env.NEXT_PUBLIC_URL}/${ROUTES_PATH.CONTACT}`,
    openGraph: {
        title: 'Liên Hệ - Tuấn Rèm',
        description: 'Liên hệ với Tuấn Rèm để được tư vấn và báo giá về sản phẩm rèm cửa cao cấp',
        type: 'website',
        url: `${process.env.NEXT_PUBLIC_URL}/${ROUTES_PATH.CONTACT}`,
    },
};

export default function ContactLayout({ children }) {
  return children;
}