import { ROUTES_PATH } from "@/utils/constant"
const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
const backendUrl = 'https://curtain-backend.onrender.com' || 'https://curtain-backend.onrender.com';

const staticRoutes = [
    {
        url: `${process.env.NEXT_PUBLIC_URL}`,
        lastModified: new Date(),
        changeFrequency: 'yearly',
        priority: 1,
    },
    {
        url: `${process.env.NEXT_PUBLIC_URL}/${ROUTES_PATH.ABOUT}`,
        lastModified: new Date(),
        changeFrequency: 'yearly',
        priority: 0.8,
    },
    {
        url: `${process.env.NEXT_PUBLIC_URL}/${ROUTES_PATH.CONG_TRINH}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
    },
    {
        url: `${process.env.NEXT_PUBLIC_URL}/${ROUTES_PATH.CONTACT}`,
        lastModified: new Date(),
        changeFrequency: 'yearly',
        priority: 0.5,
    },
    {
        url: `${process.env.NEXT_PUBLIC_URL}/${ROUTES_PATH.POSTS}`,
        lastModified: new Date(),
        changeFrequency: 'yearly',
        priority: 0.5,
    },
    {
        url: `${process.env.NEXT_PUBLIC_URL}/${ROUTES_PATH.PRODUCTS}`,
        lastModified: new Date(),
        changeFrequency: 'yearly',
        priority: 0.5,
    }
]

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
            images: [item.mainImage || item.featuredImage || item.thumbnail]
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

    return [...staticRoutes, ...productRoutes, ...postRoutes, ...projectRoutes];
}
