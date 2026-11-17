'use client';

import { useId, useRef, useState } from 'react';
import Link from 'next/link';
import { FaImage, FaTimes, FaUpload } from 'react-icons/fa';

import { uploadImage } from '@/lib/api';
import PageHeader from './PageHeader';
import Panel from './Panel';
import Field, { controlClass } from './Field';
import Button, { buttonClasses } from './Button';

export default function CategoryForm({
  initial,
  onSubmit,
  heading,
  description,
  submitLabel = 'Lưu danh mục',
  cancelHref = '/admin/categories',
}) {
  const [name, setName] = useState(initial?.name || '');
  const [categoryDescription, setCategoryDescription] = useState(initial?.description || '');
  const [image, setImage] = useState(initial?.image || '');
  const [imageFile, setImageFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const fileRef = useRef(null);
  const fileId = useId();

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setImageFile(file);
    setError('');
    const reader = new FileReader();
    reader.onload = () => setImage(reader.result);
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setImage('');
    setImageFile(null);
    if (fileRef.current) fileRef.current.value = '';
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError('');

    try {
      let imageUrl = image;
      if (imageFile) {
        setUploading(true);
        const uploaded = await uploadImage(imageFile);
        imageUrl = uploaded.url;
      }
      await onSubmit({ name: name.trim(), description: categoryDescription, image: imageUrl });
    } catch (err) {
      setError(err.message || 'Không lưu được danh mục. Vui lòng thử lại.');
    } finally {
      setSaving(false);
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={heading}
        description={description}
        actions={
          <Link href={cancelHref} className={buttonClasses('secondary', 'md')}>
            Quay lại danh mục
          </Link>
        }
      />

      <form onSubmit={handleSubmit}>
        <Panel>
          <div className="grid gap-6 p-5 lg:grid-cols-[minmax(0,1fr)_320px]">
            <div className="space-y-5">
              <Field label="Tên danh mục" htmlFor="category-name" required>
                <input
                  id="category-name"
                  type="text"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  required
                  autoFocus
                  className={controlClass}
                  placeholder="Ví dụ: Rèm vải tuyết"
                />
              </Field>

              <Field
                label="Mô tả"
                htmlFor="category-description"
                hint="Hiển thị ngắn gọn để khách hiểu nhóm sản phẩm này dùng cho không gian nào."
              >
                <textarea
                  id="category-description"
                  rows={5}
                  value={categoryDescription}
                  onChange={(event) => setCategoryDescription(event.target.value)}
                  className={controlClass}
                  placeholder="Chất liệu, ánh sáng, gợi ý không gian…"
                />
              </Field>

              {error && (
                <p className="rounded-[var(--a-radius-sm)] border border-[rgba(156,59,54,0.25)] bg-[var(--a-danger-soft)] px-3 py-2 text-[12.5px] text-[var(--a-danger)]">
                  {error}
                </p>
              )}
            </div>

            <div>
              <p className="mb-1.5 text-[13px] font-medium text-[var(--a-muted)]">Ảnh đại diện</p>

              {image ? (
                <div className="relative overflow-hidden rounded-[var(--a-radius-sm)] border border-[var(--a-line)]">
                  <img src={image} alt="Ảnh danh mục" className="aspect-[4/3] w-full object-cover" />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-[#1b2f3b]/70 text-white transition hover:bg-[var(--a-danger)]"
                    aria-label="Bỏ ảnh danh mục"
                  >
                    <FaTimes className="h-3 w-3" />
                  </button>
                </div>
              ) : (
                <div className="flex aspect-[4/3] flex-col items-center justify-center gap-2 rounded-[var(--a-radius-sm)] border border-dashed border-[var(--a-line-strong)] bg-[var(--a-raised)] text-center">
                  <FaImage className="h-5 w-5 text-[var(--a-faint)]" aria-hidden="true" />
                  <p className="text-[12.5px] text-[var(--a-faint)]">Chưa có ảnh</p>
                </div>
              )}

              <input
                id={fileId}
                ref={fileRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="sr-only"
              />
              <label
                htmlFor={fileId}
                className={`${buttonClasses('secondary', 'sm')} mt-3 w-full cursor-pointer`}
              >
                <FaUpload className="h-3.5 w-3.5" aria-hidden="true" />
                {image ? 'Chọn ảnh khác' : 'Chọn ảnh'}
              </label>
              <p className="mt-2 text-[12px] leading-relaxed text-[var(--a-faint)]">
                JPG, PNG hoặc GIF. Ảnh sẽ được tải lên khi bấm lưu.
              </p>
              {uploading && <p className="mt-1 text-[12px] text-[var(--a-cham)]">Đang tải ảnh lên…</p>}
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 border-t border-[var(--a-line)] px-5 py-3">
            <Link href={cancelHref} className={buttonClasses('secondary', 'md')}>
              Hủy
            </Link>
            <Button type="submit" variant="primary" loading={saving} disabled={uploading}>
              {saving ? 'Đang lưu…' : submitLabel}
            </Button>
          </div>
        </Panel>
      </form>
    </div>
  );
}
