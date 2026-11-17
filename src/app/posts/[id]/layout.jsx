import { getPostById } from '@/lib/api';
import { ROUTES_PATH, SITE_NAME } from '@/utils/constant';

export async function generateMetadata({ params }) {
  try {
    const { id } = await params;
    const post = await getPostById(id);
    
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