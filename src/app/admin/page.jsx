'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  FaBuilding,
  FaEnvelope,
  FaImage,
  FaList,
  FaPen,
  FaPlus,
  FaTags,
  FaWindowMaximize,
} from 'react-icons/fa';

import { getAllContacts, getCategories, getCurtains } from '@/lib/api';
import PageHeader from '@/components/admin/PageHeader';
import Panel, { PanelHeader } from '@/components/admin/Panel';
import LedgerTable from '@/components/admin/LedgerTable';
import Button, { buttonClasses } from '@/components/admin/Button';
import Badge from '@/components/admin/Badge';
import Thumb from '@/components/admin/Thumb';
import EmptyState from '@/components/admin/EmptyState';
import { formatDate, formatNumber, formatPrice } from '@/components/admin/format';

const shortcuts = [
  { href: '/admin/curtains/add', label: 'Thêm sản phẩm', icon: FaPlus },
  { href: '/admin/categories/add', label: 'Thêm danh mục', icon: FaTags },
  { href: '/admin/projects/add', label: 'Thêm công trình', icon: FaBuilding },
  { href: '/admin/banners', label: 'Sửa banner trang chủ', icon: FaImage },
  { href: '/admin/posts/new', label: 'Viết bài mới', icon: FaList },
  { href: '/admin/contacts', label: 'Xem liên hệ', icon: FaEnvelope },
];

function categoryName(curtain) {
  return typeof curtain.category === 'object' ? curtain.category?.name : curtain.category;
}

function StatCell({ label, value, hint, loading }) {
  return (
    <div className="bg-[var(--a-surface)] p-5">
      <dt className="text-[12px] font-medium text-[var(--a-muted)]">{label}</dt>
      {loading ? (
        <span className="mt-2 block h-7 w-16 animate-pulse rounded bg-[var(--a-line)]" />
      ) : (
        <dd className="mt-2 text-[28px] font-semibold leading-none tabular-nums text-[var(--a-ink)]">
          {value}
        </dd>
      )}
      <p className="mt-2 text-[12px] text-[var(--a-faint)]">{hint}</p>
    </div>
  );
}

export default function AdminDashboard() {
  const [curtains, setCurtains] = useState([]);
  const [categories, setCategories] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [curtainsError, setCurtainsError] = useState('');
  const [contactsError, setContactsError] = useState(false);
  const [updatedAt, setUpdatedAt] = useState('');

  const fetchDashboardData = async () => {
    setLoading(true);
    setCurtainsError('');
    setContactsError(false);

    const [curtainsResult, categoriesResult, contactsResult] = await Promise.allSettled([
      getCurtains(),
      getCategories(),
      getAllContacts(),
    ]);

    if (curtainsResult.status === 'fulfilled') {
      setCurtains(Array.isArray(curtainsResult.value) ? curtainsResult.value : []);
    } else {
      console.error('Error fetching curtains:', curtainsResult.reason);
      setCurtainsError('Không tải được danh sách sản phẩm.');
    }

    if (categoriesResult.status === 'fulfilled') {
      setCategories(Array.isArray(categoriesResult.value) ? categoriesResult.value : []);
    } else {
      console.error('Error fetching categories:', categoriesResult.reason);
      setCategories([]);
    }

    if (contactsResult.status === 'fulfilled') {
      setContacts(Array.isArray(contactsResult.value) ? contactsResult.value : []);
    } else {
      console.error('Error fetching contacts:', contactsResult.reason);
      setContactsError(true);
      setContacts([]);
    }

    setUpdatedAt(
      new Intl.DateTimeFormat('vi-VN', { hour: '2-digit', minute: '2-digit' }).format(new Date())
    );
    setLoading(false);
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const totalCurtains = curtains.length;
  const inStockCount = curtains.filter((curtain) => curtain.inStock).length;
  const outOfStockCount = totalCurtains - inStockCount;
  const newContacts = contacts.filter((contact) => contact.status === 'new').length;

  const recentProducts = [...curtains]
    .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
    .slice(0, 5);

  const columns = [
    {
      key: 'name',
      label: 'Sản phẩm',
      primary: true,
      render: (curtain) => (
        <div className="flex min-w-0 items-center gap-3">
          <Thumb
            src={curtain.mainImage || curtain.image}
            alt={curtain.name}
            className="h-10 w-10 shrink-0"
          />
          <div className="min-w-0">
            <p className="truncate font-medium text-[var(--a-ink)]">{curtain.name}</p>
            <p className="mt-0.5 text-[12px] text-[var(--a-faint)]">
              {formatDate(curtain.createdAt)}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: 'category',
      label: 'Danh mục',
      render: (curtain) => (
        <span className="text-[var(--a-muted)]">{categoryName(curtain) || 'Chưa phân loại'}</span>
      ),
    },
    {
      key: 'price',
      label: 'Giá',
      align: 'right',
      render: (curtain) => (
        <span className="whitespace-nowrap font-medium tabular-nums text-[var(--a-ink)]">
          {formatPrice(curtain.price)}
        </span>
      ),
    },
    {
      key: 'stock',
      label: 'Trạng thái',
      render: (curtain) => (
        <Badge tone={curtain.inStock ? 'success' : 'danger'} dot>
          {curtain.inStock ? 'Còn hàng' : 'Hết hàng'}
        </Badge>
      ),
    },
    {
      key: 'actions',
      label: '',
      actions: true,
      align: 'right',
      width: '56px',
      render: (curtain) => (
        <Link
          href={`/admin/curtains/edit/${curtain._id}`}
          className="flex h-8 w-8 items-center justify-center rounded-[6px] text-[var(--a-muted)] transition hover:bg-[var(--a-raised)] hover:text-[var(--a-cham)]"
          aria-label={`Sửa ${curtain.name}`}
          title="Sửa sản phẩm"
        >
          <FaPen className="h-3.5 w-3.5" />
        </Link>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Sổ xưởng"
        description="Tình hình hôm nay: hàng còn trong kho, nhóm sản phẩm và liên hệ mới từ khách."
        meta={updatedAt ? `Cập nhật ${updatedAt}` : undefined}
        actions={
          <>
            <Link href="/admin/posts/new" className={buttonClasses('secondary', 'md')}>
              Viết bài
            </Link>
            <Link href="/admin/curtains/add" className={buttonClasses('primary', 'md')}>
              <FaPlus className="h-3.5 w-3.5" />
              Thêm sản phẩm
            </Link>
          </>
        }
      />

      <Panel className="overflow-hidden">
        <dl className="grid grid-cols-2 gap-px bg-[var(--a-line)] lg:grid-cols-4">
          <StatCell
            label="Sản phẩm"
            value={formatNumber(totalCurtains)}
            hint={loading ? 'Đang đếm…' : `${formatNumber(inStockCount)} đang còn hàng`}
            loading={loading}
          />
          <StatCell
            label="Hết hàng"
            value={formatNumber(outOfStockCount)}
            hint={outOfStockCount ? 'Cần nhập thêm' : 'Không có mẫu hết hàng'}
            loading={loading}
          />
          <StatCell
            label="Danh mục"
            value={formatNumber(categories.length)}
            hint="Nhóm sản phẩm trong sổ"
            loading={loading}
          />
          <StatCell
            label="Liên hệ mới"
            value={contactsError ? '—' : formatNumber(newContacts)}
            hint={contactsError ? 'Không tải được hộp thư' : `${formatNumber(contacts.length)} tổng cộng`}
            loading={loading}
          />
        </dl>
      </Panel>

      {curtainsError ? (
        <Panel className="border-[rgba(156,59,54,0.25)]">
          <div className="flex flex-col items-start gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-[var(--a-danger)]">{curtainsError}</p>
            <Button size="sm" onClick={fetchDashboardData}>
              Thử lại
            </Button>
          </div>
        </Panel>
      ) : (
        <Panel>
          <PanelHeader title="Sản phẩm mới nhất" description="Năm mẫu vừa được ghi vào sổ.">
            <Link
              href="/admin/curtains"
              className="text-[12.5px] text-[var(--a-cham)] hover:underline"
            >
              Xem tất cả
            </Link>
          </PanelHeader>

          <LedgerTable
            columns={columns}
            rows={recentProducts}
            loading={loading}
            caption="Năm sản phẩm mới nhất"
            empty={
              <EmptyState
                icon={FaWindowMaximize}
                title="Sổ chưa có sản phẩm nào"
                description="Thêm mẫu rèm đầu tiên để bắt đầu theo dõi giá và tồn kho."
                action={
                  <Link href="/admin/curtains/add" className={buttonClasses('primary', 'sm')}>
                    Thêm sản phẩm
                  </Link>
                }
              />
            }
          />
        </Panel>
      )}

      <Panel>
        <PanelHeader title="Đi nhanh" description="Các việc thường làm trong ngày." />
        <div className="grid gap-px bg-[var(--a-line)] sm:grid-cols-2 lg:grid-cols-3">
          {shortcuts.map((shortcut) => {
            const Icon = shortcut.icon;
            return (
              <Link
                key={shortcut.href}
                href={shortcut.href}
                className="flex items-center gap-3 bg-[var(--a-surface)] px-5 py-4 text-[13px] text-[var(--a-ink)] transition-colors hover:bg-[var(--a-raised)]"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--a-cham-soft)] text-[var(--a-cham)]">
                  <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                </span>
                {shortcut.label}
              </Link>
            );
          })}
        </div>
      </Panel>
    </div>
  );
}
