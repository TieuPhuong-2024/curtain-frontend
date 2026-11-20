import { ROUTES_PATH } from '@/utils/constant';
import {
  buildPageMetadata,
  getInternalApiUrl,
  stripHtmlAndTruncate,
  toAbsoluteUrl,
} from '@/utils/seo';

const API_URL = getInternalApiUrl();

export async function generateMetadata({ params }) {
  try {
    const { id } = await params;
    const response = await fetch(`${API_URL}/curtains/${id}`, {
      next: { revalidate: 60 },
    });

    if (response.status === 404) {
      return {
        title: 'Không Tìm Thấy Sản Phẩm',
        robots: { index: false, follow: false },
      };
    }

    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const product = await response.json();

    const description =
      stripHtmlAndTruncate(product.description, 160) ||
      `${product.name} - Rèm cửa cao cấp may đo theo yêu cầu tại Tuấn Rèm.`;
    const imageUrl = toAbsoluteUrl(product.mainImage);

    return buildPageMetadata({
      title: product.name,
      description,
      keywords: [product.name, 'rèm cửa', product.category?.name, product.material]
        .filter(Boolean)
        .join(', '),
      path: `/${ROUTES_PATH.PRODUCTS}/${id}`,
      images: imageUrl ? [{ url: imageUrl, alt: product.name }] : undefined,
    });
  } catch (error) {
    console.error('Error generating product metadata:', error);
    return {
      title: 'Chi Tiết Sản Phẩm',
      description: 'Thông tin chi tiết về sản phẩm rèm cửa cao cấp tại Tuấn Rèm.',
    };
  }
}

export default function ProductDetailLayout({ children }) {
  return children;
}
