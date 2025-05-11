'use client';

import { getProjectById } from '@/lib/api';
import Script from 'next/script';
import { useEffect, useState } from 'react';

export default function ProjectJsonLd({ id }) {
  const [project, setProject] = useState(null);

  useEffect(() => {
    async function fetchProject() {
      try {
        const data = await getProjectById(id);
        setProject(data);
      } catch (error) {
        console.error('Error fetching project for JSON-LD:', error);
      }
    }

    fetchProject();
  }, [id]);

  if (!project) return null;

  // Strip HTML tags for plaintext
  const getPlainText = (html) => {
    return html?.replace(/<[^>]*>/g, '') || '';
  };

  // Format date string to ISO format
  const formatDate = (dateString) => {
    if (!dateString) return new Date().toISOString();
    return new Date(dateString).toISOString();
  };

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: project.title || project.name,
    description:
      getPlainText(project.description) ||
      `Dự án ${project.title || project.name} - Công trình rèm cửa cao cấp.`,
    image:
      project.featuredImage ||
      (project.images && project.images.length > 0
        ? project.images[0].url
        : 'https://tuanrem.com/images/logo.png'),
    datePublished: formatDate(project.completionDate || project.createdAt),
    author: {
      '@type': 'Organization',
      name: 'Tuấn Rèm',
      url: 'https://tuanrem.com',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Tuấn Rèm',
      logo: {
        '@type': 'ImageObject',
        url: 'https://tuanrem.com/images/logo.png',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://tuanrem.com/cong-trinh/${id}`,
    },
    ...(project.location && {
      locationCreated: {
        '@type': 'Place',
        name: project.location,
      },
    }),
  };

  return (
    <Script id="project-json-ld" type="application/ld+json">
      {JSON.stringify(jsonLd)}
    </Script>
  );
}
