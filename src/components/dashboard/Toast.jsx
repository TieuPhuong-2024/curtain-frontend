'use client';

import { useEffect, useState } from 'react';
import { FaCheckCircle, FaExclamationCircle, FaInfoCircle } from 'react-icons/fa';

const variantConfigs = {
  success: { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700', icon: <FaCheckCircle className="text-emerald-500" /> },
  error: { bg: 'bg-rose-50', border: 'border-rose-200', text: 'text-rose-700', icon: <FaExclamationCircle className="text-rose-500" /> },
  info: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700', icon: <FaInfoCircle className="text-blue-500" /> },
};

export default function Toast({ message, variant = 'info', onClose, duration = 5000 }) {
  const [visible, setVisible] = useState(true);
  const config = variantConfigs[variant];

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), duration);
    return () => clearTimeout(timer);
  }, [duration]);

  if (!visible) return null;

  return (
    <div
      className={`fixed bottom-4 right-4 z-50 flex items-start gap-3 px-4 py-3 rounded-xl shadow-lg border ${
        config.bg
      } ${config.border} ${config.text} animate-in slide-in-from-bottom-2 duration-300`}
    >
      <div className="flex-shrink-0 mt-0.5">{config.icon}</div>
      <div>
        <p className="text-sm font-medium">{message}</p>
      </div>
      <button
        onClick={() => {
          setVisible(false);
          onClose?.();
        }}
        className="ml-2 text-gray-400 hover:text-gray-600 transition-colors"
        aria-label="Đóng thông báo"
      >
        <span className="sr-only">Đóng</span>
        <span className="block w-5 h-5" dangerouslySetInnerHTML={{ __html: '<path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>' }} />
      </button>
    </div>
  );
}