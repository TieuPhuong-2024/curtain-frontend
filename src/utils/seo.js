import { SITE_NAME } from '@/utils/constant';

const DEFAULT_SITE_URL = 'http://localhost:3000';

export function getSiteUrl() {
  const raw = process.env.NEXT_PUBLIC_URL || DEFAULT_SITE_URL;
  return raw.replace(/\/+$/, '');
}

export function getInternalApiUrl() {
  return process.env.API_URL_INTERNAL
    ? `${process.env.API_URL_INTERNAL.replace(/\/+$/, '')}/api`
    : 'http://localhost:5000/api';
}

export function toAbsoluteUrl(url) {
  if (!url || typeof url !== 'string') return null;
  const trimmed = url.trim();
  if (!trimmed) return null;
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  if (trimmed.startsWith('/')) return `${getSiteUrl()}${trimmed}`;
  return `${getSiteUrl()}/${trimmed}`;
}

export function getDefaultOgImage(alt = SITE_NAME) {
  return {
    url: `${getSiteUrl()}/logo.png`,
    width: 1200,
    height: 630,
    alt,
  };
}

export function stripHtmlAndTruncate(input, maxLength = 160) {
  if (!input || typeof input !== 'string') return '';
  const cleaned = input
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\s+/g, ' ')
    .trim();

  if (cleaned.length <= maxLength) return cleaned;
  return `${cleaned.slice(0, maxLength - 1).trimEnd()}…`;
}

export function extractTextFromPostContent(content) {
  if (!content) return '';
  if (typeof content === 'string') return content;
  if (typeof content === 'object') {
    if (typeof content.html === 'string') return content.html;
    if (Array.isArray(content.blocks)) {
      return content.blocks
        .map((block) => block?.data?.text || '')
        .filter(Boolean)
        .join(' ');
    }
  }
  return '';
}

export function buildPageMetadata({
  title,
  description,
  keywords,
  path = '/',
  type = 'website',
  images,
  openGraphExtra = {},
}) {
  const siteUrl = getSiteUrl();
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const canonicalUrl = normalizedPath === '/' ? siteUrl : `${siteUrl}${normalizedPath}`;
  const ogImages =
    Array.isArray(images) && images.length > 0
      ? images
      : [getDefaultOgImage(title || SITE_NAME)];

  const twitterImages = ogImages.map((img) => (typeof img === 'string' ? img : img.url)).filter(Boolean);

  return {
    title,
    description,
    ...(keywords ? { keywords } : {}),
    alternates: {
      canonical: normalizedPath,
    },
    openGraph: {
      title: title ? `${title} | ${SITE_NAME}` : SITE_NAME,
      description,
      type,
      locale: 'vi_VN',
      siteName: SITE_NAME,
      url: canonicalUrl,
      images: ogImages,
      ...openGraphExtra,
    },
    twitter: {
      card: 'summary_large_image',
      title: title ? `${title} | ${SITE_NAME}` : SITE_NAME,
      description,
      images: twitterImages,
    },
  };
}
