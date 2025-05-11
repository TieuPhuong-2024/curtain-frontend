import { getCurtainById } from '@/lib/api';

export async function generateMetadata({ params }) {
  try {
    // Fetch the product data
    const product = await getCurtainById(params.id);

    if (!product) {
      return {
        title: 'Sản phẩm không tìm thấy - Tuấn Rèm',
        description:
          'Không tìm thấy sản phẩm rèm cửa này trong hệ thống của chúng tôi.',
      };
    }

    // Construct metadata from product data
    return {
      title: `${product.name} - Tuấn Rèm`,
      description:
        product.description ||
        `${product.name} - Rèm cửa cao cấp tại Tuấn Rèm với chất lượng hàng đầu và giá cả hợp lý.`,
      keywords: `${product.name}, ${product.category?.name || 'rèm cửa'}, ${product.material || 'rèm cao cấp'}, tuấn rèm, rèm cửa cao cấp`,
      // Open Graph
      openGraph: {
        title: `${product.name} - Rèm Cửa Cao Cấp`,
        description:
          product.description ||
          `${product.name} - Rèm cửa cao cấp với chất liệu ${product.material || 'cao cấp'}.`,
        url: `https://tuanrem.com/products/${params.id}`,
        siteName: 'Tuấn Rèm',
        images: [
          {
            url: product.mainImage || '/images/logo.png',
            width: 800,
            height: 600,
            alt: product.name,
          },
        ],
        type: 'product',
      },
      // Twitter
      twitter: {
        card: 'summary_large_image',
        title: `${product.name} - Tuấn Rèm`,
        description:
          product.description ||
          `${product.name} - Rèm cửa cao cấp tại Tuấn Rèm.`,
        images: [product.mainImage || '/images/logo.png'],
      },
      // Product metadata
      other: {
        'product:price:amount': product.price?.toString() || '',
        'product:price:currency': 'VND',
        'product:availability': product.inStock ? 'in stock' : 'out of stock',
      },
    };
  } catch (error) {
    console.error('Error generating metadata:', error);

    // Fallback metadata
    return {
      title: 'Sản phẩm rèm cửa - Tuấn Rèm',
      description:
        'Khám phá các sản phẩm rèm cửa cao cấp tại Tuấn Rèm với đa dạng mẫu mã và chất lượng hàng đầu.',
    };
  }
}
