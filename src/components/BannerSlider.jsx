'use client';

import {useEffect, useState, useCallback, useRef} from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {FaArrowLeft, FaArrowRight} from 'react-icons/fa';
import styles from '@/styles/modules/BannerSlider.module.css';

export default function BannerSlider({banners}) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [transitioning, setTransitioning] = useState(false);
    const timerRef = useRef(null);
    const slideDuration = 6000; // Duration in ms for each slide

    // Callback for changing slides with animation
    const changeSlide = useCallback((newIndex) => {
        if (transitioning || newIndex === currentIndex) return;
        
        setTransitioning(true);
        setCurrentIndex(newIndex);
        
        // Reset transition state after animation completes
        setTimeout(() => {
            setTransitioning(false);
        }, 700); // Slightly longer than the CSS transition
    }, [currentIndex, transitioning]);

    // Auto-slide functionality
    useEffect(() => {
        if (!banners || banners.length <= 1) return;

        const startTimer = () => {
            timerRef.current = setTimeout(() => {
                const nextIndex = (currentIndex + 1) % banners.length;
                changeSlide(nextIndex);
            }, slideDuration);
        };

        startTimer();

        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, [banners, currentIndex, changeSlide]);

    // Handle manual navigation
    const goToPrevious = useCallback(() => {
        if (!banners || banners.length <= 1) return;
        const newIndex = currentIndex === 0 ? banners.length - 1 : currentIndex - 1;
        changeSlide(newIndex);
    }, [banners, currentIndex, changeSlide]);

    const goToNext = useCallback(() => {
        if (!banners || banners.length <= 1) return;
        const newIndex = (currentIndex + 1) % banners.length;
        changeSlide(newIndex);
    }, [banners, currentIndex, changeSlide]);

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'ArrowLeft') {
                goToPrevious();
            } else if (e.key === 'ArrowRight') {
                goToNext();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [goToNext, goToPrevious]);

    // If no banners, show a fallback
    if (!banners || banners.length === 0) {
        return (
            <div className="relative h-[50vh] sm:h-[60vh] md:h-[70vh] lg:h-[80vh] flex items-center overflow-hidden max-h-[800px]">
                <div className="absolute inset-0 z-0 bg-[#c9bfb4]" aria-hidden="true" />

                <div className="container-custom z-10">
                    <div className={styles.slideContent}>
                        <h1 className={styles.slideTitle}>Rèm cửa cho không gian của bạn</h1>
                        <p className={styles.slideDescription}>
                            Xem mẫu vải, chọn màu, rồi hẹn đo và lắp tại nhà.
                        </p>
                        <Link href="/products" className={styles.slideButton}>
                            Xem sản phẩm <FaArrowRight className={styles.slideButtonIcon}/>
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    const currentBanner = banners[currentIndex];

    return (
        <div className="relative h-[50vh] sm:h-[60vh] md:h-[70vh] lg:h-[80vh] flex items-center overflow-hidden max-h-[800px]">
            {/* Banner images with transition effect */}
            {banners.map((banner, index) => (
                <div 
                    key={banner._id || index}
                    className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                        index === currentIndex ? 'opacity-100 z-0' : 'opacity-0 -z-10'
                    }`}
                >
                    <Image
                        src={banner.image || "/images/hero-curtain.jpg"}
                        alt={banner.title || "Banner"}
                        fill
                        style={{
                            objectFit: 'cover', 
                            transform: index === currentIndex ? 'scale(1.05)' : 'scale(1)',
                            transition: 'transform 10s ease'
                        }}
                        priority={index === currentIndex}
                        className="w-full h-full"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/10"></div>
                </div>
            ))}

            <div className="container-custom z-10">
                <div className={`${styles.slideContent} ${transitioning ? styles.slideContentHidden : ''}`}>
                    <h1 className={styles.slideTitle}>{currentBanner.title}</h1>
                    {currentBanner.description && (
                        <p className={styles.slideDescription}>{currentBanner.description}</p>
                    )}
                    {currentBanner.link && (
                        <Link href={currentBanner.link} className={styles.slideButton}>
                            Xem thêm <FaArrowRight className={styles.slideButtonIcon} />
                        </Link>
                    )}
                </div>
            </div>

            {/* Navigation arrows - hide on very small screens */}
            {banners.length > 1 && (
                <>
                    <button
                        onClick={goToPrevious}
                        className="sm:flex cursor-pointer absolute left-2 xs:left-3 sm:left-4 md:left-5 lg:left-8 xl:left-6 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-primary text-white p-2 sm:p-3 md:p-4 rounded-full z-20 transition-all hover:scale-110 backdrop-blur-sm"
                        aria-label="Previous banner"
                        disabled={transitioning}
                    >
                        <FaArrowLeft size={16} className="sm:text-base md:text-lg" />
                    </button>
                    <button
                        onClick={goToNext}
                        className="sm:flex cursor-pointer absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-primary text-white p-2 sm:p-3 md:p-4 rounded-full z-20 transition-all hover:scale-110 backdrop-blur-sm"
                        aria-label="Next banner"
                        disabled={transitioning}
                    >
                        <FaArrowRight size={16} className="sm:text-base md:text-lg" />
                    </button>
                </>
            )}

            {/* Progress bar */}
            {banners.length > 1 && (
                <div className="absolute bottom-12 left-0 right-0 z-20 container-custom">
                    <div className="flex space-x-3">
                        {banners.map((_, index) => (
                            <div 
                                key={index} 
                                className="flex-1 h-1.5 bg-white/30 overflow-hidden rounded-full"
                            >
                                <div 
                                    className={`h-full rounded-full bg-white ${
                                        index === currentIndex 
                                            ? 'animate-progress w-full origin-left' 
                                            : 'w-0'
                                    }`}
                                    style={{
                                        animationDuration: `${slideDuration}ms`,
                                        animationPlayState: transitioning ? 'paused' : 'running'
                                    }}
                                ></div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
