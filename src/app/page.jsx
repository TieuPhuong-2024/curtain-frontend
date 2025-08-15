'use client';

import './styles/cozy-theme.css';
import Image from 'next/image';
import Link from 'next/link';
import { FaArrowRight, FaCheck } from 'react-icons/fa';

import { useEffect, useState } from 'react';
import { getBanners, getCategories, getCurtains } from '@/lib/api';
import CurtainCard from '@/components/CurtainCard';
import BannerSlider from '@/components/BannerSlider';
import CategorySlider from '@/components/CategorySlider';
import { SITE_DESCRIPTION, SITE_NAME } from '@/utils/constant';
import StructuredData, {
  createOrganizationSchema,
  createWebPageSchema,
} from '@/components/StructureData';

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

  // Tạo schema cho trang chủ
  const organizationSchema = createOrganizationSchema({
    name: SITE_NAME,
    url: process.env.NEXT_PUBLIC_URL,
    logo: `${process.env.NEXT_PUBLIC_URL}/logo.png`,
    description: SITE_DESCRIPTION,
    address: {
      street: '15/7A Tân Lập - Đông Hoà - Dĩ An - Bình Dương',
      city: 'Dĩ An',
      region: 'Bình Dương',
      country: 'VN',
    },
    phone: '+84-937-543-809',
    email: 'tuanremgiare@gmail.com',
    sameAs: [
      'https://www.facebook.com/NguyenTuanthht12',
      'https://www.youtube.com/@Tu%E1%BA%A5nR%C3%A8mB%C3%ACnhD%C6%B0%C6%A1ng',
    ],
  });

  const webPageSchema = createWebPageSchema({
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    url: process.env.NEXT_PUBLIC_URL,
    image: `${process.env.NEXT_PUBLIC_URL}/logo.png`,
  });

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
          const categoryId =
            typeof product.category === 'object' ? product.category._id : product.category;

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
    <div className="min-h-screen bg-gradient-to-br from-white via-secondary/50 to-primary-light/20">
      <StructuredData data={organizationSchema} />
      <StructuredData data={webPageSchema} />
      {/* Banner Slider Section */}
      {loadingBanners ? (
        <section className="relative h-[80vh] flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
          <div className="absolute inset-0 bg-[url('/images/pattern-curtain.svg')] opacity-5"></div>
          <div className="text-center relative z-10">
            <div className="animate-spin rounded-full h-16 w-16 border-t-3 border-b-3 border-primary mx-auto mb-6 shadow-lg"></div>
            <p className="text-text-primary text-lg font-medium">Đang tải banner...</p>
          </div>
        </section>
      ) : bannerError ? (
        <section className="relative h-[80vh] flex items-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <Image
              src="/images/hero-curtain.jpg"
              alt="Rèm cửa cao cấp"
              fill
              style={{ objectFit: 'cover' }}
              priority
              className="scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-black/20"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent"></div>
          </div>

          <div className="container mx-auto px-4 z-10 text-white">
            <div className="max-w-3xl backdrop-blur-sm bg-white/10 rounded-2xl p-8 md:p-12 border border-white/20 shadow-2xl">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent leading-tight">
                Rèm Cửa Cao Cấp Cho Không Gian Của Bạn
              </h1>
              <p className="text-lg md:text-xl lg:text-2xl mb-8 text-white/90 leading-relaxed">
                Khám phá bộ sưu tập rèm cửa đa dạng với chất lượng tốt nhất và giá cả hợp lý
              </p>
              <Link href="/products" className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-primary to-accent text-white font-semibold rounded-full hover:from-accent hover:to-primary transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl">
                Xem sản phẩm <FaArrowRight className="ml-3" />
              </Link>
            </div>
          </div>
        </section>
      ) : (
        <BannerSlider banners={banners} />
      )}

      {/* Categories Section */}
      <section className="py-20 bg-gradient-to-br from-white via-secondary/30 to-primary-light/10 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/pattern-curtain.svg')] opacity-3"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-text-primary mb-6 relative">
              Danh Mục Rèm Cửa
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-primary to-accent rounded-full"></div>
            </h2>
            <p className="text-lg text-text-secondary max-w-2xl mx-auto leading-relaxed">
              Khám phá đa dạng các loại rèm cửa phù hợp với mọi không gian và phong cách
            </p>
          </div>
          {loadingCategories ? (
            <div className="text-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-text-primary">Đang tải danh mục...</p>
            </div>
          ) : categoryError ? (
            <div className="text-center text-error py-16 bg-red-50 rounded-xl border border-red-100">
              <p className="text-lg">{categoryError}</p>
            </div>
          ) : categories.length === 0 ? (
            <div className="text-center py-16 bg-gray-50 rounded-xl">
              <p className="text-text-secondary text-lg">Chưa có danh mục nào.</p>
            </div>
          ) : (
            <CategorySlider categories={categories} productCounts={productCounts} />
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-white via-primary-light/5 to-white"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1">
              <div className="mb-8">
                <h2 className="text-4xl md:text-5xl font-bold text-text-primary mb-6 leading-tight">
                  Tại Sao Chọn Chúng Tôi?
                </h2>
                <p className="text-lg text-text-secondary leading-relaxed">
                  Với hơn 20 năm kinh nghiệm, chúng tôi tự hào cung cấp các sản phẩm rèm cửa chất
                  lượng cao, được thiết kế để nâng tầm không gian sống của bạn.
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-start p-4 bg-gradient-to-r from-success/10 to-success/5 rounded-xl border border-success/20">
                  <div className="flex-shrink-0 w-12 h-12 bg-success rounded-full flex items-center justify-center mr-4">
                    <FaCheck className="text-white text-lg" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-text-primary mb-1">Chất liệu cao cấp</h3>
                    <p className="text-text-secondary">Bền đẹp theo thời gian, không phai màu</p>
                  </div>
                </div>
                
                <div className="flex items-start p-4 bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl border border-primary/20">
                  <div className="flex-shrink-0 w-12 h-12 bg-primary rounded-full flex items-center justify-center mr-4">
                    <FaCheck className="text-white text-lg" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-text-primary mb-1">Đa dạng mẫu mã</h3>
                    <p className="text-text-secondary">Phù hợp với mọi phong cách và không gian</p>
                  </div>
                </div>
                
                <div className="flex items-start p-4 bg-gradient-to-r from-accent/10 to-accent/5 rounded-xl border border-accent/20">
                  <div className="flex-shrink-0 w-12 h-12 bg-accent rounded-full flex items-center justify-center mr-4">
                    <FaCheck className="text-white text-lg" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-text-primary mb-1">Dịch vụ tận tâm</h3>
                    <p className="text-text-secondary">Tư vấn, đo đạc và lắp đặt tại nhà</p>
                  </div>
                </div>
                
                <div className="flex items-start p-4 bg-gradient-to-r from-primary-dark/10 to-primary-dark/5 rounded-xl border border-primary-dark/20">
                  <div className="flex-shrink-0 w-12 h-12 bg-primary-dark rounded-full flex items-center justify-center mr-4">
                    <FaCheck className="text-white text-lg" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-text-primary mb-1">Bảo hành dài hạn</h3>
                    <p className="text-text-secondary">Hỗ trợ sau bán hàng tận tình</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="order-1 lg:order-2">
              <div className="relative">
                <div className="w-full h-96 bg-gradient-to-br from-primary-light/20 to-accent/20 rounded-2xl flex items-center justify-center">
                  <div className="text-center p-8">
                    <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                      <FaCheck className="text-white text-3xl" />
                    </div>
                    <h3 className="text-2xl font-bold text-text-primary mb-2">Chất lượng đảm bảo</h3>
                    <p className="text-text-secondary">Cam kết 100% sự hài lòng</p>
                  </div>
                </div>
                <div className="absolute -top-4 -right-4 w-16 h-16 bg-accent rounded-full opacity-80"></div>
                <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-primary rounded-full opacity-60"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sản phẩm nổi bật */}
      <section className="py-20 bg-gradient-to-br from-white via-gray-50/50 to-primary-light/5 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/pattern-curtain.svg')] opacity-2"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-text-primary mb-6 relative">
              Sản Phẩm Nổi Bật
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-primary to-accent rounded-full"></div>
            </h2>
            <p className="text-lg text-text-secondary max-w-2xl mx-auto leading-relaxed">
              Khám phá những sản phẩm rèm cửa được yêu thích nhất với thiết kế hiện đại và chất lượng vượt trội
            </p>
          </div>
          {loading ? (
            <div className="flex justify-center items-center h-80">
              <div className="text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-t-3 border-b-3 border-primary mx-auto mb-6"></div>
                <p className="text-text-primary text-lg font-medium">Đang tải sản phẩm...</p>
              </div>
            </div>
          ) : error ? (
            <div className="text-center py-16 bg-gradient-to-br from-red-50 to-red-100/50 rounded-2xl border border-red-200">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-red-500 text-2xl">⚠</span>
              </div>
              <p className="text-red-600 mb-6 text-lg">{error}</p>
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
                className="cursor-pointer px-6 py-3 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all duration-300 hover:shadow-lg transform hover:scale-105"
              >
                Thử lại
              </button>
            </div>
          ) : featuredCurtains.length === 0 ? (
            <div className="text-center py-16 bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-2xl border border-gray-200">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-gray-400 text-2xl">📦</span>
              </div>
              <p className="text-text-secondary mb-4 text-lg">Chưa có sản phẩm nổi bật</p>
              <Link
                href="/products"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-primary to-accent text-white font-medium rounded-full hover:from-accent hover:to-primary transition-all duration-300 hover:shadow-lg transform hover:scale-105"
              >
                Xem tất cả sản phẩm <FaArrowRight className="ml-2" />
              </Link>
            </div>
          ) : (
            <>
              <div className={`${
                featuredCurtains.length < 3
                  ? "flex justify-center gap-8 flex-wrap"
                  : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              } mb-12`}>
                {featuredCurtains.map(curtain => (
                  <div key={curtain._id} className="group">
                    <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden border border-gray-100">
                      <CurtainCard curtain={curtain} />
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="text-center">
                <Link
                  href="/products"
                  className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-primary to-accent text-white font-semibold rounded-full hover:from-accent hover:to-primary transition-all duration-300 hover:shadow-lg transform hover:scale-105"
                >
                  Xem tất cả sản phẩm <FaArrowRight className="ml-3" />
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-primary-dark via-primary to-accent relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/pattern-curtain.svg')] opacity-5"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/20 to-transparent"></div>
        
        {/* Floating decorative elements */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-white/5 rounded-full blur-xl"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-accent/10 rounded-full blur-xl"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-primary-light/10 rounded-full blur-lg"></div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8 leading-tight text-white drop-shadow-lg">
              Sẵn Sàng Làm Mới 
              <span className="block text-white drop-shadow-lg">
                Không Gian Của Bạn?
              </span>
            </h2>
            <p className="text-xl md:text-2xl mb-12 max-w-3xl mx-auto leading-relaxed text-white drop-shadow-md">
              Liên hệ ngay với chúng tôi để được tư vấn miễn phí và nhận báo giá tốt nhất
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-6 max-w-2xl mx-auto mb-16">
              <Link
                href="/contact"
                className="group px-8 py-4 bg-white text-primary-dark font-semibold rounded-full hover:bg-primary-light hover:text-primary-dark transition-all duration-300 hover:shadow-xl transform hover:scale-105 flex items-center justify-center shadow-lg"
              >
                <span className="mr-2 text-lg">📞</span>
                <span className="text-lg">Liên hệ ngay</span>
                <div className="ml-2 transform group-hover:translate-x-1 transition-transform text-lg">→</div>
              </Link>
              <Link
                href="/products"
                className="group px-8 py-4 bg-transparent text-white border-2 border-white font-semibold rounded-full hover:bg-white hover:text-primary-dark transition-all duration-300 hover:shadow-xl transform hover:scale-105 flex items-center justify-center backdrop-blur-sm"
              >
                <span className="mr-2 text-lg">🏠</span>
                <span className="text-lg">Khám phá sản phẩm</span>
                <div className="ml-2 transform group-hover:translate-x-1 transition-transform text-lg">→</div>
              </Link>
            </div>

            {/* Trust indicators */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
                <div className="flex items-center text-white">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mr-3">
                    <span className="text-xl">⭐</span>
                  </div>
                  <div className="text-left">
                    <div className="font-bold text-lg">20+</div>
                    <div className="text-sm opacity-90">năm kinh nghiệm</div>
                  </div>
                </div>
                <div className="flex items-center text-white">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mr-3">
                    <span className="text-xl">🏆</span>
                  </div>
                  <div className="text-left">
                    <div className="font-bold text-lg">1000+</div>
                    <div className="text-sm opacity-90">khách hàng hài lòng</div>
                  </div>
                </div>
                <div className="flex items-center text-white">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mr-3">
                    <span className="text-xl">🚚</span>
                  </div>
                  <div className="text-left">
                    <div className="font-bold text-lg">Toàn quốc</div>
                    <div className="text-sm opacity-90">Giao hàng miễn phí</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
