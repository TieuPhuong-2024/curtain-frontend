import { ROUTES_PATH, SITE_NAME } from '@/utils/constant';
import { getSiteUrl, stripHtmlAndTruncate, toAbsoluteUrl } from '@/utils/seo';

export const defaultSchema = ({
  title,
  description,
  url,
  type = 'WebSite',
  ...restProps
}) => {
  return {
    '@context': 'https://schema.org',
    '@type': type,
    name: title,
    description,
    url: url || getSiteUrl(),
    ...restProps,
  };
};

export const createWebSiteSchema = ({ name = SITE_NAME, description, url } = {}) => {
  const siteUrl = url || getSiteUrl();
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name,
    description,
    url: siteUrl,
    inLanguage: 'vi-VN',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${siteUrl}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
};

export const createOrganizationSchema = (config) => {
  const siteUrl = getSiteUrl();
  const { name, url, logo, description, address = {}, phone, email, sameAs = [] } = config;

  return {
    '@context': 'https://schema.org',
    '@type': 'HomeGoodsStore',
    name: name || SITE_NAME,
    url: url || siteUrl,
    logo: toAbsoluteUrl(logo) || `${siteUrl}/logo.png`,
    image: toAbsoluteUrl(logo) || `${siteUrl}/logo.png`,
    description,
    ...(phone ? { telephone: phone } : {}),
    ...(email ? { email } : {}),
    address: {
      '@type': 'PostalAddress',
      addressLocality: address.city || 'Dĩ An',
      addressRegion: address.region || 'Bình Dương',
      addressCountry: address.country || 'VN',
      ...(address.street ? { streetAddress: address.street } : {}),
    },
    areaServed: ['Bình Dương', 'Thành phố Hồ Chí Minh', 'Thủ Đức'],
    contactPoint: {
      '@type': 'ContactPoint',
      ...(phone ? { telephone: phone } : {}),
      contactType: 'customer service',
      ...(email ? { email } : {}),
      areaServed: 'VN',
      availableLanguage: ['Vietnamese'],
    },
    ...(sameAs.length > 0 ? { sameAs } : {}),
  };
};

export const createWebPageSchema = (config) => {
  const siteUrl = getSiteUrl();
  const { title, description, url, image } = config;

  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: title,
    description,
    url: url || siteUrl,
    inLanguage: 'vi-VN',
    ...(image ? { image: toAbsoluteUrl(image) || image } : {}),
  };
};

function buildOfferSchema(price, inStock, url) {
  const availability = inStock
    ? 'https://schema.org/InStock'
    : 'https://schema.org/OutOfStock';
  const seller = {
    '@type': 'Organization',
    name: 'Tuấn Rèm',
  };

  if (typeof price === 'number' && Number.isFinite(price) && price > 0) {
    return {
      '@type': 'Offer',
      price,
      priceCurrency: 'VND',
      url,
      availability,
      seller,
    };
  }

  if (price && typeof price === 'object') {
    if (price.type === 'range' && Number.isFinite(price.min) && Number.isFinite(price.max)) {
      return {
        '@type': 'AggregateOffer',
        lowPrice: price.min,
        highPrice: price.max,
        priceCurrency: 'VND',
        url,
        availability,
        seller,
      };
    }

    if (price.type === 'discount' && Number.isFinite(price.new) && price.new > 0) {
      return {
        '@type': 'Offer',
        price: price.new,
        priceCurrency: 'VND',
        url,
        availability,
        seller,
      };
    }

    if (price.type === 'fixed' && Number.isFinite(price.value) && price.value > 0) {
      return {
        '@type': 'Offer',
        price: price.value,
        priceCurrency: 'VND',
        url,
        availability,
        seller,
      };
    }
  }

  // Contact-for-price or missing numeric price: omit invalid price field
  return {
    '@type': 'Offer',
    priceCurrency: 'VND',
    url,
    availability,
    seller,
  };
}

export const createProductSchema = ({ name, description, images, price, inStock, url, material }) => {
  const normalizedImages = (Array.isArray(images) ? images : [images])
    .map((img) => toAbsoluteUrl(img))
    .filter(Boolean);

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name,
    description: stripHtmlAndTruncate(description, 300) || name,
    ...(normalizedImages.length > 0 ? { image: normalizedImages } : {}),
    ...(material ? { material } : {}),
    brand: {
      '@type': 'Brand',
      name: 'Tuấn Rèm',
    },
    offers: buildOfferSchema(price, inStock, url),
  };
};

export const createBreadcrumbSchema = (items) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
};

export const createFAQSchema = (questions) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: questions.map((q) => ({
      '@type': 'Question',
      name: q.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: q.answer,
      },
    })),
  };
};

export const createArticleSchema = ({
  title,
  description,
  image,
  url,
  datePublished,
  dateModified,
  author = 'Tuấn Rèm',
  publisher = 'Tuấn Rèm',
  articleBody = '',
}) => {
  const siteUrl = getSiteUrl();
  const absImage = toAbsoluteUrl(image);

  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
    headline: title,
    description: stripHtmlAndTruncate(description, 200) || title,
    ...(absImage ? { image: absImage } : {}),
    ...(datePublished ? { datePublished } : {}),
    ...(dateModified || datePublished ? { dateModified: dateModified || datePublished } : {}),
    ...(articleBody ? { articleBody: stripHtmlAndTruncate(articleBody, 1000) } : {}),
    inLanguage: 'vi-VN',
    author: {
      '@type': 'Organization',
      name: author || 'Tuấn Rèm',
      url: siteUrl,
    },
    publisher: {
      '@type': 'Organization',
      name: publisher || 'Tuấn Rèm',
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}/logo.png`,
      },
    },
  };
};

export const createArticleSchemaShort = ({ title, description, image, url }) => {
  const absImage = toAbsoluteUrl(image);
  return {
    '@type': 'Article',
    headline: title,
    description: stripHtmlAndTruncate(description, 160) || title,
    ...(absImage ? { image: absImage } : {}),
    ...(url ? { url } : {}),
    author: {
      '@type': 'Organization',
      name: 'Tuấn Rèm',
    },
  };
};

export const createAboutPageSchema = ({ title, description }) => {
  const siteUrl = getSiteUrl();
  return {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: title,
    description,
    url: `${siteUrl}/${ROUTES_PATH.ABOUT}`,
    mainEntity: {
      '@type': 'Organization',
      name: 'Tuấn Rèm',
      url: siteUrl,
      logo: `${siteUrl}/logo.png`,
    },
  };
};

export const createContactPageSchema = ({ title, description, phone, email }) => {
  const siteUrl = getSiteUrl();
  return {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: title,
    description,
    url: `${siteUrl}/${ROUTES_PATH.CONTACT}`,
    mainEntity: {
      '@type': 'Organization',
      name: 'Tuấn Rèm',
      url: siteUrl,
      logo: `${siteUrl}/logo.png`,
      contactPoint: {
        '@type': 'ContactPoint',
        ...(phone ? { telephone: phone } : {}),
        ...(email ? { email } : {}),
        contactType: 'customer service',
        areaServed: 'VN',
        availableLanguage: ['Vietnamese'],
      },
    },
  };
};

const StructuredData = ({ data }) => {
  if (!data) return null;
  const json = JSON.stringify(data).replace(/</g, '\\u003c');
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
};

export default StructuredData;
