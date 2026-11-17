'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/AuthContext';
import {
  FaBell, FaSearch, FaUser, FaMoon, FaSun, FaBars, FaGrid, FaCalendar, FaClock
} from 'react-icons/fa';

export default function Header({ onMenuClick }) {
  const { user } = useAuth();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState(3);

  return (
    <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16">
        {/* Left: Menu + Search */}
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors lg:hidden"
            aria-label="Mở menu"
          >
            <FaBars size={22} />
          </button>

          <div className="hidden sm:flex items-center flex-1 max-w-md">
            <div className="relative w-full">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Tìm kiếm nhanh..."
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
              />
            </div>
          </div>
        </div>

        {/* Right: User actions */}
        <div className="flex items-center gap-3">
          {/* Quick stats preview */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1 bg-gray-50 rounded-lg">
            <div className="flex flex-col">
              <p className="text-[10px] text-gray-500 uppercase font-medium">Hôm nay</p>
              <p className="text-sm font-semibold text-gray-900">12 đơn mới</p>
            </div>
          </div>

          {/* Notifications */}
          <div className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors group cursor-pointer">
            <FaBell size={20} />
            {notifications > 0 && (
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white"></span>
            )}
          </div>

          {/* User dropdown */}
          <div className="relative group">
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-full hover:bg-gray-100 transition-colors"
            >
              <div className="w-7 h-7 rounded-full bg-indigo-500 flex items-center justify-center text-white text-xs font-semibold overflow-hidden">
                {user?.email?.charAt(0).toUpperCase() || 'U'}
              </div>
              <span className="hidden sm:block text-sm font-medium text-gray-900">{user?.email?.split('@')[0] || 'Admin'}</span>
              <span className="text-gray-400 text-xs transform rotate-180">▲</span>
            </button>

            {userMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 animate-in fade-in slide-in-from-top-2 duration-200 z-50">
                <div className="px-4 py-3 border-b border-gray-50">
                  <p className="text-sm font-medium text-gray-900">{user?.email}</p>
                  <p className="text-[10px] text-gray-500 uppercase font-medium mt-1">Quản trị viên</p>
                </div>
                <div className="py-1">
                  <a
                    href="/account"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-indigo-600 transition-colors"
                  >
                    <FaUser className="mr-2 w-4 h-4" /> Tài khoản của tôi
                  </a>
                  <button
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-indigo-600 transition-colors"
                    onClick={() => setUserMenuOpen(false)}
                  >
                    <FaUser className="mr-2 w-4 h-4" /> Cài đặt
                  </button>
                  <hr className="my-2 border-gray-100" />
                  <button
                    className="block w-full text-left px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 transition-colors"
                  >
                    <FaSignOutAltIcon size={16} className="mr-2" /> Đăng xuất
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

function FaSignOutAltIcon({ size = 16, className = '' }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      className={`w-${size} h-${size} ${className}`}
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
    </svg>
  );
}