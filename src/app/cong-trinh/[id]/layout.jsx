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
    const response = await fetch(`${API_URL}/projects/${id}`, {
      next: { revalidate: 60 },
    });

    if (response.status === 404) {
      return {
        title: 'Không Tìm Thấy Công Trình',
        robots: { index: false, follow: false },
      };
    }

    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const project = await response.json();

    const title = project.title || 'Chi Tiết Công Trình';
    const description =
      stripHtmlAndTruncate(project.shortDescription || project.detailedContent, 160) ||
      'Chi tiết công trình lắp đặt rèm cửa tiêu biểu của Tuấn Rèm.';
    const imageUrl = toAbsoluteUrl(project.thumbnail);

    return buildPageMetadata({
      title,
      description,
      keywords: [project.title, 'công trình rèm cửa', 'lắp đặt rèm cửa', project.location]
        .filter(Boolean)
        .join(', '),
      path: `/${ROUTES_PATH.CONG_TRINH}/${id}`,
      type: 'article',
      images: imageUrl ? [{ url: imageUrl, alt: title }] : undefined,
      openGraphExtra: {
        ...(project.createdAt ? { publishedTime: project.createdAt } : {}),
        ...(project.updatedAt ? { modifiedTime: project.updatedAt } : {}),
      },
    });
  } catch (error) {
    console.error('Error generating project metadata:', error);
    return {
      title: 'Chi Tiết Công Trình',
      description: 'Thông tin chi tiết về công trình rèm cửa tiêu biểu của Tuấn Rèm.',
    };
  }
}

export default function ProjectDetailLayout({ children }) {
  return children;
}
