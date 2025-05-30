export default function robots() {
    const baseUrl = process.env.NEXT_PUBLIC_URL || 'https://remcuathuduc.shop'

    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: '/admin/',
        },
        sitemap: [
            `${baseUrl}/sitemap_index.xml`,
        ],
    }
}