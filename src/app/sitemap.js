import { ROUTES_PATH } from "@/utils/constant"

export default async function sitemap() {
    const staticRoutes = [
        {
            url: `${process.env.NEXT_PUBLIC_URL}`,
            lastModified: new Date(),
            changeFrequency: 'yearly',
            priority: 1,
        },
        {
            url: `${process.env.NEXT_PUBLIC_URL}${ROUTES_PATH.ABOUT}`,
            lastModified: new Date(),
            changeFrequency: 'yearly',
            priority: 0.8,
        },
        {
            url: `${process.env.NEXT_PUBLIC_URL}${ROUTES_PATH.CONG_TRINH}`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
        },
        {
            url: `${process.env.NEXT_PUBLIC_URL}${ROUTES_PATH.CONTACT}`,
            lastModified: new Date(),
            changeFrequency: 'yearly',
            priority: 0.5,
        },
        {
            url: `${process.env.NEXT_PUBLIC_URL}${ROUTES_PATH.POSTS}`,
            lastModified: new Date(),
            changeFrequency: 'yearly',
            priority: 0.5,
        },
        {
            url: `${process.env.NEXT_PUBLIC_URL}${ROUTES_PATH.PRODUCTS}`,
            lastModified: new Date(),
            changeFrequency: 'yearly',
            priority: 0.5,
        }
    ]

    return [...staticRoutes]
}
