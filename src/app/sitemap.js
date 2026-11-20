import { ROUTES_PATH } from '@/utils/constant';
import { getInternalApiUrl, getSiteUrl, toAbsoluteUrl } from '@/utils/seo';

const baseUrl = getSiteUrl();
const API_URL = getInternalApiUrl();

const staticRoutes = [
  {
    url: baseUrl,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 1.0,
  },
  {
    url: `${baseUrl}/${ROUTES_PATH.PRODUCTS}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 0.9,
  },
  {
    url: `${baseUrl}/${ROUTES_PATH.CONG_TRINH}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.85,
  },
  {
    url: `${baseUrl}/${ROUTES_PATH.POSTS}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 0.8,
  },
  {
    url: `${baseUrl}/${ROUTES_PATH.ABOUT}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.7,
  },
  {
    url: `${baseUrl}/${ROUTES_PATH.CONTACT}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.6,
  },
];

async function fetchAndMapRoutes(apiUrl, pathPrefix, { changeFrequency, priority, filterFn } = {}) {
  try {
    const response = await fetch(apiUrl, { next: { revalidate: 300 } });
    if (!response.ok) {
      console.error(`Error fetching ${apiUrl}: ${response.status} ${response.statusText}`);
      return [];
    }

    let itemsToMap = await response.json();

    if (
      pathPrefix === ROUTES_PATH.POSTS &&
      itemsToMap &&
      typeof itemsToMap === 'object' &&
      Array.isArray(itemsToMap.posts)
    ) {
      itemsToMap = itemsToMap.posts;
    } else if (!Array.isArray(itemsToMap)) {
      console.error(`Data from ${apiUrl} is not an array:`, itemsToMap);
      return [];
    }

    if (typeof filterFn === 'function') {
      itemsToMap = itemsToMap.filter(filterFn);
    }

    return itemsToMap
      .filter((item) => item && item._id)
      .map((item) => {
        const rawImage = item.mainImage || item.featuredImage || item.thumbnail;
        const absImage = toAbsoluteUrl(rawImage);
        const lastMod = item.updatedAt || item.createdAt;

        return {
          url: `${baseUrl}/${pathPrefix}/${item._id}`,
          lastModified: lastMod ? new Date(lastMod) : new Date(),
          changeFrequency,
          priority,
          ...(absImage ? { images: [absImage] } : {}),
        };
      });
  } catch (error) {
    console.error(`Failed to fetch data from ${apiUrl}:`, error);
    return [];
  }
}

export default async function sitemap() {
  const [productRoutes, postRoutes, projectRoutes] = await Promise.all([
    fetchAndMapRoutes(`${API_URL}/curtains`, ROUTES_PATH.PRODUCTS, {
      changeFrequency: 'weekly',
      priority: 0.8,
    }),
    fetchAndMapRoutes(`${API_URL}/posts?status=published&limit=1000`, ROUTES_PATH.POSTS, {
      changeFrequency: 'monthly',
      priority: 0.7,
      filterFn: (post) => !post.status || post.status === 'published',
    }),
    fetchAndMapRoutes(`${API_URL}/projects`, ROUTES_PATH.CONG_TRINH, {
      changeFrequency: 'monthly',
      priority: 0.75,
      filterFn: (project) => project.published !== false,
    }),
  ]);

  return [...staticRoutes, ...productRoutes, ...postRoutes, ...projectRoutes];
}
