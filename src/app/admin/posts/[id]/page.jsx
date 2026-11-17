'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';

import { getPostById, updatePost } from '@/lib/api';
import PostForm from '@/components/admin/PostForm';
import PageHeader from '@/components/admin/PageHeader';
import Panel from '@/components/admin/Panel';
import Button, { buttonClasses } from '@/components/admin/Button';
import { notify } from '@/components/admin/notify';

export default function EditPost() {
  const router = useRouter();
  const params = useParams();
  const postId = params?.id;
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadPost = async () => {
    if (!postId) return;
    setLoading(true);
    setError('');
    try {
      const data = await getPostById(postId, { recordView: false });
      setPost(data);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Không tải được bài viết.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPost();
  }, [postId]);

  const handleSubmit = async (payload) => {
    await updatePost(postId, payload);
    notify.success('Đã cập nhật bài viết.');
    router.push('/admin/posts');
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Sửa bài viết" description="Đang mở nội dung bài viết…" />
        <Panel>
          <div className="flex items-center gap-3 p-6 text-sm text-[var(--a-muted)]">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-[var(--a-line-strong)] border-t-[var(--a-cham)]" />
            Đang tải dữ liệu…
          </div>
        </Panel>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="space-y-6">
        <PageHeader title="Sửa bài viết" description="Không mở được nội dung bài viết." />
        <Panel className="border-[rgba(156,59,54,0.25)]">
          <div className="flex flex-col items-start gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-[var(--a-danger)]">
              {error || 'Không tìm thấy bài viết này.'}
            </p>
            <div className="flex gap-2">
              <Button size="sm" onClick={loadPost}>
                Thử lại
              </Button>
              <Link href="/admin/posts" className={buttonClasses('secondary', 'sm')}>
                Quay lại
              </Link>
            </div>
          </div>
        </Panel>
      </div>
    );
  }

  return (
    <PostForm
      initial={post}
      heading="Sửa bài viết"
      description="Cập nhật nội dung, ảnh và trạng thái xuất bản của bài."
      submitLabel="Lưu thay đổi"
      onSubmit={handleSubmit}
    />
  );
}
