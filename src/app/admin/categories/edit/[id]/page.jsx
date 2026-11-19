'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';

import { getCategories, updateCategory } from '@/lib/api';
import CategoryForm from '@/components/admin/CategoryForm';
import PageHeader from '@/components/admin/PageHeader';
import Panel from '@/components/admin/Panel';
import { buttonClasses } from '@/components/admin/Button';

export default function EditCategoryPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id;
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    getCategories()
      .then((data) => {
        const found = data.find((item) => item._id === id);
        if (found) setCategory(found);
        else setError('Không tìm thấy danh mục này.');
      })
      .catch((err) => setError(err.message || 'Không tải được danh mục.'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = async (payload) => {
    await updateCategory(id, payload);
    router.push('/admin/categories');
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Sửa danh mục" description="Đang mở hồ sơ danh mục…" />
        <Panel>
          <div className="flex items-center gap-3 p-6 text-sm text-[var(--a-muted)]">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-[var(--a-line-strong)] border-t-[var(--a-cham)]" />
            Đang tải dữ liệu…
          </div>
        </Panel>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <PageHeader title="Sửa danh mục" description="Không mở được hồ sơ danh mục." />
        <Panel className="border-[rgba(156,59,54,0.25)]">
          <div className="flex flex-col items-start gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-[var(--a-danger)]">{error}</p>
            <Link href="/admin/categories" className={buttonClasses('secondary', 'sm')}>
              Quay lại danh mục
            </Link>
          </div>
        </Panel>
      </div>
    );
  }

  return (
    <CategoryForm
      initial={category}
      heading="Sửa danh mục"
      description="Cập nhật tên, mô tả và ảnh đại diện. Thay đổi sẽ hiển thị ngay trên trang công khai."
      submitLabel="Lưu thay đổi"
      onSubmit={handleSubmit}
    />
  );
}
