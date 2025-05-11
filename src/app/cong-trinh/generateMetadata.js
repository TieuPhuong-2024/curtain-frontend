export async function generateMetadata() {
  return {
    title: 'Công Trình Đã Thực Hiện - Tuấn Rèm',
    description:
      'Khám phá các công trình trang trí rèm cửa đã hoàn thành của Tuấn Rèm. Bộ sưu tập các dự án thiết kế và lắp đặt rèm cửa cho nhà ở, văn phòng, khách sạn và các không gian thương mại.',
    keywords:
      'công trình rèm cửa, dự án hoàn thành, thiết kế rèm cửa, thi công rèm, lắp đặt rèm cửa, portfolio rèm cửa',
    openGraph: {
      title: 'Công Trình Đã Thực Hiện - Tuấn Rèm',
      description:
        'Bộ sưu tập các dự án thiết kế và lắp đặt rèm cửa cao cấp cho nhà ở, văn phòng và không gian thương mại.',
      url: 'https://curtain-frontend.vercel.app/cong-trinh',
      siteName: 'Tuấn Rèm',
      images: [
        {
          url: '/images/logo.png',
          width: 800,
          height: 600,
          alt: 'Công Trình Đã Thực Hiện - Tuấn Rèm',
        },
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Công Trình Đã Thực Hiện - Tuấn Rèm',
      description:
        'Khám phá các công trình trang trí rèm cửa đã hoàn thành của Tuấn Rèm.',
      images: ['/images/logo.png'],
    },
  };
}
