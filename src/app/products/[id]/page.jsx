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
import StructuredData, { createBreadcrumbSchema, createProductSchema } from '@/components/StructureData';
import { ROUTES_PATH } from '@/utils/constant';

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
  const handleSelectImage = imageUrl => {
    setSelectedImage(imageUrl);
  };

  // Prepare slides for lightbox
  const prepareSlides = () => {
    const slides = [];

    // Add main image first if available
    if (curtain?.mainImage) {
      slides.push({
        type: 'image',
        src: curtain.mainImage,
      });
    }

    // Add other images
    if (images && images.length > 0) {
      images.forEach(image => {
        if (image.url !== curtain?.mainImage) {
          slides.push({
            type: 'image',
            src: image.url,
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
  const displayImage =
    selectedImage ||
    mainImage ||
    (images.length > 0 ? images[0].url : '/images/curtain-placeholder.jpg');
  const slides = prepareSlides();

  // Find index of currently selected image for lightbox
  const getCurrentImageIndex = () => {
    if (!displayImage) return 0;

    return slides.findIndex(slide => slide.src === displayImage) || 0;
  };

  return (
    <div className="cozy-bg min-h-screen py-8">

      {/* StructureData for SEO */}
      {curtain && (
        <>
          <StructuredData
            data={createBreadcrumbSchema([
              { name: 'Trang chủ', url: `${process.env.NEXT_PUBLIC_URL}` },
              { name: 'Sản phẩm', url: `${process.env.NEXT_PUBLIC_URL}/${ROUTES_PATH.PRODUCTS}` },
              { name: name, url: `${process.env.NEXT_PUBLIC_URL}/${ROUTES_PATH.PRODUCTS}/${curtain._id}` }
            ])} />
          <StructuredData
            data={createProductSchema({
              name,
              description,
              images: [curtain.mainImage, ...(images.map(img => img.url) || [])],
              price,
              inStock,
              url: `${process.env.NEXT_PUBLIC_URL}/${ROUTES_PATH.PRODUCTS}/${curtain._id}`,
            })} />

        </>
      )}
      <div className="container mx-auto px-4">
        <div className="mb-4">
          <Link href="/products" className="cozy-link font-medium flex items-center">
            <FaArrowLeft className="mr-2" /> Quay lại danh sách sản phẩm
          </Link>
        </div>
        <div className="cozy-card overflow-hidden">
          <div className="flex flex-col lg:flex-row">
            {/* Product Image Gallery */}
            <div className="w-full lg:w-1/2 p-2 sm:p-4">
              <div className="flex flex-col">
                {/* Main displayed image */}
                <div
                  className="relative h-80 sm:h-96 md:h-[450px] overflow-hidden group cursor-pointer rounded-lg shadow-md"
                  onClick={() => handleOpenLightbox(getCurrentImageIndex())}
                >
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
                  <div className="flex flex-wrap gap-2 mt-4 py-2 justify-center sm:justify-start">
                    {/* Main image thumbnail */}
                    <div
                      className={`relative w-16 h-16 sm:w-20 sm:h-20 min-w-[4rem] sm:min-w-[5rem] cursor-pointer rounded-md overflow-hidden border-2 shadow-sm ${selectedImage === mainImage ? 'border-[#a67c52]' : 'border-transparent'
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
                          className={`relative w-16 h-16 sm:w-20 sm:h-20 min-w-[4rem] sm:min-w-[5rem] cursor-pointer rounded-md overflow-hidden border-2 shadow-sm ${selectedImage === image.url ? 'border-[#a67c52]' : 'border-transparent'
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
                      ))}
                  </div>
                )}
              </div>
            </div>

            {/* Product Info */}
            <div className="w-full lg:w-1/2 p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
                <h1 className="cozy-title mb-2 text-xl sm:text-2xl md:text-3xl">{name}</h1>
                <span className="bg-yellow-100 text-yellow-800 text-sm px-3 py-1 rounded-full self-start mb-2">
                  {typeof category === 'object' ? category.name : category}
                </span>
              </div>
              <div className="text-xl sm:text-2xl font-bold text-[#a67c52] mb-4 mt-2">
                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(
                  price
                )}
              </div>
              <div className="mb-6">
                <p className="text-[#5b4636] mb-4 text-sm sm:text-base">{description}</p>
                <div className="space-y-3 bg-[#f8f5f1] p-3 rounded-lg shadow-sm">
                  <div className="flex items-center">
                    <FaPalette className="text-[#a67c52] mr-2 flex-shrink-0" />
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
                    <FaTag className="text-[#a67c52] mr-2 flex-shrink-0" />
                    <span className="text-[#5b4636] font-semibold">Chất liệu: </span>
                    <span className="ml-2">{material}</span>
                  </div>
                  <div className="flex items-center">
                    <FaRuler className="text-[#a67c52] mr-2 flex-shrink-0" />
                    <span className="text-[#5b4636] font-semibold">Kích thước: </span>
                    <span className="ml-2">
                      {size.width}cm x {size.height}cm
                    </span>
                  </div>
                </div>
              </div>
              {inStock ? (
                <div className="mb-4">
                  <span className="text-green-700 bg-green-50 px-3 py-1.5 rounded-full text-sm font-medium inline-flex items-center shadow-sm">
                    <svg className="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Còn hàng
                  </span>
                </div>
              ) : (
                <div className="mb-4">
                  <span className="text-red-600 bg-red-50 px-3 py-1.5 rounded-full text-sm font-medium inline-flex items-center shadow-sm">
                    <svg className="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Hết hàng
                  </span>
                </div>
              )}
              {inStock && (
                <div className="flex flex-col items-start gap-3 mb-6">
                  {/* Quantity control - Mobile optimized */}
                  <div className="flex items-center w-full">
                    <div className="flex-1 sm:flex-none">
                      <div className="flex items-center border border-[#e7cba9] rounded-l-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow h-12 sm:h-10">
                        <button
                          onClick={() => setQuantity(Math.max(1, quantity - 1))}
                          className="cursor-pointer h-full w-12 sm:w-10 flex items-center justify-center bg-[#f8f5f1] hover:bg-[#efe8df] text-[#a67c52] font-medium text-xl border-r border-[#e7cba9] transition-colors"
                          aria-label="Giảm số lượng"
                        >
                          -
                        </button>
                        <span className="px-4 py-2 min-w-[3rem] text-center font-medium">
                          {quantity}
                        </span>
                        <button
                          onClick={() => setQuantity(quantity + 1)}
                          className="cursor-pointer h-full w-12 sm:w-10 flex items-center justify-center bg-[#f8f5f1] hover:bg-[#efe8df] text-[#a67c52] font-medium text-xl border-l border-[#e7cba9] transition-colors"
                          aria-label="Tăng số lượng"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* Add to cart button */}
                    <button
                      onClick={handleAddToCart}
                      className="cursor-pointer flex-1 h-12 sm:h-10 flex items-center justify-center px-4 py-2.5 bg-[#d6a77a] hover:bg-[#a67c52] text-white font-medium rounded-r-lg transition-colors shadow-sm hover:shadow-md"
                    >
                      <FaShoppingCart className="mr-2" />
                      <span>Thêm vào giỏ hàng</span>
                    </button>
                  </div>
                </div>
              )}
              <div className="mt-8 pt-4 border-t border-[#e7cba9]">
                <h3 className="text-lg font-semibold mb-3 text-[#a67c52]">
                  Dịch vụ của chúng tôi:
                </h3>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[#5b4636]">
                  <li className="flex items-start p-2 bg-[#f8f5f1] rounded-lg shadow-sm">
                    <span className="text-green-600 mr-2 mt-0.5">✓</span>
                    <span>Tư vấn, đo đạc tận nhà miễn phí</span>
                  </li>
                  <li className="flex items-start p-2 bg-[#f8f5f1] rounded-lg shadow-sm">
                    <span className="text-green-600 mr-2 mt-0.5">✓</span>
                    <span>Giao hàng tận nơi</span>
                  </li>
                  <li className="flex items-start p-2 bg-[#f8f5f1] rounded-lg shadow-sm">
                    <span className="text-green-600 mr-2 mt-0.5">✓</span>
                    <span>Lắp đặt chuyên nghiệp</span>
                  </li>
                  <li className="flex items-start p-2 bg-[#f8f5f1] rounded-lg shadow-sm">
                    <span className="text-green-600 mr-2 mt-0.5">✓</span>
                    <span>Bảo hành 12 tháng</span>
                  </li>
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
