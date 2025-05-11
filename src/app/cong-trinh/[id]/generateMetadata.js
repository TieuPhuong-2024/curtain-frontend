import { getProjectById } from '@/lib/api';

export async function generateMetadata({ params }) {
  try {
    // Fetch the project data
    const project = await getProjectById(params.id);

    if (!project) {
      return {
        title: 'Công trình không tìm thấy - Tuấn Rèm',
        description:
          'Không tìm thấy thông tin công trình này trong hệ thống của chúng tôi.',
      };
    }

    // Extract a snippet from the description
    let descriptionSnippet = '';
    if (project.description) {
      // Remove HTML tags if description is HTML
      const plainText = project.description.replace(/<[^>]*>/g, '');
      // Get first 160 characters for description
      descriptionSnippet =
        plainText.substring(0, 160) + (plainText.length > 160 ? '...' : '');
    }

    // Construct metadata from project data
    return {
      title: `${project.title || project.name} - Công Trình Tuấn Rèm`,
      description:
        descriptionSnippet ||
        `Dự án ${project.title || project.name} - Một công trình thiết kế và lắp đặt rèm cửa cao cấp của Tuấn Rèm.`,
      keywords: `${project.title || project.name}, công trình rèm cửa, ${project.type || 'thiết kế rèm'}, ${project.location || 'lắp đặt rèm cửa'}, tuấn rèm`,
      // Open Graph
      openGraph: {
        title: `${project.title || project.name} - Công Trình Tuấn Rèm`,
        description:
          descriptionSnippet ||
          `Dự án ${project.title || project.name} - Một công trình thiết kế và lắp đặt rèm cửa cao cấp của Tuấn Rèm.`,
        url: `https://curtain-frontend.vercel.app/cong-trinh/${params.id}`,
        siteName: 'Tuấn Rèm',
        images: [
          {
            url:
              project.featuredImage ||
              project.images?.[0]?.url ||
              '/images/logo.png',
            width: 1200,
            height: 630,
            alt: project.title || project.name,
          },
        ],
        type: 'article',
      },
      // Twitter
      twitter: {
        card: 'summary_large_image',
        title: `${project.title || project.name} - Công Trình Tuấn Rèm`,
        description:
          descriptionSnippet ||
          `Dự án ${project.title || project.name} - Công trình rèm cửa của Tuấn Rèm.`,
        images: [
          project.featuredImage ||
            project.images?.[0]?.url ||
            '/images/logo.png',
        ],
      },
    };
  } catch (error) {
    console.error('Error generating metadata:', error);

    // Fallback metadata
    return {
      title: 'Công Trình - Tuấn Rèm',
      description:
        'Khám phá các công trình trang trí rèm cửa đã hoàn thành của Tuấn Rèm.',
    };
  }
}
