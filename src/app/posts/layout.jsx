import { ROUTES_PATH } from '@/utils/constant';
import { buildPageMetadata } from '@/utils/seo';

export const metadata = buildPageMetadata({
  title: 'Tin Tức & Bài Viết',
  description:
    'Cập nhật tin tức, bài viết và chia sẻ kiến thức về rèm cửa, xu hướng thiết kế nội thất và các mẹo trang trí nhà cửa.',
  keywords: 'tin tức rèm cửa, blog rèm cửa, bài viết rèm cửa, mẹo trang trí, xu hướng thiết kế rèm',
  path: `/${ROUTES_PATH.POSTS}`,
});

export default function PostsLayout({ children }) {
  return children;
}
