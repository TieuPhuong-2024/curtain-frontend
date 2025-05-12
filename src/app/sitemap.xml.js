export async function GET() {
  const frontendUrl = 'http://localhost:3000'; // Đã đổi sang domain thật
  const backendUrl = 'https://curtain-backend.onrender.com';

  // Main routes
  const routes = [
    '',
    '/products',
    '/about',
    '/contact',
    '/cong-trinh',
    '/posts',
  ].map((route) => ({
    url: `${frontendUrl}${route}`,
    lastModified: new Date().toISOString(),
  }));

  // Fetch sản phẩm
  let productRoutes = [];
  try {
    const productsRes = await fetch(`${backendUrl}/api/curtains`);
    const products = await productsRes.json();
    productRoutes = products.map((product) => ({
      url: `${frontendUrl}/products/${product._id}`,
      lastModified: new Date(
        product.updatedAt || product.createdAt || new Date()
      ).toISOString(),
    }));
  } catch (error) {
    console.error('Error fetching products for sitemap:', error);
  }

  // Fetch bài viết
  let postRoutes = [];
  try {
    const postsRes = await fetch(`${backendUrl}/api/posts`);
    const posts = await postsRes.json();
    if (Array.isArray(posts)) {
      postRoutes = posts.map((post) => ({
        url: `${frontendUrl}/posts/${post._id}`,
        lastModified: new Date(
          post.updatedAt || post.createdAt || new Date()
        ).toISOString(),
      }));
    }
  } catch (error) {
    console.error('Error fetching posts for sitemap:', error);
  }

  // Fetch dự án (công trình)
  let projectRoutes = [];
  try {
    const projectsRes = await fetch(`${backendUrl}/api/projects`);
    const projects = await projectsRes.json();
    projectRoutes = projects.map((project) => ({
      url: `${frontendUrl}/cong-trinh/${project._id}`,
      lastModified: new Date(
        project.updatedAt || project.createdAt || new Date()
      ).toISOString(),
    }));
  } catch (error) {
    console.error('Error fetching projects for sitemap:', error);
  }

  const allRoutes = [
    ...routes,
    ...productRoutes,
    ...postRoutes,
    ...projectRoutes,
  ];

  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${allRoutes
    .map(
      (route) =>
        `  <url>\n    <loc>${route.url}</loc>\n    <lastmod>${route.lastModified}</lastmod>\n  </url>`
    )
    .join('\n')}\n</urlset>`;

  return new Response(body, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}
