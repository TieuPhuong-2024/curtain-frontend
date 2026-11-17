'use client';

import { useRouter } from 'next/navigation';

import { createPost } from '@/lib/api';
import PostForm from '@/components/admin/PostForm';
import { notify } from '@/components/admin/notify';

export default function NewPost() {
  const router = useRouter();

  const handleSubmit = async (payload) => {
    await createPost(payload);
    notify.success('Đã tạo bài viết.');
    router.push('/admin/posts');
  };

  return (
    <PostForm
      heading="Viết bài mới"
      description="Bài viết mới bắt đầu ở dạng bản nháp. Chỉ xuất bản khi nội dung và ảnh đã ổn."
      submitLabel="Lưu bài viết"
      onSubmit={handleSubmit}
    />
  );
}
