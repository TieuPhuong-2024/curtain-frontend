import { getCurtainById } from '@/lib/api';
import { SITE_NAME } from '@/utils/constant';

export async function generateMetadata({ params }) {
    // Kiểm tra params có tồn tại và có id không
    try {
      const product = await getCurtainById(params?.id);
      
      return {
        title: `${product.name} | ${SITE_NAME}`,
        description: product.description || 'Chi tiết sản phẩm rèm cửa cao cấp',
        keywords: `${product.name}, rèm cửa, ${product.category?.name || ''}`,
        url: `${process.env.NEXT_PUBLIC_URL}/products/${params?.id}`,
        openGraph: {
          title: product.name,
          description: product.description,
          type: 'website',
          images: [
            {
              url: product.mainImage,
              alt: product.name,
            }
          ],
          url: `${process.env.NEXT_PUBLIC_URL}/products/${params?.id}`,
        },
      };
    } catch (error) {
      console.error("Error generating metadata:", error);
      return {
        title: 'Chi Tiết Sản Phẩm',
        description: 'Thông tin chi tiết về sản phẩm rèm cửa cao cấp',
        openGraph: {
          type: 'website',
        }
      };
    }
  }

export default function ProductDetailLayout({ children }) {
  return children;
}
