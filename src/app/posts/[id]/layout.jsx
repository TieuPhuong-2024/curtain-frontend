import { ROUTES_PATH } from '@/utils/constant';
import {
  buildPageMetadata,
  extractTextFromPostContent,
  getInternalApiUrl,
  stripHtmlAndTruncate,
  toAbsoluteUrl,
} from '@/utils/seo';

const API_URL = getInternalApiUrl();

export async function generateMetadata({ params }) {
  try {
    const { id } = await params;
    const response = await fetch(`${API_URL}/posts/${id}?recordView=false`, {
      next: { revalidate: 60 },
    });

    if (response.status === 404) {
      return {
        title: 'Không Tìm Thấy Bài Viết',
        robots: { index: false, follow: false },
      };
    }

    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const post = await response.json();

    const rawDesc = post.summary || extractTextFromPostContent(post.content) || post.title;
    const description = stripHtmlAndTruncate(rawDesc, 160) || 'Bài viết chia sẻ kinh nghiệm chọn rèm cửa từ Tuấn Rèm.';
    const imageUrl = toAbsoluteUrl(post.featuredImage);

    return buildPageMetadata({
      title: post.title,
      description,
      keywords: [post.title, 'tin tức rèm cửa', ...(Array.isArray(post.tags) ? post.tags : [])]
        .filter(Boolean)
        .join(', '),
      path: `/${ROUTES_PATH.POSTS}/${id}`,
      type: 'article',
      images: imageUrl ? [{ url: imageUrl, alt: post.title }] : undefined,
      openGraphExtra: {
        ...(post.createdAt ? { publishedTime: post.createdAt } : {}),
        ...(post.updatedAt ? { modifiedTime: post.updatedAt } : {}),
        authors: ['Tuấn Rèm'],
        ...(Array.isArray(post.tags) && post.tags.length > 0 ? { tags: post.tags } : {}),
      },
    });
  } catch (error) {
    console.error('Error generating post metadata:', error);
    return {
      title: 'Bài Viết',
      description: 'Tin tức và bài viết về rèm cửa từ Tuấn Rèm.',
    };
  }
}

export default function PostDetailLayout({ children }) {
  return children;
}
