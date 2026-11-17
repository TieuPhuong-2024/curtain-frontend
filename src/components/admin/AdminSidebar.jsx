'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/AuthContext';
import {
  FaHome,
  FaStore,
  FaTags,
  FaBuilding,
  FaImage,
  FaList,
  FaEnvelope,
  FaChevronLeft,
  FaChevronRight,
  FaSignOutAlt,
  FaExternalLinkAlt,
  FaTimes,
} from 'react-icons/fa';

import PleatMark from './PleatMark';

export const adminNavItems = [
  { label: 'Tổng quan', href: '/admin', icon: FaHome, exact: true },
  { label: 'Sản phẩm', href: '/admin/curtains', icon: FaStore },
  { label: 'Danh mục', href: '/admin/categories', icon: FaTags },
  { label: 'Công trình', href: '/admin/projects', icon: FaBuilding },
  { label: 'Banner', href: '/admin/banners', icon: FaImage },
  { label: 'Bài viết', href: '/admin/posts', icon: FaList },
  { label: 'Liên hệ', href: '/admin/contacts', icon: FaEnvelope },
];

export default function AdminSidebar({ collapsed, onToggleCollapse, mobileOpen, onClose }) {
  const pathname = usePathname() || '';
  const { user, logout } = useAuth();

  return (
    <>
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-[#1b2f3b]/50 backdrop-blur-[1px] lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`a-pleats fixed inset-y-0 left-0 z-50 flex w-[248px] flex-col bg-[var(--a-cham-deep)] text-white/85 transition-[transform,width] duration-200 ease-out lg:sticky lg:top-0 lg:z-auto lg:h-screen lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        } ${collapsed ? 'lg:w-[76px]' : ''}`}
        aria-label="Điều hướng quản trị"
      >
        <div className="flex h-16 shrink-0 items-center gap-3 border-b border-white/10 px-5">
          <PleatMark tone="light" />
          <div className={`min-w-0 ${collapsed ? 'lg:hidden' : ''}`}>
            <p className="truncate text-[14px] font-semibold tracking-tight text-white">Tuấn Rèm</p>
            <p className="text-[11px] text-white/45">Sổ xưởng</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="ml-auto flex h-7 w-7 items-center justify-center rounded-[6px] text-white/50 transition hover:bg-white/10 hover:text-white lg:hidden"
            aria-label="Đóng menu"
          >
            <FaTimes className="h-3.5 w-3.5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <ul className="space-y-0.5">
            {adminNavItems.map((item) => {
              const active = item.exact
                ? pathname === item.href
                : pathname === item.href || pathname.startsWith(`${item.href}/`);
              const Icon = item.icon;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={onClose}
                    title={collapsed ? item.label : undefined}
                    aria-current={active ? 'page' : undefined}
                    className={`relative flex items-center gap-3 rounded-[7px] px-3 py-2.5 text-[13.5px] transition-colors ${
                      collapsed ? 'lg:justify-center lg:px-0' : ''
                    } ${
                      active
                        ? 'bg-white/[0.07] font-medium text-white'
                        : 'text-white/60 hover:bg-white/[0.04] hover:text-white/90'
                    }`}
                  >
                    {active && (
                      <span
                        className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r bg-[var(--a-brass)]"
                        aria-hidden="true"
                      />
                    )}
                    <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                    <span className={collapsed ? 'lg:hidden' : ''}>{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="shrink-0 border-t border-white/10 p-3">
          <p
            className={`mb-2 truncate px-2 text-[11.5px] text-white/40 ${collapsed ? 'lg:hidden' : ''}`}
            title={user?.email}
          >
            {user?.email || 'Quản trị viên'}
          </p>
          <div className={`flex items-center gap-1 ${collapsed ? 'lg:flex-col' : ''}`}>
            <Link
              href="/"
              target="_blank"
              rel="noreferrer"
              title="Xem site"
              className={`flex flex-1 items-center gap-2 rounded-[6px] px-2.5 py-2 text-[12.5px] text-white/55 transition hover:bg-white/[0.05] hover:text-white/90 ${
                collapsed ? 'lg:justify-center lg:px-0' : ''
              }`}
            >
              <FaExternalLinkAlt className="h-3 w-3 shrink-0" aria-hidden="true" />
              <span className={collapsed ? 'lg:hidden' : ''}>Xem site</span>
            </Link>
            <button
              type="button"
              onClick={logout}
              title="Đăng xuất"
              className={`flex flex-1 items-center gap-2 rounded-[6px] px-2.5 py-2 text-[12.5px] text-white/55 transition hover:bg-white/[0.05] hover:text-white/90 ${
                collapsed ? 'lg:justify-center lg:px-0' : ''
              }`}
            >
              <FaSignOutAlt className="h-3 w-3 shrink-0" aria-hidden="true" />
              <span className={collapsed ? 'lg:hidden' : ''}>Đăng xuất</span>
            </button>
          </div>
          <button
            type="button"
            onClick={onToggleCollapse}
            className="mt-2 hidden h-8 w-full items-center justify-center gap-2 rounded-[6px] border border-white/10 text-[12px] text-white/45 transition hover:border-white/20 hover:text-white/80 lg:flex"
          >
            {collapsed ? (
              <>
                <FaChevronRight className="h-3 w-3" aria-hidden="true" />
                <span className="sr-only">Mở rộng menu</span>
              </>
            ) : (
              <>
                <FaChevronLeft className="h-3 w-3" aria-hidden="true" />
                <span>Thu gọn</span>
              </>
            )}
          </button>
        </div>
      </aside>
    </>
  );
}
