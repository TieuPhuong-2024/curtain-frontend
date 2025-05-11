export async function generateMetadata() {
  return {
    title: 'Sản Phẩm Rèm Cửa - Tuấn Rèm',
    description:
      'Khám phá bộ sưu tập rèm cửa cao cấp tại Tuấn Rèm với đa dạng mẫu mã, chất liệu và màu sắc phù hợp cho mọi không gian sống và làm việc.',
    keywords:
      'rèm cửa, sản phẩm rèm, rèm cửa cao cấp, rèm cửa sổ, rèm phòng khách, rèm phòng ngủ, rèm văn phòng',
    openGraph: {
      title: 'Sản Phẩm Rèm Cửa Cao Cấp - Tuấn Rèm',
      description:
        'Bộ sưu tập rèm cửa cao cấp đa dạng mẫu mã, chất liệu và màu sắc phù hợp cho mọi không gian.',
      url: 'https://tuanrem.com/products',
      siteName: 'Tuấn Rèm',
      images: [
        {
          url: '/images/logo.png',
          width: 800,
          height: 600,
          alt: 'Sản Phẩm Rèm Cửa - Tuấn Rèm',
        },
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Sản Phẩm Rèm Cửa - Tuấn Rèm',
      description:
        'Khám phá bộ sưu tập rèm cửa cao cấp tại Tuấn Rèm với đa dạng mẫu mã, chất liệu và màu sắc.',
      images: ['/images/logo.png'],
    },
  };
}
