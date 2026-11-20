import { ROUTES_PATH } from '@/utils/constant';
import { buildPageMetadata } from '@/utils/seo';

export const metadata = buildPageMetadata({
  title: 'Giới Thiệu',
  description:
    'Tuấn Rèm là đơn vị chuyên cung cấp các sản phẩm rèm cửa cao cấp với hơn 20 năm kinh nghiệm may đo và lắp đặt tận nơi tại Bình Dương và TP.HCM.',
  keywords: 'giới thiệu rèm cửa, lịch sử công ty, về chúng tôi, Tuấn Rèm, xưởng may rèm cửa',
  path: `/${ROUTES_PATH.ABOUT}`,
});

export default function AboutLayout({ children }) {
  return children;
}
