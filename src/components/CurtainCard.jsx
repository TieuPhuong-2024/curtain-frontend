'use client'

import Image from 'next/image';
import Link from 'next/link';
import { FaEye } from 'react-icons/fa';
import { useState, useEffect } from 'react';
import ProductPrice from './ProductPrice';
import styles from '@/styles/modules/CurtainCard.module.css';

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
            className={styles.card}
            onMouseEnter={() => !isTouchDevice && setIsHovered(true)}
            onMouseLeave={() => !isTouchDevice && setIsHovered(false)}
            onClick={handleCardClick}
        >
            <div className={styles.imageContainer}>
                <Image
                    src={displayImage}
                    alt={name}
                    fill
                    sizes="(max-width: 576px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    style={{
                        objectFit: 'cover',
                        transition: 'transform 0.5s ease'
                    }}
                    className={`${styles.image} ${isHovered ? styles.imageHovered : styles.imageNormal}`}
                />
                {/* Category badge */}
                <div className={styles.categoryBadge}>
                    {categoryName}
                </div>
                {/* Overlay with actions - shown on hover (desktop) or tap (mobile) */}
                <div
                    className={`${styles.overlay} ${showActions ? styles.overlayVisible : styles.overlayHidden}`}
                    onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside overlay
                >
                    <Link
                        href={`/products/${_id}`}
                        className={styles.actionButton}
                        title="Xem chi tiết"
                    >
                        <FaEye size={16} className={styles.actionIcon} />
                        <span className={styles.actionText}>Chi tiết</span>
                    </Link>
                </div>
            </div>
            <div className={styles.cardContent}>
                <h3 className={styles.cardTitle}>
                    {name}
                </h3>
                <div className={styles.cardFooter}>
                    <p className="font-bold text-sm sm:text-base text-primary">
                        <ProductPrice price={price} />
                    </p>
                    <div className={styles.colorIndicator}>
                        <div
                            className={styles.colorSwatch}
                            style={{ backgroundColor: displayBackgroundColor }}
                            title={displayColorName}
                        />
                        <span className={styles.colorName}>
                            {displayColorName}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
