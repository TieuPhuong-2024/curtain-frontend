import { ROUTES_PATH } from "@/utils/constant";

export const metadata = {
  title: 'Công Trình',
  description: 'Khám phá các công trình lắp đặt rèm cửa tiêu biểu của Tuấn Rèm - Những dự án đã hoàn thành với chất lượng cao và thiết kế đẹp mắt',
  keywords: 'công trình rèm cửa, dự án rèm cửa, lắp đặt rèm cửa, rèm cửa công trình, rèm cửa biệt thự, rèm cửa văn phòng',
  url: `${process.env.NEXT_PUBLIC_URL}/${ROUTES_PATH.CONG_TRINH}`,
  openGraph: {
    title: 'Công Trình Tiêu Biểu - Tuấn Rèm',
    description: 'Khám phá các công trình lắp đặt rèm cửa tiêu biểu của Tuấn Rèm - Những dự án đã hoàn thành với chất lượng cao và thiết kế đẹp mắt',
    type: 'website',
    url: `${process.env.NEXT_PUBLIC_URL}/${ROUTES_PATH.CONG_TRINH}`,
  },
};

export default function ProjectsLayout({ children }) {
  return children;
}