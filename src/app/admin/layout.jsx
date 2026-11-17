'use client';

import { Inter } from 'next/font/google';
import Link from 'next/link';
import { useAuth } from '@/lib/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Sidebar from '@/components/dashboard/Sidebar';
import Header from '@/components/dashboard/Header';
import ConfirmDialog from '@/components/dashboard/ConfirmDialog';
import Toast from '@/components/dashboard/Toast';

const inter = Inter({ subsets: ['latin'] });

export default function AdminLayout({ children }) {
  const { user, userRole, loading, logout } = useAuth();
  const router = useRouter();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    onConfirm: () => {},
    title: 'Xác nhận',
    description: '',
    confirmLabel: 'Xác nhận',
    cancelLabel: 'Hủy',
  });
  const [toasts, setToasts] = useState([]);

  // Check if user is not an admin
  useEffect(() => {
    if (!loading && (!user || userRole !== 'admin')) {
      logout();
      router.push('/login');
    }
  }, [user, userRole, loading, router, logout]);

  // If still loading or no permission, show minimal loading UI
  if (loading || !user || userRole !== 'admin') {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
          <p className="text-gray-600 font-medium">Đang khởi tạo...</p>
        </div>
      </div>
    );
  }

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  const showConfirm = (config) => {
    setConfirmDialog({ isOpen: true, ...config });
  };

  const addToast = (message, variant = 'info') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, variant }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5000);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <Header onMenuClick={() => setMobileSidebarOpen(true)} />

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar
          collapsed={sidebarCollapsed}
          setCollapsed={setSidebarCollapsed}
          mobileOpen={mobileSidebarOpen}
          setMobileOpen={setMobileSidebarOpen}
        />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-gray-50">
          <div className="p-4 sm:p-6 lg:p-8">
            {children}
          </div>
        </main>
      </div>

      {/* Confirm Dialog */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onConfirm={() => {
          confirmDialog.onConfirm();
          setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
        }}
        onCancel={() => setConfirmDialog((prev) => ({ ...prev, isOpen: false }))}
        title={confirmDialog.title}
        description={confirmDialog.description}
        confirmLabel={confirmDialog.confirmLabel}
        cancelLabel={confirmDialog.cancelLabel}
      />

      {/* Toasts */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            message={toast.message}
            variant={toast.variant}
            onClose={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))}
          />
        ))}
      </div>
    </div>
  );
}
