'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import CategoryCard from './CategoryCard';

const CategorySlider = ({ categories, productCounts = {} }) => {
  const sliderRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  // Function to handle slider scroll
  const scroll = (direction) => {
    if (sliderRef.current) {
      const { current } = sliderRef;
      const scrollAmount = direction === 'left' ? -300 : 300;
      current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  // Function to check scroll position and update arrow visibility
  const handleScroll = () => {
    if (sliderRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  if (!categories || categories.length === 0) {
    return <div className="text-center py-12 text-lg">Chưa có danh mục nào.</div>;
  }

  return (
    <>
      <p className="text-center text-gray-500 max-w-3xl mx-auto mb-8 text-base">
        Rèm cửa không chỉ là một phụ kiện trang trí đơn thuần, mà còn là yếu tố quan trọng tạo nên không gian lý tưởng cho gia đình bạn.
      </p>

      <div className="relative px-0 md:px-8">
        {/* Left navigation arrow */}
        {showLeftArrow && (
          <button
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-primary text-gray-800 hover:text-white p-2 rounded-full z-10 shadow-md transition-all hover:scale-110 hidden md:flex"
            aria-label="Previous categories"
          >
            <FaArrowLeft size={20} />
          </button>
        )}

        {/* Categories slider container */}
        <div
          ref={sliderRef}
          className={`flex overflow-x-auto gap-4 py-4 px-4 md:px-2 hide-scrollbar ${
            categories.length === 1 ? 'justify-center' : ''
          }`}
          onScroll={handleScroll}
        >
          {categories.map(category => (
            <div
              key={category._id}
              className="flex-shrink-0 w-[250px] md:w-[280px]"
            >
              <CategoryCard
                category={category}
                productCount={productCounts[category._id] || 0}
              />
            </div>
          ))}
        </div>

        {/* Right navigation arrow */}
        {showRightArrow && (
          <button
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-primary text-gray-800 hover:text-white p-2 rounded-full z-10 shadow-md transition-all hover:scale-110 hidden md:flex"
            aria-label="Next categories"
          >
            <FaArrowRight size={20} />
          </button>
        )}
      </div>

      <div className="text-center mt-8">
        <Link
          href="/products"
          className="inline-flex items-center text-primary hover:text-primary-dark font-medium transition-colors"
        >
          Xem tất cả danh mục <FaArrowRight className="ml-2" size={14} />
        </Link>
      </div>

      {/* CSS for hiding scrollbar */}
      <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </>
  );
};

export default CategorySlider; 