'use client';

import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

export default function Pagination({ page, totalPages, onChange, total }) {
  if (!totalPages || totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between gap-3 border-t border-[var(--a-line)] px-4 py-3 sm:px-5">
      <p className="text-[12.5px] tabular-nums text-[var(--a-faint)]">
        Trang {page} / {totalPages}
        {total != null && `, ${total} mục`}
      </p>
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => onChange(page - 1)}
          disabled={page <= 1}
          className="flex h-8 w-8 items-center justify-center rounded-[var(--a-radius-sm)] border border-[var(--a-line)] text-[var(--a-muted)] transition hover:border-[var(--a-line-strong)] hover:text-[var(--a-ink)] disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="Trang trước"
        >
          <FaChevronLeft className="h-3 w-3" />
        </button>
        <button
          type="button"
          onClick={() => onChange(page + 1)}
          disabled={page >= totalPages}
          className="flex h-8 w-8 items-center justify-center rounded-[var(--a-radius-sm)] border border-[var(--a-line)] text-[var(--a-muted)] transition hover:border-[var(--a-line-strong)] hover:text-[var(--a-ink)] disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="Trang sau"
        >
          <FaChevronRight className="h-3 w-3" />
        </button>
      </div>
    </div>
  );
}
