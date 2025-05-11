/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://curtain-frontend.vercel.app',
  generateRobotsTxt: true,
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/login/', '/register/'],
      },
    ],
    additionalSitemaps: ['https://curtain-frontend.vercel.app/sitemap.xml'],
  },
  exclude: ['/admin/*', '/login', '/register'],
  generateIndexSitemap: true,
  outDir: 'public',
  changefreq: 'weekly',
  priority: 0.7,
  // Set this to true when using next-sitemap and Next.js's built-in sitemap API together
  // to avoid overriding the default sitemap.xml
  // You can customize this path if needed to avoid conflicts
  sitemapBaseFileName: 'sitemap',
};
