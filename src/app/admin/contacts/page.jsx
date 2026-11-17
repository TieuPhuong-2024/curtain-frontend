'use client';

import { useEffect, useState } from 'react';
import { FaEnvelope, FaTrash } from 'react-icons/fa';

import { getAllContacts, updateContactStatus, deleteContact } from '@/lib/api';
import PageHeader from '@/components/admin/PageHeader';
import Panel from '@/components/admin/Panel';
import Toolbar from '@/components/admin/Toolbar';
import LedgerTable from '@/components/admin/LedgerTable';
import Pagination from '@/components/admin/Pagination';
import Button from '@/components/admin/Button';
import ConfirmDialog from '@/components/admin/ConfirmDialog';
import EmptyState from '@/components/admin/EmptyState';
import { formatDate, formatNumber, getInitial } from '@/components/admin/format';
import { notify } from '@/components/admin/notify';
import { selectClass } from '@/components/admin/Field';

const PAGE_SIZE = 10;

const statusLabels = {
  new: 'Mới',
  processing: 'Đang xử lý',
  completed: 'Hoàn thành',
};

const statusSelectTones = {
  new: 'border-[rgba(44,70,87,0.25)] bg-[var(--a-cham-soft)] text-[var(--a-cham-deep)]',
  processing: 'border-[rgba(169,118,47,0.28)] bg-[var(--a-warning-soft)] text-[var(--a-warning)]',
  completed: 'border-[rgba(62,107,79,0.25)] bg-[var(--a-success-soft)] text-[var(--a-success)]',
};

export default function ContactsPage() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllContacts();
      setContacts(Array.isArray(data) ? data : []);
      setSelectedContacts([]);
    } catch (err) {
      console.error('Error fetching contacts:', err);
      setError('Không tải được danh sách liên hệ.');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    const previous = contacts;
    setContacts((current) =>
      current.map((contact) => (contact._id === id ? { ...contact, status: newStatus } : contact))
    );
    setUpdatingId(id);
    try {
      await updateContactStatus(id, newStatus);
      notify.success('Đã cập nhật trạng thái liên hệ.');
    } catch (err) {
      console.error('Error updating contact status:', err);
      setContacts(previous);
      notify.error('Không cập nhật được trạng thái. Vui lòng thử lại.');
    } finally {
      setUpdatingId(null);
    }
  };

  const keyword = searchTerm.trim().toLowerCase();
  const filteredContacts = contacts.filter((contact) => {
    const matchesSearch =
      !keyword ||
      [contact.name, contact.email, contact.phone, contact.subject, contact.message].some((value) =>
        value?.toLowerCase().includes(keyword)
      );
    const matchesStatus = statusFilter ? contact.status === statusFilter : true;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredContacts.length / PAGE_SIZE);
  const paginatedContacts = filteredContacts.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );
  const newCount = contacts.filter((contact) => contact.status === 'new').length;

  useEffect(() => {
    if (totalPages > 0 && currentPage > totalPages) setCurrentPage(totalPages);
  }, [totalPages, currentPage]);

  const toggleRow = (id) => {
    setSelectedContacts((current) =>
      current.includes(id) ? current.filter((value) => value !== id) : [...current, id]
    );
  };

  const toggleAll = (checked) => {
    const pageIds = paginatedContacts.map((contact) => contact._id);
    setSelectedContacts((current) =>
      checked
        ? Array.from(new Set([...current, ...pageIds]))
        : current.filter((id) => !pageIds.includes(id))
    );
  };

  const handleDeleteSelected = async () => {
    if (!selectedContacts.length) return;
    try {
      setDeleting(true);
      for (const id of selectedContacts) {
        await deleteContact(id);
      }
      notify.success(`Đã xóa ${selectedContacts.length} liên hệ.`);
      setDeleteOpen(false);
      await fetchContacts();
    } catch (err) {
      console.error('Error deleting contacts:', err);
      notify.error('Không xóa được liên hệ. Vui lòng thử lại.');
    } finally {
      setDeleting(false);
    }
  };

  const columns = [
    {
      key: 'name',
      label: 'Người liên hệ',
      primary: true,
      render: (contact) => (
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--a-cham-soft)] text-[12px] font-semibold text-[var(--a-cham)]">
            {getInitial(contact.name)}
          </span>
          <div className="min-w-0">
            <p className="truncate font-medium text-[var(--a-ink)]">{contact.name}</p>
            <p className="mt-0.5 truncate text-[12px] text-[var(--a-faint)]">
              {[contact.email, contact.phone].filter(Boolean).join(', ')}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: 'message',
      label: 'Nội dung',
      render: (contact) => (
        <div className="max-w-[46ch]">
          {contact.subject && (
            <p className="truncate text-[13px] font-medium text-[var(--a-ink)]">{contact.subject}</p>
          )}
          <p className="line-clamp-2 text-[12.5px] leading-5 text-[var(--a-muted)]">
            {contact.message}
          </p>
        </div>
      ),
    },
    {
      key: 'createdAt',
      label: 'Thời gian',
      render: (contact) => (
        <span className="whitespace-nowrap tabular-nums text-[var(--a-muted)]">
          {formatDate(contact.createdAt, true)}
        </span>
      ),
    },
    {
      key: 'status',
      label: 'Trạng thái',
      width: '150px',
      render: (contact) => (
        <select
          value={contact.status || 'new'}
          onChange={(event) => handleStatusUpdate(contact._id, event.target.value)}
          disabled={updatingId === contact._id}
          aria-label={`Trạng thái liên hệ của ${contact.name}`}
          className={`h-8 rounded-[6px] border px-2 text-[12px] font-medium transition focus:outline-none focus:ring-[3px] focus:ring-[rgba(44,70,87,0.12)] disabled:opacity-60 ${
            statusSelectTones[contact.status] || statusSelectTones.new
          }`}
        >
          {Object.entries(statusLabels).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      ),
    },
  ];

  const resetSelection = () => setSelectedContacts([]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Liên hệ"
        description="Yêu cầu tư vấn từ khách. Đánh dấu trạng thái để không bỏ sót ai."
        meta={`${formatNumber(filteredContacts.length)}${
          filteredContacts.length !== contacts.length ? ` / ${formatNumber(contacts.length)}` : ''
        } liên hệ`}
        actions={
          selectedContacts.length > 0 ? (
            <Button
              icon={FaTrash}
              variant="dangerSolid"
              onClick={() => setDeleteOpen(true)}
              disabled={deleting}
            >
              Xóa liên hệ đã chọn ({selectedContacts.length})
            </Button>
          ) : null
        }
      />

      {error ? (
        <Panel className="border-[rgba(156,59,54,0.25)]">
          <div className="flex flex-col items-start gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-[var(--a-danger)]">{error}</p>
            <Button size="sm" onClick={fetchContacts}>
              Thử lại
            </Button>
          </div>
        </Panel>
      ) : (
        <Panel>
          <Toolbar
            searchValue={searchTerm}
            onSearchChange={(value) => {
              setSearchTerm(value);
              setCurrentPage(1);
              resetSelection();
            }}
            searchPlaceholder="Tìm theo tên, email, nội dung…"
            filters={
              <select
                value={statusFilter}
                onChange={(event) => {
                  setStatusFilter(event.target.value);
                  setCurrentPage(1);
                  resetSelection();
                }}
                className={selectClass}
                aria-label="Lọc theo trạng thái"
              >
                <option value="">Tất cả trạng thái</option>
                <option value="new">Mới</option>
                <option value="processing">Đang xử lý</option>
                <option value="completed">Hoàn thành</option>
              </select>
            }
          >
            <p className="text-[12.5px] tabular-nums text-[var(--a-faint)]">
              {formatNumber(newCount)} liên hệ mới
            </p>
          </Toolbar>

          <LedgerTable
            columns={columns}
            rows={paginatedContacts}
            loading={loading}
            caption="Danh sách liên hệ"
            selectable
            selected={selectedContacts}
            onToggleRow={toggleRow}
            onToggleAll={toggleAll}
            empty={
              <EmptyState
                icon={FaEnvelope}
                title={keyword || statusFilter ? 'Không có liên hệ phù hợp' : 'Hộp thư đang trống'}
                description={
                  keyword || statusFilter
                    ? 'Thử từ khóa khác hoặc bỏ bộ lọc trạng thái.'
                    : 'Liên hệ mới từ trang công khai sẽ xuất hiện ở đây.'
                }
                action={
                  keyword || statusFilter ? (
                    <Button
                      size="sm"
                      onClick={() => {
                        setSearchTerm('');
                        setStatusFilter('');
                      }}
                    >
                      Bỏ bộ lọc
                    </Button>
                  ) : null
                }
              />
            }
          />

          <Pagination
            page={currentPage}
            totalPages={totalPages}
            total={filteredContacts.length}
            onChange={(page) => {
              setCurrentPage(page);
              resetSelection();
            }}
          />
        </Panel>
      )}

      <ConfirmDialog
        open={deleteOpen}
        title="Xóa liên hệ đã chọn?"
        description={`${selectedContacts.length} liên hệ sẽ bị xóa vĩnh viễn khỏi hộp thư. Thao tác này không hoàn tác được.`}
        confirmLabel="Xóa liên hệ"
        loading={deleting}
        onConfirm={handleDeleteSelected}
        onCancel={() => !deleting && setDeleteOpen(false)}
      />
    </div>
  );
}
