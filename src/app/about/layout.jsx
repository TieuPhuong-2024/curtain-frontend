import { ROUTES_PATH } from "@/utils/constant";

export const metadata = {
  title: 'Giới Thiệu',
  description: 'Tuấn Rèm là đơn vị chuyên cung cấp các sản phẩm rèm cửa cao cấp với hơn 20 năm kinh nghiệm trong ngành',
  keywords: 'giới thiệu rèm cửa, lịch sử công ty, về chúng tôi, Tuấn Rèm',
  url: `${process.env.NEXT_PUBLIC_URL}/${ROUTES_PATH.ABOUT}}`,
  openGraph: {
    title: 'Giới Thiệu - Tuấn Rèm',
    description: 'Tuấn Rèm là đơn vị chuyên cung cấp các sản phẩm rèm cửa cao cấp với hơn 20 năm kinh nghiệm trong ngành',
    type: 'website',
    url: `${process.env.NEXT_PUBLIC_URL}/${ROUTES_PATH.ABOUT}}`,
  },
};

export default function AboutLayout({ children }) {
  return children;
}