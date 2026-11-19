'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FaEye, FaFileAlt, FaPen, FaPlus, FaTrash } from 'react-icons/fa';

import { getPosts, deletePost } from '@/lib/api';
import { ROUTES_PATH } from '@/utils/constant';
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
import { selectClass } from '@/components/admin/Field';

const PAGE_SIZE = 10;

function statusInfo(status) {
  if (status === 'published') return { label: 'Đã xuất bản', tone: 'success' };
  if (status === 'draft') return { label: 'Bản nháp', tone: 'warning' };
  return { label: status || 'Chưa rõ', tone: 'neutral' };
}

export default function AdminPosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [statusFilter, setStatusFilter] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchPosts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getPosts(currentPage, PAGE_SIZE, statusFilter);
      setPosts(response.posts || []);
      setTotalPages(response.pagination?.pages || 1);
      setTotal(response.pagination?.total ?? response.posts?.length ?? 0);
    } catch (err) {
      console.error('Error fetching posts:', err);
      setError('Không tải được danh sách bài viết.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [currentPage, statusFilter]);

  useEffect(() => {
    if (totalPages >= 1 && currentPage > totalPages) setCurrentPage(totalPages);
  }, [totalPages, currentPage]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      setDeleting(true);
      await deletePost(deleteTarget._id);
      notify.success('Đã xóa bài viết.');
      setDeleteTarget(null);
      await fetchPosts();
    } catch (err) {
      console.error('Error deleting post:', err);
      notify.error('Không xóa được bài viết. Vui lòng thử lại.');
    } finally {
      setDeleting(false);
    }
  };

  const columns = [
    {
      key: 'title',
      label: 'Bài viết',
      primary: true,
      render: (post) => {
        const status = statusInfo(post.status);
        return (
          <div className="flex min-w-0 items-center gap-3">
            <Thumb src={post.featuredImage} alt={post.title} className="h-12 w-16 shrink-0" />
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <p className="truncate font-medium text-[var(--a-ink)]">{post.title}</p>
                <Badge tone={status.tone} dot>
                  {status.label}
                </Badge>
              </div>
              <p className="mt-0.5 line-clamp-2 text-[12px] leading-5 text-[var(--a-faint)]">
                {post.summary || 'Chưa có mô tả ngắn'}
              </p>
              {post.tags?.length > 0 && (
                <div className="mt-1.5 flex flex-wrap gap-1">
                  {post.tags.slice(0, 3).map((tag) => (
                    <Badge key={tag}>{tag}</Badge>
                  ))}
                </div>
              )}
            </div>
          </div>
        );
      },
    },
    {
      key: 'createdAt',
      label: 'Ngày đăng',
      render: (post) => (
        <span className="whitespace-nowrap tabular-nums text-[var(--a-muted)]">
          {formatDate(post.createdAt)}
        </span>
      ),
    },
    {
      key: 'viewCount',
      label: 'Lượt xem',
      align: 'right',
      width: '96px',
      render: (post) => (
        <span className="tabular-nums text-[var(--a-muted)]">{formatNumber(post.viewCount || 0)}</span>
      ),
    },
    {
      key: 'actions',
      label: '',
      actions: true,
      align: 'right',
      width: '132px',
      render: (post) => (
        <div className="flex items-center justify-end gap-1">
          <Link
            href={`/${ROUTES_PATH.POSTS}/${post._id}`}
            target="_blank"
            rel="noreferrer"
            className="flex h-8 w-8 items-center justify-center rounded-[6px] text-[var(--a-muted)] transition hover:bg-[var(--a-raised)] hover:text-[var(--a-cham)]"
            aria-label={`Xem bài ${post.title}`}
            title="Xem trên site"
          >
            <FaEye className="h-3.5 w-3.5" />
          </Link>
          <Link
            href={`/admin/posts/${post._id}`}
            className="flex h-8 w-8 items-center justify-center rounded-[6px] text-[var(--a-muted)] transition hover:bg-[var(--a-raised)] hover:text-[var(--a-cham)]"
            aria-label={`Sửa ${post.title}`}
            title="Sửa bài viết"
          >
            <FaPen className="h-3.5 w-3.5" />
          </Link>
          <button
            type="button"
            onClick={() => setDeleteTarget(post)}
            className="flex h-8 w-8 items-center justify-center rounded-[6px] text-[var(--a-muted)] transition hover:bg-[var(--a-danger-soft)] hover:text-[var(--a-danger)]"
            aria-label={`Xóa ${post.title}`}
            title="Xóa bài viết"
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
        title="Bài viết"
        description="Mẹo chọn rèm, câu chuyện xưởng và hướng dẫn bảo quản — nội dung giúp khách tin tay nghề."
        meta={loading ? undefined : `${formatNumber(total)} bài viết`}
        actions={
          <Link href="/admin/posts/new" className={buttonClasses('primary', 'md')}>
            <FaPlus className="h-3.5 w-3.5" />
            Viết bài mới
          </Link>
        }
      />

      {error ? (
        <Panel className="border-[rgba(156,59,54,0.25)]">
          <div className="flex flex-col items-start gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-[var(--a-danger)]">{error}</p>
            <Button size="sm" onClick={fetchPosts}>
              Thử lại
            </Button>
          </div>
        </Panel>
      ) : (
        <Panel>
          <Toolbar
            filters={
              <select
                value={statusFilter}
                onChange={(event) => {
                  setStatusFilter(event.target.value);
                  setCurrentPage(1);
                }}
                className={selectClass}
                aria-label="Lọc theo trạng thái"
              >
                <option value="">Tất cả trạng thái</option>
                <option value="published">Đã xuất bản</option>
                <option value="draft">Bản nháp</option>
              </select>
            }
          >
            <p className="text-[12.5px] text-[var(--a-faint)]">Sắp xếp theo ngày tạo mới nhất</p>
          </Toolbar>

          <LedgerTable
            columns={columns}
            rows={posts}
            loading={loading}
            caption="Danh sách bài viết"
            empty={
              <EmptyState
                icon={FaFileAlt}
                title={statusFilter ? 'Không có bài viết ở trạng thái này' : 'Chưa có bài viết nào'}
                description={
                  statusFilter
                    ? 'Đổi bộ lọc trạng thái để xem bài khác.'
                    : 'Viết bài đầu tiên để khách hiểu hơn về chất liệu và cách chọn rèm.'
                }
                action={
                  statusFilter ? (
                    <Button size="sm" onClick={() => setStatusFilter('')}>
                      Xem tất cả
                    </Button>
                  ) : (
                    <Link href="/admin/posts/new" className={buttonClasses('primary', 'sm')}>
                      Viết bài mới
                    </Link>
                  )
                }
              />
            }
          />

          <Pagination
            page={currentPage}
            totalPages={totalPages}
            total={total}
            onChange={setCurrentPage}
          />
        </Panel>
      )}

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Xóa bài viết?"
        description={
          deleteTarget
            ? `“${deleteTarget.title}” sẽ bị gỡ khỏi trang bài viết. Thao tác này không hoàn tác được.`
            : ''
        }
        confirmLabel="Xóa bài viết"
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => !deleting && setDeleteTarget(null)}
      />
    </div>
  );
}
