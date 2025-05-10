'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { FaMapMarkerAlt, FaImages, FaVideo, FaChevronLeft, FaChevronRight, FaTimes, FaCalendarAlt, FaUser, FaCheckCircle } from 'react-icons/fa';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';

export default function ProjectCard({ project }) {
  const { title, description, location, type, images, videos, completionDate, customerName, productDetails } = project;
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [showDetails, setShowDetails] = useState(false);

  // Bổ sung lại các hàm chuyển ảnh chính
  const handlePrevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  // Gom cả ảnh và video vào một mảng slides
  const slides = [
    ...(images || []).map((src) => ({ type: 'image', src })),
    ...(videos || []).map((src) => {
      // Nếu là link YouTube, chuyển sang dạng embed
      if (src.includes('youtube.com/watch?v=')) {
        const videoId = src.split('v=')[1].split('&')[0];
        return {
          type: 'youtube',
          videoId: videoId,
          thumbnail: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
        };
      }
      if (src.includes('youtu.be/')) {
        const videoId = src.split('youtu.be/')[1].split('?')[0];
        return {
          type: 'youtube',
          videoId: videoId,
          thumbnail: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
        };
      }
      return { type: 'video', src };
    }),
  ];

  // Khi click xem ảnh hoặc video, xác định index trong slides
  const handleOpenLightbox = (type, idx) => {
    let index = 0;
    if (type === 'image') index = idx;
    else if (type === 'video') index = (images?.length || 0) + idx;
    setLightboxIndex(index);
    setLightboxOpen(true);
    document.body.style.overflow = 'hidden';
  };
  const handleCloseLightbox = () => {
    setLightboxOpen(false);
    document.body.style.overflow = 'auto';
  };

  const toggleDetails = () => {
    setShowDetails(!showDetails);
  };

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-lg mb-8 card-hover transition-all duration-300 hover:shadow-xl">
      {/* Main image with navigation */}
      <div className="relative h-60 sm:h-72 md:h-80 w-full">
        <Image
          src={images[currentImageIndex]}
          alt={title}
          fill
          sizes="(max-width: 576px) 100vw, (max-width: 768px) 90vw, (max-width: 1024px) 50vw, 33vw"
          style={{ objectFit: 'cover' }}
          className="transition-opacity duration-300"
        />
        
        {/* Image navigation buttons */}
        {images.length > 1 && (
          <>
            <button 
              onClick={handlePrevImage}
              className="cursor-pointer absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-1 sm:p-2 rounded-full hover:bg-opacity-70 transition-all"
              aria-label="Previous image"
            >
              <FaChevronLeft className="text-sm sm:text-base" />
            </button>
            <button 
              onClick={handleNextImage}
              className="cursor-pointer absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-1 sm:p-2 rounded-full hover:bg-opacity-70 transition-all"
              aria-label="Next image"
            >
              <FaChevronRight className="text-sm sm:text-base" />
            </button>
          </>
        )}
        
        {/* Image counter */}
        <div className="absolute bottom-2 right-2 bg-black bg-opacity-60 text-white px-2 py-1 rounded text-xs sm:text-sm">
          {currentImageIndex + 1} / {images.length}
        </div>
        
        {/* Project type badge */}
        <div className="absolute top-2 left-2">
          <span className="bg-blue-600 text-white text-xs px-2 py-1 sm:px-3 rounded-md font-medium">
            {type}
          </span>
        </div>
      </div>
      
      {/* Project details */}
      <div className="p-3 sm:p-4 md:p-5">
        <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1 sm:mb-2">{title}</h3>
        
        <div className="flex flex-wrap items-center text-sm sm:text-base text-gray-600 mb-2 sm:mb-3">
          <div className="flex items-center mr-4 mb-1">
            <FaMapMarkerAlt className="mr-1 text-blue-600" />
            <span>{location}</span>
          </div>
          
          {completionDate && (
            <div className="flex items-center mb-1">
              <FaCalendarAlt className="mr-1 text-blue-600" />
              <span>{completionDate}</span>
            </div>
          )}
        </div>
        
        <p className="text-sm sm:text-base text-gray-700 mb-3 sm:mb-4 line-clamp-3">{description}</p>
        
        {/* Additional details section */}
        {(productDetails || customerName) && (
          <div className={`mb-4 overflow-hidden transition-all duration-300 ${showDetails ? 'max-h-80' : 'max-h-0'}`}>
            {customerName && (
              <div className="flex items-start mb-2">
                <FaUser className="mr-2 text-blue-600 mt-1 flex-shrink-0" />
                <div>
                  <div className="font-medium text-gray-800">Khách hàng:</div>
                  <div className="text-gray-600">{customerName}</div>
                </div>
              </div>
            )}
            
            {productDetails && productDetails.length > 0 && (
              <div className="flex items-start">
                <FaCheckCircle className="mr-2 text-blue-600 mt-1 flex-shrink-0" />
                <div>
                  <div className="font-medium text-gray-800">Sản phẩm đã sử dụng:</div>
                  <ul className="list-disc pl-5 text-gray-600 text-sm">
                    {productDetails.map((detail, index) => (
                      <li key={index}>{detail}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        )}
        
        {/* Action buttons */}
        <div className="flex flex-wrap gap-2">
          {images.length > 0 && (
            <button 
              onClick={() => handleOpenLightbox('image', 0)}
              className="cursor-pointer flex items-center justify-center bg-blue-100 text-blue-700 px-3 py-1.5 sm:py-2 rounded text-sm hover:bg-blue-200 transition-colors"
            >
              <FaImages className="mr-1 sm:mr-2" />
              {images.length > 1 ? `Xem tất cả ảnh (${images.length})` : 'Xem ảnh'}
            </button>
          )}
          
          {videos && videos.length > 0 && (
            <button 
              onClick={() => handleOpenLightbox('video', 0)}
              className="cursor-pointer flex items-center justify-center bg-red-100 text-red-700 px-3 py-1.5 sm:py-2 rounded text-sm hover:bg-red-200 transition-colors"
            >
              <FaVideo className="mr-1 sm:mr-2" />
              {videos.length > 1 ? `Xem video (${videos.length})` : 'Xem video'}
            </button>
          )}
          
          {(productDetails || customerName) && (
            <button 
              onClick={toggleDetails}
              className="cursor-pointer flex items-center justify-center bg-gray-100 text-gray-700 px-3 py-1.5 sm:py-2 rounded text-sm hover:bg-gray-200 transition-colors ml-auto"
            >
              {showDetails ? 'Ẩn chi tiết' : 'Xem thêm chi tiết'}
            </button>
          )}
        </div>
      </div>
      
      {/* Thumbnail preview */}
      {images.length > 1 && (
        <div className="px-3 sm:px-5 pb-3 sm:pb-5 overflow-x-auto">
          <div className="flex gap-1.5 sm:gap-2 mt-1 sm:mt-2">
            {images.map((img, idx) => (
              <div 
                key={idx} 
                className={`relative w-12 h-12 sm:w-16 sm:h-16 flex-shrink-0 cursor-pointer border-2 rounded overflow-hidden ${
                  idx === currentImageIndex ? 'border-blue-600' : 'border-transparent'
                }`}
                onClick={() => setCurrentImageIndex(idx)}
              >
                <Image
                  src={img}
                  alt={`Thumbnail ${idx + 1}`}
                  fill
                  sizes="64px"
                  style={{ objectFit: 'cover' }}
                />
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Thay thế modal custom bằng Lightbox */}
      <Lightbox
        open={lightboxOpen}
        close={handleCloseLightbox}
        slides={slides}
        index={lightboxIndex}
        render={{
          slide: ({ slide }) => {
            if (slide.type === 'youtube') {
              return (
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <iframe
                    src={`https://www.youtube.com/embed/${slide.videoId}?autoplay=1&mute=0&controls=1&rel=0&modestbranding=1`}
                    width="80%"
                    height="80%"
                    allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title="YouTube video player"
                    frameBorder="0"
                  />
                </div>
              );
            }
            if (slide.type === 'image') {
              return (
                <img
                  src={slide.src}
                  alt=""
                  style={{
                    maxWidth: '100%',
                    maxHeight: '100%',
                    objectFit: 'contain'
                  }}
                />
              );
            }
            if (slide.type === 'video') {
              return (
                <iframe
                  src={slide.src}
                  width="80%"
                  height="80%"
                  allow="autoplay; fullscreen"
                  allowFullScreen
                  style={{ background: 'black', border: 0 }}
                />
              );
            }
            return null;
          }
        }}
      />
    </div>
  );
}