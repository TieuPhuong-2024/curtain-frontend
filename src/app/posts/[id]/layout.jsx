import { ROUTES_PATH, SITE_NAME } from '@/utils/constant';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export async function generateMetadata({ params }) {
  try {
    const { id } = await params;
    const response = await fetch(`${API_URL}/posts/${id}?recordView=false`, {
      next: { revalidate: 60 },
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const post = await response.json();
    
    return {
      title: `${post.title} | ${SITE_NAME}`,
      description: post.title || 'Bài viết từ Tuấn Rèm',
      keywords: `${post.title}, tin tức rèm cửa, ${post.tags?.join(', ') || ''}`,
      url: `${process.env.NEXT_PUBLIC_URL}/${ROUTES_PATH.POSTS}/${id}`,
      openGraph: {
        title: post.title,
        description: post.title || 'Bài viết từ Tuấn Rèm',
        type: 'article',
        url: `${process.env.NEXT_PUBLIC_URL}/${ROUTES_PATH.POSTS}/${id}`,
        images: post.featuredImage ? [
          {
            url: post.featuredImage,
            alt: post.title,
          }
        ] : [],
        publishedTime: post.createdAt,
        authors: ['Tuấn Rèm'],
      },
    };
  } catch (error) {
    console.error("Error generating post metadata:", error);
    return {
      title: 'Bài Viết - Tuấn Rèm',
      description: 'Tin tức và bài viết về rèm cửa',
      openGraph: {
        type: 'article',
      }
    };
  }
}

export default function PostDetailLayout({ children }) {
  return children;
}