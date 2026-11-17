'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaArrowRight, FaRegCalendarAlt, FaRegClock, FaRegEye } from 'react-icons/fa';
import { ROUTES_PATH } from '@/utils/constant';
import { getReadingMinutes } from '@/utils/postArticle';
import styles from '@/styles/modules/PostListCard.module.css';

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

export default function PostListCard({ post, priority = false }) {
  const postId = post._id || post.id;
  const href = `/${ROUTES_PATH.POSTS}/${postId}`;
  const [imageSrc, setImageSrc] = useState(post.featuredImage || FALLBACK_IMAGE);

  useEffect(() => {
    setImageSrc(post.featuredImage || FALLBACK_IMAGE);
  }, [post.featuredImage]);

  const formattedDate = formatDate(post.createdAt);
  const minutes = getReadingMinutes(post.content || '');
  const tag = post.tags?.[0];

  return (
    <Link href={href} className={styles.card}>
      <span className={styles.media}>
        <Image
          src={imageSrc}
          alt={post.title}
          fill
          sizes="(max-width: 700px) 100vw, (max-width: 1024px) 50vw, 33vw"
          priority={priority}
          className={styles.image}
          onError={() => {
            if (imageSrc !== FALLBACK_IMAGE) setImageSrc(FALLBACK_IMAGE);
          }}
        />
        {tag && <span className={styles.tag}>{tag}</span>}
      </span>

      <span className={styles.body}>
        <span className={styles.meta}>
          {formattedDate && (
            <span className={styles.metaItem}>
              <FaRegCalendarAlt aria-hidden="true" />
              {formattedDate}
            </span>
          )}
          <span className={styles.metaItem}>
            <FaRegClock aria-hidden="true" />
            {minutes} phút đọc
          </span>
          {post.viewCount != null && (
            <span className={styles.metaItem}>
              <FaRegEye aria-hidden="true" />
              {post.viewCount}
            </span>
          )}
        </span>

        <h3 className={styles.title}>{post.title}</h3>
        {post.summary && <span className={styles.summary}>{post.summary}</span>}

        <span className={styles.more}>
          Đọc bài viết
          <FaArrowRight className={styles.moreIcon} aria-hidden="true" />
        </span>
      </span>
    </Link>
  );
}
