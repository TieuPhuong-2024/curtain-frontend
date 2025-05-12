export async function generateMetadata() {
  return {
    title: 'Bài Viết - Tuấn Rèm',
    description:
      'Khám phá các bài viết hữu ích về trang trí nội thất, thiết kế rèm cửa và mẹo chăm sóc, bảo quản các sản phẩm rèm cửa cao cấp.',
    keywords:
      'bài viết rèm cửa, hướng dẫn chọn rèm, trang trí nội thất, thiết kế rèm cửa, mẹo chăm sóc rèm, blog rèm cửa',
    openGraph: {
      title: 'Bài Viết Về Rèm Cửa & Trang Trí Nội Thất - Tuấn Rèm',
      description:
        'Khám phá các bài viết hữu ích về trang trí nội thất, thiết kế rèm cửa và mẹo chăm sóc, bảo quản các sản phẩm rèm cửa cao cấp.',
      url: 'http://localhost:3000/posts',
      siteName: 'Tuấn Rèm',
      images: [
        {
          url: '/images/logo.png',
          width: 800,
          height: 600,
          alt: 'Bài Viết - Tuấn Rèm',
        },
      ],
      type: 'website',
    },
    alternates: {
      canonical: 'http://localhost:3000/posts',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Bài Viết Về Rèm Cửa & Trang Trí Nội Thất - Tuấn Rèm',
      description:
        'Khám phá các bài viết hữu ích về trang trí nội thất, thiết kế rèm cửa và mẹo chăm sóc rèm.',
      images: ['/images/logo.png'],
    },
  };
}
