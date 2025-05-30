// src/app/cong-trinh/[id]/layout.jsx
import { getProjectById } from '@/lib/api';
import { ROUTES_PATH, SITE_NAME } from '@/utils/constant';

export async function generateMetadata({ params }) {
  try {
    const project = await getProjectById(params?.id);

    return {
      title: `${project.title || 'Chi tiết công trình'} | ${SITE_NAME}`,
      description: project.description || 'Chi tiết công trình rèm cửa tiêu biểu của Tuấn Rèm',
      keywords: `${project.title}, công trình rèm cửa, ${project.location || ''}`,
      url: `${process.env.NEXT_PUBLIC_URL}/${ROUTES_PATH.CONG_TRINH}/${params.id}`,
      openGraph: {
        title: project.title || 'Chi tiết công trình',
        description: project.description || 'Chi tiết công trình rèm cửa tiêu biểu của Tuấn Rèm',
        type: 'website',
        url: `${process.env.NEXT_PUBLIC_URL}/${ROUTES_PATH.CONG_TRINH}/${params.id}`,
        images: project.mainImage
          ? [
              {
                url: project.mainImage,
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
