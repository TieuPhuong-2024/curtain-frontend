'use client';

import { useRouter } from 'next/navigation';

import { createCurtain } from '@/lib/api';
import CurtainForm from '@/components/admin/CurtainForm';
import { notify } from '@/components/admin/notify';

export default function AddCurtain() {
  const router = useRouter();

  const handleSubmit = async (payload) => {
    await createCurtain(payload);
    notify.success('Đã thêm sản phẩm.');
    router.push('/admin/curtains');
  };

  return (
    <CurtainForm
      mode="add"
      heading="Thêm sản phẩm"
      description="Ghi một mẫu rèm mới vào sổ: tên, giá, màu và ảnh thực tế."
      submitLabel="Lưu sản phẩm"
      onSubmit={handleSubmit}
    />
  );
}
