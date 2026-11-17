'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useAuth } from '@/lib/AuthContext';
import {
  FaHome, FaStore, FaList, FaTags, FaImage, FaBuilding, FaEnvelope, FaUser, FaSignOutAlt, FaChevronLeft, FaChevronRight
} from 'react-icons/fa';

const navItems = [
  { name: 'Tổng quan', href: '/admin', icon: <FaHome size={20} />, exact: true },
  { name: 'Sản phẩm', href: '/admin/curtains', icon: <FaStore size={20} /> },
  { name: 'Danh mục', href: '/admin/categories', icon: <FaTags size={20} /> },
  { name: 'Công trình', href: '/admin/projects', icon: <FaBuilding size={20} /> },
  { name: 'Banner', href: '/admin/banners', icon: <FaImage size={20} /> },
  { name: 'Bài viết', href: '/admin/posts', icon: <FaList size={20} /> },
  { name: 'Liên hệ', href: '/admin/contacts', icon: <FaEnvelope size={20} /> },
];

export default function Sidebar({ collapsed, setCollapsed, mobileOpen, setMobileOpen }) {
  const { user, userRole, logout } = useAuth();
  const [collapsedState, setCollapsedState] = useState(collapsed);

  const handleLogout = async () => {
    await logout();
  };

  return (
    <>
      {/* Mobile toggle button */}
      {!collapsedState && (
        <button
          onClick={() => setCollapsedState(!collapsedState)}
          className="md:hidden p-3 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
          aria-label="Thu gọn sidebar"
        >
          <FaChevronLeft size={20} />
        </button>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-16 bottom-0 z-40 bg-gray-900 text-white border-r border-gray-800 transition-all duration-300 ease-in-out w-64 overflow-y-auto
          ${collapsedState ? '-translate-x-full md:translate-x-0 md:w-16' : ''}
          md:static md:inset-0 md:h-auto md:border-r md:border-gray-800`}
      >
        {/* Brand */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-xs">C</span>
            </div>
            <span className="font-bold text-lg tracking-tight hidden md:block">CurtainAdmin</span>
          </div>
          {!collapsedState && (
            <button
              onClick={() => setCollapsedState(!collapsedState)}
              className="p-2 text-gray-400 hover:text-white"
              aria-label="Thu gọn"
            >
              <FaChevronLeft size={18} />
            </button>
          )}
        </div>

        {/* User Profile */}
        {!collapsedState && (
          <div className="px-4 py-4 border-b border-gray-800">
            <div className="flex items-center gap-3 cursor-pointer group">
              <div className="w-10 h-10 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center overflow-hidden group-hover:scale-105 transition-transform">
                {user?.email?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-100 truncate">{user?.email || 'Admin'}</p>
                <p className="text-xs text-indigo-400 truncate capitalize">{userRole || 'admin'}</p>
              </div>
              <FaChevronRight size={16} className="text-gray-500 group-hover:text-indigo-400 transition-colors" />
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="px-2 py-3">
          <ul className="space-y-1">
            {navItems.map((item) => {
              const isActive = window.location.pathname === item.href ||
                (!item.exact && window.location.pathname.startsWith(item.href));
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? 'bg-indigo-500/10 text-indigo-200 border border-indigo-500/20 shadow-sm'
                        : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                    }`}
                  >
                    {item.icon}
                    {!collapsedState && <span>{item.name}</span>}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Logout */}
        <div className="mt-6 px-4">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-3 rounded-xl text-sm font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors"
          >
            <FaSignOutAlt size={18} />
            <span className={collapsedState ? 'hidden' : 'block'}>Đăng xuất</span>
          </button>
        </div>

        {/* Collapsed state labels */}
        {collapsedState && (
          <div className="absolute left-full top-0 mt-1 px-2 bg-gray-900 border border-gray-700 rounded-lg shadow-lg text-xs whitespace-nowrap z-50 opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="block px-3 py-2 text-gray-300 hover:bg-gray-800">Thoát</span>
          </div>
        )}
      </aside>

      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-30 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}
    </>
  );
}