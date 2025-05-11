export default async function sitemap() {
  // Use different URLs for the frontend sitemap and backend data fetching
  const frontendUrl = 'https://curtain-frontend.vercel.app';
  const backendUrl = 'https://curtain-backend.onrender.com';

  // Define your main routes
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
    changeFrequency: 'weekly',
    priority: route === '' ? 1 : 0.8,
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
      changeFrequency: 'monthly',
      priority: 0.6,
    }));
  } catch (error) {
    console.error('Error fetching products for sitemap:', error);
  }

  // Fetch bài viết
  let postRoutes = [];
  try {
    const postsRes = await fetch(`${backendUrl}/api/posts`);
    const posts = await postsRes.json();

    // Check if posts is an array before mapping
    if (Array.isArray(posts)) {
      postRoutes = posts.map((post) => ({
        url: `${frontendUrl}/posts/${post._id}`,
        lastModified: new Date(
          post.updatedAt || post.createdAt || new Date()
        ).toISOString(),
        changeFrequency: 'monthly',
        priority: 0.6,
      }));
    } else {
      console.error('Posts data is not an array:', posts);
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
      changeFrequency: 'monthly',
      priority: 0.7,
    }));
  } catch (error) {
    console.error('Error fetching projects for sitemap:', error);
  }

  return [...routes, ...productRoutes, ...postRoutes, ...projectRoutes];
}
