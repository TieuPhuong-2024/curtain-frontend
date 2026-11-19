'use client';

import { Be_Vietnam_Pro } from 'next/font/google';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/AuthContext';

import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminTopbar from '@/components/admin/AdminTopbar';

import './admin.css';

const adminFont = Be_Vietnam_Pro({
  subsets: ['vietnamese', 'latin'],
  weight: ['400', '500', '600'],
  variable: '--font-admin',
  display: 'swap',
});

export default function AdminLayout({ children }) {
  const { user, userRole, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  useEffect(() => {
    if (!loading && (!user || userRole !== 'admin')) {
      logout();
      router.replace('/login');
    }
  }, [user, userRole, loading, router, logout]);

  useEffect(() => {
    setMobileSidebarOpen(false);
  }, [pathname]);

  if (loading || !user || userRole !== 'admin') {
    return (
      <div className={`admin-scope ${adminFont.variable} flex min-h-screen items-center justify-center`}>
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-[var(--a-line-strong)] border-t-[var(--a-cham)]" />
          <p className="text-sm text-[var(--a-muted)]">Đang mở sổ xưởng…</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`admin-scope ${adminFont.variable} flex min-h-screen`}>
      <AdminSidebar
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed((value) => !value)}
        mobileOpen={mobileSidebarOpen}
        onClose={() => setMobileSidebarOpen(false)}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <AdminTopbar onMenuClick={() => setMobileSidebarOpen(true)} />
        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-10 lg:py-8">{children}</main>
      </div>
    </div>
  );
}
