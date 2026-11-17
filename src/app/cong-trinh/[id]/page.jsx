'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
  FaArrowLeft,
  FaArrowRight,
  FaCalendarAlt,
  FaImages,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaStar,
} from 'react-icons/fa';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';
import { getProjectById, getProjects } from '@/lib/api';
import ProjectListCard from '@/components/projects/ProjectListCard';
import { renderCKEditorContent } from '@/utils/ckeditorConverter';
import { preparePostContent } from '@/utils/postArticle';
import StructuredData, {
  createArticleSchema,
  createBreadcrumbSchema,
} from '@/components/StructureData';
import { ROUTES_PATH } from '@/utils/constant';
import styles from '@/styles/modules/ProjectDetail.module.css';

const PHONE_DISPLAY = '0937 543 809';
const PHONE_HREF = 'tel:+84937543809';
const ZALO_HREF = 'https://zalo.me/0937543809';
const FALLBACK_IMAGE = '/images/curtain-placeholder.jpg';

function ProjectToc({ items, variant = 'desktop' }) {
  const [activeId, setActiveId] = useState('');

  useEffect(() => {
    if (!items?.length) return;

    const headings = items
      .map(({ id }) => document.getElementById(id))
      .filter(Boolean);

    if (!headings.length) return;

    const observer = new IntersectionObserver(
      entries => {
        const visible = entries
          .filter(entry => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: '-20% 0px -55% 0px', threshold: 0 }
    );

    headings.forEach(element => observer.observe(element));
    return () => observer.disconnect();
  }, [items]);

  if (!items?.length) return null;

  const list = (
    <ul className={styles.tocList}>
      {items.map(({ id, text, level }) => (
        <li key={id}>
          <a
            href={`#${id}`}
            className={`${styles.tocLink} ${level === 3 ? styles.tocLinkNested : ''} ${
              activeId === id ? styles.tocLinkActive : ''
            }`}
            onClick={event => {
              event.preventDefault();
              document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              setActiveId(id);
            }}
          >
            {text}
          </a>
        </li>
      ))}
    </ul>
  );

  if (variant === 'mobile') {
    return (
      <details className={styles.tocMobile}>
        <summary className={styles.tocSummary}>Mục lục công trình</summary>
        <div className={styles.tocMobileBody}>
          <nav aria-label="Mục lục công trình">{list}</nav>
        </div>
      </details>
    );
  }

  return (
    <nav className={styles.tocPanel} aria-label="Mục lục công trình">
      <p className={styles.tocTitle}>Mục lục</p>
      {list}
    </nav>
  );
}

export default function ProjectDetailPage() {
  const params = useParams();
  const projectId = params?.id;

  const [project, setProject] = useState(null);
  const [relatedProjects, setRelatedProjects] = useState([]);
  const [preparedHtml, setPreparedHtml] = useState('');
  const [toc, setToc] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [imageSrc, setImageSrc] = useState(null);

  useEffect(() => {
    if (!projectId) return;
    let ignore = false;

    const fetchProject = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getProjectById(projectId);
        if (ignore) return;
        setProject(data);
        setImageSrc(data.thumbnail || FALLBACK_IMAGE);
      } catch (err) {
        if (ignore) return;
        console.error('Error fetching project details:', err);
        setError('Không thể tải công trình. Vui lòng thử lại sau.');
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    fetchProject();
    return () => {
      ignore = true;
    };
  }, [projectId, reloadKey]);

  useEffect(() => {
    if (!projectId) return;
    let ignore = false;

    const fetchRelated = async () => {
      try {
        const data = await getProjects();
        if (ignore || !Array.isArray(data)) return;
        setRelatedProjects(
          data.filter(item => String(item._id || item.id) !== String(projectId)).slice(0, 3)
        );
      } catch (err) {
        console.error('Error fetching related projects:', err);
      }
    };

    fetchRelated();
    return () => {
      ignore = true;
    };
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

  useEffect(() => () => {
    document.body.style.overflow = '';
  }, []);

  const formattedDate = useMemo(() => {
    const raw = project?.updatedAt || project?.createdAt;
    if (!raw) return '';
    const date = new Date(raw);
    if (Number.isNaN(date.getTime())) return '';
    return new Intl.DateTimeFormat('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(date);
  }, [project?.updatedAt, project?.createdAt]);

  const slides = project?.thumbnail ? [{ type: 'image', src: project.thumbnail }] : [];

  const openLightbox = () => {
    if (!project?.thumbnail) return;
    setLightboxOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    document.body.style.overflow = '';
  };

  if (loading) {
    return (
      <div className={styles.page}>
        <div className={styles.container} aria-hidden="true">
          <span className={styles.skeletonBreadcrumb} />
          <span className={styles.skeletonKicker} />
          <span className={styles.skeletonTitle} />
          <span className={styles.skeletonTitleShort} />
          <span className={styles.skeletonLineShort} />
          <span className={styles.skeletonHero} />
          <span className={styles.skeletonLine} />
          <span className={styles.skeletonLine} />
          <span className={styles.skeletonLineShort} />
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className={styles.page}>
        <div className={styles.container}>
          <div className={styles.statePanel} role="alert">
            <h1 className={styles.stateTitle}>Không tìm thấy công trình</h1>
            <p className={styles.stateText}>
              {error || 'Công trình có thể đã được gỡ hoặc đường dẫn không đúng.'}
            </p>
            <div className={styles.stateActions}>
              {error && (
                <button
                  type="button"
                  className={styles.stateButton}
                  onClick={() => setReloadKey(key => key + 1)}
                >
                  Thử lại
                </button>
              )}
              <Link href={`/${ROUTES_PATH.CONG_TRINH}`} className={styles.stateButtonGhost}>
                Quay lại danh sách công trình
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const listUrl = `/${ROUTES_PATH.CONG_TRINH}`;

  return (
    <div className={styles.page}>
      <StructuredData
        id="project-breadcrumb-schema"
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
        id="project-article-schema"
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

      <div className={styles.container}>
        <nav className={styles.breadcrumb} aria-label="Breadcrumb">
          <Link href="/">Trang chủ</Link>
          <span className={styles.breadcrumbSep} aria-hidden="true">
            /
          </span>
          <Link href={listUrl}>Công trình</Link>
          <span className={styles.breadcrumbSep} aria-hidden="true">
            /
          </span>
          <span className={styles.breadcrumbCurrent} aria-current="page">
            {project.title}
          </span>
        </nav>

        <header className={styles.header}>
          <p className={styles.kicker}>{project.type || 'Công trình'}</p>
          <h1 className={styles.title}>{project.title}</h1>
          {project.shortDescription && <p className={styles.lead}>{project.shortDescription}</p>}
          <div className={styles.metaRow}>
            {project.location && (
              <span className={styles.metaItem}>
                <FaMapMarkerAlt aria-hidden="true" />
                {project.location}
              </span>
            )}
            {formattedDate && (
              <span className={styles.metaItem}>
                <FaCalendarAlt aria-hidden="true" />
                Cập nhật {formattedDate}
              </span>
            )}
            {project.featured && (
              <span className={styles.featuredPill}>
                <FaStar aria-hidden="true" /> Nổi bật
              </span>
            )}
          </div>
        </header>

        <button
          type="button"
          className={styles.hero}
          onClick={openLightbox}
          aria-label={`Xem ảnh lớn: ${project.title}`}
        >
          <Image
            src={imageSrc || FALLBACK_IMAGE}
            alt={project.title}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 90vw"
            className={styles.heroImage}
            onError={() => {
              if (imageSrc !== FALLBACK_IMAGE) setImageSrc(FALLBACK_IMAGE);
            }}
          />
          {project.type && <span className={styles.heroTag}>{project.type}</span>}
          <span className={styles.heroHint}>
            <FaImages aria-hidden="true" /> Xem ảnh lớn
          </span>
        </button>

        <div className={styles.layout}>
          <article className={styles.article}>
            {toc.length > 0 && <ProjectToc items={toc} variant="mobile" />}

            {preparedHtml ? (
              <div className={styles.content}>
                <div className="ck-content" dangerouslySetInnerHTML={{ __html: preparedHtml }} />
              </div>
            ) : (
              project.shortDescription && (
                <div className={styles.content}>
                  <p>{project.shortDescription}</p>
                </div>
              )
            )}

            <div className={styles.backRow}>
              <Link href={listUrl} className={styles.backLink}>
                <FaArrowLeft aria-hidden="true" /> Quay lại danh sách công trình
              </Link>
            </div>
          </article>

          <aside className={styles.aside} aria-label="Thông tin công trình">
            <div className={styles.asideSticky}>
              <div className={styles.asideCard}>
                <h2 className={styles.asideTitle}>Thông tin công trình</h2>
                <dl className={styles.factList}>
                  {project.type && (
                    <div className={styles.factRow}>
                      <dt>Loại hình</dt>
                      <dd>{project.type}</dd>
                    </div>
                  )}
                  {project.location && (
                    <div className={styles.factRow}>
                      <dt>Địa điểm</dt>
                      <dd>{project.location}</dd>
                    </div>
                  )}
                  {formattedDate && (
                    <div className={styles.factRow}>
                      <dt>Cập nhật</dt>
                      <dd>{formattedDate}</dd>
                    </div>
                  )}
                  <div className={styles.factRow}>
                    <dt>Trạng thái</dt>
                    <dd className={styles.factDelivered}>Đã hoàn thành</dd>
                  </div>
                </dl>
              </div>

              {toc.length > 0 && <ProjectToc items={toc} variant="desktop" />}

              <div className={styles.asideCta}>
                <p className={styles.asideCtaTitle}>Bạn có dự án tương tự?</p>
                <p className={styles.asideCtaText}>
                  Tuấn Rèm khảo sát hiện trạng, tư vấn mẫu vải và báo giá thi công tận nơi
                  tại Bình Dương và TP.HCM.
                </p>
                <div className={styles.asideCtaActions}>
                  <Link href="/contact" className={styles.asideCtaPrimary}>
                    Liên hệ báo giá
                  </Link>
                  <a href={PHONE_HREF} className={styles.asideCtaSecondary}>
                    <FaPhoneAlt aria-hidden="true" /> {PHONE_DISPLAY}
                  </a>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {relatedProjects.length > 0 && (
        <section className={styles.relatedSection} aria-labelledby="related-projects-title">
          <div className={styles.relatedInner}>
            <div className={styles.relatedHead}>
              <div>
                <p className={styles.kicker}>Tiếp tục xem</p>
                <h2 id="related-projects-title" className={styles.relatedTitle}>
                  Công trình khác
                </h2>
              </div>
              <Link href={listUrl} className={styles.textLink}>
                Xem tất cả công trình
                <FaArrowRight className={styles.textLinkIcon} aria-hidden="true" />
              </Link>
            </div>
            <div className={styles.relatedGrid}>
              {relatedProjects.map(item => (
                <ProjectListCard key={item._id || item.id} project={item} />
              ))}
            </div>
          </div>
        </section>
      )}

      <section className={styles.ctaSection} aria-labelledby="project-cta-title">
        <div className={styles.ctaInner}>
          <p className={styles.ctaKicker}>Tư vấn miễn phí</p>
          <h2 id="project-cta-title" className={styles.ctaTitle}>
            Bạn có dự án tương tự?
          </h2>
          <p className={styles.ctaText}>
            Gửi ảnh hiện trạng hoặc hẹn khảo sát — Tuấn Rèm tư vấn mẫu vải, báo giá theo mét
            và lên lịch thi công tận nơi.
          </p>
          <div className={styles.ctaActions}>
            <Link href="/contact" className={styles.ctaPrimary}>
              Liên hệ báo giá
            </Link>
            <a
              href={ZALO_HREF}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.ctaGhost}
            >
              Nhắn Zalo
            </a>
          </div>
          <p className={styles.ctaNote}>0937 543 809 · Dĩ An, Bình Dương</p>
        </div>
      </section>

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
