'use client';

import { useState, useEffect } from 'react';
import { getPosts } from '@/lib/api';
import PostCard from '@/components/PostCard';
import { ROUTES_PATH } from '@/utils/constant';
import StructuredData, { createArticleSchemaShort, createBreadcrumbSchema } from '@/components/StructureData';
import listStyles from '@/styles/modules/ContentList.module.css';
import detailStyles from '@/styles/modules/PostDetail.module.css';

export default function Posts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedTag, setSelectedTag] = useState('');
  const [allTags, setAllTags] = useState([]);

  // Fetch posts
  const fetchPosts = async () => {
    setLoading(true);
    try {
      // Only show published posts on the public-facing page
      const response = await getPosts(currentPage, 9, 'published', selectedTag);
      setPosts(response.posts);
      setTotalPages(response.pagination.pages);

      // Extract all unique tags from posts
      const tags = [];
      response.posts.forEach(post => {
        if (post.tags) {
          post.tags.forEach(tag => {
            if (!tags.includes(tag)) {
              tags.push(tag);
            }
          });
        }
      });
      setAllTags(tags);
    } catch (err) {
      setError('Không tải được bài viết');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [currentPage, selectedTag]);

  return (
    <div className={detailStyles.page}>
      {/* Breadcrumbs Structured Data */}
      <StructuredData
        data={createBreadcrumbSchema([
          { name: 'Trang chủ', url: `${process.env.NEXT_PUBLIC_URL}` },
          { name: 'Blog', url: `${process.env.NEXT_PUBLIC_URL}/${ROUTES_PATH.POSTS}` },
        ])}
      />
      <StructuredData
        data={{
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: 'Blog - Tuấn Rèm',
          description: 'Tổng hợp các bài viết mới nhất từ Tuấn Rèm về rèm cửa, mẹo trang trí nội thất và công trình thực tế.',
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
      <div className={listStyles.header}>
        <h1 className={listStyles.title}>Blog</h1>
        <p className={listStyles.lead}>Các bài viết mới nhất</p>
      </div>

      {allTags.length > 0 && (
        <div className={listStyles.chipRow}>
          <button
            type="button"
            onClick={() => setSelectedTag('')}
            className={`${listStyles.chip} ${selectedTag === '' ? listStyles.chipActive : ''}`}
          >
            Tất cả
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => setSelectedTag(tag)}
              className={`${listStyles.chip} ${selectedTag === tag ? listStyles.chipActive : ''}`}
            >
              {tag}
            </button>
          ))}
        </div>
      )}

      {loading ? (
        <div className={listStyles.loading} role="status">
          <div className={listStyles.spinner} aria-hidden />
          <p>Đang tải bài viết…</p>
        </div>
      ) : error ? (
        <div className={listStyles.errorBox}>{error}</div>
      ) : (
        <>
          {posts.length === 0 ? (
            <div className={listStyles.empty}>
              <p>Không tìm thấy bài viết nào</p>
            </div>
          ) : (
            <div className={listStyles.grid}>
              {posts.map((post) => (
                <PostCard key={post._id} post={post} />
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <div className={listStyles.pagination}>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  type="button"
                  onClick={() => setCurrentPage(page)}
                  className={`${listStyles.pageBtn} ${
                    currentPage === page ? listStyles.pageBtnActive : ''
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
