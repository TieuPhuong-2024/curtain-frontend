'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FaPlus, FaFileExcel, FaPen, FaTrash, FaTags } from 'react-icons/fa';
import * as XLSX from 'xlsx';

import { deleteCategory, getCategories } from '@/lib/api';
import PageHeader from '@/components/admin/PageHeader';
import Panel from '@/components/admin/Panel';
import Toolbar from '@/components/admin/Toolbar';
import LedgerTable from '@/components/admin/LedgerTable';
import Pagination from '@/components/admin/Pagination';
import Button, { buttonClasses } from '@/components/admin/Button';
import Thumb from '@/components/admin/Thumb';
import ConfirmDialog from '@/components/admin/ConfirmDialog';
import EmptyState from '@/components/admin/EmptyState';
import { formatDate, formatNumber } from '@/components/admin/format';
import { notify } from '@/components/admin/notify';

const PAGE_SIZE = 10;

function categoryId(category) {
  return category?._id || category;
}

function categoryName(category) {
  return category?.name || String(category ?? '');
}

export default function CategoryListPage() {
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await getCategories();
      setCategories(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || 'Không tải được danh mục.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      setDeleting(true);
      await deleteCategory(categoryId(deleteTarget));
      notify.success('Đã xóa danh mục.');
      setDeleteTarget(null);
      await fetchCategories();
    } catch (err) {
      notify.error(err.message || 'Không xóa được danh mục.');
    } finally {
      setDeleting(false);
    }
  };

  const keyword = searchTerm.trim().toLowerCase();
  const filteredCategories = categories.filter((category) =>
    categoryName(category).toLowerCase().includes(keyword)
  );

  const totalPages = Math.ceil(filteredCategories.length / PAGE_SIZE);
  const paginatedCategories = filteredCategories.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  useEffect(() => {
    if (totalPages > 0 && currentPage > totalPages) setCurrentPage(totalPages);
  }, [totalPages, currentPage]);

  const handleExportExcel = () => {
    const rows = filteredCategories.map((category) => ({
      'Tên danh mục': categoryName(category),
      'Mô tả': category.description || '',
      'Ngày tạo': category.createdAt ? formatDate(category.createdAt) : '',
    }));
    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Danh muc');
    XLSX.writeFile(workbook, 'danh-sach-danh-muc.xlsx');
  };

  const columns = [
    {
      key: 'name',
      label: 'Danh mục',
      primary: true,
      render: (category) => (
        <div className="flex min-w-0 items-center gap-3">
          <Thumb src={category.image} alt={categoryName(category)} className="h-10 w-10 shrink-0" />
          <div className="min-w-0">
            <p className="truncate font-medium text-[var(--a-ink)]">{categoryName(category)}</p>
            <p className="mt-0.5 line-clamp-1 text-[12px] text-[var(--a-faint)]">
              {category.description || 'Chưa có mô tả'}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: 'createdAt',
      label: 'Ngày tạo',
      render: (category) => (
        <span className="whitespace-nowrap tabular-nums text-[var(--a-muted)]">
          {formatDate(category.createdAt)}
        </span>
      ),
    },
    {
      key: 'actions',
      label: '',
      actions: true,
      align: 'right',
      width: '108px',
      render: (category) => (
        <div className="flex items-center justify-end gap-1">
          <Link
            href={`/admin/categories/edit/${categoryId(category)}`}
            className="flex h-8 w-8 items-center justify-center rounded-[6px] text-[var(--a-muted)] transition hover:bg-[var(--a-raised)] hover:text-[var(--a-cham)]"
            aria-label={`Sửa ${categoryName(category)}`}
            title="Sửa danh mục"
          >
            <FaPen className="h-3.5 w-3.5" />
          </Link>
          <button
            type="button"
            onClick={() => setDeleteTarget(category)}
            className="flex h-8 w-8 items-center justify-center rounded-[6px] text-[var(--a-muted)] transition hover:bg-[var(--a-danger-soft)] hover:text-[var(--a-danger)]"
            aria-label={`Xóa ${categoryName(category)}`}
            title="Xóa danh mục"
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
        title="Danh mục"
        description="Nhóm sản phẩm theo chất liệu và kiểu rèm để khách tìm nhanh hơn."
        meta={`${formatNumber(filteredCategories.length)}${
          filteredCategories.length !== categories.length ? ` / ${formatNumber(categories.length)}` : ''
        } danh mục`}
        actions={
          <>
            <Button
              icon={FaFileExcel}
              onClick={handleExportExcel}
              disabled={!filteredCategories.length}
            >
              Xuất Excel
            </Button>
            <Link href="/admin/categories/add" className={buttonClasses('primary', 'md')}>
              <FaPlus className="h-3.5 w-3.5" />
              Thêm danh mục
            </Link>
          </>
        }
      />

      {error ? (
        <Panel className="border-[rgba(156,59,54,0.25)]">
          <div className="flex flex-col items-start gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-[var(--a-danger)]">{error}</p>
            <Button size="sm" onClick={fetchCategories}>
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
            searchPlaceholder="Tìm tên danh mục…"
          />

          <LedgerTable
            columns={columns}
            rows={paginatedCategories}
            rowKey="_id"
            loading={loading}
            caption="Danh sách danh mục sản phẩm"
            empty={
              <EmptyState
                icon={FaTags}
                title={keyword ? 'Không có danh mục phù hợp' : 'Sổ chưa có danh mục nào'}
                description={
                  keyword
                    ? 'Thử từ khóa khác để tìm đúng nhóm sản phẩm.'
                    : 'Tạo danh mục đầu tiên để sắp xếp sản phẩm trong cửa hàng.'
                }
                action={
                  keyword ? (
                    <Button size="sm" onClick={() => setSearchTerm('')}>
                      Xóa tìm kiếm
                    </Button>
                  ) : (
                    <Link href="/admin/categories/add" className={buttonClasses('primary', 'sm')}>
                      Thêm danh mục
                    </Link>
                  )
                }
              />
            }
          />

          <Pagination
            page={currentPage}
            totalPages={totalPages}
            total={filteredCategories.length}
            onChange={setCurrentPage}
          />
        </Panel>
      )}

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Xóa danh mục?"
        description={
          deleteTarget
            ? `“${categoryName(deleteTarget)}” sẽ bị gỡ khỏi danh sách. Sản phẩm đang thuộc danh mục này có thể mất phân loại.`
            : ''
        }
        confirmLabel="Xóa danh mục"
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => !deleting && setDeleteTarget(null)}
      />
    </div>
  );
}
