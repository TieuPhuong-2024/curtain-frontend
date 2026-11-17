'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FaTimes } from 'react-icons/fa';

import ImageUploader from '@/components/ImageUploader';
import PageHeader from './PageHeader';
import Panel, { PanelHeader } from './Panel';
import Field, { controlClass, selectClass } from './Field';
import Button, { buttonClasses } from './Button';
import RichTextEditor from './RichTextEditor';
import { notify } from './notify';

export default function PostForm({
  initial,
  heading,
  description,
  submitLabel = 'Lưu bài viết',
  onSubmit,
}) {
  const [title, setTitle] = useState(initial?.title || '');
  const [summary, setSummary] = useState(initial?.summary || '');
  const [content, setContent] = useState(initial?.content || '');
  const [tags, setTags] = useState(
    Array.isArray(initial?.tags) ? initial.tags.join(', ') : initial?.tags || ''
  );
  const [status, setStatus] = useState(initial?.status || 'draft');
  const [featuredImage, setFeaturedImage] = useState(initial?.featuredImage || '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleImageUpload = (urls) => {
    setFeaturedImage(urls?.[0] || '');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    const plainContent = content.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim();
    if (!title.trim() || !plainContent) {
      const message = 'Cần nhập tiêu đề và nội dung bài viết.';
      setError(message);
      notify.error(message);
      return;
    }

    setSaving(true);
    try {
      const tagList = Array.from(
        new Set(
          tags
            .split(',')
            .map((tag) => tag.trim())
            .filter(Boolean)
        )
      );

      await onSubmit({
        title: title.trim(),
        content,
        summary: summary.trim() || null,
        tags: tagList,
        status,
        featuredImage: featuredImage || null,
      });
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Không lưu được bài viết.';
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
          <Link href="/admin/posts" className={buttonClasses('secondary', 'md')}>
            Quay lại bài viết
          </Link>
        }
      />

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px] xl:items-start">
          <Panel>
            <div className="space-y-5 p-5">
              <Field label="Tiêu đề" htmlFor="post-title" required>
                <input
                  id="post-title"
                  type="text"
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  required
                  autoFocus
                  className={controlClass}
                  placeholder="Ví dụ: Chọn rèm cho phòng ngủ hướng tây"
                />
              </Field>

              <Field
                label="Tóm tắt"
                htmlFor="post-summary"
                hint="Hai đến ba dòng hiển thị ở danh sách bài viết và thẻ chia sẻ."
              >
                <textarea
                  id="post-summary"
                  rows={3}
                  value={summary}
                  onChange={(event) => setSummary(event.target.value)}
                  className={controlClass}
                  placeholder="Một đoạn ngắn dẫn vào bài"
                />
              </Field>

              <Field label="Nội dung" required>
                <RichTextEditor
                  value={content}
                  onChange={setContent}
                  placeholder="Viết nội dung bài viết tại đây…"
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
              <PanelHeader title="Xuất bản" description="Bản nháp chưa hiển thị với khách." />
              <div className="space-y-4 p-5">
                <Field label="Trạng thái" htmlFor="post-status">
                  <select
                    id="post-status"
                    value={status}
                    onChange={(event) => setStatus(event.target.value)}
                    className={`${selectClass} w-full`}
                  >
                    <option value="draft">Bản nháp</option>
                    <option value="published">Xuất bản</option>
                  </select>
                </Field>

                <Field
                  label="Tags"
                  htmlFor="post-tags"
                  hint="Phân cách bằng dấu phẩy, dùng để gom bài cùng chủ đề."
                >
                  <input
                    id="post-tags"
                    type="text"
                    value={tags}
                    onChange={(event) => setTags(event.target.value)}
                    className={controlClass}
                    placeholder="phòng ngủ, rèm cản sáng"
                  />
                </Field>
              </div>
            </Panel>

            <Panel>
              <PanelHeader title="Ảnh nổi bật" description="Ảnh ngang, tỉ lệ khoảng 16:9." />
              <div className="p-5">
                <ImageUploader onUpload={handleImageUpload} isMultiple={false} />

                {featuredImage ? (
                  <div className="relative mt-3 overflow-hidden rounded-[var(--a-radius-sm)] border border-[var(--a-line)]">
                    <img
                      src={featuredImage}
                      alt="Ảnh nổi bật của bài viết"
                      className="aspect-video w-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => setFeaturedImage('')}
                      className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-[#1b2f3b]/70 text-white transition hover:bg-[var(--a-danger)]"
                      aria-label="Bỏ ảnh nổi bật"
                    >
                      <FaTimes className="h-3 w-3" />
                    </button>
                  </div>
                ) : (
                  <p className="mt-3 text-[12px] text-[var(--a-faint)]">Chưa chọn ảnh nổi bật.</p>
                )}
              </div>
            </Panel>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-2 border-t border-[var(--a-line)] pt-4">
          <Link href="/admin/posts" className={buttonClasses('secondary', 'md')}>
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
