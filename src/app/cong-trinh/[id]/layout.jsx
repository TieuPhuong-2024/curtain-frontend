// src/app/cong-trinh/[id]/layout.jsx
import { ROUTES_PATH, SITE_NAME } from '@/utils/constant';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export async function generateMetadata({ params }) {
  try {
    const { id } = await params;
    const response = await fetch(`${API_URL}/projects/${id}`, {
      next: { revalidate: 60 },
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const project = await response.json();

    return {
      title: `${project.title || 'Chi tiết công trình'} | ${SITE_NAME}`,
      description: project.shortDescription || 'Chi tiết công trình rèm cửa tiêu biểu của Tuấn Rèm',
      keywords: `${project.title}, công trình rèm cửa, ${project.location || ''}`,
      url: `${process.env.NEXT_PUBLIC_URL}/${ROUTES_PATH.CONG_TRINH}/${id}`,
      openGraph: {
        title: project.title || 'Chi tiết công trình',
        description: project.shortDescription || 'Chi tiết công trình rèm cửa tiêu biểu của Tuấn Rèm',
        type: 'website',
        url: `${process.env.NEXT_PUBLIC_URL}/${ROUTES_PATH.CONG_TRINH}/${id}`,
        images: project.thumbnail
          ? [
              {
                url: project.thumbnail,
                alt: project.title,
              },
            ]
          : [],
      },
    };
  } catch (error) {
    console.error('Error generating project metadata:', error);
    return {
      title: 'Chi Tiết Công Trình',
      description: 'Thông tin chi tiết về công trình rèm cửa tiêu biểu',
      openGraph: {
        type: 'website',
      },
    };
  }
}

export default function ProjectDetailLayout({ children }) {
  return children;
}
