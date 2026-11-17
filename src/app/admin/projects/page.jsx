'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FaEye, FaPen, FaPlus, FaTrash, FaBuilding } from 'react-icons/fa';

import { getProjects, deleteProject } from '@/lib/api';
import PageHeader from '@/components/admin/PageHeader';
import Panel from '@/components/admin/Panel';
import Toolbar from '@/components/admin/Toolbar';
import LedgerTable from '@/components/admin/LedgerTable';
import Pagination from '@/components/admin/Pagination';
import Button, { buttonClasses } from '@/components/admin/Button';
import Badge from '@/components/admin/Badge';
import Thumb from '@/components/admin/Thumb';
import ConfirmDialog from '@/components/admin/ConfirmDialog';
import EmptyState from '@/components/admin/EmptyState';
import { formatDate, formatNumber } from '@/components/admin/format';
import { notify } from '@/components/admin/notify';

const PAGE_SIZE = 10;

export default function AdminProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getProjects();
      setProjects(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching projects:', err);
      setError('Không tải được danh sách công trình. Kiểm tra kết nối rồi thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      setDeleting(true);
      await deleteProject(deleteTarget._id);
      notify.success('Đã xóa công trình.');
      setDeleteTarget(null);
      await fetchProjects();
    } catch (err) {
      console.error('Error deleting project:', err);
      notify.error('Không xóa được công trình. Vui lòng thử lại.');
    } finally {
      setDeleting(false);
    }
  };

  const keyword = searchTerm.trim().toLowerCase();
  const filteredProjects = projects.filter((project) => {
    if (!keyword) return true;
    return [project.title, project.shortDescription, project.location, project.type].some((value) =>
      value?.toLowerCase().includes(keyword)
    );
  });

  const totalPages = Math.ceil(filteredProjects.length / PAGE_SIZE);
  const paginatedProjects = filteredProjects.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  useEffect(() => {
    if (totalPages > 0 && currentPage > totalPages) setCurrentPage(totalPages);
  }, [totalPages, currentPage]);

  const columns = [
    {
      key: 'title',
      label: 'Công trình',
      primary: true,
      render: (project) => (
        <div className="flex min-w-0 items-center gap-3">
          <Thumb src={project.thumbnail} alt={project.title} className="h-11 w-16 shrink-0" />
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <p className="truncate font-medium text-[var(--a-ink)]">{project.title}</p>
              {project.featured && <Badge tone="brass">Nổi bật</Badge>}
            </div>
            <p className="mt-0.5 line-clamp-1 text-[12px] text-[var(--a-faint)]">
              {project.shortDescription || 'Chưa có mô tả ngắn'}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: 'location',
      label: 'Địa điểm',
      render: (project) => (
        <span className="text-[var(--a-muted)]">{project.location || 'Chưa ghi'}</span>
      ),
    },
    {
      key: 'type',
      label: 'Loại',
      render: (project) =>
        project.type ? <Badge tone="cham">{project.type}</Badge> : <span className="text-[var(--a-faint)]">—</span>,
    },
    {
      key: 'createdAt',
      label: 'Ngày tạo',
      render: (project) => (
        <span className="whitespace-nowrap tabular-nums text-[var(--a-muted)]">
          {formatDate(project.createdAt)}
        </span>
      ),
    },
    {
      key: 'actions',
      label: '',
      actions: true,
      align: 'right',
      width: '132px',
      render: (project) => (
        <div className="flex items-center justify-end gap-1">
          <Link
            href={`/cong-trinh/${project._id}`}
            target="_blank"
            rel="noreferrer"
            className="flex h-8 w-8 items-center justify-center rounded-[6px] text-[var(--a-muted)] transition hover:bg-[var(--a-raised)] hover:text-[var(--a-cham)]"
            aria-label={`Xem công trình ${project.title}`}
            title="Xem trên site"
          >
            <FaEye className="h-3.5 w-3.5" />
          </Link>
          <Link
            href={`/admin/projects/edit/${project._id}`}
            className="flex h-8 w-8 items-center justify-center rounded-[6px] text-[var(--a-muted)] transition hover:bg-[var(--a-raised)] hover:text-[var(--a-cham)]"
            aria-label={`Sửa ${project.title}`}
            title="Sửa công trình"
          >
            <FaPen className="h-3.5 w-3.5" />
          </Link>
          <button
            type="button"
            onClick={() => setDeleteTarget(project)}
            className="flex h-8 w-8 items-center justify-center rounded-[6px] text-[var(--a-muted)] transition hover:bg-[var(--a-danger-soft)] hover:text-[var(--a-danger)]"
            aria-label={`Xóa ${project.title}`}
            title="Xóa công trình"
          >
            <FaTrash className="h-3.5 w-3.5" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Công trình"
        description="Hồ sơ những công trình đã thi công, dùng làm bằng chứng tay nghề trên trang chủ."
        meta={`${formatNumber(filteredProjects.length)}${
          filteredProjects.length !== projects.length ? ` / ${formatNumber(projects.length)}` : ''
        } công trình`}
        actions={
          <Link href="/admin/projects/add" className={buttonClasses('primary', 'md')}>
            <FaPlus className="h-3.5 w-3.5" />
            Thêm công trình
          </Link>
        }
      />

      {error ? (
        <Panel className="border-[rgba(156,59,54,0.25)]">
          <div className="flex flex-col items-start gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-[var(--a-danger)]">{error}</p>
            <Button size="sm" onClick={fetchProjects}>
              Thử lại
            </Button>
          </div>
        </Panel>
      ) : (
        <Panel>
          <Toolbar
            searchValue={searchTerm}
            onSearchChange={(value) => {
              setSearchTerm(value);
              setCurrentPage(1);
            }}
            searchPlaceholder="Tìm theo tên, địa điểm, loại…"
          />

          <LedgerTable
            columns={columns}
            rows={paginatedProjects}
            loading={loading}
            caption="Danh sách công trình"
            empty={
              <EmptyState
                icon={FaBuilding}
                title={keyword ? 'Không có công trình phù hợp' : 'Sổ chưa có công trình nào'}
                description={
                  keyword
                    ? 'Thử từ khóa khác để tìm đúng công trình.'
                    : 'Đăng công trình đầu tiên để khách thấy tay nghề của xưởng.'
                }
                action={
                  keyword ? (
                    <Button size="sm" onClick={() => setSearchTerm('')}>
                      Xóa tìm kiếm
                    </Button>
                  ) : (
                    <Link href="/admin/projects/add" className={buttonClasses('primary', 'sm')}>
                      Thêm công trình
                    </Link>
                  )
                }
              />
            }
          />

          <Pagination
            page={currentPage}
            totalPages={totalPages}
            total={filteredProjects.length}
            onChange={setCurrentPage}
          />
        </Panel>
      )}

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Xóa công trình?"
        description={
          deleteTarget
            ? `“${deleteTarget.title}” sẽ bị gỡ khỏi trang công trình. Thao tác này không hoàn tác được.`
            : ''
        }
        confirmLabel="Xóa công trình"
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => !deleting && setDeleteTarget(null)}
      />
    </div>
  );
}
