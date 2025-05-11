import { getPostById } from '@/lib/api';

export async function generateMetadata({ params }) {
  try {
    // Fetch the post data
    const post = await getPostById(params.id);

    if (!post) {
      return {
        title: 'Bài viết không tìm thấy - Tuấn Rèm',
        description:
          'Không tìm thấy bài viết này trong hệ thống của chúng tôi.',
      };
    }

    // Extract a snippet from the content for description (if content is HTML)
    let contentSnippet = '';
    if (post.content) {
      // Remove HTML tags to get plain text
      const plainText = post.content.replace(/<[^>]*>/g, '');
      // Get first 160 characters for description
      contentSnippet =
        plainText.substring(0, 160) + (plainText.length > 160 ? '...' : '');
    }

    // Construct metadata from post data
    return {
      title: `${post.title} - Tuấn Rèm`,
      description:
        contentSnippet ||
        post.excerpt ||
        `Đọc bài viết "${post.title}" từ Tuấn Rèm - Chuyên gia về rèm cửa cao cấp.`,
      keywords: `${post.title}, bài viết rèm cửa, ${post.categories?.join(', ') || 'trang trí nội thất'}, tuấn rèm`,
      // Open Graph
      openGraph: {
        title: post.title,
        description:
          contentSnippet ||
          post.excerpt ||
          `Đọc bài viết "${post.title}" từ Tuấn Rèm.`,
        url: `https://curtain-frontend.vercel.app/posts/${params.id}`,
        siteName: 'Tuấn Rèm',
        images: [
          {
            url: post.featuredImage || '/images/logo.png',
            width: 1200,
            height: 630,
            alt: post.title,
          },
        ],
        type: 'article',
        article: {
          publishedTime: post.createdAt,
          modifiedTime: post.updatedAt,
          authors: ['Tuấn Rèm'],
          tags: post.tags || [],
        },
      },
      // Twitter
      twitter: {
        card: 'summary_large_image',
        title: post.title,
        description:
          contentSnippet ||
          post.excerpt ||
          `Đọc bài viết "${post.title}" từ Tuấn Rèm.`,
        images: [post.featuredImage || '/images/logo.png'],
      },
    };
  } catch (error) {
    console.error('Error generating metadata:', error);

    // Fallback metadata
    return {
      title: 'Bài viết - Tuấn Rèm',
      description:
        'Khám phá các bài viết hữu ích về rèm cửa và trang trí nội thất từ Tuấn Rèm.',
    };
  }
}
