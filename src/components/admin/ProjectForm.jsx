'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FaTimes } from 'react-icons/fa';

import ImageUploader from '@/components/ImageUploader';
import PageHeader from './PageHeader';
import Panel, { PanelHeader } from './Panel';
import Field, { controlClass } from './Field';
import Button, { buttonClasses } from './Button';
import RichTextEditor from './RichTextEditor';
import { notify } from './notify';

export default function ProjectForm({
  initial,
  heading,
  description,
  submitLabel = 'Lưu công trình',
  onSubmit,
}) {
  const [title, setTitle] = useState(initial?.title || '');
  const [location, setLocation] = useState(initial?.location || '');
  const [type, setType] = useState(initial?.type || '');
  const [shortDescription, setShortDescription] = useState(initial?.shortDescription || '');
  const [detailedContent, setDetailedContent] = useState(initial?.detailedContent || '');
  const [thumbnail, setThumbnail] = useState(initial?.thumbnail || '');
  const [featured, setFeatured] = useState(initial?.featured === true);
  const [published, setPublished] = useState(initial?.published !== false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    const plainContent = detailedContent.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim();
    const checks = [
      [title.trim(), 'tên công trình'],
      [location.trim(), 'địa điểm'],
      [type.trim(), 'loại công trình'],
      [shortDescription.trim(), 'mô tả ngắn'],
      [plainContent, 'nội dung chi tiết'],
      [thumbnail, 'ảnh thumbnail'],
    ];
    const missing = checks.filter(([value]) => !value).map(([, label]) => label);

    if (missing.length) {
      const message = `Còn thiếu: ${missing.join(', ')}.`;
      setError(message);
      notify.error(message);
      return;
    }

    setSaving(true);
    try {
      await onSubmit({
        title: title.trim(),
        shortDescription: shortDescription.trim(),
        detailedContent,
        location: location.trim(),
        type: type.trim(),
        thumbnail,
        featured,
        published,
      });
    } catch (err) {
      const message =
        err.response?.status === 413
          ? 'Dữ liệu quá lớn, không lưu được công trình.'
          : err.response?.data?.message || err.message || 'Không lưu được công trình.';
      setError(message);
      notify.error(message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={heading}
        description={description}
        actions={
          <Link href="/admin/projects" className={buttonClasses('secondary', 'md')}>
            Quay lại công trình
          </Link>
        }
      />

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px] xl:items-start">
          <Panel>
            <div className="space-y-5 p-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Tên công trình" htmlFor="project-title" required>
                  <input
                    id="project-title"
                    type="text"
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                    required
                    autoFocus
                    className={controlClass}
                    placeholder="Ví dụ: Biệt thự vườn Thảo Điền"
                  />
                </Field>

                <Field label="Địa điểm" htmlFor="project-location" required>
                  <input
                    id="project-location"
                    type="text"
                    value={location}
                    onChange={(event) => setLocation(event.target.value)}
                    required
                    className={controlClass}
                    placeholder="Quận, thành phố"
                  />
                </Field>
              </div>

              <Field
                label="Loại công trình"
                htmlFor="project-type"
                required
                hint="Dùng để phân nhóm trên trang công trình."
              >
                <input
                  id="project-type"
                  type="text"
                  value={type}
                  onChange={(event) => setType(event.target.value)}
                  required
                  className={controlClass}
                  placeholder="Biệt thự, chung cư, văn phòng…"
                />
              </Field>

              <Field
                label="Mô tả ngắn"
                htmlFor="project-summary"
                required
                hint="Một đến hai câu, hiển thị ở danh sách công trình."
              >
                <textarea
                  id="project-summary"
                  rows={3}
                  value={shortDescription}
                  onChange={(event) => setShortDescription(event.target.value)}
                  required
                  className={controlClass}
                  placeholder="Không gian, chất liệu và điểm đáng chú ý"
                />
              </Field>

              <Field label="Nội dung chi tiết" required>
                <RichTextEditor
                  value={detailedContent}
                  onChange={setDetailedContent}
                  placeholder="Kể lại quá trình thi công, chất liệu và kết quả…"
                />
              </Field>

              {error && (
                <p className="rounded-[var(--a-radius-sm)] border border-[rgba(156,59,54,0.25)] bg-[var(--a-danger-soft)] px-3 py-2 text-[12.5px] text-[var(--a-danger)]">
                  {error}
                </p>
              )}
            </div>
          </Panel>

          <div className="space-y-6">
            <Panel>
              <PanelHeader title="Ảnh thumbnail" description="Ảnh ngang, tỉ lệ khoảng 4:3." />
              <div className="p-5">
                <ImageUploader
                  onUpload={(urls) => setThumbnail(urls?.[0] || '')}
                  isMultiple={false}
                />

                {thumbnail ? (
                  <div className="relative mt-3 overflow-hidden rounded-[var(--a-radius-sm)] border border-[var(--a-line)]">
                    <img
                      src={thumbnail}
                      alt="Ảnh thumbnail công trình"
                      className="aspect-[4/3] w-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => setThumbnail('')}
                      className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-[#1b2f3b]/70 text-white transition hover:bg-[var(--a-danger)]"
                      aria-label="Bỏ ảnh thumbnail"
                    >
                      <FaTimes className="h-3 w-3" />
                    </button>
                  </div>
                ) : (
                  <p className="mt-3 text-[12px] text-[var(--a-faint)]">Chưa chọn ảnh thumbnail.</p>
                )}
              </div>
            </Panel>

            <Panel>
              <PanelHeader title="Hiển thị" description="Quyết định công trình xuất hiện ở đâu." />
              <div className="space-y-3 p-5">
                <label className="flex items-start gap-2 text-[13px] text-[var(--a-ink)]">
                  <input
                    type="checkbox"
                    checked={featured}
                    onChange={(event) => setFeatured(event.target.checked)}
                    className="mt-0.5 h-4 w-4 rounded border-[var(--a-line-strong)] accent-[var(--a-cham)]"
                  />
                  <span>
                    Công trình nổi bật
                    <span className="mt-0.5 block text-[12px] text-[var(--a-faint)]">
                      Ưu tiên hiển thị ở trang chủ.
                    </span>
                  </span>
                </label>
                <label className="flex items-start gap-2 text-[13px] text-[var(--a-ink)]">
                  <input
                    type="checkbox"
                    checked={published}
                    onChange={(event) => setPublished(event.target.checked)}
                    className="mt-0.5 h-4 w-4 rounded border-[var(--a-line-strong)] accent-[var(--a-cham)]"
                  />
                  <span>
                    Hiển thị công khai
                    <span className="mt-0.5 block text-[12px] text-[var(--a-faint)]">
                      Bỏ chọn để ẩn công trình khỏi trang khách.
                    </span>
                  </span>
                </label>
              </div>
            </Panel>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-2 border-t border-[var(--a-line)] pt-4">
          <Link href="/admin/projects" className={buttonClasses('secondary', 'md')}>
            Hủy
          </Link>
          <Button type="submit" variant="primary" loading={saving}>
            {saving ? 'Đang lưu…' : submitLabel}
          </Button>
        </div>
      </form>
    </div>
  );
}
