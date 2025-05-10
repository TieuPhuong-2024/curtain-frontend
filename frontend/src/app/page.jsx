'use client';

import './styles/cozy-theme.css';
import Image from 'next/image';
import Link from 'next/link';
import {FaArrowRight, FaCheck} from 'react-icons/fa';

import {useEffect, useState} from 'react';
import {getBanners, getCategories, getCurtains} from '@/lib/api';
import CurtainCard from '@/components/CurtainCard';
import BannerSlider from '@/components/BannerSlider';
import CategorySlider from '@/components/CategorySlider';

export default function Home() {
    const [featuredCurtains, setFeaturedCurtains] = useState([]);
    const [banners, setBanners] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loadingCategories, setLoadingCategories] = useState(true);
    const [loading, setLoading] = useState(true);
    const [loadingBanners, setLoadingBanners] = useState(true);
    const [error, setError] = useState(null);
    const [bannerError, setBannerError] = useState(null);
    const [categoryError, setCategoryError] = useState(null);
    const [productCounts, setProductCounts] = useState({});

    useEffect(() => {
        const fetchFeatured = async () => {
            try {
                setLoading(true);
                const allProducts = await getCurtains();
                // Lấy 3 sản phẩm đầu tiên hoặc sắp xếp theo tiêu chí khác nếu cần
                setFeaturedCurtains(allProducts.slice(0, 3));
                
                // Calculate product counts per category
                const counts = {};
                allProducts.forEach(product => {
                    const categoryId = typeof product.category === 'object' 
                        ? product.category._id 
                        : product.category;
                    
                    if (categoryId) {
                        counts[categoryId] = (counts[categoryId] || 0) + 1;
                    }
                });
                setProductCounts(counts);
            } catch (err) {
                console.error('Error fetching curtains:', err);
                setError('Không thể tải sản phẩm nổi bật.');
            } finally {
                setLoading(false);
            }
        };

        const fetchBanners = async () => {
            try {
                setLoadingBanners(true);
                const data = await getBanners();
                setBanners(data);
            } catch (err) {
                console.error('Error fetching banners:', err);
                setBannerError('Không thể tải banner.');
            } finally {
                setLoadingBanners(false);
            }
        };

        fetchFeatured();
        fetchBanners();

        const fetchCategories = async () => {
            try {
                setLoadingCategories(true);
                const data = await getCategories();
                setCategories(data);
            } catch (err) {
                setCategoryError('Không thể tải danh mục sản phẩm');
            } finally {
                setLoadingCategories(false);
            }
        };
        fetchCategories();
    }, []);

    return (
        <div className="cozy-bg min-h-screen">
            {/* Banner Slider Section */}
            {loadingBanners ? (
                <section className="relative h-[70vh] flex items-center justify-center bg-gray-200">
                    <div className="text-center">
                        <div
                            className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                        <p className="text-gray-600">Đang tải banner...</p>
                    </div>
                </section>
            ) : bannerError ? (
                <section className="relative h-[70vh] flex items-center">
                    <div className="absolute inset-0 z-0">
                        <Image
                            src="/images/hero-curtain.jpg"
                            alt="Rèm cửa cao cấp"
                            fill
                            style={{objectFit: 'cover'}}
                            priority
                            className="cozy-img w-full h-full"
                        />
                        <div className="absolute inset-0 bg-black opacity-40"></div>
                    </div>

                    <div className="container mx-auto px-4 z-10 text-white">
                        <div className="max-w-2xl cozy-card bg-opacity-90">
                            <h1 className="cozy-title mb-4 text-4xl md:text-5xl">Rèm Cửa Cao Cấp Cho Không Gian Của
                                Bạn</h1>
                            <p className="text-xl mb-8">
                                Khám phá bộ sưu tập rèm cửa đa dạng với chất lượng tốt nhất và giá cả hợp lý
                            </p>
                            <Link href="/products" className="cozy-btn font-semibold inline-flex items-center">
                                Xem sản phẩm <FaArrowRight className="ml-2"/>
                            </Link>
                        </div>
                    </div>
                </section>
            ) : (
                <BannerSlider banners={banners}/>
            )}

            {/* Categories Section */}
            <section className="py-16 bg-[#f3e6d8]">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-12">Danh Mục Rèm Cửa</h2>
                    {loadingCategories ? (
                        <div className="text-center py-12">Đang tải danh mục...</div>
                    ) : categoryError ? (
                        <div className="text-center text-red-500 py-12">{categoryError}</div>
                    ) : categories.length === 0 ? (
                        <div className="text-center py-12">Chưa có danh mục nào.</div>
                    ) : (
                        <CategorySlider categories={categories} productCounts={productCounts} />
                    )}
                </div>
            </section>

            {/* Features Section */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-3xl font-bold mb-6">Tại Sao Chọn Chúng Tôi?</h2>
                            <p className="text-gray-600 mb-8">
                                Với hơn 20 năm kinh nghiệm, chúng tôi tự hào cung cấp các sản phẩm rèm cửa
                                chất lượng cao, được thiết kế để nâng tầm không gian sống của bạn.
                            </p>

                            <ul className="space-y-4">
                                <li className="flex items-start">
                                    <FaCheck className="text-green-500 mt-1 mr-3"/>
                                    <span>Chất liệu cao cấp, bền đẹp theo thời gian</span>
                                </li>
                                <li className="flex items-start">
                                    <FaCheck className="text-green-500 mt-1 mr-3"/>
                                    <span>Đa dạng mẫu mã, phù hợp với mọi phong cách</span>
                                </li>
                                <li className="flex items-start">
                                    <FaCheck className="text-green-500 mt-1 mr-3"/>
                                    <span>Dịch vụ tư vấn, đo đạc và lắp đặt tận nhà</span>
                                </li>
                                <li className="flex items-start">
                                    <FaCheck className="text-green-500 mt-1 mr-3"/>
                                    <span>Bảo hành dài hạn và hỗ trợ sau bán hàng</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Sản phẩm nổi bật */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-12">Sản Phẩm Nổi Bật</h2>
                    {loading ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="text-center">
                                <div
                                    className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                                <p className="text-gray-600">Đang tải sản phẩm...</p>
                            </div>
                        </div>
                    ) : error ? (
                        <div className="text-center py-12 bg-red-50 rounded-lg">
                            <p className="text-red-500 mb-4">{error}</p>
                            <button
                                onClick={() => {
                                    setLoading(true);
                                    setError(null);
                                    getCurtains()
                                        .then(data => {
                                            setFeaturedCurtains(data.slice(0, 3));
                                            setLoading(false);
                                        })
                                        .catch(err => {
                                            setError('Không thể tải sản phẩm nổi bật.');
                                            setLoading(false);
                                        });
                                }}
                                className="cursor-pointer px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors"
                            >
                                Thử lại
                            </button>
                        </div>
                    ) : featuredCurtains.length === 0 ? (
                        <div className="text-center py-12 bg-gray-50 rounded-lg">
                            <p className="text-gray-500 mb-2">Chưa có sản phẩm nổi bật</p>
                            <Link href="/products"
                                  className="text-indigo-600 hover:text-indigo-800 font-medium inline-flex items-center">
                                Xem tất cả sản phẩm <FaArrowRight className="ml-1"/>
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {featuredCurtains.map(curtain => (
                                <CurtainCard key={curtain._id} curtain={curtain}/>
                            ))}
                            <div className="flex justify-center items-center col-span-1 md:col-span-3 mt-8">
                                <Link
                                    href="/products"
                                    className="px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors inline-flex items-center"
                                >
                                    Xem tất cả sản phẩm <FaArrowRight className="ml-2"/>
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 bg-[#f9f3ea] text-[#5d4938] relative">
                <div className="container mx-auto px-4 text-center relative z-10">
                    <h2 className="text-3xl font-bold mb-5">Sẵn Sàng Làm Mới Không Gian Của Bạn?</h2>
                    <p className="text-lg mb-12 max-w-2xl mx-auto">
                        Liên hệ ngay với chúng tôi để được tư vấn miễn phí và nhận báo giá tốt nhất
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-y-4 sm:gap-y-0 sm:gap-x-6">
                        <Link href="/contact"
                              className="w-60 mx-auto sm:mx-0 bg-[#f9f3ea] text-[#5d4938] hover:bg-[#f0e9df] border border-[#d1c3b3] px-6 py-3 rounded-md font-medium transition-colors duration-300">
                            Liên hệ ngay
                        </Link>
                        <Link href="/products"
                              className="w-60 mx-auto sm:mx-0 bg-transparent text-[#5d4938] hover:bg-[#f0e9df] border border-[#d1c3b3] px-6 py-3 rounded-md font-medium transition-colors duration-300">
                            Khám phá sản phẩm
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
} 