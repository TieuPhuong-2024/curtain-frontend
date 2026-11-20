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
import { useSettings } from '@/lib/SettingsContext';
import { phoneDigits } from '@/utils/siteSettings';
import { SITE_DESCRIPTION, SITE_NAME } from '@/utils/constant';
import StructuredData, {
  createOrganizationSchema,
  createWebPageSchema,
  createWebSiteSchema,
} from '@/components/StructureData';
import { getSiteUrl } from '@/utils/seo';

export default function Home() {
  const { getValue } = useSettings();
  const siteName = getValue('global.siteName');
  const siteDescription = getValue('global.siteDescription');
  const hotline = getValue('global.hotline');
  const zaloUrl = getValue('global.zaloUrl');
  const hotlineDigits = phoneDigits(hotline);
  const telHref = hotlineDigits ? `tel:+84${hotlineDigits.replace(/^0/, '')}` : '';

  const trustItems = [1, 2, 3, 4]
    .map((index) => ({
      value: getValue(`home.trust${index}Value`),
      label: getValue(`home.trust${index}Label`),
    }))
    .filter((item) => item.value || item.label);

  const whyPoints = [1, 2]
    .map((index) => ({
      title: getValue(`home.whyPoint${index}Title`),
      text: getValue(`home.whyPoint${index}Text`),
    }))
    .filter((point) => point.title || point.text);

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

  const siteUrl = getSiteUrl();

  const webSiteSchema = createWebSiteSchema({
    name: siteName || SITE_NAME,
    description: siteDescription || SITE_DESCRIPTION,
    url: siteUrl,
  });

  const organizationSchema = createOrganizationSchema({
    name: siteName || SITE_NAME,
    url: siteUrl,
    logo: `${siteUrl}/logo.png`,
    description: siteDescription || SITE_DESCRIPTION,
    address: {
      street: getValue('global.address'),
      city: 'Dĩ An',
      region: 'Bình Dương',
      country: 'VN',
    },
    phone: hotlineDigits ? `+84-${hotlineDigits.replace(/^0/, '')}` : '',
    email: getValue('global.email'),
    sameAs: [zaloUrl, getValue('global.youtubeUrl')].filter(Boolean),
  });

  const webPageSchema = createWebPageSchema({
    title: siteName || SITE_NAME,
    description: siteDescription || SITE_DESCRIPTION,
    url: siteUrl,
    image: `${siteUrl}/logo.png`,
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
      <StructuredData data={webSiteSchema} />
      <StructuredData data={organizationSchema} />
      <StructuredData data={webPageSchema} />

      <BannerSlider banners={banners} loading={loadingBanners} />

      {trustItems.length > 0 && (
        <section className={styles.trustBand} aria-label="Cam kết của shop">
          <div className={styles.trustInner}>
            {trustItems.map((item, index) => (
              <div key={`${item.label}-${index}`} className={styles.trustItem}>
                <span className={styles.trustValue}>{item.value}</span>
                <span className={styles.trustLabel}>{item.label}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className={styles.categoriesSection} aria-labelledby="home-categories-title">
        <div className={styles.sectionInner}>
          <div className={styles.sectionHead}>
            <div>
              {getValue('home.categoriesKicker') && (
                <p className={styles.kicker}>{getValue('home.categoriesKicker')}</p>
              )}
              {getValue('home.categoriesTitle') && (
                <h2 id="home-categories-title" className={styles.sectionTitle}>
                  {getValue('home.categoriesTitle')}
                </h2>
              )}
            </div>
            <div className={styles.sectionAside}>
              {getValue('home.categoriesLead') && (
                <p className={styles.sectionLead}>{getValue('home.categoriesLead')}</p>
              )}
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
                {telHref ? (
                  <>
                    Gọi <a href={telHref}>{hotline}</a> để xem mẫu vải và hẹn đo tại nhà.
                  </>
                ) : (
                  'Vui lòng quay lại sau để xem mẫu vải.'
                )}
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
            {getValue('home.whyKicker') && (
              <p className={styles.kicker}>{getValue('home.whyKicker')}</p>
            )}
            {getValue('home.whyTitle') && (
              <h2 id="home-why-title" className={styles.whyTitle}>
                {getValue('home.whyTitle')}
              </h2>
            )}
            {getValue('home.whyLead') && (
              <p className={styles.whyLead}>{getValue('home.whyLead')}</p>
            )}

            <ol className={styles.whyList}>
              {whyPoints.map((point, index) => (
                <li key={`${point.title}-${index}`} className={styles.whyItem}>
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
              {getValue('home.productsKicker') && (
                <p className={styles.kicker}>{getValue('home.productsKicker')}</p>
              )}
              {getValue('home.productsTitle') && (
                <h2 id="home-products-title" className={styles.sectionTitle}>
                  {getValue('home.productsTitle')}
                </h2>
              )}
            </div>
            <div className={styles.sectionAside}>
              {getValue('home.productsLead') && (
                <p className={styles.sectionLead}>{getValue('home.productsLead')}</p>
              )}
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
                {telHref || zaloUrl
                  ? 'Gọi hoặc nhắn Zalo để xem catalogue và hẹn đo tại nhà.'
                  : 'Vui lòng quay lại sau để xem mẫu rèm mới.'}
              </p>
              <div className={styles.stateActions}>
                {telHref && (
                  <a href={telHref} className={styles.stateButton}>
                    <FaPhoneAlt size={12} /> {hotline}
                  </a>
                )}
                {zaloUrl && (
                  <a
                    href={zaloUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.stateButtonGhost}
                  >
                    Nhắn Zalo
                  </a>
                )}
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
          {getValue('home.ctaKicker') && (
            <p className={styles.kickerLight}>{getValue('home.ctaKicker')}</p>
          )}
          {getValue('home.ctaTitle') && (
            <h2 id="home-cta-title" className={styles.ctaTitle}>
              {getValue('home.ctaTitle')}
            </h2>
          )}
          {getValue('home.ctaLead') && (
            <p className={styles.ctaLead}>{getValue('home.ctaLead')}</p>
          )}
          <div className={styles.ctaActions}>
            <Link href="/contact" className={styles.ctaPrimary}>
              Liên hệ
            </Link>
            {zaloUrl && (
              <a
                href={zaloUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.ctaSecondary}
              >
                Nhắn Zalo
              </a>
            )}
          </div>
          {(hotline || getValue('global.address')) && (
            <p className={styles.ctaNote}>
              {[hotline, getValue('global.address')].filter(Boolean).join(' · ')}
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
