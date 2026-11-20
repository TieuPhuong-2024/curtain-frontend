import { ROUTES_PATH } from '@/utils/constant';
import { buildPageMetadata } from '@/utils/seo';

export const metadata = buildPageMetadata({
  title: 'Sản Phẩm Rèm Cửa',
  description:
    'Khám phá bộ sưu tập rèm cửa đa dạng với nhiều mẫu mã, chất liệu và màu sắc. May đo theo yêu cầu, lắp đặt tận nơi tại Bình Dương và TP.HCM.',
  keywords: 'rèm cửa, rèm cửa cao cấp, rèm phòng khách, rèm phòng ngủ, mua rèm cửa, rèm vải, rèm cầu vồng',
  path: `/${ROUTES_PATH.PRODUCTS}`,
});

export default function ProductsLayout({ children }) {
  return children;
}
