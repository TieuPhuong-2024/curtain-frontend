'use client';

import { FaPhone, FaYoutube } from 'react-icons/fa';
import { SiZalo } from 'react-icons/si';
import { useState, useEffect } from 'react';
import { useMediaQuery } from 'react-responsive';

const FloatingContact = () => {
  const [isVisible, setIsVisible] = useState(false);
  const isMobile = useMediaQuery({ maxWidth: 768 }); // Check if device is mobile

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <div className={`fixed right-4 sm:right-6 bottom-20 sm:bottom-24 z-50 flex flex-col gap-3 sm:gap-4 transition-all duration-300 ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
      <style jsx global>{`
        @media (max-width: 768px) {
          .fixed.right-4 {
            right: 1rem;
          }
          /* Thêm hiệu ứng khi chạm vào nút trên mobile */
          @media (hover: none) {
            a:active {
              transform: scale(0.95) !important;
              opacity: 0.9 !important;
            }
          }
        }
      `}</style>
      {/* Phone Button */}
      <a
        href="tel:+84937543809"
        className="w-12 h-12 bg-red-600 hover:bg-red-700 text-white rounded-full flex items-center justify-center shadow-lg transform hover:scale-110 transition-all duration-200 group relative"
        aria-label="Gọi điện thoại"
        title="Gọi: 0937 543 809"
      >
        <FaPhone className="text-xl" />
        {!isMobile && (
          <span className="absolute right-full mr-3 px-3 py-1 bg-gray-800 text-white text-sm rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
            0937 543 809
          </span>
        )}
      </a>

      {/* Zalo Button */}
      <a
        href="https://zalo.me/0937543809"
        target="_blank"
        rel="noopener noreferrer"
        className="w-12 h-12 bg-blue-500 hover:bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg transform hover:scale-110 transition-all duration-200 group relative"
        aria-label="Nhắn tin Zalo"
        title="Chat Zalo"
      >
        <SiZalo className="text-2xl" />
        {!isMobile && (
          <span className="absolute right-full mr-3 px-3 py-1 bg-gray-800 text-white text-sm rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
            Chat Zalo
          </span>
        )}
      </a>

      {/* YouTube Button */}
      <a
        href="https://www.youtube.com/@Tu%E1%BA%A5nR%C3%A8mB%C3%ACnhD%C6%B0%C6%A1ng"
        target="_blank"
        rel="noopener noreferrer"
        className="w-12 h-12 bg-red-600 hover:bg-red-700 text-white rounded-full flex items-center justify-center shadow-lg transform hover:scale-110 transition-all duration-200 group relative"
        aria-label="Kênh YouTube"
        title="Kênh YouTube"
      >
        <FaYoutube className="text-2xl" />
        {!isMobile && (
          <span className="absolute right-full mr-3 px-3 py-1 bg-gray-800 text-white text-sm rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
            Kênh YouTube
          </span>
        )}
      </a>

      {/* Back to Top Button - Only shows when scrolled down */}
      <button
        onClick={scrollToTop}
        className={`w-12 h-12 bg-gray-700 hover:bg-gray-800 text-white rounded-full flex items-center justify-center shadow-lg transform hover:scale-110 transition-all duration-200 mt-2 ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        aria-label="Lên đầu trang"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>
    </div>
  );
};

export default FloatingContact;
