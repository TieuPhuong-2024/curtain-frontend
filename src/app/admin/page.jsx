"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  FaWindowMaximize, FaShoppingCart, FaTags, FaBuilding, FaImage, FaList, FaEnvelope,
  FaChartPie, FaClock, FaUserPlus, FaTrash, FaEdit, FaEye
} from 'react-icons/fa';
import { getCurtains } from '@/lib/api';
import StatCard from '@/components/dashboard/StatCard';
import Badge from '@/components/dashboard/Badge';
import ActionButton from '@/components/dashboard/ActionButton';
import EmptyState from '@/components/dashboard/EmptyState';
import LoadingSpinner from '@/components/dashboard/LoadingSpinner';

const statusColors = {
  published: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  draft: 'bg-amber-100 text-amber-700 border-amber-200',
  archived: 'bg-gray-100 text-gray-700 border-gray-200',
};

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalCurtains: 0,
    lowStock: 0,
    totalCategories: 0,
    totalOrders: 0,
  });
  const [recentItems, setRecentItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const curtains = await getCurtains();
      const totalCurtains = curtains.length;
      const lowStockItems = curtains.filter((c) => !c.inStock).length;

      setStats({
        totalCurtains,
        lowStock: lowStockItems,
        totalCategories: 8,
        totalOrders: 24,
      });

      setRecentItems(
        curtains
          .slice(0, 5)
          .map((c) => ({
            id: c._id,
            name: c.name,
            category: typeof c.category === 'object' ? c.category?.name : c.category,
            price: c.price,
            status: c.inStock ? 'published' : 'draft',
            updatedAt: c.updatedAt || c.createdAt,
          }))
      );

      setLoading(false);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Không thể tải dữ liệu thống kê. Vui lòng thử lại sau.');
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Tổng sản phẩm',
      value: stats.totalCurtains,
      icon: FaWindowMaximize,
      trend: 12,
      trendLabel: 'so với tháng trước',
      variant: 'primary',
    },
    {
      title: 'Sắp hết hàng',
      value: stats.lowStock,
      icon: FaShoppingCart,
      trend: -5,
      trendLabel: 'so với tuần trước',
      variant: stats.lowStock > 0 ? 'warning' : 'success',
    },
    {
      title: 'Danh mục',
      value: stats.totalCategories,
      icon: FaTags,
      trend: 0,
      trendLabel: '',
      variant: 'info',
    },
    {
      title: 'Đơn hàng hôm nay',
      value: stats.totalOrders,
      icon: FaChartPie,
      trend: 18,
      trendLabel: 'so với hôm qua',
      variant: 'success',
    },
  ];

  const quickActions = [
    {
      label: 'Thêm sản phẩm',
      href: '/admin/curtains/add',
      icon: <FaUserPlus size={18} />,
      variant: 'primary',
    },
    {
      label: 'Quản lý danh mục',
      href: '/admin/categories',
      icon: <FaTags size={18} />,
      variant: 'secondary',
    },
    {
      label: 'Quản lý công trình',
      href: '/admin/projects',
      icon: <FaBuilding size={18} />,
      variant: 'secondary',
    },
    {
      label: 'Quản lý Banner',
      href: '/admin/banners',
      icon: <FaImage size={18} />,
      variant: 'ghost',
    },
    {
      label: 'Quản lý bài viết',
      href: '/admin/posts',
      icon: <FaList size={18} />,
      variant: 'ghost',
    },
    {
      label: 'Quản lý liên hệ',
      href: '/admin/contacts',
      icon: <FaEnvelope size={18} />,
      variant: 'ghost',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Bảng điều khiển</h1>
          <p className="text-gray-500 mt-1">
            Chào mừng quay lại. Dưới đây là tổng quan về hoạt động của cửa hàng.
          </p>
        </div>
        <div className="flex gap-3">
          <ActionButton
            href="/admin/curtains/add"
            icon={<FaUserPlus size={16} />}
            variant="primary"
            size="sm"
          >
            Thêm sản phẩm mới
          </ActionButton>
          <ActionButton
            variant="outline"
            size="sm"
            onClick={() => window.location.reload()}
          >
            <FaClock size={16} /> Làm mới
          </ActionButton>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-xl flex items-center gap-3">
          <FaExclamationCircle size={20} />
          <div>
            <p className="font-medium">{error}</p>
            <button
              onClick={fetchDashboardData}
              className="mt-2 text-xs text-rose-600 hover:underline font-medium"
            >
              Thử lại
            </button>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, idx) => (
          <StatCard key={idx} {...card} />
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <LoadingSpinner size="lg" className="text-indigo-600" />
        </div>
      ) : (
        <>
          {/* Quick Actions */}
          <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-50">
              <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
                Thao tác nhanh
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-6 gap-0 border-t border-gray-50">
              {quickActions.map((action, idx) => (
                <Link
                  key={idx}
                  href={action.href}
                  className="flex flex-col items-center justify-center p-4 gap-2 hover:bg-gray-50 transition-colors border-r border-b border-gray-50 last:border-r-0 lg:last:border-b-0"
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    action.variant === 'primary'
                      ? 'bg-indigo-100 text-indigo-600'
                      : action.variant === 'secondary'
                        ? 'bg-emerald-100 text-emerald-600'
                        : 'bg-gray-100 text-gray-600'
                  }`}>
                    {action.icon}
                  </div>
                  <span className="text-xs font-medium text-gray-700 text-center leading-tight">
                    {action.label}
                  </span>
                </Link>
              ))}
            </div>
          </section>

          {/* Recent Activity */}
          <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-50 flex justify-between items-center">
              <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
                Hoạt động gần đây
              </h2>
              <Link
                href="/admin/curtains"
                className="text-sm text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1"
              >
                Xem tất cả <span>→</span>
              </Link>
            </div>

            {recentItems.length === 0 ? (
              <EmptyState
                title="Chưa có sản phẩm"
                description="Thêm sản phẩm đầu tiên để bắt đầu quản lý."
                action={() => (window.location.href = '/admin/curtains/add')}
                actionLabel="Thêm sản phẩm"
              />
            ) : (
              <div className="divide-y divide-gray-50">
                {recentItems.map((item) => (
                  <div key={item.id} className="px-6 py-4 flex items-center gap-4 hover:bg-gray-50 transition-colors group">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 group-hover:bg-indigo-100 transition-colors">
                      <FaImage size={20} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
                      <p className="text-xs text-gray-500 truncate">
                        {item.category || 'Chưa phân loại'}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-medium text-gray-900 block">
                        {item.price ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price) : 'Liên hệ'}
                      </span>
                      <Badge variant={item.status === 'published' ? 'success' : 'warning'} size="sm">
                        {item.status === 'published' ? 'Còn hàng' : 'Hết hàng'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}
