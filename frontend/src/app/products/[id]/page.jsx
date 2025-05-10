'use client';

import '../../styles/cozy-theme.css';
import { use, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getCurtainById, getImagesByCurtainId } from '@/lib/api';
import { FaArrowLeft, FaPalette, FaRuler, FaShoppingCart, FaTag, FaImages } from 'react-icons/fa';
import { toast } from 'react-toastify';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';

export default function ProductDetailPage({ params }) {
    const { id } = use(params);

    const [curtain, setCurtain] = useState(null);
    const [images, setImages] = useState([]);
    const [selectedImage, setSelectedImage] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [selectedColor, setSelectedColor] = useState(null);
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [lightboxIndex, setLightboxIndex] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                // Fetch product data only
                const productData = await getCurtainById(id);

                setCurtain(productData);
                setSelectedColor(productData.color); // Set selected color directly from productData

                // Set the main image as selected by default
                setSelectedImage(productData.mainImage);

                // Fetch additional images if available
                if (productData.images && productData.images.length > 0) {
                    setImages(productData.images);
                } else {
                    // If images not included in the response, fetch separately
                    try {
                        const imagesData = await getImagesByCurtainId(id);
                        setImages(imagesData);
                    } catch (imgErr) {
                        console.error('Error fetching images:', imgErr);
                    }
                }
            } catch (err) {
                setError('Không thể tải thông tin sản phẩm. Vui lòng thử lại sau.');
                console.error('Error fetching product data:', err); // Log error
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    const handleAddToCart = () => {
        toast.success(`Đã thêm ${quantity} sản phẩm vào giỏ hàng`);
        // Implement cart functionality
    };

    // Chọn một hình ảnh
    const handleSelectImage = (imageUrl) => {
        setSelectedImage(imageUrl);
    };

    // Prepare slides for lightbox
    const prepareSlides = () => {
        const slides = [];
        
        // Add main image first if available
        if (curtain?.mainImage) {
            slides.push({ 
                type: 'image',
                src: curtain.mainImage 
            });
        }
        
        // Add other images
        if (images && images.length > 0) {
            images.forEach(image => {
                if (image.url !== curtain?.mainImage) {
                    slides.push({
                        type: 'image',
                        src: image.url
                    });
                }
            });
        }
        
        return slides;
    };

    const handleOpenLightbox = (index = 0) => {
        setLightboxIndex(index);
        setLightboxOpen(true);
        document.body.style.overflow = 'hidden';
    };
    
    const handleCloseLightbox = () => {
        setLightboxOpen(false);
        document.body.style.overflow = 'auto';
    };

    if (loading) {
        return (
            <div className="cozy-bg min-h-screen py-8">
                <div className="container mx-auto px-4 py-8 flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#a67c52]"></div>
                </div>
            </div>
        );
    }

    if (error || !curtain) {
        return (
            <div className="cozy-bg min-h-screen py-8">
                <div className="container mx-auto px-4">
                    <div className="cozy-card overflow-hidden">
                        <div className="bg-red-100 text-red-700 p-4 rounded-md">
                            {error || 'Không tìm thấy sản phẩm'}
                        </div>
                        <div className="mt-4">
                            <Link href="/products" className="cozy-link font-medium flex items-center">
                                <FaArrowLeft className="mr-2" /> Quay lại danh sách sản phẩm
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const { name, description, price, category, material, size, mainImage, inStock } = curtain;
    const displayImage = selectedImage || mainImage || (images.length > 0 ? images[0].url : '/images/curtain-placeholder.jpg');
    const slides = prepareSlides();

    // Find index of currently selected image for lightbox
    const getCurrentImageIndex = () => {
        if (!displayImage) return 0;
        
        return slides.findIndex(slide => slide.src === displayImage) || 0;
    };

    return (
        <div className="cozy-bg min-h-screen py-8">
            <div className="container mx-auto px-4">
                <div className="mb-4">
                    <Link href="/products" className="cozy-link font-medium flex items-center">
                        <FaArrowLeft className="mr-2" /> Quay lại danh sách sản phẩm
                    </Link>
                </div>
                <div className="cozy-card overflow-hidden">
                    <div className="md:flex">
                        {/* Product Image Gallery */}
                        <div className="md:w-1/2">
                            <div className="flex flex-col">
                                {/* Main displayed image */}
                                <div className="relative h-96 md:h-[500px] overflow-hidden group cursor-pointer"
                                     onClick={() => handleOpenLightbox(getCurrentImageIndex())}>
                                    <Image
                                        src={displayImage}
                                        alt={name}
                                        fill
                                        style={{ objectFit: 'cover' }}
                                        className="cozy-img w-full h-full rounded-lg transition-transform duration-500 hover:scale-105"
                                        priority
                                    />
                                    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                                        <FaImages className="text-white text-4xl" />
                                    </div>
                                </div>

                                {/* Thumbnails for additional images */}
                                {images.length > 1 && (
                                    <div className="flex space-x-2 mt-4 overflow-x-auto py-2">
                                        {/* Main image thumbnail */}
                                        <div
                                            className={`relative w-20 h-20 min-w-[5rem] cursor-pointer rounded-md overflow-hidden border-2 ${selectedImage === mainImage ? 'border-[#a67c52]' : 'border-transparent'
                                                }`}
                                            onClick={() => handleSelectImage(mainImage)}
                                        >
                                            <Image
                                                src={mainImage}
                                                alt={`${name} - Main`}
                                                fill
                                                style={{ objectFit: 'cover' }}
                                            />
                                        </div>

                                        {/* Other image thumbnails */}
                                        {images
                                            .filter(img => img.url !== mainImage)
                                            .map((image, index) => (
                                                <div
                                                    key={index}
                                                    className={`relative w-20 h-20 min-w-[5rem] cursor-pointer rounded-md overflow-hidden border-2 ${selectedImage === image.url ? 'border-[#a67c52]' : 'border-transparent'
                                                        }`}
                                                    onClick={() => handleSelectImage(image.url)}
                                                >
                                                    <Image
                                                        src={image.url}
                                                        alt={`${name} - ${index + 1}`}
                                                        fill
                                                        style={{ objectFit: 'cover' }}
                                                    />
                                                </div>
                                            ))
                                        }
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Product Info */}
                        <div className="md:w-1/2 p-6">
                            <div className="flex justify-between items-start">
                                <h1 className="cozy-title mb-2">{name}</h1>
                                <span className="bg-yellow-100 text-yellow-800 text-sm px-3 py-1 rounded-full">
                                    {typeof category === 'object' ? category.name : category}
                                </span>
                            </div>
                            <div className="text-2xl font-bold text-[#a67c52] mb-4">
                                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)}
                            </div>
                            <div className="mb-6">
                                <p className="text-[#5b4636] mb-4">{description}</p>
                                <div className="space-y-3">
                                    <div className="flex items-center">
                                        <FaPalette className="text-[#a67c52] mr-2" />
                                        <div className="font-semibold">Màu sắc:</div>
                                        <div className="flex items-center ml-2">
                                            {selectedColor ? (
                                                <button
                                                    className="w-8 h-8 rounded-full border-2 transition-all duration-200 ease-in-out
                                                        border-indigo-500"
                                                    style={{ backgroundColor: selectedColor.hexCode || 'transparent' }}
                                                    title={selectedColor.name}
                                                >
                                                    <span className="sr-only">Selected</span>
                                                </button>
                                            ) : (
                                                <div className="w-8 h-8 rounded-full border-2 border-gray-300"></div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex items-center">
                                        <FaTag className="text-[#a67c52] mr-2" />
                                        <span className="text-[#5b4636]">Chất liệu: </span>
                                        <span className="ml-2">{material}</span>
                                    </div>
                                    <div className="flex items-center">
                                        <FaRuler className="text-[#a67c52] mr-2" />
                                        <span className="text-[#5b4636]">Kích thước: </span>
                                        <span className="ml-2">{size.width}cm x {size.height}cm</span>
                                    </div>
                                </div>
                            </div>
                            {inStock ? (
                                <div className="mb-4">
                                    <span className="text-green-700 flex items-center">
                                        <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd"
                                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                                clipRule="evenodd" />
                                        </svg>
                                        Còn hàng
                                    </span>
                                </div>
                            ) : (
                                <div className="mb-4">
                                    <span className="text-red-600 flex items-center">
                                        <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd"
                                                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                                clipRule="evenodd" />
                                        </svg>
                                        Hết hàng
                                    </span>
                                </div>
                            )}
                            {inStock && (
                                <div className="flex items-center space-x-4 mb-6">
                                    <div className="flex items-center border rounded-md">
                                        <button
                                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                            className="cozy-btn px-3 py-1 border-r"
                                        >
                                            -
                                        </button>
                                        <span className="px-4 py-1">{quantity}</span>
                                        <button
                                            onClick={() => setQuantity(quantity + 1)}
                                            className="cozy-btn px-3 py-1 border-l"
                                        >
                                            +
                                        </button>
                                    </div>
                                    <button
                                        onClick={handleAddToCart}
                                        className="cozy-btn flex items-center"
                                    >
                                        <FaShoppingCart className="mr-2" /> Thêm vào giỏ hàng
                                    </button>
                                </div>
                            )}
                            <div className="cozy-divider pt-4">
                                <h3 className="text-lg font-semibold mb-2">Dịch vụ của chúng tôi:</h3>
                                <ul className="space-y-1 text-[#5b4636]">
                                    <li>✓ Tư vấn, đo đạc tận nhà miễn phí</li>
                                    <li>✓ Giao hàng tận nơi</li>
                                    <li>✓ Lắp đặt chuyên nghiệp</li>
                                    <li>✓ Bảo hành 12 tháng</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Lightbox for full-size image viewing */}
            <Lightbox
                open={lightboxOpen}
                close={handleCloseLightbox}
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
                                        margin: 'auto'
                                    }}
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