'use client';

import { getPostById } from '@/lib/api';
import Script from 'next/script';
import { useEffect, useState } from 'react';

export default function PostJsonLd({ id }) {
  const [post, setPost] = useState(null);

  useEffect(() => {
    async function fetchPost() {
      try {
        const data = await getPostById(id);
        setPost(data);
      } catch (error) {
        console.error('Error fetching post for JSON-LD:', error);
      }
    }

    fetchPost();
  }, [id]);

  if (!post) return null;

  // Strip HTML tags for plaintext
  const getPlainText = (html) => {
    return html?.replace(/<[^>]*>/g, '') || '';
  };

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt || getPlainText(post.content).substring(0, 160),
    image: post.featuredImage || 'https://curtain-frontend.vercel.app/images/logo.png',
    datePublished: post.createdAt || new Date().toISOString(),
    dateModified: post.updatedAt || new Date().toISOString(),
    author: {
      '@type': 'Organization',
      name: 'Tuấn Rèm',
      url: 'https://curtain-frontend.vercel.app',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Tuấn Rèm',
      logo: {
        '@type': 'ImageObject',
        url: 'https://curtain-frontend.vercel.app/images/logo.png',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://curtain-frontend.vercel.app/posts/${id}`,
    },
    // Add article body if needed (consider performance/size constraints)
    articleBody: getPlainText(post.content),
  };

  return (
    <Script id="post-json-ld" type="application/ld+json">
      {JSON.stringify(jsonLd)}
    </Script>
  );
}
