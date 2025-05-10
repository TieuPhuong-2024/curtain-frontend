'use client';

import {useEffect, useState, useCallback, useRef} from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {FaArrowLeft, FaArrowRight} from 'react-icons/fa';

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
                <div className="absolute inset-0 z-0">
                    <Image
                        src="/images/hero-curtain.jpg"
                        alt="Rèm cửa cao cấp"
                        fill
                        style={{objectFit: 'cover'}}
                        priority
                        className="scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/10"></div>
                </div>

                <div className="container-custom z-10 text-white">
                    <div className="max-w-2xl p-4 sm:p-6 md:p-8 rounded-lg backdrop-blur-sm bg-black/5 slide-up">
                        <h1 className="text-gradient text-3xl sm:text-4xl md:text-5xl font-bold mb-4 md:mb-6">Rèm Cửa Cao Cấp Cho Không Gian Của Bạn</h1>
                        <p className="text-base sm:text-lg md:text-xl mb-6 md:mb-8 opacity-90">
                            Khám phá bộ sưu tập rèm cửa đa dạng với chất lượng tốt nhất và giá cả hợp lý
                        </p>
                        <Link href="/products" className="btn-primary inline-flex items-center">
                            Xem sản phẩm <FaArrowRight className="ml-2"/>
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

            <div className="container-custom z-10 text-white">
                <div className={`max-w-xs sm:max-w-sm md:max-w-xl lg:max-w-2xl p-3 sm:p-4 md:p-6 lg:p-8 rounded-lg backdrop-blur-sm bg-black/5 transition-all duration-700 ${
                    transitioning ? 'opacity-0 transform translate-y-10' : 'opacity-100 transform translate-y-0'
                } ml-12 xs:ml-14 sm:ml-16 md:ml-16 lg:ml-20 xl:ml-0`}>
                    <h1 className="text-gradient text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold mb-2 sm:mb-3 md:mb-4 lg:mb-6">{currentBanner.title}</h1>
                    {currentBanner.description && (
                        <p className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl mb-3 sm:mb-4 md:mb-6 lg:mb-8 opacity-90">{currentBanner.description}</p>
                    )}
                    {currentBanner.link && (
                        <Link href={currentBanner.link} className="btn-primary inline-flex items-center text-xs sm:text-sm md:text-base">
                            Xem thêm <FaArrowRight className="ml-2 text-xs sm:text-sm md:text-base" />
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
