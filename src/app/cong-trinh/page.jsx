'use client';

import '../styles/cozy-theme.css';
import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaArrowRight, FaMapMarkerAlt, FaPhoneAlt, FaSearch, FaStar, FaTimes } from 'react-icons/fa';
import { getProjects } from '@/lib/api';
import { useSettings } from '@/lib/SettingsContext';
import ProjectListCard from '@/components/projects/ProjectListCard';
import StructuredData, {
  createArticleSchemaShort,
  createBreadcrumbSchema,
} from '@/components/StructureData';
import { ROUTES_PATH } from '@/utils/constant';
import { phoneDigits } from '@/utils/siteSettings';
import styles from '@/styles/modules/Projects.module.css';

const FALLBACK_IMAGE = '/images/curtain-placeholder.jpg';
const PAGE_SIZE = 9;

const PROCESS_STEPS = [
  {
    title: 'Khảo sát & tư vấn',
    text: 'Đo đạc tại nhà, tư vấn mẫu vải và kiểu rèm theo ánh sáng từng phòng.',
  },
  {
    title: 'Báo giá & chốt mẫu',
    text: 'Báo giá minh bạch theo mét vải, chốt mẫu và thống nhất lịch thi công.',
  },
  {
    title: 'May đo tại xưởng',
    text: 'Rèm may đúng kích thước từng ô cửa, hoàn thiện trước ngày lắp.',
  },
  {
    title: 'Thi công & bàn giao',
    text: 'Lắp gọn gàng, vệ sinh sau lắp và nghiệm thu cùng gia chủ.',
  },
  {
    title: 'Bảo hành & hỗ trợ',
    text: 'Bảo hành 12 tháng, hỗ trợ chỉnh rèm trong quá trình sử dụng.',
  },
];

const REVIEWS = [
  {
    initials: 'NT',
    name: 'Nguyễn Thành',
    context: 'Biệt thự Vinhomes',
    quote:
      'Rèm được lắp rất nhanh, đẹp và đúng ý tôi. Đội ngũ thi công chuyên nghiệp, tư vấn tận tình.',
  },
  {
    initials: 'LH',
    name: 'Lê Hương',
    context: 'Chung cư The Vista',
    quote:
      'Chất lượng rèm tốt, màu sắc đúng như mẫu. Đội ngũ lắp đặt gọn gàng, đúng hẹn.',
  },
  {
    initials: 'PT',
    name: 'Phạm Tuấn',
    context: 'Văn phòng Quận 1',
    quote:
      'Đã tìm hiểu nhiều nơi và chọn dịch vụ tại đây. Kết quả hoàn toàn xứng đáng, rèm đẹp vượt mong đợi.',
  },
];

function FeaturedProjectCard({ project, index, priority = false }) {
  const projectId = project._id || project.id;
  const [imageSrc, setImageSrc] = useState(project.thumbnail || FALLBACK_IMAGE);

  useEffect(() => {
    setImageSrc(project.thumbnail || FALLBACK_IMAGE);
  }, [project.thumbnail]);

  return (
    <Link href={`/${ROUTES_PATH.CONG_TRINH}/${projectId}`} className={styles.featuredItem}>
      <span className={styles.featuredMedia}>
        <Image
          src={imageSrc}
          alt={project.title}
          fill
          priority={priority}
          sizes="(max-width: 900px) 100vw, 50vw"
          className={styles.featuredImage}
          onError={() => {
            if (imageSrc !== FALLBACK_IMAGE) setImageSrc(FALLBACK_IMAGE);
          }}
        />
        {project.type && <span className={styles.featuredTag}>{project.type}</span>}
        <span className={styles.featuredIndex} aria-hidden="true">
          {String(index + 1).padStart(2, '0')}
        </span>
      </span>
      <span className={styles.featuredBody}>
        {project.location && (
          <span className={styles.featuredMeta}>
            <FaMapMarkerAlt aria-hidden="true" />
            {project.location}
          </span>
        )}
        <h3 className={styles.featuredTitle}>{project.title}</h3>
        {project.shortDescription && (
          <span className={styles.featuredText}>{project.shortDescription}</span>
        )}
        <span className={styles.featuredMore}>
          Xem công trình
          <FaArrowRight className={styles.textLinkIcon} aria-hidden="true" />
        </span>
      </span>
    </Link>
  );
}

export default function CongTrinhPage() {
  const { getValue } = useSettings();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);
  const [activeType, setActiveType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const hotline = getValue('global.hotline');
  const hotlineDigits = phoneDigits(hotline);
  const phoneHref = hotlineDigits ? `tel:+84${hotlineDigits.replace(/^0/, '')}` : '';
  const zaloUrl = getValue('global.zaloUrl');
  const address = getValue('global.address');

  useEffect(() => {
    let ignore = false;

    const fetchProjects = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getProjects();
        if (ignore) return;
        setProjects(data || []);
      } catch (err) {
        if (ignore) return;
        console.error('Error fetching projects:', err);
        setError('Không thể tải dữ liệu công trình. Vui lòng thử lại sau.');
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    fetchProjects();
    return () => {
      ignore = true;
    };
  }, [reloadKey]);

  const featuredProjects = useMemo(
    () => projects.filter(project => project.featured === true),
    [projects]
  );

  const projectTypes = useMemo(() => {
    const seen = new Set();
    const types = [];
    projects.forEach(project => {
      if (project.type && !seen.has(project.type)) {
        seen.add(project.type);
        types.push(project.type);
      }
    });
    return types;
  }, [projects]);

  const typeCounts = useMemo(() => {
    const counts = {};
    projects.forEach(project => {
      if (project.type) counts[project.type] = (counts[project.type] || 0) + 1;
    });
    return counts;
  }, [projects]);

  const normalizedSearch = searchTerm.trim().toLowerCase();

  const filteredProjects = useMemo(
    () =>
      projects.filter(project => {
        if (activeType !== 'all' && project.type !== activeType) return false;
        if (!normalizedSearch) return true;
        return [project.title, project.shortDescription, project.location].some(
          value => value && value.toLowerCase().includes(normalizedSearch)
        );
      }),
    [projects, activeType, normalizedSearch]
  );

  const visibleProjects = filteredProjects.slice(0, visibleCount);
  const hasMore = visibleCount < filteredProjects.length;
  const hasActiveFilters = activeType !== 'all' || normalizedSearch.length > 0;

  const handleTypeChange = type => {
    setActiveType(type);
    setVisibleCount(PAGE_SIZE);
  };

  const handleSearchChange = value => {
    setSearchTerm(value);
    setVisibleCount(PAGE_SIZE);
  };

  const clearFilters = () => {
    setActiveType('all');
    setSearchTerm('');
    setVisibleCount(PAGE_SIZE);
  };

  return (
    <div className={styles.page}>
      <StructuredData
        data={{
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: 'Công Trình - Tuấn Rèm',
          description:
            'Khám phá các công trình lắp đặt rèm cửa tiêu biểu của Tuấn Rèm - Những dự án đã hoàn thành với chất lượng cao và thiết kế đẹp mắt',
          url: `${process.env.NEXT_PUBLIC_URL}/cong-trinh`,
          mainEntity: {
            '@type': 'ItemList',
            itemListElement: projects.map((project, index) => ({
              '@type': 'ListItem',
              position: index + 1,
              url: `${process.env.NEXT_PUBLIC_URL}/${ROUTES_PATH.CONG_TRINH}/${project._id}`,
              item: createArticleSchemaShort({
                title: project.title,
                image: project.thumbnail,
                description: project.shortDescription || project.description,
              }),
            })),
          },
        }}
      />
      <StructuredData
        data={createBreadcrumbSchema([
          { name: 'Trang chủ', url: `${process.env.NEXT_PUBLIC_URL}` },
          { name: 'Công trình', url: `${process.env.NEXT_PUBLIC_URL}/${ROUTES_PATH.CONG_TRINH}` },
        ])}
      />

      <header className={styles.pageHead}>
        <div className={styles.headInner}>
          <nav className={styles.breadcrumb} aria-label="Breadcrumb">
            <Link href="/">Trang chủ</Link>
            <span className={styles.breadcrumbSep} aria-hidden="true">
              /
            </span>
            <span className={styles.breadcrumbCurrent} aria-current="page">
              Công trình
            </span>
          </nav>
          <div className={styles.headGrid}>
            <div>
              <p className={styles.kicker}>Album thực tế</p>
              <h1 className={styles.title}>Công trình đã thi công</h1>
            </div>
            <div className={styles.headAside}>
              <p className={styles.lead}>
                Album lắp đặt tại căn hộ, biệt thự và văn phòng — xem cách rèm hoàn thiện
                từng không gian trước khi chọn mẫu.
              </p>
              <p className={styles.headNote}>Bình Dương &amp; TP.HCM · Khảo sát miễn phí</p>
            </div>
          </div>
        </div>
      </header>

      {(loading || (!error && featuredProjects.length > 0)) && (
        <section className={styles.featuredSection} aria-labelledby="featured-projects-title">
          <div className={styles.sectionInner}>
            <div className={styles.sectionHead}>
              <div>
                <p className={styles.kicker}>Tuyển chọn</p>
                <h2 id="featured-projects-title" className={styles.sectionTitle}>
                  Dự án nổi bật
                </h2>
              </div>
              <div className={styles.sectionAside}>
                <p className={styles.sectionLead}>
                  Vài công trình tiêu biểu — nơi rèm được đo may riêng cho từng ô cửa
                  và hoàn thiện cùng gia chủ.
                </p>
                <a href="#all-projects" className={styles.textLink}>
                  Xem tất cả công trình
                  <FaArrowRight className={styles.textLinkIcon} aria-hidden="true" />
                </a>
              </div>
            </div>

            {loading ? (
              <div className={styles.featuredGrid} aria-hidden="true">
                {[0, 1].map(item => (
                  <div key={item} className={styles.featuredSkeleton}>
                    <span className={styles.featuredSkeletonMedia} />
                    <span className={styles.skeletonLine} />
                    <span className={styles.skeletonLineShort} />
                  </div>
                ))}
              </div>
            ) : (
              <div className={styles.featuredGrid}>
                {featuredProjects.map((project, index) => (
                  <FeaturedProjectCard
                    key={project._id || project.id}
                    project={project}
                    index={index}
                    priority={index === 0}
                  />
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      <section id="all-projects" className={styles.allSection} aria-labelledby="all-projects-title">
        <div className={styles.sectionInner}>
          <div className={styles.sectionHead}>
            <div>
              <p className={styles.kicker}>Toàn bộ</p>
              <h2 id="all-projects-title" className={styles.sectionTitle}>
                Tất cả công trình
              </h2>
            </div>
            <div className={styles.sectionAside}>
              <p className={styles.sectionLead}>
                Lọc theo loại hình, tìm theo tên hoặc khu vực — mỗi công trình là một
                album lắp đặt thực tế.
              </p>
            </div>
          </div>

          <div className={styles.toolbar}>
            <div className={styles.searchBox}>
              <FaSearch className={styles.searchIcon} aria-hidden="true" />
              <input
                id="project-search"
                name="project-search"
                type="search"
                value={searchTerm}
                onChange={event => handleSearchChange(event.target.value)}
                placeholder="Tìm theo tên công trình, khu vực…"
                aria-label="Tìm kiếm công trình"
                className={styles.searchInput}
              />
              {searchTerm && (
                <button
                  type="button"
                  className={styles.searchClear}
                  onClick={() => handleSearchChange('')}
                  aria-label="Xóa tìm kiếm"
                >
                  <FaTimes aria-hidden="true" />
                </button>
              )}
            </div>

            <div className={styles.chips} role="group" aria-label="Lọc theo loại công trình">
              <button
                type="button"
                className={`${styles.chip} ${activeType === 'all' ? styles.chipActive : ''}`}
                onClick={() => handleTypeChange('all')}
                aria-pressed={activeType === 'all'}
              >
                Tất cả
                <span className={styles.chipCount}>{projects.length}</span>
              </button>
              {projectTypes.map(type => (
                <button
                  key={type}
                  type="button"
                  className={`${styles.chip} ${activeType === type ? styles.chipActive : ''}`}
                  onClick={() => handleTypeChange(type)}
                  aria-pressed={activeType === type}
                >
                  {type}
                  <span className={styles.chipCount}>{typeCounts[type]}</span>
                </button>
              ))}
            </div>

            <select
              id="project-type-filter"
              name="project-type"
              className={styles.mobileSelect}
              value={activeType}
              onChange={event => handleTypeChange(event.target.value)}
              aria-label="Lọc theo loại công trình"
            >
              <option value="all">Tất cả các loại ({projects.length})</option>
              {projectTypes.map(type => (
                <option key={type} value={type}>
                  {type} ({typeCounts[type]})
                </option>
              ))}
            </select>
          </div>

          <div className={styles.resultsBar}>
            <p className={styles.resultCount}>
              {loading ? (
                'Đang tải công trình'
              ) : (
                <>
                  <strong>{filteredProjects.length}</strong>
                  công trình
                </>
              )}
            </p>
            {hasActiveFilters && !loading && (
              <button type="button" className={styles.clearFilters} onClick={clearFilters}>
                Xóa bộ lọc
              </button>
            )}
          </div>

          {loading ? (
            <div className={styles.skeletonGrid} aria-hidden="true">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className={styles.skeletonCard}>
                  <span className={styles.skeletonImage} />
                  <span className={styles.skeletonLine} />
                  <span className={styles.skeletonLineShort} />
                </div>
              ))}
            </div>
          ) : error ? (
            <div className={styles.statePanel} role="alert">
              <h3 className={styles.stateTitle}>Không tải được công trình</h3>
              <p className={styles.stateText}>{error}</p>
              <div className={styles.stateActions}>
                <button
                  type="button"
                  className={styles.stateButton}
                  onClick={() => setReloadKey(key => key + 1)}
                >
                  Thử lại
                </button>
              </div>
            </div>
          ) : projects.length === 0 ? (
            <div className={styles.statePanel}>
              <h3 className={styles.stateTitle}>Công trình đang được cập nhật</h3>
              <p className={styles.stateText}>
                Gọi hoặc nhắn Zalo để xem album lắp đặt mới nhất và hẹn khảo sát tại nhà.
              </p>
              <div className={styles.stateActions}>
                {phoneHref && (
                  <a href={phoneHref} className={styles.stateButton}>
                    <FaPhoneAlt aria-hidden="true" /> {hotline}
                  </a>
                )}
                {zaloUrl && (
                  <a
                    href={zaloUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.stateButtonGhost}
                  >
                    Nhắn Zalo
                  </a>
                )}
              </div>
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className={styles.statePanel}>
              <h3 className={styles.stateTitle}>Không tìm thấy công trình phù hợp</h3>
              <p className={styles.stateText}>
                Thử từ khóa khác hoặc bỏ bộ lọc để xem toàn bộ album.
              </p>
              <div className={styles.stateActions}>
                <button type="button" className={styles.stateButton} onClick={clearFilters}>
                  Xóa bộ lọc
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className={styles.grid}>
                {visibleProjects.map((project, index) => (
                  <ProjectListCard
                    key={project._id || project.id}
                    project={project}
                    priority={index < 3}
                  />
                ))}
              </div>
              {hasMore && (
                <div className={styles.loadMoreWrap}>
                  <button
                    type="button"
                    className={styles.loadMore}
                    onClick={() => setVisibleCount(count => count + PAGE_SIZE)}
                  >
                    Xem thêm công trình
                    <FaArrowRight aria-hidden="true" />
                  </button>
                  <span className={styles.loadMoreMeta}>
                    Còn {filteredProjects.length - visibleCount} công trình
                  </span>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      <section className={styles.processSection} aria-labelledby="process-title">
        <div className={styles.sectionInner}>
          <div className={styles.sectionHead}>
            <div>
              <p className={styles.kicker}>Quy trình</p>
              <h2 id="process-title" className={styles.sectionTitle}>
                Thi công trong 5 bước
              </h2>
            </div>
            <div className={styles.sectionAside}>
              <p className={styles.sectionLead}>
                Từ khảo sát đến bảo hành — một đầu mối duy nhất, lịch hẹn rõ ràng.
              </p>
            </div>
          </div>
          <div className={styles.processGrid}>
            {PROCESS_STEPS.map((step, index) => (
              <div key={step.title} className={styles.processStep}>
                <span className={styles.processNumber}>{String(index + 1).padStart(2, '0')}</span>
                <h3 className={styles.processTitle}>{step.title}</h3>
                <p className={styles.processText}>{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.reviewsSection} aria-labelledby="reviews-title">
        <div className={styles.sectionInner}>
          <div className={styles.sectionHead}>
            <div>
              <p className={styles.kicker}>Khách hàng</p>
              <h2 id="reviews-title" className={styles.sectionTitle}>
                Khách hàng nói gì
              </h2>
            </div>
            <div className={styles.sectionAside}>
              <p className={styles.sectionLead}>
                Chia sẻ từ các gia chủ và doanh nghiệp đã lắp rèm cùng Tuấn Rèm.
              </p>
            </div>
          </div>
          <div className={styles.reviewsGrid}>
            {REVIEWS.map(review => (
              <figure key={review.name} className={styles.reviewCard}>
                <div className={styles.reviewStars} role="img" aria-label="5 trên 5 sao">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <FaStar key={index} aria-hidden="true" />
                  ))}
                </div>
                <blockquote className={styles.reviewQuote}>“{review.quote}”</blockquote>
                <figcaption className={styles.reviewAuthor}>
                  <span className={styles.reviewInitials} aria-hidden="true">
                    {review.initials}
                  </span>
                  <div>
                    <p className={styles.reviewName}>{review.name}</p>
                    <p className={styles.reviewMeta}>{review.context}</p>
                  </div>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.ctaSection} aria-labelledby="projects-cta-title">
        <div className={styles.ctaInner}>
          <p className={styles.ctaKicker}>Tư vấn miễn phí</p>
          <h2 id="projects-cta-title" className={styles.ctaTitle}>
            Bạn muốn thi công rèm cho công trình của mình?
          </h2>
          <p className={styles.ctaText}>
            Gửi ảnh hiện trạng hoặc hẹn khảo sát — tư vấn mẫu vải, báo giá theo mét
            và lên lịch thi công tận nơi.
          </p>
          <div className={styles.ctaActions}>
            <Link href="/contact" className={styles.ctaPrimary}>
              Liên hệ ngay
            </Link>
            {zaloUrl && (
              <a
                href={zaloUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.ctaGhost}
              >
                Nhắn Zalo
              </a>
            )}
          </div>
          {(hotline || address) && (
            <p className={styles.ctaNote}>{[hotline, address].filter(Boolean).join(' · ')}</p>
          )}
        </div>
      </section>
    </div>
  );
}
