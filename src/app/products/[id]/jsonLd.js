'use client';

import { getCurtainById } from '@/lib/api';
import Script from 'next/script';
import { useEffect, useState } from 'react';

export default function ProductJsonLd({ id }) {
  const [product, setProduct] = useState(null);

  useEffect(() => {
    async function fetchProduct() {
      try {
        const data = await getCurtainById(id);
        setProduct(data);
      } catch (error) {
        console.error('Error fetching product for JSON-LD:', error);
      }
    }

    fetchProduct();
  }, [id]);

  if (!product) return null;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: [
      product.mainImage,
      ...(product.images?.map((img) => img.url) || []),
    ].filter(Boolean),
    description:
      product.description || `${product.name} - Rèm cửa cao cấp tại Tuấn Rèm.`,
    sku: product._id,
    brand: {
      '@type': 'Brand',
      name: 'Tuấn Rèm',
    },
    offers: {
      '@type': 'Offer',
      url: `https://curtain-frontend.vercel.app/products/${id}`,
      priceCurrency: 'VND',
      price: product.price?.toString() || '',
      priceValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split('T')[0], // Valid for 30 days
      availability: product.inStock
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      seller: {
        '@type': 'Organization',
        name: 'Tuấn Rèm',
      },
    },
    // Add product properties if available
    ...(product.material && { material: product.material }),
    ...(product.color && { color: product.color }),
    ...(product.size && { size: product.size }),
    ...(product.category && {
      category:
        typeof product.category === 'object'
          ? product.category.name
          : product.category,
    }),
  };

  return (
    <Script id="product-json-ld" type="application/ld+json">
      {JSON.stringify(jsonLd)}
    </Script>
  );
}
