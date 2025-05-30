export const metadata = {
  title: 'Tin Tức & Bài Viết',
  description:
    'Cập nhật tin tức, bài viết và chia sẻ kiến thức về rèm cửa, xu hướng thiết kế nội thất và các mẹo trang trí nhà cửa',
  keywords: 'tin tức rèm cửa, blog rèm cửa, bài viết rèm cửa, mẹo trang trí, xu hướng thiết kế',
  url: `${process.env.NEXT_PUBLIC_URL}/posts`,

  openGraph: {
    title: 'Tin Tức & Bài Viết - Tuấn Rèm',
    description:
      'Cập nhật tin tức, bài viết và chia sẻ kiến thức về rèm cửa, xu hướng thiết kế nội thất và các mẹo trang trí nhà cửa',
    type: 'website',
    url: `${process.env.NEXT_PUBLIC_URL}/posts`,
  },
};

export default function PostsLayout({ children }) {
  return children;
}
