'use client';

import { FaSearch } from 'react-icons/fa';

export default function Toolbar({
  searchValue,
  onSearchChange,
  searchPlaceholder = 'Tìm kiếm…',
  filters,
  children,
}) {
  return (
    <div className="flex flex-col gap-3 border-b border-[var(--a-line)] px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5">
      <div className="flex flex-1 flex-col gap-2 sm:flex-row sm:items-center">
        {onSearchChange && (
          <div className="relative w-full sm:max-w-xs">
            <FaSearch
              className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[var(--a-faint)]"
              aria-hidden="true"
            />
            <input
              type="search"
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={searchPlaceholder}
              aria-label={searchPlaceholder}
              className="h-9 w-full rounded-[var(--a-radius-sm)] border border-[var(--a-line-strong)] bg-[var(--a-surface)] pl-9 pr-3 text-[13px] text-[var(--a-ink)] placeholder:text-[var(--a-faint)] transition focus:border-[var(--a-cham)] focus:outline-none focus:ring-[3px] focus:ring-[rgba(44,70,87,0.12)]"
            />
          </div>
        )}
        {filters}
      </div>
      {children && <div className="flex flex-wrap items-center gap-2">{children}</div>}
    </div>
  );
}
