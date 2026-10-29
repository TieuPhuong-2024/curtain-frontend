'use client';

import { useState, useEffect, use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { format } from 'date-fns';
import { getPostById, getPosts } from '@/lib/api';
import PostCard from '@/components/PostCard';
import PostDetailToc from '@/components/posts/PostDetailToc';
import PostDetailAside from '@/components/posts/PostDetailAside';
import { renderCKEditorContent } from '@/utils/ckeditorConverter';
import { preparePostContent, getReadingMinutes } from '@/utils/postArticle';
import '@/app/styles/content-styles.css';
import StructuredData, { createArticleSchema, createBreadcrumbSchema } from '@/components/StructureData';
import { ROUTES_PATH } from '@/utils/constant';
import styles from '@/styles/modules/PostDetail.module.css';

export default function PostDetail({ params }) {
  const postId = use(params).id;

  const [post, setPost] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [preparedHtml, setPreparedHtml] = useState('');
  const [toc, setToc] = useState([]);
  const [readingMinutes, setReadingMinutes] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const fetchedPost = await getPostById(postId);
        setPost(fetchedPost);

        if (fetchedPost.tags?.length > 0) {
          const tag = fetchedPost.tags[0];
          const response = await getPosts(1, 3, 'published', tag);
          const filtered = response.posts.filter((p) => p._id !== postId);
          setRelatedPosts(filtered);
        }

        setLoading(false);
      } catch (err) {
        setError('Không tải được bài viết');
        console.error(err);
        setLoading(false);
      }
    };

    fetchPost();
  }, [postId]);

  useEffect(() => {
    if (!post?.content) {
      setPreparedHtml('');
      setToc([]);
      return;
    }

    const rawContent =
      typeof post.content === 'string'
        ? post.content
        : post.content?.html || post.content?.data || '';

    const sanitized = renderCKEditorContent(rawContent);
    const { html, toc: items } = preparePostContent(sanitized);
    setPreparedHtml(html);
    setToc(items);
    setReadingMinutes(getReadingMinutes(sanitized));
  }, [post?.content]);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return format(new Date(dateString), 'dd/MM/yyyy');
  };

  if (loading) {
    return (
      <div className={styles.loading} role="status" aria-live="polite">
        <div className={styles.spinner} aria-hidden="true" />
        <p>Đang tải bài viết…</p>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className={styles.page}>
        <div className={styles.errorBox}>{error || 'Không tìm thấy bài viết'}</div>
        <Link href={`/${ROUTES_PATH.POSTS}`} className={styles.errorBack}>
          Về danh sách blog
        </Link>
      </div>
    );
  }

  const postsUrl = `/${ROUTES_PATH.POSTS}`;

  return (
    <div className={styles.page}>
      <StructuredData
        data={createBreadcrumbSchema([
          { name: 'Trang chủ', url: `${process.env.NEXT_PUBLIC_URL}` },
          { name: 'Blog', url: `${process.env.NEXT_PUBLIC_URL}/${ROUTES_PATH.POSTS}` },
          {
            name: post.title,
            url: `${process.env.NEXT_PUBLIC_URL}/${ROUTES_PATH.POSTS}/${post._id}`,
          },
        ])}
      />
      <StructuredData
        data={createArticleSchema({
          title: post.title,
          url: `${process.env.NEXT_PUBLIC_URL}/${ROUTES_PATH.POSTS}/${post._id}`,
          image: post.featuredImage,
          datePublished: post.createdAt,
          dateModified: post.updatedAt,
          description: post.summary,
          articleBody: post.content,
        })}
      />

      <nav className={styles.breadcrumb} aria-label="Đường dẫn">
        <Link href="/">Trang chủ</Link>
        <span aria-hidden="true">/</span>
        <Link href={postsUrl}>Blog</Link>
        <span aria-hidden="true">/</span>
        <span className={styles.breadcrumbCurrent}>{post.title}</span>
      </nav>

      {post.featuredImage && (
        <div className={styles.hero}>
          <Image
            src={post.featuredImage}
            alt={post.title}
            fill
            className={styles.heroImage}
            priority
            sizes="(max-width: 1024px) 100vw, 72rem"
          />
          <div className={styles.heroFade} aria-hidden="true" />
        </div>
      )}

      <header className={styles.header}>
        <h1 className={styles.title}>{post.title}</h1>
        {post.summary && <p className={styles.lead}>{post.summary}</p>}
        <div className={styles.meta}>
          <span className={styles.metaItem}>Đăng {formatDate(post.createdAt)}</span>
          <span className={styles.metaItem}>Khoảng {readingMinutes} phút đọc</span>
          {post.viewCount != null && (
            <span className={styles.metaItem}>{post.viewCount} lượt xem</span>
          )}
        </div>
      </header>

      <div className={styles.layout}>
        <article className={styles.article}>
          <PostDetailToc items={toc} variant="mobile" />

          <div className={`${styles.body} post-content`}>
            <div
              className="ck-content"
              dangerouslySetInnerHTML={{ __html: preparedHtml }}
            />
          </div>

          {post.tags?.length > 0 && (
            <footer className={styles.tags}>
              <p className={styles.tagsLabel}>Chủ đề</p>
              <div className={styles.tagList}>
                {post.tags.map((tag) => (
                  <Link
                    key={tag}
                    href={`${postsUrl}?tag=${encodeURIComponent(tag)}`}
                    className={styles.tag}
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            </footer>
          )}
        </article>

        <PostDetailAside toc={toc} />
      </div>

      {relatedPosts.length > 0 && (
        <section className={styles.related} aria-labelledby="related-posts-heading">
          <h2 id="related-posts-heading" className={styles.relatedTitle}>
            Bài viết liên quan
          </h2>
          <div className={styles.relatedGrid}>
            {relatedPosts.map((relatedPost) => (
              <PostCard key={relatedPost._id} post={relatedPost} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
