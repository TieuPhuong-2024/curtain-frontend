export const metadata = {
  title: 'Sản Phẩm Rèm Cửa',
  description: 'Khám phá bộ sưu tập rèm cửa đa dạng với nhiều mẫu mã, chất liệu và màu sắc',
  keywords: 'rèm cửa, rèm cửa cao cấp, rèm phòng khách, rèm phòng ngủ, mua rèm cửa',
  url: `${process.env.NEXT_PUBLIC_URL}/products`,

  openGraph: {
    title: 'Sản Phẩm Rèm Cửa - Tuấn Rèm',
    description: 'Khám phá bộ sưu tập rèm cửa đa dạng với nhiều mẫu mã, chất liệu và màu sắc',
    type: 'website',
    url: `${process.env.NEXT_PUBLIC_URL}/products`,
  },
};

export default function ProductsLayout({ children }) {
  return children;
}