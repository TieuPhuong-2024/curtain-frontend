'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import CategoryCard from './CategoryCard';
import styles from '@/styles/modules/CategorySlider.module.css';

const CategorySlider = ({ categories = [], productCounts = {} }) => {
  const sliderRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateArrows = useCallback(() => {
    const slider = sliderRef.current;
    if (!slider) return;

    const { scrollLeft, scrollWidth, clientWidth } = slider;
    setCanScrollLeft(scrollLeft > 4);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 4);
  }, []);

  const scroll = (direction) => {
    const slider = sliderRef.current;
    if (!slider) return;

    slider.scrollBy({
      left: direction === 'left' ? -slider.clientWidth * 0.8 : slider.clientWidth * 0.8,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    updateArrows();
    window.addEventListener('resize', updateArrows);
    return () => window.removeEventListener('resize', updateArrows);
  }, [categories, updateArrows]);

  const visibleCategories = categories.filter(
    (category) => category.image && String(category.image).trim() !== ''
  );

  if (visibleCategories.length === 0) {
    return (
      <div className={styles.emptyState}>
        Danh mục đang cập nhật ảnh. Gọi{' '}
        <a href="tel:+84937543809">0937 543 809</a> để xem mẫu vải tại nhà.
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      {canScrollLeft && (
        <button
          type="button"
          onClick={() => scroll('left')}
          className={`${styles.arrow} ${styles.arrowLeft}`}
          aria-label="Danh mục trước"
        >
          <FaArrowLeft size={14} />
        </button>
      )}

      <div
        ref={sliderRef}
        className={styles.track}
        onScroll={updateArrows}
        role="list"
        aria-label="Danh mục rèm cửa"
      >
        {visibleCategories.map((category) => (
          <div key={category._id} className={styles.item} role="listitem">
            <CategoryCard
              category={category}
              productCount={productCounts[category._id] || 0}
            />
          </div>
        ))}
      </div>

      {canScrollRight && (
        <button
          type="button"
          onClick={() => scroll('right')}
          className={`${styles.arrow} ${styles.arrowRight}`}
          aria-label="Danh mục tiếp theo"
        >
          <FaArrowRight size={14} />
        </button>
      )}
    </div>
  );
};

export default CategorySlider;
