import { SITE_NAME } from '@/utils/constant';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export async function generateMetadata({ params }) {
    // Kiểm tra params có tồn tại và có id không
    try {
      const { id } = await params;
      const response = await fetch(`${API_URL}/curtains/${id}`, {
        next: { revalidate: 60 },
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const product = await response.json();
      
      return {
        title: `${product.name} | ${SITE_NAME}`,
        description: product.description || 'Chi tiết sản phẩm rèm cửa cao cấp',
        keywords: `${product.name}, rèm cửa, ${product.category?.name || ''}`,
        url: `${process.env.NEXT_PUBLIC_URL}/products/${id}`,
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
          url: `${process.env.NEXT_PUBLIC_URL}/products/${id}`,
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
