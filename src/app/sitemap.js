export default async function sitemap() {
  const baseUrl = 'https://tuanrem.com';

  // Define your main routes
  const routes = [
    '',
    '/products',
    '/about',
    '/contact',
    '/cong-trinh',
    '/posts',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'weekly',
    priority: route === '' ? 1 : 0.8,
  }));

  // Fetch dynamic routes - this would be ideal to implement in production
  // Example for fetching products:
  // const products = await fetch('https://tuanrem.com/api/products').then((res) => res.json());
  // const productRoutes = products.map((product) => ({
  //   url: `${baseUrl}/products/${product._id}`,
  //   lastModified: new Date(product.updatedAt || product.createdAt).toISOString(),
  //   changeFrequency: 'monthly',
  //   priority: 0.6,
  // }));

  // Example for fetching posts:
  // const posts = await fetch('https://tuanrem.com/api/posts').then((res) => res.json());
  // const postRoutes = posts.map((post) => ({
  //   url: `${baseUrl}/posts/${post._id}`,
  //   lastModified: new Date(post.updatedAt || post.createdAt).toISOString(),
  //   changeFrequency: 'monthly',
  //   priority: 0.6,
  // }));

  // Example for fetching projects:
  // const projects = await fetch('https://tuanrem.com/api/projects').then((res) => res.json());
  // const projectRoutes = projects.map((project) => ({
  //   url: `${baseUrl}/cong-trinh/${project._id}`,
  //   lastModified: new Date(project.updatedAt || project.createdAt).toISOString(),
  //   changeFrequency: 'monthly',
  //   priority: 0.7,
  // }));

  return [
    ...routes,
    // In production, uncomment these lines and ensure the API endpoints work:
    // ...productRoutes,
    // ...postRoutes,
    // ...projectRoutes,
  ];
}
