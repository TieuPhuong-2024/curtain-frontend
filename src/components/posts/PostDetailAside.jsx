'use client';

import Link from 'next/link';
import PostDetailToc from '@/components/posts/PostDetailToc';
import styles from '@/styles/modules/PostDetail.module.css';
import { ROUTES_PATH } from '@/utils/constant';

export default function PostDetailAside({
  toc,
  ctaTitle = 'Cần tư vấn rèm cho nhà bạn?',
  ctaText = 'Gửi kích thước cửa sổ hoặc hình ảnh không gian — Tuấn Rèm báo giá may đo và lắp tận nơi.',
}) {
  return (
    <aside className={styles.aside}>
      <div className={styles.asideSticky}>
        <PostDetailToc items={toc} variant="desktop" />
        <div className={styles.cta}>
          <p className={styles.ctaTitle}>{ctaTitle}</p>
          <p className={styles.ctaText}>{ctaText}</p>
          <div className={styles.ctaActions}>
            <Link href={`/${ROUTES_PATH.CONTACT}`} className={styles.ctaPrimary}>
              Liên hệ báo giá
            </Link>
            <a href="tel:+84937543809" className={styles.ctaSecondary}>
              Gọi 0937 543 809
            </a>
          </div>
        </div>
      </div>
    </aside>
  );
}
