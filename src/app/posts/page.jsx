'use client';

import { Suspense, useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  FaArrowRight,
  FaChevronLeft,
  FaChevronRight,
  FaRegCalendarAlt,
  FaRegEye,
} from 'react-icons/fa';
import { getPosts } from '@/lib/api';
import PostListCard from '@/components/posts/PostListCard';
import { ROUTES_PATH } from '@/utils/constant';
import StructuredData, {
  createArticleSchemaShort,
  createBreadcrumbSchema,
} from '@/components/StructureData';
import styles from '@/styles/modules/Posts.module.css';

const PAGE_SIZE = 9;
const PHONE_DISPLAY = '0937 543 809';
const ZALO_HREF = 'https://zalo.me/0937543809';
const FALLBACK_IMAGE = '/images/curtain-placeholder.jpg';

function formatDate(value) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date);
}

function collectTagCounts(posts) {
  const counts = {};
  posts.forEach(post => {
    post.tags?.forEach(tag => {
      counts[tag] = (counts[tag] || 0) + 1;
    });
  });
  return counts;
}

function FeaturedPost({ post }) {
  const postId = post._id || post.id;
  const href = `/${ROUTES_PATH.POSTS}/${postId}`;
  const [imageSrc, setImageSrc] = useState(post.featuredImage || FALLBACK_IMAGE);

  useEffect(() => {
    setImageSrc(post.featuredImage || FALLBACK_IMAGE);
  }, [post.featuredImage]);

  const formattedDate = formatDate(post.createdAt);
  const tag = post.tags?.[0];

  return (
    <Link href={href} className={styles.featuredLink}>
      <span className={styles.featuredMedia}>
        <Image
          src={imageSrc}
          alt={post.title}
          fill
          priority
          sizes="(max-width: 900px) 100vw, 55vw"
          className={styles.featuredImage}
          onError={() => {
            if (imageSrc !== FALLBACK_IMAGE) setImageSrc(FALLBACK_IMAGE);
          }}
        />
        {tag && <span className={styles.featuredTag}>{tag}</span>}
      </span>

      <span className={styles.featuredBody}>
        <span className={styles.featuredKicker}>Đọc nhiều nhất</span>
        <h2 className={styles.featuredTitle}>{post.title}</h2>
        {post.summary && <span className={styles.featuredText}>{post.summary}</span>}

        <span className={styles.featuredMeta}>
          {formattedDate && (
            <span className={styles.featuredMetaItem}>
              <FaRegCalendarAlt aria-hidden="true" />
              {formattedDate}
            </span>
          )}
          {post.viewCount != null && (
            <span className={styles.featuredMetaItem}>
              <FaRegEye aria-hidden="true" />
              {post.viewCount} lượt xem
            </span>
          )}
        </span>

        <span className={styles.featuredMore}>
          Đọc bài viết
          <FaArrowRight className={styles.featuredMoreIcon} aria-hidden="true" />
        </span>
      </span>
    </Link>
  );
}

function SkeletonGrid({ count = 3 }) {
  return (
    <div className={styles.skeletonGrid} aria-hidden="true">
      {Array.from({ length: count }, (_, index) => (
        <div key={index} className={styles.skeletonCard}>
          <span className={styles.skeletonImage} />
          <span className={styles.skeletonLineShort} />
          <span className={styles.skeletonLine} />
          <span className={styles.skeletonLineShort} />
        </div>
      ))}
    </div>
  );
}

function PostsSkeleton({ withFeatured = false }) {
  return (
    <div className={styles.preloadWrap}>
      {withFeatured && (
        <div className={styles.featuredLink} aria-hidden="true">
          <span className={styles.skeletonImage} />
          <span className={styles.skeletonCard}>
            <span className={styles.skeletonLineShort} />
            <span className={styles.skeletonLine} />
            <span className={styles.skeletonLine} />
            <span className={styles.skeletonLineShort} />
          </span>
        </div>
      )}
      <div className={withFeatured ? styles.skeletonGridWrap : undefined}>
        <SkeletonGrid />
      </div>
    </div>
  );
}

function PostsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedTag = searchParams.get('tag') ?? '';

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [tagCounts, setTagCounts] = useState({});
  const [allTotal, setAllTotal] = useState(0);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedTag]);

  useEffect(() => {
    let cancelled = false;

    const loadTags = async () => {
      try {
        const response = await getPosts(1, 100, 'published');
        if (cancelled) return;
        setTagCounts(collectTagCounts(response.posts || []));
        setAllTotal(response.pagination?.total ?? response.posts?.length ?? 0);
      } catch (err) {
        console.error(err);
      }
    };

    loadTags();
    return () => {
      cancelled = true;
    };
  }, [reloadKey]);

  useEffect(() => {
    let cancelled = false;

    const fetchPosts = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await getPosts(
          currentPage,
          PAGE_SIZE,
          'published',
          selectedTag || undefined
        );
        if (cancelled) return;
        setPosts(response.posts || []);
        setTotalPages(response.pagination?.pages || 1);
        setTotalCount(response.pagination?.total ?? response.posts?.length ?? 0);
      } catch (err) {
        if (!cancelled) {
          setError('Không tải được bài viết');
          console.error(err);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchPosts();
    return () => {
      cancelled = true;
    };
  }, [currentPage, selectedTag, reloadKey]);

  const tagOptions = useMemo(
    () =>
      Object.entries(tagCounts).sort(
        (a, b) => b[1] - a[1] || a[0].localeCompare(b[0], 'vi')
      ),
    [tagCounts]
  );

  const selectTag = useCallback(
    tag => {
      setCurrentPage(1);
      if (tag) {
        router.replace(`/posts?tag=${encodeURIComponent(tag)}`, { scroll: false });
      } else {
        router.replace('/posts', { scroll: false });
      }
    },
    [router]
  );

  const goToPage = useCallback(page => {
    setCurrentPage(page);
    window.requestAnimationFrame(() => {
      document.getElementById('all-posts')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }, []);

  const showFeatured = !loading && !error && !selectedTag && currentPage === 1 && posts.length > 1;
  const featuredPost = useMemo(() => {
    if (!showFeatured) return null;
    return posts.reduce(
      (best, post) => ((post.viewCount || 0) > (best.viewCount || 0) ? post : best),
      posts[0]
    );
  }, [showFeatured, posts]);
  const gridPosts = featuredPost
    ? posts.filter(
        post =>
          String(post._id || post.id) !== String(featuredPost._id || featuredPost.id)
      )
    : posts;

  return (
    <div className={styles.page}>
      <StructuredData
        id="posts-breadcrumb-schema"
        data={createBreadcrumbSchema([
          { name: 'Trang chủ', url: `${process.env.NEXT_PUBLIC_URL}` },
          { name: 'Blog', url: `${process.env.NEXT_PUBLIC_URL}/${ROUTES_PATH.POSTS}` },
        ])}
      />
      <StructuredData
        id="posts-collection-schema"
        data={{
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: 'Blog - Tuấn Rèm',
          description:
            'Tổng hợp các bài viết mới nhất từ Tuấn Rèm về rèm cửa, mẹo trang trí nội thất và công trình thực tế.',
          url: `${process.env.NEXT_PUBLIC_URL}/${ROUTES_PATH.POSTS}`,
          mainEntity: {
            '@type': 'ItemList',
            itemListElement: posts.map((post, index) => ({
              '@type': 'ListItem',
              position: index + 1,
              url: `${process.env.NEXT_PUBLIC_URL}/${ROUTES_PATH.POSTS}/${post._id || post.id}`,
              item: createArticleSchemaShort({
                title: post.title,
                description: post.summary,
                image: post.featuredImage,
              }),
            })),
          },
        }}
      />

      <header className={styles.pageHead}>
        <div className={styles.headInner}>
          <nav className={styles.breadcrumb} aria-label="Breadcrumb">
            <Link href="/">Trang chủ</Link>
            <span className={styles.breadcrumbSep} aria-hidden="true">
              /
            </span>
            <span className={styles.breadcrumbCurrent} aria-current="page">
              Blog
            </span>
          </nav>

          <div className={styles.headGrid}>
            <div>
              <p className={styles.kicker}>Tạp chí Tuấn Rèm</p>
              <h1 className={styles.title}>Bài viết &amp; cảm hứng</h1>
            </div>
            <div className={styles.headAside}>
              <p className={styles.lead}>
                Kinh nghiệm chọn vải, xu hướng nội thất và những câu chuyện nghề từ các công
                trình thực tế.
              </p>
              <p className={styles.headNote}>
                {allTotal > 0 ? `${allTotal} bài viết · Cập nhật hàng tuần` : 'Cập nhật hàng tuần'}
              </p>
            </div>
          </div>
        </div>
      </header>

      {loading ? (
        <PostsSkeleton withFeatured={!selectedTag} />
      ) : error ? (
        <section className={styles.allSection}>
          <div className={styles.sectionInner}>
            <div className={styles.statePanel} role="alert">
              <h2 className={styles.stateTitle}>Không tải được bài viết</h2>
              <p className={styles.stateText}>
                Đã có lỗi khi kết nối. Vui lòng thử lại sau ít phút.
              </p>
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
          </div>
        </section>
      ) : posts.length === 0 ? (
        <section className={styles.allSection}>
          <div className={styles.sectionInner}>
            <div className={styles.statePanel}>
              <h2 className={styles.stateTitle}>
                {selectedTag ? 'Không có bài viết phù hợp' : 'Chưa có bài viết nào'}
              </h2>
              <p className={styles.stateText}>
                {selectedTag
                  ? `Chưa có bài viết nào với chủ đề “${selectedTag}”.`
                  : 'Tuấn Rèm đang chuẩn bị nội dung mới. Ghé lại sớm nhé.'}
              </p>
              <div className={styles.stateActions}>
                {selectedTag ? (
                  <button
                    type="button"
                    className={styles.stateButton}
                    onClick={() => selectTag('')}
                  >
                    Xem tất cả bài viết
                  </button>
                ) : (
                  <Link href="/" className={styles.stateButtonGhost}>
                    Về trang chủ
                  </Link>
                )}
              </div>
            </div>
          </div>
        </section>
      ) : (
        <>
          {featuredPost && (
            <section className={styles.featuredSection} aria-label="Bài viết nổi bật">
              <div className={styles.sectionInner}>
                <FeaturedPost post={featuredPost} />
              </div>
            </section>
          )}

          <section id="all-posts" className={styles.allSection} aria-labelledby="all-posts-title">
            <div className={styles.sectionInner}>
              <h2 id="all-posts-title" className={styles.srOnly}>
                {selectedTag ? `Bài viết chủ đề ${selectedTag}` : 'Tất cả bài viết'}
              </h2>

              <div className={styles.toolbar}>
                <div className={styles.chips} role="group" aria-label="Lọc theo chủ đề">
                  <button
                    type="button"
                    onClick={() => selectTag('')}
                    aria-pressed={selectedTag === ''}
                    className={`${styles.chip} ${selectedTag === '' ? styles.chipActive : ''}`}
                  >
                    Tất cả
                    {allTotal > 0 && <span className={styles.chipCount}>{allTotal}</span>}
                  </button>
                  {tagOptions.map(([tag, count]) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => selectTag(tag)}
                      aria-pressed={selectedTag === tag}
                      className={`${styles.chip} ${
                        selectedTag === tag ? styles.chipActive : ''
                      }`}
                    >
                      {tag}
                      <span className={styles.chipCount}>{count}</span>
                    </button>
                  ))}
                </div>

                <label className={styles.srOnly} htmlFor="post-topic-select">
                  Chọn chủ đề bài viết
                </label>
                <select
                  id="post-topic-select"
                  name="post-topic"
                  className={styles.mobileSelect}
                  value={selectedTag}
                  onChange={event => selectTag(event.target.value)}
                >
                  <option value="">Tất cả chủ đề</option>
                  {tagOptions.map(([tag, count]) => (
                    <option key={tag} value={tag}>
                      {tag} ({count})
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.resultsBar}>
                <p className={styles.resultCount} aria-live="polite">
                  <strong>{totalCount}</strong> bài viết
                  {selectedTag && (
                    <>
                      {' '}
                      <span className={styles.filterTag}>về “{selectedTag}”</span>
                    </>
                  )}
                </p>
                {selectedTag && (
                  <button
                    type="button"
                    className={styles.clearFilters}
                    onClick={() => selectTag('')}
                  >
                    Bỏ lọc chủ đề
                  </button>
                )}
              </div>

              <div className={styles.grid}>
                {gridPosts.map(post => (
                  <PostListCard key={post._id || post.id} post={post} />
                ))}
              </div>

              {totalPages > 1 && (
                <nav className={styles.pagination} aria-label="Phân trang bài viết">
                  <button
                    type="button"
                    className={styles.pageArrow}
                    aria-label="Trang trước"
                    disabled={currentPage === 1}
                    onClick={() => goToPage(currentPage - 1)}
                  >
                    <FaChevronLeft aria-hidden="true" />
                  </button>
                  <div className={styles.pageNumbers}>
                    {Array.from({ length: totalPages }, (_, index) => index + 1).map(page => (
                      <button
                        key={page}
                        type="button"
                        className={`${styles.pageBtn} ${
                          currentPage === page ? styles.pageBtnActive : ''
                        }`}
                        aria-label={`Trang ${page}`}
                        aria-current={currentPage === page ? 'page' : undefined}
                        onClick={() => goToPage(page)}
                      >
                        {page}
                      </button>
                    ))}
                  </div>
                  <button
                    type="button"
                    className={styles.pageArrow}
                    aria-label="Trang sau"
                    disabled={currentPage === totalPages}
                    onClick={() => goToPage(currentPage + 1)}
                  >
                    <FaChevronRight aria-hidden="true" />
                  </button>
                </nav>
              )}
            </div>
          </section>
        </>
      )}

      <section className={styles.ctaSection} aria-labelledby="posts-cta-title">
        <div className={styles.ctaInner}>
          <p className={styles.ctaKicker}>Cần tư vấn?</p>
          <h2 id="posts-cta-title" className={styles.ctaTitle}>
            Chọn rèm đúng ngay từ lần đầu
          </h2>
          <p className={styles.ctaText}>
            Gửi kích thước cửa hoặc ảnh không gian — Tuấn Rèm tư vấn chất liệu, màu sắc và báo
            giá may đo tận nơi.
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
          <p className={styles.ctaNote}>{`${PHONE_DISPLAY} · Dĩ An, Bình Dương`}</p>
        </div>
      </section>
    </div>
  );
}

export default function Posts() {
  return (
    <Suspense
      fallback={
        <div className={styles.page}>
          <div className={styles.sectionInner}>
            <PostsSkeleton withFeatured />
          </div>
        </div>
      }
    >
      <PostsContent />
    </Suspense>
  );
}
