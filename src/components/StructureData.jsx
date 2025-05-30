import { ROUTES_PATH } from '@/utils/constant';
import Script from 'next/script';

export const defaultSchema = ({
  title,
  description,
  url,
  type = 'WebSite',
  offers,
  image,
  ...restProps
}) => {
  return {
    '@context': 'https://schema.org',
    '@type': type,
    name: title,
    description: description,
    url: url,
    ...restProps,
  };
};

export const createOrganizationSchema = config => {
  const { name, url, logo, description, address, phone, email, sameAs = [] } = config;

  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: name,
    url: url,
    logo: logo,
    description: description,
    address: {
      '@type': 'PostalAddress',
      addressLocality: address.city,
      addressRegion: address.region,
      addressCountry: address.country,
      streetAddress: address.street,
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: phone,
      contactType: 'customer service',
      email: email,
    },
    sameAs: sameAs,
  };
};

export const createWebPageSchema = config => {
  const { title, description, url, image } = config;

  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: title,
    description: description,
    url: url,
    image: image,
  };
};

export const createProductSchema = ({ name, description, images, price, inStock, url }) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: name,
    description: description,
    image: images,
    brand: {
      '@type': 'Brand',
      name: 'Tuấn Rèm',
    },
    offers: {
      '@type': 'Offer',
      price: price,
      priceCurrency: 'VND',
      url,
      availability: inStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      seller: {
        '@type': 'Organization',
        name: 'Tuấn Rèm',
      },
    },
  };
};

export const createBreadcrumbSchema = items => {
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

export const createFAQSchema = questions => {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: questions.map(q => ({
      '@type': 'Question',
      name: q.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: q.answer,
      },
    })),
  };
};

export const createArticleSchema = (
  { title,
    description,
    image,
    url,
    datePublished,
    dateModified,
    author = 'Tuấn Rèm',
    publisher = 'Tuấn Rèm',
    articleBody = ''
  }) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
    headline: title,
    description: description,
    image: image,
    datePublished: datePublished,
    dateModified: dateModified || datePublished,
    articleBody: articleBody,
    author: {
      '@type': 'Organization',
      name: author || 'Tuấn Rèm',
    },
    publisher: {
      '@type': 'Organization',
      name: publisher || 'Tuấn Rèm',
      logo: {
        '@type': 'ImageObject',
        url: `${process.env.NEXT_PUBLIC_URL}/logo.png`,
      },
    },
  };
};

export const createArticleSchemaShort = ({ title, description, image, url }) => ({
  '@type': 'Article',
  headline: title,
  description: description,
  image: image,
  author: {
    '@type': 'Organization',
    name: 'Tuấn Rèm',
  },
});

export const createAboutPageSchema = ({ title, description }) => ({
  '@context': 'https://schema.org',
  '@type': 'AboutPage',
  name: title,
  description: description,
  url: `${process.env.NEXT_PUBLIC_URL}/${ROUTES_PATH.ABOUT}`,
  mainEntity: {
    '@type': 'Organization',
    name: 'Tuấn Rèm',
    url: process.env.NEXT_PUBLIC_URL,
    logo: `${process.env.NEXT_PUBLIC_URL}/logo.png`,
  },
});

export const createContactPageSchema = ({ title, description, url, phone, email }) => ({
  '@context': 'https://schema.org',
  '@type': 'ContactPage',
  name: title,
  description: description,
  url: `${process.env.NEXT_PUBLIC_URL}/${ROUTES_PATH.CONTACT}`,
  mainEntity: {
    '@type': 'Organization',
    name: 'Tuấn Rèm',
    url: process.env.NEXT_PUBLIC_URL,
    logo: `${process.env.NEXT_PUBLIC_URL}/logo.png`,
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: phone,
      email: email,
      contactType: 'customer service',
      areaServed: 'VN',
      availableLanguage: ['Vietnamese'],
    },
  },
});

const StructuredData = ({ data }) => {
  return (
    <Script
      id="structured-data"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
      strategy="afterInteractive"
    />
  );
};

export default StructuredData;
