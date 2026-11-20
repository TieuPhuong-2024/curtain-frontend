'use client';

import '../../styles/cozy-theme.css';
import { use, useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getCurtainById, getImagesByCurtainId } from '@/lib/api';
import { useSettings } from '@/lib/SettingsContext';
import { FaCheck, FaImages, FaPhoneAlt } from 'react-icons/fa';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';
import StructuredData, { createBreadcrumbSchema, createProductSchema } from '@/components/StructureData';
import { ROUTES_PATH } from '@/utils/constant';
import { getSiteUrl } from '@/utils/seo';
import { phoneDigits } from '@/utils/siteSettings';
import ProductPrice from '@/components/ProductPrice';
import styles from '@/styles/modules/ProductDetail.module.css';

const SERVICES = [
    'Tư vấn, đo đạc tận nhà miễn phí',
    'Giao hàng tận nơi',
    'Lắp đặt chuyên nghiệp',
    'Bảo hành 12 tháng',
];

export default function ProductDetailPage({ params }) {
    const { id } = use(params);
    const { getValue } = useSettings();
    const hotline = getValue('global.hotline');
    const hotlineDigits = phoneDigits(hotline);
    const phoneHref = hotlineDigits ? `tel:+84${hotlineDigits.replace(/^0/, '')}` : '';
    const zaloUrl = getValue('global.zaloUrl');

    const [curtain, setCurtain] = useState(null);
    const [images, setImages] = useState([]);
    const [selectedImage, setSelectedImage] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [reloadKey, setReloadKey] = useState(0);
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [lightboxIndex, setLightboxIndex] = useState(0);
    const [imageSrc, setImageSrc] = useState(null);

    useEffect(() => {
        let ignore = false;

        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);
                const productData = await getCurtainById(id);
                if (ignore) return;

                setCurtain(productData);
                setSelectedImage(productData.mainImage || null);

                if (productData.images && productData.images.length > 0) {
                    setImages(productData.images);
                } else {
                    try {
                        const imagesData = await getImagesByCurtainId(id);
                        if (!ignore) setImages(imagesData || []);
                    } catch (imgErr) {
                        console.error('Error fetching images:', imgErr);
                    }
                }
            } catch (err) {
                if (ignore) return;
                console.error('Error fetching product data:', err);
                setError('Không thể tải thông tin sản phẩm. Vui lòng thử lại sau.');
            } finally {
                if (!ignore) setLoading(false);
            }
        };

        fetchData();
        return () => {
            ignore = true;
        };
    }, [id, reloadKey]);

    useEffect(() => () => {
        document.body.style.overflow = '';
    }, []);

    const categoryName = typeof curtain?.category === 'object' ? curtain?.category?.name : curtain?.category;
    const categoryKey = (categoryName || '').toLowerCase();
    const fallbackImage =
        categoryKey.includes('sheer') || categoryKey.includes('voan')
            ? '/images/living-room-curtains.jpg'
            : categoryKey.includes('blackout') || categoryKey.includes('chống nắng')
                ? '/images/blackout-curtains.jpg'
                : '/images/curtain-placeholder.jpg';

    const galleryImages = useMemo(() => {
        const list = [];
        if (curtain?.mainImage) list.push(curtain.mainImage);
        (images || []).forEach(img => {
            if (img?.url && !list.includes(img.url)) list.push(img.url);
        });
        return list;
    }, [curtain, images]);

    const displayImage = selectedImage || galleryImages[0] || fallbackImage;

    useEffect(() => {
        setImageSrc(displayImage);
    }, [displayImage]);

    const slides = useMemo(
        () => (galleryImages.length > 0 ? galleryImages : [fallbackImage]).map(src => ({ type: 'image', src })),
        [galleryImages, fallbackImage]
    );

    const openLightbox = () => {
        const index = galleryImages.indexOf(displayImage);
        setLightboxIndex(index > -1 ? index : 0);
        setLightboxOpen(true);
        document.body.style.overflow = 'hidden';
    };

    const closeLightbox = () => {
        setLightboxOpen(false);
        document.body.style.overflow = '';
    };

    if (loading) {
        return (
            <div className={styles.page}>
                <div className={styles.container}>
                    <div className={styles.skeletonBreadcrumb} aria-hidden="true" />
                    <div className={styles.grid} aria-hidden="true">
                        <div>
                            <span className={styles.skeletonImage} />
                            <div className={styles.skeletonThumbs}>
                                <span />
                                <span />
                                <span />
                            </div>
                        </div>
                        <div>
                            <span className={`${styles.skeletonLine} ${styles.skeletonKicker}`} />
                            <span className={`${styles.skeletonLine} ${styles.skeletonTitle}`} />
                            <span className={`${styles.skeletonLine} ${styles.skeletonPrice}`} />
                            <span className={styles.skeletonLine} />
                            <span className={styles.skeletonLine} />
                            <span className={`${styles.skeletonLine} ${styles.skeletonShort}`} />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !curtain) {
        return (
            <div className={styles.page}>
                <div className={styles.container}>
                    <div className={styles.statePanel}>
                        <h1 className={styles.stateTitle}>Không tìm thấy sản phẩm</h1>
                        <p className={styles.stateText}>
                            {error || 'Sản phẩm có thể đã được gỡ hoặc đường dẫn không đúng.'}
                        </p>
                        <div className={styles.stateActions}>
                            {error && (
                                <button
                                    type="button"
                                    className={styles.stateButton}
                                    onClick={() => setReloadKey(key => key + 1)}
                                >
                                    Thử lại
                                </button>
                            )}
                            <Link href="/products" className={styles.stateButtonGhost}>
                                Quay lại danh sách sản phẩm
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const { name, description, price, material, size, inStock, color } = curtain;

    return (
        <div className={styles.page}>
            <StructuredData
                data={createBreadcrumbSchema([
                    { name: 'Trang chủ', url: `${process.env.NEXT_PUBLIC_URL}` },
                    { name: 'Sản phẩm', url: `${process.env.NEXT_PUBLIC_URL}/${ROUTES_PATH.PRODUCTS}` },
                    { name, url: `${process.env.NEXT_PUBLIC_URL}/${ROUTES_PATH.PRODUCTS}/${curtain._id}` },
                ])} />
            <StructuredData
                data={createProductSchema({
                    name,
                    description,
                    images: galleryImages,
                    price,
                    inStock,
                    material,
                    url: `${getSiteUrl()}/${ROUTES_PATH.PRODUCTS}/${curtain._id}`,
                })} />

            <div className={styles.container}>
                <nav className={styles.breadcrumb} aria-label="Breadcrumb">
                    <Link href="/">Trang chủ</Link>
                    <span className={styles.breadcrumbSep} aria-hidden="true">/</span>
                    <Link href="/products">Sản phẩm</Link>
                    {categoryName && (
                        <>
                            <span className={styles.breadcrumbSep} aria-hidden="true">/</span>
                            <Link href={`/products?category=${encodeURIComponent(categoryName)}`}>
                                {categoryName}
                            </Link>
                        </>
                    )}
                    <span className={styles.breadcrumbSep} aria-hidden="true">/</span>
                    <span className={styles.breadcrumbCurrent} aria-current="page">{name}</span>
                </nav>

                <div className={styles.grid}>
                    <section className={styles.gallery} aria-label="Hình ảnh sản phẩm">
                        <button
                            type="button"
                            className={styles.mainImage}
                            onClick={openLightbox}
                            aria-label={`Xem ảnh lớn: ${name}`}
                        >
                            <Image
                                src={imageSrc || fallbackImage}
                                alt={name}
                                fill
                                priority
                                sizes="(max-width: 1024px) 100vw, 56vw"
                                className={styles.mainImageEl}
                                onError={() => {
                                    if (imageSrc !== fallbackImage) setImageSrc(fallbackImage);
                                }}
                            />
                            <span className={styles.zoomHint} aria-hidden="true">
                                <FaImages /> Xem ảnh
                            </span>
                        </button>

                        {galleryImages.length > 1 && (
                            <div className={styles.thumbs}>
                                {galleryImages.map((src, index) => (
                                    <button
                                        key={src}
                                        type="button"
                                        className={`${styles.thumb} ${displayImage === src ? styles.thumbActive : ''}`}
                                        onClick={() => setSelectedImage(src)}
                                        aria-label={`Xem ảnh ${index + 1}`}
                                        aria-pressed={displayImage === src}
                                    >
                                        <Image src={src} alt="" fill sizes="96px" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </section>

                    <aside className={styles.info}>
                        {categoryName && <p className={styles.kicker}>{categoryName}</p>}
                        <h1 className={styles.title}>{name}</h1>
                        <p className={styles.price}>
                            <ProductPrice price={price} />
                        </p>
                        <p className={`${styles.stock} ${inStock ? '' : styles.stockOut}`}>
                            <span className={styles.stockDot} aria-hidden="true" />
                            {inStock ? 'Còn hàng · Sẵn sàng tư vấn' : 'Hết hàng · Liên hệ đặt trước'}
                        </p>

                        {description && <p className={styles.description}>{description}</p>}

                        <dl className={styles.specs}>
                            {color?.name && (
                                <div className={styles.specRow}>
                                    <dt>Màu sắc</dt>
                                    <dd>
                                        <span
                                            className={styles.swatch}
                                            style={{ backgroundColor: color.hexCode || '#c9bda9' }}
                                            aria-hidden="true"
                                        />
                                        {color.name}
                                    </dd>
                                </div>
                            )}
                            {material && (
                                <div className={styles.specRow}>
                                    <dt>Chất liệu</dt>
                                    <dd>{material}</dd>
                                </div>
                            )}
                            {size && (
                                <div className={styles.specRow}>
                                    <dt>Kích thước</dt>
                                    <dd>{size}</dd>
                                </div>
                            )}
                        </dl>

                        <div className={styles.actions}>
                            <Link
                                href={`/contact?product=${encodeURIComponent(name)}#contact-form`}
                                className={styles.primaryAction}
                            >
                                Đặt lịch tư vấn
                            </Link>
                            {phoneHref && (
                                <a href={phoneHref} className={styles.secondaryAction}>
                                    <FaPhoneAlt aria-hidden="true" /> {hotline}
                                </a>
                            )}
                        </div>

                        <ul className={styles.services}>
                            {SERVICES.map(service => (
                                <li key={service}>
                                    <FaCheck className={styles.serviceIcon} aria-hidden="true" />
                                    <span>{service}</span>
                                </li>
                            ))}
                        </ul>
                    </aside>
                </div>
            </div>

            <section className={styles.ctaSection} aria-label="Tư vấn miễn phí">
                <div className={styles.ctaInner}>
                    <p className={styles.ctaKicker}>Tư vấn miễn phí</p>
                    <h2 className={styles.ctaTitle}>Xem vải thật, đo đúng từng ô cửa</h2>
                    <p className={styles.ctaText}>
                        Đặt lịch hẹn đo và xem mẫu vải tại nhà — miễn phí tại Bình Dương &amp; TP.HCM.
                    </p>
                    <div className={styles.ctaActions}>
                        {phoneHref && (
                            <a href={phoneHref} className={styles.ctaPrimary}>
                                <FaPhoneAlt aria-hidden="true" /> {hotline}
                            </a>
                        )}
                        {zaloUrl && (
                            <a
                                href={zaloUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles.ctaGhost}
                            >
                                Nhắn Zalo
                            </a>
                        )}
                    </div>
                </div>
            </section>

            <Lightbox
                open={lightboxOpen}
                close={closeLightbox}
                slides={slides}
                index={lightboxIndex}
                render={{
                    slide: ({ slide }) => {
                        if (slide.type === 'image') {
                            return (
                                <img
                                    src={slide.src}
                                    alt={name}
                                    style={{
                                        maxWidth: '100%',
                                        maxHeight: '100%',
                                        objectFit: 'contain',
                                        display: 'block',
                                        margin: 'auto',
                                    }}
                                />
                            );
                        }
                        return null;
                    },
                }}
            />
        </div>
    );
}
