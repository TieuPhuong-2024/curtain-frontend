'use client';

import { useRouter } from 'next/navigation';

import { createProject } from '@/lib/api';
import ProjectForm from '@/components/admin/ProjectForm';
import { notify } from '@/components/admin/notify';

export default function AddProject() {
  const router = useRouter();

  const handleSubmit = async (payload) => {
    await createProject(payload);
    notify.success('Đã thêm công trình.');
    router.push('/admin/projects');
  };

  return (
    <ProjectForm
      heading="Thêm công trình"
      description="Ghi lại một công trình vừa hoàn thiện. Ảnh và mô tả càng cụ thể, khách càng dễ tin."
      submitLabel="Lưu công trình"
      onSubmit={handleSubmit}
    />
  );
}
