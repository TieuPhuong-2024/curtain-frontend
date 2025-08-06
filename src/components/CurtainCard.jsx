'use client'

import Image from 'next/image';
import Link from 'next/link';
import { FaEye } from 'react-icons/fa';
import { useState, useEffect } from 'react';
import ProductPrice from './ProductPrice';

export default function CurtainCard({ curtain }) {
    const { _id, name, price, mainImage, image, category, color } = curtain;
    const [isHovered, setIsHovered] = useState(false);
    const [isTouchDevice, setIsTouchDevice] = useState(false);
    const [isActive, setIsActive] = useState(false);

    // Sử dụng mainImage hoặc fallback vào image cho tương thích ngược
    const displayImage = mainImage || image || '/images/curtain-placeholder.jpg';
    // Xử lý trường hợp category có thể là object hoặc string
    const categoryName = typeof category === 'object' ? category?.name : category;
    // Use hexCode for background color, with a fallback. Name for display.
    const displayBackgroundColor = color?.hexCode || (typeof color === 'string' ? color : 'transparent');
    const displayColorName = color?.name || (typeof color === 'string' ? color : 'N/A');

    // Check if device is touch-enabled for better mobile experience
    const checkTouch = () => {
        const touchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        setIsTouchDevice(touchDevice);
        // Reset isActive when device type changes to avoid buttons staying visible
        if (!touchDevice) {
            setIsActive(false);
        }
    };

    useEffect(() => {
        fetchFavoriteStatus();
        fetchFavoriteCount();

        checkTouch();
        window.addEventListener('touchstart', () => setIsTouchDevice(true), { once: true });

        // Listen for resize events which might indicate device/orientation changes
        window.addEventListener('resize', checkTouch);

        return () => {
            window.removeEventListener('touchstart', () => setIsTouchDevice(true));
            window.removeEventListener('resize', checkTouch);
        };
    }, [_id]);

    // Touch devices need click/tap to show actions, desktop uses hover
    const showActions = isTouchDevice ? isActive : isHovered;

    const handleCardClick = () => {
        if (isTouchDevice) {
            setIsActive(!isActive);
        }
    };

    return (
        <div
            className="bg-white rounded-lg overflow-hidden shadow-md card-hover"
            onMouseEnter={() => !isTouchDevice && setIsHovered(true)}
            onMouseLeave={() => !isTouchDevice && setIsHovered(false)}
            onClick={handleCardClick}
        >
            <div className="relative h-48 sm:h-56 md:h-64 w-full group">
                <Image
                    src={displayImage}
                    alt={name}
                    fill
                    sizes="(max-width: 576px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    style={{
                        objectFit: 'cover',
                        transition: 'transform 0.5s ease'
                    }}
                    className={`${isHovered ? 'scale-110' : 'scale-100'}`}
                />
                {/* Category badge */}
                <div className="absolute top-2 left-2">
                    <span className="bg-white bg-opacity-90 text-primary text-xs px-2 py-1 rounded-md">
                        {categoryName}
                    </span>
                </div>
                {/* Overlay with actions - shown on hover (desktop) or tap (mobile) */}
                <div
                    className={`absolute inset-0 bg-transparent bg-opacity-20 flex items-center justify-center gap-3 transition-opacity duration-300 ${showActions ? 'opacity-100' : 'opacity-0 pointer-events-none'
                        }`}
                    onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside overlay
                >
                    <Link
                        href={`/products/${_id}`}
                        className="bg-white text-gray-700 p-2 sm:px-3 sm:py-2 rounded-md flex items-center gap-1 sm:gap-2 hover:bg-indigo-100 transition-colors duration-300"
                        title="Xem chi tiết"
                    >
                        <FaEye size={16} className="sm:text-lg" />
                        <span className="text-xs sm:text-sm hidden sm:inline">Chi tiết</span>
                    </Link>
                </div>
            </div>
            <div className="p-3 sm:p-4">
                <h3 className="font-medium text-sm sm:text-base text-gray-900 mb-1 truncate">
                    {name}
                </h3>
                <div className="flex justify-between items-center">
                    <p className="font-bold text-sm sm:text-base text-primary">
                        <ProductPrice price={price} />
                    </p>
                    <div className="flex items-center gap-1 sm:gap-2">
                        <div
                            className="w-3 h-3 sm:w-4 sm:h-4 rounded-full border border-gray-300"
                            style={{ backgroundColor: displayBackgroundColor }}
                            title={displayColorName}
                        />
                        <span className="text-xs text-gray-600 truncate max-w-[50px] sm:max-w-[100px]">
                            {displayColorName}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
