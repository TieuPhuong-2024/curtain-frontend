'use client';

import './styles/cozy-theme.css';
import styles from '@/styles/modules/Home.module.css';
import Link from 'next/link';
import Image from 'next/image';
import { FaArrowRight } from 'react-icons/fa';

import { useEffect, useState } from 'react';
import { getBanners, getCategories, getCurtains, getProjects } from '@/lib/api';
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
  const [spotlightProject, setSpotlightProject] = useState(null);

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

    const fetchSpotlightProject = async () => {
      try {
        const projects = await getProjects();
        const withImage = (projects || []).find((p) => p.thumbnail);
        setSpotlightProject(withImage || projects?.[0] || null);
      } catch (err) {
        console.error('Error fetching spotlight project:', err);
      }
    };
    fetchSpotlightProject();
  }, []);

  return (
    <div className={styles.container}>
      <StructuredData data={organizationSchema} />
      <StructuredData data={webPageSchema} />
      {/* Banner Slider Section */}
      {loadingBanners ? (
        <section className={styles.bannerSection}>
          <div className={styles.bannerPattern}></div>
          <div className={styles.bannerLoading}>
            <div className={styles.loadingSpinner}></div>
            <p className={styles.loadingText}>Đang tải banner...</p>
          </div>
        </section>
      ) : bannerError ? (
        <section className={styles.fallbackBanner}>
          <div className="absolute inset-0 z-0 bg-[#c9bfb4]" aria-hidden="true" />

          <div className="container mx-auto px-4 z-10 text-white">
            <div className={styles.fallbackContent}>
              <h1 className={styles.fallbackTitle}>
                Rèm cửa cho không gian của bạn
              </h1>
              <p className={styles.fallbackDescription}>
                Xem mẫu vải, chọn màu, rồi hẹn đo và lắp tại nhà.
              </p>
              <Link href="/products" className={styles.fallbackButton}>
                Xem sản phẩm <FaArrowRight className="ml-3" />
              </Link>
            </div>
          </div>
        </section>
      ) : (
        <BannerSlider banners={banners} />
      )}

      {/* Categories Section */}
      <section className={styles.categoriesSection}>
        <div className={styles.categoriesPattern}></div>
        <div className={styles.categoriesContainer}>
          <div className={styles.categoriesHeader}>
            <h2 className={styles.categoriesTitle}>
              Danh mục rèm cửa
            </h2>
            <p className={styles.categoriesDescription}>
              Chọn loại rèm theo không gian — phòng khách, phòng ngủ, chống nắng, voan…
            </p>
          </div>
          {loadingCategories ? (
            <div className={styles.categoriesLoading}>
              <div className={styles.categoriesSpinner}></div>
              <p className="text-text-primary">Đang tải danh mục...</p>
            </div>
          ) : categoryError ? (
            <div className={styles.categoriesError}>
              <p className="text-lg">{categoryError}</p>
            </div>
          ) : categories.length === 0 ? (
            <div className={styles.categoriesEmpty}>
              <p className="text-lg text-[#5b4636]">Danh mục đang được cập nhật.</p>
              <p className="mt-2 text-[#7d6e5d]">
                Gọi{' '}
                <a href="tel:+84937543809" className="font-semibold text-[#8a6642] underline">
                  0937 543 809
                </a>{' '}
                để xem mẫu và hẹn đo tại nhà.
              </p>
            </div>
          ) : (
            <CategorySlider categories={categories} productCounts={productCounts} />
          )}
        </div>
      </section>

      {/* Why us + công trình */}
      <section className={styles.whySection}>
        <div className={styles.whyGrid}>
          <div>
            <h2 className={styles.whyTitle}>Tại sao chọn Tuấn Rèm?</h2>
            <p className={styles.whyLead}>
              Hơn 20 năm đo, may và lắp rèm tại Bình Dương — bạn xem mẫu vải tận nhà trước khi quyết định.
            </p>
            <ul className={styles.whyPoints}>
              <li className={styles.whyPoint}>
                <strong>Vải và màu thật</strong>
                Catalogue online + mẫu vải khi đo tại nhà, không chỉ ảnh stock.
              </li>
              <li className={styles.whyPoint}>
                <strong>Lắp đúng kích thước</strong>
                Đo cửa, tư vấn kiểu rèm, bảo hành sau lắp.
              </li>
            </ul>
            <Link href="/cong-trinh" className={styles.whyLink}>
              Xem công trình đã lắp
            </Link>
          </div>

          <Link href="/cong-trinh" className={styles.projectShowcase}>
            {spotlightProject?.thumbnail ? (
              <>
                <Image
                  src={spotlightProject.thumbnail}
                  alt={spotlightProject.title || 'Công trình rèm Tuấn Rèm'}
                  fill
                  className={styles.projectShowcaseImage}
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className={styles.projectShowcaseCaption}>
                  <h3>{spotlightProject.title}</h3>
                  <p>{spotlightProject.location || 'Công trình thực tế'}</p>
                </div>
              </>
            ) : (
              <div className={styles.projectShowcaseFallback}>
                <p className="font-semibold text-[#3f2f22]">Ảnh công trình trên web</p>
                <p className="mt-2 text-sm">Xem album lắp đặt tại Dĩ An và lân cận.</p>
              </div>
            )}
          </Link>
        </div>
      </section>

      {/* Sản phẩm nổi bật */}
      <section className={styles.productsSection}>
        <div className="container mx-auto px-4">
          <div className={styles.productsHeader}>
            <h2 className={styles.productsTitle}>Sản phẩm nổi bật</h2>
            <p className={styles.productsLead}>
              Một vài mẫu hay chọn — xem thêm màu và kích thước tại trang sản phẩm.
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
              <p className="text-[#5b4636] mb-2 text-lg">Mẫu rèm đang được cập nhật trên web.</p>
              <p className="text-[#7d6e5d] mb-6">Gọi hoặc nhắn Zalo để xem catalogue và hẹn đo tại nhà.</p>
              <div className="flex flex-col sm:flex-row justify-center gap-3">
                <a
                  href="tel:+84937543809"
                  className="inline-flex items-center justify-center px-6 py-3 bg-[#8a6642] text-white font-semibold rounded-full"
                >
                  Gọi 0937 543 809
                </a>
                <a
                  href="https://zalo.me/0937543809"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center px-6 py-3 border border-[#8a6642] text-[#8a6642] font-semibold rounded-full"
                >
                  Nhắn Zalo
                </a>
              </div>
            </div>
          ) : (
            <>
              <div className={styles.productsGrid}>
                {featuredCurtains.map(curtain => (
                  <div key={curtain._id} className={styles.productCardWrap}>
                    <CurtainCard curtain={curtain} />
                  </div>
                ))}
              </div>
              
              <div className={styles.productsMore}>
                <Link href="/products" className={styles.productsMoreLink}>
                  Xem tất cả sản phẩm
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className={styles.ctaSection}>
        <div className={styles.ctaInner}>
          <h2 className={styles.ctaTitle}>Hẹn đo rèm tại nhà</h2>
          <p className={styles.ctaLead}>
            Gọi hoặc nhắn Zalo — tư vấn miễn phí, báo giá sau khi đo cửa.
          </p>
          <div className={styles.ctaActions}>
            <Link href="/contact" className={styles.ctaPrimary}>
              Liên hệ
            </Link>
            <a
              href="https://zalo.me/0937543809"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.ctaSecondary}
            >
              Nhắn Zalo
            </a>
          </div>
          <p className={styles.ctaNote}>0937 543 809 · Dĩ An, Bình Dương</p>
        </div>
      </section>
    </div>
  );
}
