'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { FaPhoneAlt } from 'react-icons/fa';
import { SiZalo } from 'react-icons/si';
import { useSettings } from '@/lib/SettingsContext';
import { phoneDigits } from '@/utils/siteSettings';
import styles from '@/styles/modules/FloatingContact.module.css';

const SCROLL_THRESHOLD = 300;

const FloatingContact = () => {
  const [isVisible, setIsVisible] = useState(false);
  const pathname = usePathname();
  const { getValue } = useSettings();

  const hotline = getValue('global.hotline');
  const zaloUrl = getValue('global.zaloUrl');
  const hotlineDigits = phoneDigits(hotline);
  const telHref = hotlineDigits ? `tel:+84${hotlineDigits.replace(/^0/, '')}` : '';

  useEffect(() => {
    const toggleVisibility = () => {
      setIsVisible(window.scrollY > SCROLL_THRESHOLD);
    };

    toggleVisibility();
    window.addEventListener('scroll', toggleVisibility, { passive: true });
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  if (pathname?.startsWith('/admin') || (!telHref && !zaloUrl)) {
    return null;
  }

  return (
    <aside
      className={`${styles.dock} ${isVisible ? styles.visible : ''}`}
      aria-label="Liên hệ nhanh"
    >
      {telHref && (
        <a
          href={telHref}
          className={`${styles.action} ${styles.call}`}
          aria-label={`Gọi điện ${hotline}`}
        >
          <FaPhoneAlt className={styles.phoneIcon} aria-hidden="true" />
          <span className={styles.tooltip}>Gọi {hotline}</span>
        </a>
      )}

      {telHref && zaloUrl && <span className={styles.divider} aria-hidden="true" />}

      {zaloUrl && (
        <a
          href={zaloUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={`${styles.action} ${styles.zalo}`}
          aria-label="Nhắn tin Zalo"
        >
          <SiZalo className={styles.zaloIcon} aria-hidden="true" />
          <span className={styles.tooltip}>Nhắn Zalo</span>
        </a>
      )}
    </aside>
  );
};

export default FloatingContact;
