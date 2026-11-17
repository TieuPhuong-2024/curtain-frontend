'use client';

import { useEffect, useRef, useState } from 'react';
import { FaPen, FaPlus, FaTrash, FaImage, FaTimes, FaExternalLinkAlt } from 'react-icons/fa';

import { createBanner, deleteBanner, getBanners, updateBanner } from '@/lib/api';
import ImageUploader from '@/components/ImageUploader';
import PageHeader from '@/components/admin/PageHeader';
import Panel, { PanelHeader } from '@/components/admin/Panel';
import Toolbar from '@/components/admin/Toolbar';
import LedgerTable from '@/components/admin/LedgerTable';
import Button from '@/components/admin/Button';
import Badge from '@/components/admin/Badge';
import Thumb from '@/components/admin/Thumb';
import ConfirmDialog from '@/components/admin/ConfirmDialog';
import EmptyState from '@/components/admin/EmptyState';
import Field, { controlClass } from '@/components/admin/Field';
import { formatNumber } from '@/components/admin/format';
import { notify } from '@/components/admin/notify';

const emptyForm = {
  title: '',
  description: '',
  image: '',
  link: '',
  isActive: true,
  order: 0,
};

export default function AdminBannerPage() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const titleRef = useRef(null);

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getBanners(true);
      setBanners(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching banners:', err);
      setError('Không tải được danh sách banner.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const scrollToForm = () => {
    document.getElementById('banner-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleCreateNew = () => {
    resetForm();
    scrollToForm();
    requestAnimationFrame(() => titleRef.current?.focus());
  };

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((previous) => ({
      ...previous,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleImageUpload = (uploadedImages) => {
    setForm((previous) => ({ ...previous, image: uploadedImages[0] || '' }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!form.image) {
      notify.error('Chọn ảnh banner trước khi lưu.');
      return;
    }

    setSubmitting(true);
    try {
      const payload = { ...form, order: Number(form.order) || 0 };
      if (editingId) {
        await updateBanner(editingId, payload);
        notify.success('Đã cập nhật banner.');
      } else {
        await createBanner(payload);
        notify.success('Đã thêm banner mới.');
      }
      resetForm();
      await fetchData();
    } catch (err) {
      console.error('Error saving banner:', err);
      notify.error('Không lưu được banner. Vui lòng thử lại.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (banner) => {
    setForm({
      title: banner.title || '',
      description: banner.description || '',
      image: banner.image || '',
      link: banner.link || '',
      isActive: banner.isActive !== false,
      order: banner.order ?? 0,
    });
    setEditingId(banner._id);
    scrollToForm();
    requestAnimationFrame(() => titleRef.current?.focus());
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      setDeleting(true);
      await deleteBanner(deleteTarget._id);
      if (editingId === deleteTarget._id) resetForm();
      notify.success('Đã xóa banner.');
      setDeleteTarget(null);
      await fetchData();
    } catch (err) {
      console.error('Error deleting banner:', err);
      notify.error('Không xóa được banner.');
    } finally {
      setDeleting(false);
    }
  };

  const keyword = searchTerm.trim().toLowerCase();
  const filteredBanners = banners.filter(
    (banner) =>
      !keyword ||
      banner.title?.toLowerCase().includes(keyword) ||
      banner.description?.toLowerCase().includes(keyword)
  );
  const activeCount = banners.filter((banner) => banner.isActive).length;

  const columns = [
    {
      key: 'title',
      label: 'Banner',
      primary: true,
      render: (banner) => (
        <div className="flex min-w-0 items-center gap-3">
          <Thumb src={banner.image} alt={banner.title} className="h-12 w-20 shrink-0" />
          <div className="min-w-0">
            <p className="truncate font-medium text-[var(--a-ink)]">{banner.title}</p>
            <p className="mt-0.5 line-clamp-2 text-[12px] leading-5 text-[var(--a-faint)]">
              {banner.description || 'Chưa có mô tả'}
            </p>
            {banner.link && (
              <a
                href={banner.link}
                target="_blank"
                rel="noreferrer"
                className="mt-1 inline-flex items-center gap-1 text-[12px] text-[var(--a-cham)] hover:underline"
              >
                <FaExternalLinkAlt className="h-2.5 w-2.5" />
                Liên kết
              </a>
            )}
          </div>
        </div>
      ),
    },
    {
      key: 'order',
      label: 'Thứ tự',
      align: 'right',
      width: '88px',
      render: (banner) => (
        <span className="tabular-nums text-[var(--a-muted)]">{banner.order ?? 0}</span>
      ),
    },
    {
      key: 'active',
      label: 'Hiển thị',
      render: (banner) => (
        <Badge tone={banner.isActive ? 'success' : 'neutral'} dot>
          {banner.isActive ? 'Đang hiển thị' : 'Đang ẩn'}
        </Badge>
      ),
    },
    {
      key: 'actions',
      label: '',
      actions: true,
      align: 'right',
      width: '108px',
      render: (banner) => (
        <div className="flex items-center justify-end gap-1">
          <button
            type="button"
            onClick={() => handleEdit(banner)}
            className="flex h-8 w-8 items-center justify-center rounded-[6px] text-[var(--a-muted)] transition hover:bg-[var(--a-raised)] hover:text-[var(--a-cham)]"
            aria-label={`Sửa ${banner.title}`}
            title="Sửa banner"
          >
            <FaPen className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setDeleteTarget(banner)}
            className="flex h-8 w-8 items-center justify-center rounded-[6px] text-[var(--a-muted)] transition hover:bg-[var(--a-danger-soft)] hover:text-[var(--a-danger)]"
            aria-label={`Xóa ${banner.title}`}
            title="Xóa banner"
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
        title="Banner"
        description="Ảnh lớn ở đầu trang chủ. Giữ tiêu đề ngắn và ảnh ngang để banner không bị cắt xấu."
        meta={`${formatNumber(banners.length)} banner, ${formatNumber(activeCount)} đang hiển thị`}
        actions={
          <Button icon={FaPlus} variant="primary" onClick={handleCreateNew}>
            Thêm banner
          </Button>
        }
      />

      <div className="grid gap-6 xl:grid-cols-[380px_minmax(0,1fr)] xl:items-start">
        <div id="banner-form" className="scroll-mt-20">
          <Panel>
            <PanelHeader
              title={editingId ? 'Sửa banner' : 'Banner mới'}
              description={
                editingId ? 'Cập nhật nội dung rồi lưu để thay đổi ngoài trang chủ.' : 'Ảnh ngang, tiêu đề ngắn gọn.'
              }
            >
              {editingId && <Badge tone="brass">Đang sửa</Badge>}
            </PanelHeader>

            <form onSubmit={handleSubmit} className="space-y-4 p-5">
              <Field label="Tiêu đề" htmlFor="banner-title" required>
                <input
                  id="banner-title"
                  ref={titleRef}
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  className={controlClass}
                  placeholder="Ví dụ: Rèm vải tuyết cho phòng khách"
                  required
                />
              </Field>

              <Field
                label="Mô tả"
                htmlFor="banner-description"
                hint="Một dòng ngắn hiển thị dưới tiêu đề banner."
              >
                <textarea
                  id="banner-description"
                  name="description"
                  rows={3}
                  value={form.description}
                  onChange={handleChange}
                  className={controlClass}
                  placeholder="Chất liệu, không gian hoặc ưu đãi"
                />
              </Field>

              <Field label="Hình ảnh" required>
                <ImageUploader onUpload={handleImageUpload} isMultiple={false} />
                {form.image && (
                  <div className="relative mt-3 overflow-hidden rounded-[var(--a-radius-sm)] border border-[var(--a-line)]">
                    <img src={form.image} alt="Ảnh banner" className="h-32 w-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setForm((previous) => ({ ...previous, image: '' }))}
                      className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-[#1b2f3b]/70 text-white transition hover:bg-[var(--a-danger)]"
                      aria-label="Bỏ ảnh banner"
                    >
                      <FaTimes className="h-3 w-3" />
                    </button>
                  </div>
                )}
              </Field>

              <Field label="Liên kết" htmlFor="banner-link" hint="Tùy chọn — trang hoặc sản phẩm mở khi bấm banner.">
                <input
                  id="banner-link"
                  type="url"
                  name="link"
                  value={form.link}
                  onChange={handleChange}
                  className={controlClass}
                  placeholder="https://..."
                />
              </Field>

              <div className="flex flex-wrap items-end justify-between gap-3 border-t border-[var(--a-line)] pt-4">
                <label className="flex h-9 items-center gap-2 text-[13px] text-[var(--a-ink)]">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={form.isActive}
                    onChange={handleChange}
                    className="h-4 w-4 rounded border-[var(--a-line-strong)] accent-[var(--a-cham)]"
                  />
                  Hiển thị trên trang chủ
                </label>
                <div className="flex items-center gap-2">
                  <label htmlFor="banner-order" className="text-[12.5px] text-[var(--a-muted)]">
                    Thứ tự
                  </label>
                  <input
                    id="banner-order"
                    type="number"
                    name="order"
                    min={0}
                    value={form.order}
                    onChange={handleChange}
                    className={`${controlClass} w-20`}
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <Button type="submit" variant="primary" loading={submitting}>
                  {editingId ? 'Lưu thay đổi' : 'Thêm banner'}
                </Button>
                {editingId && (
                  <Button type="button" onClick={resetForm} disabled={submitting}>
                    Hủy sửa
                  </Button>
                )}
              </div>
            </form>
          </Panel>
        </div>

        <Panel>
          <PanelHeader title="Danh sách banner" description="Kéo lên trên để xem banner đang ẩn." />
          <Toolbar
            searchValue={searchTerm}
            onSearchChange={setSearchTerm}
            searchPlaceholder="Tìm theo tiêu đề hoặc mô tả…"
          />

          {error ? (
            <div className="flex flex-col items-start gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-[var(--a-danger)]">{error}</p>
              <Button size="sm" onClick={fetchData}>
                Thử lại
              </Button>
            </div>
          ) : (
            <LedgerTable
              columns={columns}
              rows={filteredBanners}
              loading={loading}
              caption="Danh sách banner"
              empty={
                <EmptyState
                  icon={FaImage}
                  title={keyword ? 'Không có banner phù hợp' : 'Chưa có banner nào'}
                  description={
                    keyword
                      ? 'Thử từ khóa khác để tìm banner.'
                      : 'Thêm banner đầu tiên để trang chủ có ảnh mở đầu.'
                  }
                  action={
                    keyword ? (
                      <Button size="sm" onClick={() => setSearchTerm('')}>
                        Xóa tìm kiếm
                      </Button>
                    ) : (
                      <Button size="sm" variant="primary" onClick={handleCreateNew}>
                        Thêm banner
                      </Button>
                    )
                  }
                />
              }
            />
          )}
        </Panel>
      </div>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Xóa banner?"
        description={
          deleteTarget
            ? `“${deleteTarget.title}” sẽ bị gỡ khỏi trang chủ. Thao tác này không hoàn tác được.`
            : ''
        }
        confirmLabel="Xóa banner"
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => !deleting && setDeleteTarget(null)}
      />
    </div>
  );
}
