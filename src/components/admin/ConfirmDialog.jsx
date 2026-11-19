'use client';

import { useEffect } from 'react';
import { FaExclamationTriangle } from 'react-icons/fa';
import Button from './Button';

export default function ConfirmDialog({
  open,
  title = 'Xác nhận',
  description,
  confirmLabel = 'Xác nhận',
  cancelLabel = 'Hủy',
  tone = 'danger',
  loading = false,
  onConfirm,
  onCancel,
}) {
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (event) => {
      if (event.key === 'Escape' && !loading) onCancel?.();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, loading, onCancel]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-[#1b2f3b]/40 backdrop-blur-[2px]"
        onClick={() => !loading && onCancel?.()}
        aria-hidden="true"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="admin-confirm-title"
        aria-describedby={description ? 'admin-confirm-description' : undefined}
        className="relative w-full max-w-sm rounded-[12px] border border-[var(--a-line)] bg-[var(--a-surface)] p-5 shadow-[0_24px_60px_rgba(27,47,59,0.22)]"
      >
        <div className="flex items-start gap-3">
          <span
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
              tone === 'danger'
                ? 'bg-[var(--a-danger-soft)] text-[var(--a-danger)]'
                : 'bg-[var(--a-warning-soft)] text-[var(--a-warning)]'
            }`}
          >
            <FaExclamationTriangle className="h-4 w-4" aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <h2 id="admin-confirm-title" className="text-[15px] font-semibold text-[var(--a-ink)]">
              {title}
            </h2>
            {description && (
              <p
                id="admin-confirm-description"
                className="mt-1 text-[13px] leading-relaxed text-[var(--a-muted)]"
              >
                {description}
              </p>
            )}
          </div>
        </div>
        <div className="mt-5 flex justify-end gap-2">
          <Button size="sm" variant="secondary" onClick={onCancel} disabled={loading} autoFocus>
            {cancelLabel}
          </Button>
          <Button
            size="sm"
            variant={tone === 'danger' ? 'dangerSolid' : 'primary'}
            onClick={onConfirm}
            loading={loading}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
