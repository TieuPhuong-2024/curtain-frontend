'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FaPlus, FaFileExcel, FaPen, FaTrash, FaStore } from 'react-icons/fa';
import * as XLSX from 'xlsx';

import { deleteCurtain, getCategories, getCurtains } from '@/lib/api';
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
import { formatPrice, formatNumber } from '@/components/admin/format';
import { notify } from '@/components/admin/notify';
import { selectClass } from '@/components/admin/Field';

const PAGE_SIZE = 10;

function categoryName(curtain) {
  return typeof curtain.category === 'object' ? curtain.category?.name : curtain.category;
}

export default function CurtainsList() {
  const [curtains, setCurtains] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchCurtains();
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(Array.isArray(data) ? data : []);
    } catch {
      setCategories([]);
    }
  };

  const fetchCurtains = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getCurtains();
      setCurtains(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching curtains:', err);
      setError('Không tải được danh sách sản phẩm. Kiểm tra kết nối rồi thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      setDeleting(true);
      await deleteCurtain(deleteTarget._id);
      notify.success('Đã xóa sản phẩm khỏi danh sách.');
      setDeleteTarget(null);
      await fetchCurtains();
    } catch (err) {
      console.error('Error deleting curtain:', err);
      notify.error('Không xóa được sản phẩm. Vui lòng thử lại.');
    } finally {
      setDeleting(false);
    }
  };

  const keyword = searchTerm.trim().toLowerCase();
  const filteredCurtains = curtains.filter((curtain) => {
    const matchesSearch =
      !keyword ||
      curtain.name?.toLowerCase().includes(keyword) ||
      categoryName(curtain)?.toLowerCase().includes(keyword);
    const matchesCategory = selectedCategory
      ? (typeof curtain.category === 'object' ? curtain.category?._id : curtain.category) === selectedCategory
      : true;
    return matchesSearch && matchesCategory;
  });

  const totalPages = Math.ceil(filteredCurtains.length / PAGE_SIZE);
  const paginatedCurtains = filteredCurtains.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );
  const inStockCount = curtains.filter((curtain) => curtain.inStock).length;

  useEffect(() => {
    if (totalPages > 0 && currentPage > totalPages) setCurrentPage(totalPages);
  }, [totalPages, currentPage]);

  const resetPage = () => setCurrentPage(1);

  const handleExportExcel = () => {
    const rows = filteredCurtains.map((curtain) => ({
      'Tên sản phẩm': curtain.name,
      'Danh mục': categoryName(curtain) || '',
      Giá: formatPrice(curtain.price),
      'Chất liệu': curtain.material || '',
      'Màu sắc': curtain.color?.name || '',
      'Còn hàng': curtain.inStock ? 'Có' : 'Không',
    }));
    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'San pham');
    XLSX.writeFile(workbook, 'danh-sach-san-pham.xlsx');
  };

  const columns = [
    {
      key: 'name',
      label: 'Sản phẩm',
      primary: true,
      render: (curtain) => (
        <div className="flex min-w-0 items-center gap-3">
          <Thumb
            src={curtain.mainImage || curtain.image}
            alt={curtain.name}
            className="h-10 w-10 shrink-0"
          />
          <div className="min-w-0">
            <p className="truncate font-medium text-[var(--a-ink)]">{curtain.name}</p>
            <p className="mt-0.5 truncate text-[12px] text-[var(--a-faint)]">
              {curtain.color?.name || curtain.material || 'Chưa ghi chất liệu'}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: 'category',
      label: 'Danh mục',
      render: (curtain) => (
        <span className="text-[var(--a-muted)]">{categoryName(curtain) || 'Chưa phân loại'}</span>
      ),
    },
    {
      key: 'price',
      label: 'Giá',
      align: 'right',
      render: (curtain) => (
        <span className="whitespace-nowrap font-medium tabular-nums text-[var(--a-ink)]">
          {formatPrice(curtain.price)}
        </span>
      ),
    },
    {
      key: 'stock',
      label: 'Trạng thái',
      render: (curtain) => (
        <Badge tone={curtain.inStock ? 'success' : 'danger'} dot>
          {curtain.inStock ? 'Còn hàng' : 'Hết hàng'}
        </Badge>
      ),
    },
    {
      key: 'actions',
      label: '',
      actions: true,
      align: 'right',
      width: '108px',
      render: (curtain) => (
        <div className="flex items-center justify-end gap-1">
          <Link
            href={`/admin/curtains/edit/${curtain._id}`}
            className="flex h-8 w-8 items-center justify-center rounded-[6px] text-[var(--a-muted)] transition hover:bg-[var(--a-raised)] hover:text-[var(--a-cham)]"
            aria-label={`Sửa ${curtain.name}`}
            title="Sửa sản phẩm"
          >
            <FaPen className="h-3.5 w-3.5" />
          </Link>
          <button
            type="button"
            onClick={() => setDeleteTarget(curtain)}
            className="flex h-8 w-8 items-center justify-center rounded-[6px] text-[var(--a-muted)] transition hover:bg-[var(--a-danger-soft)] hover:text-[var(--a-danger)]"
            aria-label={`Xóa ${curtain.name}`}
            title="Xóa sản phẩm"
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
        title="Sản phẩm"
        description="Toàn bộ rèm cửa trong sổ xưởng: giá bán, danh mục và tình trạng còn hàng."
        meta={`${formatNumber(filteredCurtains.length)}${filteredCurtains.length !== curtains.length ? ` / ${formatNumber(curtains.length)}` : ''} sản phẩm`}
        actions={
          <>
            <Button
              icon={FaFileExcel}
              onClick={handleExportExcel}
              disabled={!filteredCurtains.length}
            >
              Xuất Excel
            </Button>
            <Link href="/admin/curtains/add" className={buttonClasses('primary', 'md')}>
              <FaPlus className="h-3.5 w-3.5" />
              Thêm sản phẩm
            </Link>
          </>
        }
      />

      {error ? (
        <Panel className="border-[rgba(156,59,54,0.25)]">
          <div className="flex flex-col items-start gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-[var(--a-danger)]">{error}</p>
            <Button size="sm" onClick={fetchCurtains}>
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
              resetPage();
            }}
            searchPlaceholder="Tìm theo tên hoặc danh mục…"
            filters={
              <select
                className={selectClass}
                value={selectedCategory}
                onChange={(event) => {
                  setSelectedCategory(event.target.value);
                  resetPage();
                }}
                aria-label="Lọc theo danh mục"
              >
                <option value="">Tất cả danh mục</option>
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>
            }
          >
            <p className="text-[12.5px] tabular-nums text-[var(--a-faint)]">
              {formatNumber(inStockCount)} đang còn hàng
            </p>
          </Toolbar>

          <LedgerTable
            columns={columns}
            rows={paginatedCurtains}
            loading={loading}
            caption="Danh sách sản phẩm"
            empty={
              <EmptyState
                icon={FaStore}
                title={
                  keyword || selectedCategory
                    ? 'Không có sản phẩm phù hợp'
                    : 'Sổ chưa có sản phẩm nào'
                }
                description={
                  keyword || selectedCategory
                    ? 'Thử từ khóa khác hoặc bỏ bộ lọc danh mục để xem toàn bộ sản phẩm.'
                    : 'Thêm sản phẩm đầu tiên để bắt đầu ghi sổ bán hàng.'
                }
                action={
                  keyword || selectedCategory ? (
                    <Button
                      size="sm"
                      onClick={() => {
                        setSearchTerm('');
                        setSelectedCategory('');
                      }}
                    >
                      Bỏ bộ lọc
                    </Button>
                  ) : (
                    <Link href="/admin/curtains/add" className={buttonClasses('primary', 'sm')}>
                      Thêm sản phẩm
                    </Link>
                  )
                }
              />
            }
          />

          <Pagination
            page={currentPage}
            totalPages={totalPages}
            total={filteredCurtains.length}
            onChange={setCurrentPage}
          />
        </Panel>
      )}

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Xóa sản phẩm?"
        description={
          deleteTarget
            ? `“${deleteTarget.name}” sẽ bị gỡ khỏi danh sách bán. Thao tác này không hoàn tác được.`
            : ''
        }
        confirmLabel="Xóa sản phẩm"
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => !deleting && setDeleteTarget(null)}
      />
    </div>
  );
}
