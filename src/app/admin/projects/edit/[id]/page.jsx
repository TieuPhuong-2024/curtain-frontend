'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';

import { getProjectById, updateProject } from '@/lib/api';
import ProjectForm from '@/components/admin/ProjectForm';
import PageHeader from '@/components/admin/PageHeader';
import Panel from '@/components/admin/Panel';
import Button, { buttonClasses } from '@/components/admin/Button';
import { notify } from '@/components/admin/notify';

export default function EditProject() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id;
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadProject = async () => {
    if (!id) return;
    setLoading(true);
    setError('');
    try {
      const data = await getProjectById(id);
      setProject({
        title: data.title || '',
        location: data.location || '',
        type: data.type || '',
        shortDescription: data.shortDescription || data.description || '',
        thumbnail:
          data.thumbnail || (data.images?.length > 0 ? data.images[0] : ''),
        detailedContent: data.detailedContent || data.description || '',
        featured: data.featured === true,
        published: typeof data.published === 'boolean' ? data.published : true,
      });
    } catch (err) {
      console.error('Error fetching project:', err);
      setError('Không tải được dữ liệu công trình.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProject();
  }, [id]);

  const handleSubmit = async (payload) => {
    await updateProject(id, payload);
    notify.success('Đã cập nhật công trình.');
    router.push('/admin/projects');
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Sửa công trình" description="Đang mở hồ sơ công trình…" />
        <Panel>
          <div className="flex items-center gap-3 p-6 text-sm text-[var(--a-muted)]">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-[var(--a-line-strong)] border-t-[var(--a-cham)]" />
            Đang tải dữ liệu…
          </div>
        </Panel>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="space-y-6">
        <PageHeader title="Sửa công trình" description="Không mở được hồ sơ công trình." />
        <Panel className="border-[rgba(156,59,54,0.25)]">
          <div className="flex flex-col items-start gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-[var(--a-danger)]">
              {error || 'Không tìm thấy công trình này.'}
            </p>
            <div className="flex gap-2">
              <Button size="sm" onClick={loadProject}>
                Thử lại
              </Button>
              <Link href="/admin/projects" className={buttonClasses('secondary', 'sm')}>
                Quay lại
              </Link>
            </div>
          </div>
        </Panel>
      </div>
    );
  }

  return (
    <ProjectForm
      initial={project}
      heading="Sửa công trình"
      description="Cập nhật thông tin, ảnh và trạng thái hiển thị của công trình."
      submitLabel="Lưu thay đổi"
      onSubmit={handleSubmit}
    />
  );
}
