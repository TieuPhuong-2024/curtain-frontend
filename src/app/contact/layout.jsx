import { ROUTES_PATH } from '@/utils/constant';
import { buildPageMetadata } from '@/utils/seo';

export const metadata = buildPageMetadata({
  title: 'Liên Hệ',
  description:
    'Liên hệ với Tuấn Rèm để được tư vấn chọn mẫu vải, đo đạc và báo giá rèm cửa cao cấp tận nhà miễn phí.',
  keywords: 'liên hệ rèm cửa, tư vấn rèm cửa, báo giá rèm cửa, đo rèm tại nhà Bình Dương',
  path: `/${ROUTES_PATH.CONTACT}`,
});

export default function ContactLayout({ children }) {
  return children;
}
