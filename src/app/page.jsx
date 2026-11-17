'use client';

import './styles/cozy-theme.css';
import styles from '@/styles/modules/Home.module.css';
import Link from 'next/link';
import Image from 'next/image';
import { FaArrowRight, FaPhoneAlt } from 'react-icons/fa';

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

const TRUST_ITEMS = [
  { value: '20+', label: 'Năm kinh nghiệm' },
  { value: 'Tận nơi', label: 'Đo & lắp tại nhà' },
  { value: 'Miễn phí', label: 'Tư vấn, hẹn đo' },
  { value: 'Bảo hành', label: 'Sau lắp đặt' },
];

const WHY_POINTS = [
  {
    title: 'Vải và màu thật',
    text: 'Catalogue online cùng mẫu vải mang đến tận nhà khi đo cửa — không chỉ ảnh stock.',
  },
  {
    title: 'Lắp đúng kích thước',
    text: 'Đo cửa, tư vấn kiểu rèm, thi công gọn gàng và bảo hành sau lắp.',
  },
];

export default function Home() {
  const [featuredCurtains, setFeaturedCurtains] = useState([]);
  const [banners, setBanners] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingBanners, setLoadingBanners] = useState(true);
  const [productError, setProductError] = useState(null);
  const [categoryError, setCategoryError] = useState(null);
  const [productCounts, setProductCounts] = useState({});
  const [spotlightProject, setSpotlightProject] = useState(null);
  const [projectImageFailed, setProjectImageFailed] = useState(false);

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

  const loadFeaturedProducts = async () => {
    try {
      setLoadingProducts(true);
      setProductError(null);
      const allProducts = await getCurtains();
      setFeaturedCurtains(allProducts.slice(0, 3));

      const counts = {};
      allProducts.forEach((product) => {
        const categoryId =
          typeof product.category === 'object' ? product.category._id : product.category;

        if (categoryId) {
          counts[categoryId] = (counts[categoryId] || 0) + 1;
        }
      });
      setProductCounts(counts);
    } catch (err) {
      console.error('Error fetching curtains:', err);
      setProductError('Không thể tải sản phẩm nổi bật.');
    } finally {
      setLoadingProducts(false);
    }
  };

  const loadCategories = async () => {
    try {
      setLoadingCategories(true);
      setCategoryError(null);
      const data = await getCategories();
      setCategories(data);
    } catch (err) {
      console.error('Error fetching categories:', err);
      setCategoryError('Không thể tải danh mục sản phẩm.');
    } finally {
      setLoadingCategories(false);
    }
  };

  useEffect(() => {
    loadFeaturedProducts();
    loadCategories();

    const fetchBanners = async () => {
      try {
        setLoadingBanners(true);
        const data = await getBanners();
        setBanners(data);
      } catch (err) {
        console.error('Error fetching banners:', err);
        setBanners([]);
      } finally {
        setLoadingBanners(false);
      }
    };

    const fetchSpotlightProject = async () => {
      try {
        const projects = await getProjects();
        const withImage = (projects || []).find((project) => project.thumbnail);
        setSpotlightProject(withImage || projects?.[0] || null);
      } catch (err) {
        console.error('Error fetching spotlight project:', err);
      }
    };

    fetchBanners();
    fetchSpotlightProject();
  }, []);

  const ctaImage = '/images/blackout-curtains.jpg';
  const spotlightImage = projectImageFailed
    ? '/images/hero-curtain.jpg'
    : spotlightProject?.thumbnail;

  return (
    <div className={styles.container}>
      <StructuredData data={organizationSchema} />
      <StructuredData data={webPageSchema} />

      <BannerSlider banners={banners} loading={loadingBanners} />

      <section className={styles.trustBand} aria-label="Cam kết của Tuấn Rèm">
        <div className={styles.trustInner}>
          {TRUST_ITEMS.map((item) => (
            <div key={item.label} className={styles.trustItem}>
              <span className={styles.trustValue}>{item.value}</span>
              <span className={styles.trustLabel}>{item.label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.categoriesSection} aria-labelledby="home-categories-title">
        <div className={styles.sectionInner}>
          <div className={styles.sectionHead}>
            <div>
              <p className={styles.kicker}>Bộ sưu tập</p>
              <h2 id="home-categories-title" className={styles.sectionTitle}>
                Danh mục rèm cửa
              </h2>
            </div>
            <div className={styles.sectionAside}>
              <p className={styles.sectionLead}>
                Chọn loại rèm theo không gian — phòng khách, phòng ngủ, chống nắng, voan…
              </p>
              <Link href="/products" className={styles.textLink}>
                Xem tất cả danh mục <FaArrowRight className={styles.textLinkIcon} />
              </Link>
            </div>
          </div>

          {loadingCategories ? (
            <div className={styles.categoriesSkeleton} aria-busy="true" aria-label="Đang tải danh mục">
              {[0, 1, 2, 3].map((item) => (
                <span key={item} className={styles.categorySkeleton} />
              ))}
            </div>
          ) : categoryError ? (
            <div className={styles.statePanel} role="alert">
              <p className={styles.stateTitle}>{categoryError}</p>
              <p className={styles.stateText}>Kiểm tra kết nối và thử tải lại.</p>
              <button type="button" onClick={loadCategories} className={styles.stateButton}>
                Thử lại
              </button>
            </div>
          ) : categories.length === 0 ? (
            <div className={styles.statePanel}>
              <p className={styles.stateTitle}>Danh mục đang được cập nhật.</p>
              <p className={styles.stateText}>
                Gọi <a href="tel:+84937543809">0937 543 809</a> để xem mẫu vải và hẹn đo tại nhà.
              </p>
            </div>
          ) : (
            <CategorySlider categories={categories} productCounts={productCounts} />
          )}
        </div>
      </section>

      <section className={styles.whySection} aria-labelledby="home-why-title">
        <div className={`${styles.sectionInner} ${styles.whyInner}`}>
          <div className={styles.whyCopy}>
            <p className={styles.kicker}>Vì sao chọn Tuấn Rèm</p>
            <h2 id="home-why-title" className={styles.whyTitle}>
              Hơn hai mươi năm may đo và lắp đặt tại Bình Dương.
            </h2>
            <p className={styles.whyLead}>
              Bạn xem mẫu vải thật tại nhà trước khi quyết định — không chỉ ảnh stock.
            </p>

            <ol className={styles.whyList}>
              {WHY_POINTS.map((point, index) => (
                <li key={point.title} className={styles.whyItem}>
                  <span className={styles.whyNumber}>{String(index + 1).padStart(2, '0')}</span>
                  <div>
                    <h3 className={styles.whyItemTitle}>{point.title}</h3>
                    <p className={styles.whyItemText}>{point.text}</p>
                  </div>
                </li>
              ))}
            </ol>

            <Link href="/cong-trinh" className={styles.textLink}>
              Xem công trình đã lắp <FaArrowRight className={styles.textLinkIcon} />
            </Link>
          </div>

          <div className={styles.projectWrap}>
            <Link href="/cong-trinh" className={styles.projectShowcase}>
              {spotlightImage ? (
                <Image
                  src={spotlightImage}
                  alt={spotlightProject?.title || 'Công trình rèm Tuấn Rèm'}
                  fill
                  sizes="(max-width: 1024px) 100vw, 46vw"
                  className={styles.projectImage}
                  onError={() => setProjectImageFailed(true)}
                />
              ) : (
                <span className={styles.projectFallback} aria-hidden="true" />
              )}
              <div className={styles.projectCaption}>
                <span className={styles.projectKicker}>Công trình thực tế</span>
                <h3 className={styles.projectTitle}>
                  {spotlightProject?.title || 'Album lắp đặt tại Dĩ An'}
                </h3>
                <p className={styles.projectLocation}>
                  {spotlightProject?.location || 'Bình Dương & TP.HCM'}
                </p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      <section className={styles.productsSection} aria-labelledby="home-products-title">
        <div className={styles.sectionInner}>
          <div className={styles.sectionHead}>
            <div>
              <p className={styles.kicker}>Tuyển chọn</p>
              <h2 id="home-products-title" className={styles.sectionTitle}>
                Sản phẩm nổi bật
              </h2>
            </div>
            <div className={styles.sectionAside}>
              <p className={styles.sectionLead}>
                Một vài mẫu hay chọn — xem thêm màu và kích thước tại trang sản phẩm.
              </p>
              <Link href="/products" className={styles.textLink}>
                Xem tất cả sản phẩm <FaArrowRight className={styles.textLinkIcon} />
              </Link>
            </div>
          </div>

          {loadingProducts ? (
            <div className={styles.productsSkeleton} aria-busy="true" aria-label="Đang tải sản phẩm">
              {[0, 1, 2].map((item) => (
                <div key={item} className={styles.productSkeleton}>
                  <span className={styles.skeletonImage} />
                  <span className={styles.skeletonLine} />
                  <span className={styles.skeletonLineShort} />
                </div>
              ))}
            </div>
          ) : productError ? (
            <div className={styles.statePanel} role="alert">
              <p className={styles.stateTitle}>{productError}</p>
              <p className={styles.stateText}>Kiểm tra kết nối và thử lại.</p>
              <button type="button" onClick={loadFeaturedProducts} className={styles.stateButton}>
                Thử lại
              </button>
            </div>
          ) : featuredCurtains.length === 0 ? (
            <div className={styles.statePanel}>
              <p className={styles.stateTitle}>Mẫu rèm đang được cập nhật trên web.</p>
              <p className={styles.stateText}>
                Gọi hoặc nhắn Zalo để xem catalogue và hẹn đo tại nhà.
              </p>
              <div className={styles.stateActions}>
                <a href="tel:+84937543809" className={styles.stateButton}>
                  <FaPhoneAlt size={12} /> 0937 543 809
                </a>
                <a
                  href="https://zalo.me/0937543809"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.stateButtonGhost}
                >
                  Nhắn Zalo
                </a>
              </div>
            </div>
          ) : (
            <div className={styles.productsGrid}>
              {featuredCurtains.map((curtain) => (
                <CurtainCard key={curtain._id} curtain={curtain} variant="editorial" />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className={styles.ctaSection} aria-labelledby="home-cta-title">
        <Image src={ctaImage} alt="" fill sizes="100vw" className={styles.ctaImage} />
        <div className={styles.ctaOverlay} aria-hidden="true" />
        <div className={styles.ctaInner}>
          <p className={styles.kickerLight}>Tư vấn miễn phí</p>
          <h2 id="home-cta-title" className={styles.ctaTitle}>
            Hẹn đo rèm tại nhà
          </h2>
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
