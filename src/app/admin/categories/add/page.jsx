'use client';

import { useRouter } from 'next/navigation';

import { createCategory } from '@/lib/api';
import CategoryForm from '@/components/admin/CategoryForm';

export default function AddCategoryPage() {
  const router = useRouter();

  const handleSubmit = async (payload) => {
    await createCategory(payload);
    router.push('/admin/categories');
  };

  return (
    <CategoryForm
      heading="Thêm danh mục"
      description="Tạo một nhóm sản phẩm mới trong sổ xưởng. Tên danh mục nên ngắn và dễ tìm."
      submitLabel="Lưu danh mục"
      onSubmit={handleSubmit}
    />
  );
}
