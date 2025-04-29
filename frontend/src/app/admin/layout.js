'use client';

import {Inter} from 'next/font/google';
import Link from 'next/link';
import { useAuth } from '@/lib/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const inter = Inter({subsets: ['latin']});

export default function AdminLayout({children}) {
    const { user, userRole, loading, logout } = useAuth();
    const router = useRouter();

    useEffect(() => {
        // Check if user is not an admin
        if (!loading && (!user || userRole !== 'admin')) {
            router.push('/');
        }
    }, [user, userRole, loading, router]);

    // If still loading or no permission, show minimal loading UI
    if (loading || !user || userRole !== 'admin') {
        return <div className="flex justify-center items-center min-h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>;
    }

    // Handle logout
    const handleLogout = async () => {
        await logout();
        router.push('/');
    };

    return (
        <div className="flex min-h-screen">
            {/* Sidebar */}
            <div className="w-64 bg-gray-800 text-white">
                <div className="p-4">
                    <h2 className="text-2xl font-bold">Admin</h2>
                    <p className="text-sm text-gray-300">{user.email}</p>
                </div>
                <nav className="mt-4">
                    <ul>
                        <li>
                            <Link href="/admin" className="block py-2 px-4 hover:bg-gray-700">
                                Dashboard
                            </Link>
                        </li>
                        <li>
                            <Link href="/admin/posts" className="block py-2 px-4 hover:bg-gray-700">
                                Quản lý Bài viết
                            </Link>
                        </li>
                        <li>
                            <Link href="/admin/banners" className="block py-2 px-4 hover:bg-gray-700">
                                Quản lý Banner
                            </Link>
                        </li>
                        <li>
                            <Link href="/admin/categories" className="block py-2 px-4 hover:bg-gray-700">
                                Danh mục sản phẩm
                            </Link>
                        </li>
                        <li>
                            <Link href="/admin/curtains" className="block py-2 px-4 hover:bg-gray-700">
                                Quản lý Rèm
                            </Link>
                        </li>
                        <li>
                            <Link href="/admin/contacts" className="block py-2 px-4 hover:bg-gray-700">
                                Quản lý Liên hệ
                            </Link>
                        </li>
                        <li>
                            <Link href="/admin/projects" className="block py-2 px-4 hover:bg-gray-700">
                                Quản lý công trình
                            </Link>
                        </li>
                        <li>
                            <Link href="/" className="block py-2 px-4 hover:bg-gray-700">
                                Về Trang Chính
                            </Link>
                        </li>
                        <li>
                            <button 
                                onClick={handleLogout}
                                className="w-full text-left block py-2 px-4 hover:bg-gray-700 text-red-300"
                            >
                                Đăng xuất
                            </button>
                        </li>
                    </ul>
                </nav>
            </div>

            {/* Main content */}
            <div className="flex-1 bg-gray-100">
                <div className="p-8">
                    {children}
                </div>
            </div>
        </div>
    );
}