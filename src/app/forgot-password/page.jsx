'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/AuthContext';
import Link from 'next/link';

function mapResetError(message) {
  if (message.includes('auth/invalid-email')) {
    return 'Email không hợp lệ';
  }
  if (message.includes('auth/missing-email')) {
    return 'Vui lòng nhập email';
  }
  if (message.includes('auth/too-many-requests')) {
    return 'Quá nhiều yêu cầu. Thử lại sau.';
  }
  return message.replace(/^Firebase: Error \(|\)\.$/g, '') || 'Gửi email thất bại';
}

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const { resetPassword } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    if (!email.trim()) {
      setError('Vui lòng nhập email');
      setLoading(false);
      return;
    }

    try {
      const result = await resetPassword(email.trim());

      if (result.success) {
        setSuccess(true);
      } else {
        setError(mapResetError(result.error || ''));
      }
    } catch (err) {
      setError(mapResetError(err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight">
            Quên mật khẩu
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Nhập email đã đăng ký. Chúng tôi gửi link đặt lại mật khẩu.
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded relative" role="status">
            <span className="block sm:inline">
              Đã gửi email đặt lại mật khẩu (nếu tài khoản tồn tại). Kiểm tra hộp thư và thư rác.
            </span>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email-address" className="sr-only">
              Email
            </label>
            <input
              id="email-address"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="relative block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="cursor-pointer group relative flex w-full justify-center rounded-md bg-indigo-600 py-2 px-3 text-sm font-semibold text-white hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:bg-indigo-400"
            >
              {loading ? 'Đang gửi...' : 'Gửi link đặt lại mật khẩu'}
            </button>
          </div>
        </form>

        <p className="text-center text-sm text-gray-600">
          <Link href="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
            Quay lại đăng nhập
          </Link>
        </p>
      </div>
    </div>
  );
}
