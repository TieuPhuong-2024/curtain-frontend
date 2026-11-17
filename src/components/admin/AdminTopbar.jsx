'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaBars, FaExternalLinkAlt } from 'react-icons/fa';
import { useAuth } from '@/lib/AuthContext';

import { adminNavItems } from './AdminSidebar';
import { getInitial } from './format';

export default function AdminTopbar({ onMenuClick }) {
  const pathname = usePathname() || '';
  const { user } = useAuth();

  const section =
    adminNavItems.find((item) =>
      item.exact ? pathname === item.href : pathname === item.href || pathname.startsWith(`${item.href}/`)
    )?.label || 'Quản trị';

  const today = new Intl.DateTimeFormat('vi-VN', {
    weekday: 'long',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date());

  return (
    <header className="sticky top-0 z-30 border-b border-[var(--a-line)] bg-[var(--a-canvas)]/95 backdrop-blur-sm">
      <div className="flex h-14 items-center justify-between gap-3 px-4 sm:px-6 lg:px-10">
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            onClick={onMenuClick}
            className="-ml-1 flex h-8 w-8 items-center justify-center rounded-[6px] text-[var(--a-muted)] transition hover:bg-[var(--a-line)]/50 hover:text-[var(--a-ink)] lg:hidden"
            aria-label="Mở menu"
          >
            <FaBars className="h-4 w-4" />
          </button>
          <p className="truncate text-[12.5px] text-[var(--a-faint)]">
            Quản trị
            <span className="mx-1.5 text-[var(--a-line-strong)]">/</span>
            <span className="text-[var(--a-muted)]">{section}</span>
          </p>
          <p className="hidden shrink-0 text-[12.5px] tabular-nums text-[var(--a-faint)] sm:block">
            {today}
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <Link
            href="/"
            target="_blank"
            rel="noreferrer"
            className="hidden h-8 items-center gap-1.5 rounded-[6px] border border-[var(--a-line)] px-3 text-[12.5px] text-[var(--a-muted)] transition hover:border-[var(--a-line-strong)] hover:text-[var(--a-ink)] sm:inline-flex"
          >
            <FaExternalLinkAlt className="h-3 w-3" aria-hidden="true" />
            Xem site
          </Link>
          <div
            className="flex h-8 items-center gap-2 rounded-full border border-[var(--a-line)] bg-[var(--a-surface)] pl-1 pr-3"
            title={user?.email || 'Quản trị viên'}
          >
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--a-cham)] text-[10px] font-semibold text-white">
              {getInitial(user?.email)}
            </span>
            <span className="hidden max-w-[160px] truncate text-[12.5px] text-[var(--a-ink)] sm:block">
              {user?.email || 'Quản trị viên'}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
