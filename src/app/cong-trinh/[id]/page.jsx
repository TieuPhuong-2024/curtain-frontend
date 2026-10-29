'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { FaImages, FaMapMarkerAlt } from 'react-icons/fa';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';
import { getProjectById } from '@/lib/api';
import { renderCKEditorContent } from '@/utils/ckeditorConverter';
import { preparePostContent } from '@/utils/postArticle';
import PostDetailToc from '@/components/posts/PostDetailToc';
import PostDetailAside from '@/components/posts/PostDetailAside';
import '@/app/styles/content-styles.css';
import StructuredData, { createArticleSchema, createBreadcrumbSchema } from '@/components/StructureData';
import { ROUTES_PATH } from '@/utils/constant';
import styles from '@/styles/modules/PostDetail.module.css';
import projectStyles from '@/styles/modules/ProjectDetail.module.css';

export default function ProjectDetailPage() {
  const params = useParams();
  const projectId = params?.id;

  const [project, setProject] = useState(null);
  const [preparedHtml, setPreparedHtml] = useState('');
  const [toc, setToc] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  useEffect(() => {
    if (!projectId) return;

    const fetchProjectDetails = async () => {
      try {
        setLoading(true);
        const projectData = await getProjectById(projectId);
        setProject(projectData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching project details:', err);
        setError('Không tải được công trình.');
        setLoading(false);
      }
    };

    fetchProjectDetails();
  }, [projectId]);

  useEffect(() => {
    if (!project?.detailedContent) {
      setPreparedHtml('');
      setToc([]);
      return;
    }

    const raw =
      typeof project.detailedContent === 'string'
        ? project.detailedContent
        : project.detailedContent?.html || project.detailedContent?.data || '';

    const sanitized = renderCKEditorContent(raw);
    const { html, toc: items } = preparePostContent(sanitized);
    setPreparedHtml(html);
    setToc(items);
  }, [project?.detailedContent]);

  const slides = project?.thumbnail ? [{ type: 'image', src: project.thumbnail }] : [];

  const openLightbox = () => {
    if (!project?.thumbnail) return;
    setLightboxOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    document.body.style.overflow = 'auto';
  };

  if (loading) {
    return (
      <div className={styles.loading} role="status" aria-live="polite">
        <div className={styles.spinner} aria-hidden="true" />
        <p>Đang tải công trình…</p>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className={styles.page}>
        <div className={styles.errorBox}>{error || 'Không tìm thấy công trình'}</div>
        <Link href={`/${ROUTES_PATH.CONG_TRINH}`} className={styles.errorBack}>
          Về danh sách công trình
        </Link>
      </div>
    );
  }

  const listUrl = `/${ROUTES_PATH.CONG_TRINH}`;

  return (
    <div className={styles.page}>
      <StructuredData
        data={createBreadcrumbSchema([
          { name: 'Trang chủ', url: `${process.env.NEXT_PUBLIC_URL}` },
          { name: 'Công trình', url: `${process.env.NEXT_PUBLIC_URL}/${ROUTES_PATH.CONG_TRINH}` },
          {
            name: project.title,
            url: `${process.env.NEXT_PUBLIC_URL}/${ROUTES_PATH.CONG_TRINH}/${project._id}`,
          },
        ])}
      />
      <StructuredData
        data={createArticleSchema({
          title: project.title,
          url: `${process.env.NEXT_PUBLIC_URL}/${ROUTES_PATH.CONG_TRINH}/${project._id}`,
          image: project.thumbnail,
          datePublished: project.createdAt,
          dateModified: project.updatedAt,
          description: project.shortDescription,
          articleBody: project.detailedContent,
        })}
      />

      <nav className={styles.breadcrumb} aria-label="Đường dẫn">
        <Link href="/">Trang chủ</Link>
        <span aria-hidden="true">/</span>
        <Link href={listUrl}>Công trình</Link>
        <span aria-hidden="true">/</span>
        <span className={styles.breadcrumbCurrent}>{project.title}</span>
      </nav>

      {project.thumbnail && (
        <button
          type="button"
          className={projectStyles.galleryHero}
          onClick={openLightbox}
          aria-label="Xem ảnh công trình phóng to"
        >
          <Image
            src={project.thumbnail}
            alt={project.title}
            fill
            className={projectStyles.galleryImage}
            priority
            sizes="(max-width: 1024px) 100vw, 72rem"
          />
          <span className={projectStyles.galleryOverlay}>
            <span className={projectStyles.galleryHint}>
              <FaImages className="inline mr-2" aria-hidden />
              Xem ảnh lớn
            </span>
          </span>
        </button>
      )}

      <header className={styles.header}>
        <h1 className={styles.title}>{project.title}</h1>
        {project.shortDescription && <p className={styles.lead}>{project.shortDescription}</p>}
        <div className={projectStyles.metaRow}>
          {project.type && <span className={projectStyles.typeBadge}>{project.type}</span>}
          {project.location && (
            <span className={projectStyles.locationMeta}>
              <FaMapMarkerAlt aria-hidden />
              {project.location}
            </span>
          )}
        </div>
      </header>

      <div className={styles.layout}>
        <article className={styles.article}>
          {toc.length > 0 && <PostDetailToc items={toc} variant="mobile" />}

          {preparedHtml ? (
            <div className={`${styles.body} post-content`}>
              <div className="ck-content" dangerouslySetInnerHTML={{ __html: preparedHtml }} />
            </div>
          ) : (
            project.shortDescription && (
              <div className={`${styles.body} post-content`}>
                <p>{project.shortDescription}</p>
              </div>
            )
          )}
        </article>

        <PostDetailAside
          toc={toc}
          ctaTitle="Bạn có dự án tương tự?"
          ctaText="Tuấn Rèm khảo sát hiện trạng, tư vấn mẫu rèm và báo giá thi công tận nơi tại Bình Dương và TP.HCM."
        />
      </div>

      <Lightbox
        open={lightboxOpen}
        close={closeLightbox}
        slides={slides}
        index={0}
        render={{
          slide: ({ slide }) =>
            slide.type === 'image' ? (
              <img
                src={slide.src}
                alt={project.title}
                style={{
                  maxWidth: '100%',
                  maxHeight: '100%',
                  objectFit: 'contain',
                  display: 'block',
                  margin: 'auto',
                }}
              />
            ) : null,
        }}
      />
    </div>
  );
}
