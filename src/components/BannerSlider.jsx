'use client';

import { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import styles from '@/styles/modules/BannerSlider.module.css';

const SLIDE_DURATION = 7000;

const FALLBACK_SLIDE = {
  title: 'Rèm cửa cho không gian của bạn',
  description: 'Xem mẫu vải, chọn màu, rồi hẹn đo và lắp tại nhà.',
  link: '/products',
  image: '/images/hero-curtain.jpg',
};

export default function BannerSlider({ banners = [], loading = false }) {
  const slides = banners.length > 0 ? banners : [FALLBACK_SLIDE];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const hasMultiple = slides.length > 1;

  const goTo = useCallback(
    (nextIndex) => {
      setCurrentIndex(((nextIndex % slides.length) + slides.length) % slides.length);
    },
    [slides.length]
  );

  useEffect(() => {
    setCurrentIndex(0);
  }, [banners]);

  useEffect(() => {
    if (!hasMultiple || paused) return undefined;

    const timer = setTimeout(() => goTo(currentIndex + 1), SLIDE_DURATION);
    return () => clearTimeout(timer);
  }, [currentIndex, goTo, hasMultiple, paused]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'ArrowLeft') goTo(currentIndex - 1);
      if (event.key === 'ArrowRight') goTo(currentIndex + 1);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, goTo]);

  if (loading) {
    return (
      <section className={styles.hero} aria-label="Đang tải bộ sưu tập nổi bật" aria-busy="true">
        <div className={styles.skeletonBg} aria-hidden="true" />
        <div className={styles.heroInner}>
          <span className={`${styles.skeletonLine} ${styles.skeletonKicker}`} />
          <span className={`${styles.skeletonLine} ${styles.skeletonTitle}`} />
          <span className={`${styles.skeletonLine} ${styles.skeletonTitleShort}`} />
          <span className={`${styles.skeletonLine} ${styles.skeletonText}`} />
          <span className={`${styles.skeletonLine} ${styles.skeletonButton}`} />
        </div>
      </section>
    );
  }

  const currentSlide = slides[currentIndex];

  return (
    <section
      className={styles.hero}
      aria-label="Bộ sưu tập rèm nổi bật"
      aria-roledescription="carousel"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <div className={styles.media}>
        {slides.map((slide, index) => (
          <div
            key={slide._id || index}
            className={`${styles.slide} ${index === currentIndex ? styles.slideActive : ''}`}
            aria-hidden={index !== currentIndex}
          >
            <Image
              src={slide.image || FALLBACK_SLIDE.image}
              alt={slide.title || 'Rèm cửa Tuấn Rèm'}
              fill
              priority={index === 0}
              sizes="100vw"
              className={styles.image}
            />
          </div>
        ))}
        <div className={styles.overlay} aria-hidden="true" />
      </div>

      <div className={styles.heroInner}>
        <p className={styles.kicker}>Tuấn Rèm · Bình Dương</p>

        <div key={currentIndex} className={styles.heroContent}>
          <h1 className={styles.title}>{currentSlide.title || FALLBACK_SLIDE.title}</h1>
          {currentSlide.description && (
            <p className={styles.description}>{currentSlide.description}</p>
          )}
          <div className={styles.actions}>
            <Link href={currentSlide.link || '/products'} className={styles.primaryAction}>
              {currentSlide.link ? 'Xem thêm' : 'Xem sản phẩm'}
              <FaArrowRight className={styles.actionIcon} />
            </Link>
            <Link href="/contact" className={styles.secondaryAction}>
              Hẹn đo tại nhà
            </Link>
          </div>
        </div>

        <div className={styles.heroFoot}>
          <p className={styles.heroNote}>May đo theo yêu cầu · Lắp đặt tận nơi</p>

          {hasMultiple && (
            <div className={styles.controls}>
              <button
                type="button"
                onClick={() => goTo(currentIndex - 1)}
                className={styles.controlButton}
                aria-label="Banner trước"
              >
                <FaArrowLeft size={12} />
              </button>
              <span className={styles.counter}>
                <strong>{String(currentIndex + 1).padStart(2, '0')}</strong>
                <span>/ {String(slides.length).padStart(2, '0')}</span>
              </span>
              <button
                type="button"
                onClick={() => goTo(currentIndex + 1)}
                className={styles.controlButton}
                aria-label="Banner tiếp theo"
              >
                <FaArrowRight size={12} />
              </button>
            </div>
          )}
        </div>

        {hasMultiple && (
          <div className={styles.progressTrack}>
            {slides.map((slide, index) => (
              <button
                key={slide._id || index}
                type="button"
                onClick={() => goTo(index)}
                className={styles.progressSegment}
                aria-label={`Chuyển đến banner ${index + 1}`}
                aria-current={index === currentIndex}
              >
                <span
                  className={`${styles.progressFill} ${
                    index === currentIndex ? styles.progressActive : ''
                  }`}
                  style={
                    index === currentIndex
                      ? {
                          animationDuration: `${SLIDE_DURATION}ms`,
                          animationPlayState: paused ? 'paused' : 'running',
                        }
                      : undefined
                  }
                />
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
