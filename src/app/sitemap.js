const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
const backendUrl =
  process.env.BACKEND_URL || 'https://curtain-backend.onrender.com';

async function fetchAndMapRoutes(apiUrl, pathPrefix) {
  try {
    const response = await fetch(apiUrl, { next: { revalidate: 60 } }); // Revalidate every 60 seconds
    if (!response.ok) {
      console.error(
        `Error fetching ${apiUrl}: ${response.status} ${response.statusText}`
      );
      return [];
    }
    let itemsToMap = await response.json();

    // Handle specific structure for posts API
    if (
      pathPrefix === 'posts' &&
      itemsToMap &&
      typeof itemsToMap === 'object' &&
      itemsToMap.hasOwnProperty('posts')
    ) {
      if (!Array.isArray(itemsToMap.posts)) {
        console.error(
          `Data.posts from ${apiUrl} is not an array:`,
          itemsToMap.posts
        );
        return [];
      }
      itemsToMap = itemsToMap.posts; // Use the actual array of posts
    } else if (!Array.isArray(itemsToMap)) {
      // Original check for other routes if not the posts structure
      console.error(`Data from ${apiUrl} is not an array:`, itemsToMap);
      return [];
    }

    return itemsToMap.map((item) => ({
      url: `${frontendUrl}/${pathPrefix}/${item._id}`,
      lastModified: item.updatedAt || item.createdAt || new Date(),
    }));
  } catch (error) {
    console.error(`Failed to fetch data from ${apiUrl}:`, error);
    return [];
  }
}

export default async function sitemap() {
  const productRoutes = await fetchAndMapRoutes(
    `${backendUrl}/api/curtains`,
    'products'
  );
  const postRoutes = await fetchAndMapRoutes(
    `${backendUrl}/api/posts`,
    'posts'
  );
  const projectRoutes = await fetchAndMapRoutes(
    `${backendUrl}/api/projects`,
    'cong-trinh'
  );

  const staticRoutes = [
    {
      url: frontendUrl,
      lastModified: new Date(),
    },
    {
      url: `${frontendUrl}/about`,
      lastModified: new Date(),
    },
    {
      url: `${frontendUrl}/products`,
      lastModified: new Date(),
    },
    {
      url: `${frontendUrl}/cong-trinh`,
      lastModified: new Date(),
    },
    {
      url: `${frontendUrl}/posts`,
      lastModified: new Date(),
    },
    {
      url: `${frontendUrl}/contact`,
      lastModified: new Date(),
    },
  ];

  return [...staticRoutes, ...productRoutes, ...postRoutes, ...projectRoutes];
}
