'use client';

import { useEffect, useState } from 'react';
import styles from '@/styles/modules/PostDetail.module.css';

export default function PostDetailToc({ items, variant = 'desktop' }) {
  const [activeId, setActiveId] = useState('');

  useEffect(() => {
    if (!items?.length) return;

    const headings = items
      .map(({ id }) => document.getElementById(id))
      .filter(Boolean);

    if (!headings.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: '-20% 0px -55% 0px', threshold: 0 }
    );

    headings.forEach((el) => observer.observe(el));
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
            onClick={(e) => {
              e.preventDefault();
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
        <summary className={styles.detailsSummary}>Mục lục bài viết</summary>
        <div className={styles.detailsBody}>
          <nav aria-label="Mục lục">{list}</nav>
        </div>
      </details>
    );
  }

  return (
    <nav className={styles.tocDesktop} aria-label="Mục lục">
      <div className={styles.tocPanel}>
        <p className={styles.tocTitle}>Mục lục</p>
        {list}
      </div>
    </nav>
  );
}
