'use client';

import { useEffect } from 'react';
import { FaTrash, FaCheck, FaTimes } from 'react-icons/fa';

export default function ConfirmDialog({
  isOpen,
  onConfirm,
  onCancel,
  title = 'Xác nhận thao tác',
  description = 'Bạn có chắc chắn muốn thực hiện thao tác này?',
  confirmLabel = 'Xác nhận',
  cancelLabel = 'Hủy bỏ',
  variant = 'danger',
  loading = false,
}) {
  if (!isOpen) return null;

  useEffect(() => {
    const handleEsc = (e) => e.key === 'Escape' && onCancel();
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onCancel]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={onCancel}
      />

      {/* Dialog */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 transform transition-all duration-300 scale-100">
        <div className="p-6">
          {/* Icon */}
          <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${
            variant === 'danger' ? 'bg-rose-100 text-rose-600' : 'bg-amber-100 text-amber-600'
          }`}>
            <FaTrash size={24} />
          </div>

          <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
          <p className="text-gray-600 mb-6">{description}</p>

          <div className="flex gap-3">
            <button
              onClick={onCancel}
              disabled={loading}
              className="flex-1 px-4 py-3 rounded-xl font-medium text-gray-600 bg-gray-50 hover:bg-gray-100 transition-colors disabled:opacity-50"
            >
              {cancelLabel}
            </button>
            <button
              onClick={onConfirm}
              disabled={loading}
              className={`flex-1 px-4 py-3 rounded-xl font-medium text-white transition-all disabled:opacity-50 ${
                variant === 'danger' ? 'bg-rose-600 hover:bg-rose-700' : 'bg-indigo-600 hover:bg-indigo-700'
              }`}
            >
              {loading ? <LoadingSpinnerInline size="sm" /> : <FaCheck size={18} className="mr-1" />}{confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function LoadingSpinnerInline({ size = 'md' }) {
  const sizeMap = { sm: 'h-4 w-4', md: 'h-5 w-5' };
  return (
    <svg className={`animate-spin ${sizeMap[size]}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
    </svg>
  );
}