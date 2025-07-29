 'use client';

import {Inter} from 'next/font/google';
import Link from 'next/link';
import { useAuth } from '@/lib/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';

const inter = Inter({subsets: ['latin']});

export default function AdminLayout({children}) {
    const { user, userRole, loading, logout } = useAuth();
    const router = useRouter();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        // Check if user is not an admin
        if (!loading && (!user || userRole !== 'admin')) {
            logout();
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

    // Close sidebar when clicking a link on mobile
    const handleNavClick = () => {
        if (window.innerWidth < 768) {
            setSidebarOpen(false);
        }
    };

    return (
        <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
            {/* Mobile Header */}
            <div className="md:hidden bg-gray-800 text-white p-4 flex justify-between items-center">
                <h2 className="text-xl font-bold">Admin Panel</h2>
                <button 
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="p-2 focus:outline-none"
                >
                    {sidebarOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
                </button>
            </div>

            {/* Sidebar */}
            <div className={`
                ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
                md:translate-x-0
                transition-transform duration-300 ease-in-out
                fixed md:static top-0 left-0 h-full md:h-auto z-40
                w-3/4 sm:w-64 md:w-64 lg:w-72
                bg-gray-800 text-white
                overflow-y-auto
                md:flex-shrink-0
                mt-16 md:mt-0
                shadow-lg md:shadow-none
            `}>
                <div className="p-4 border-b border-gray-700 hidden md:block">
                    <h2 className="text-2xl font-bold">Admin</h2>
                    <p className="text-sm text-gray-300 truncate">{user.email}</p>
                </div>
                <nav className="mt-2">
                    <ul>
                        <li>
                            <Link 
                                href="/admin" 
                                className="flex items-center py-3 px-4 hover:bg-gray-700"
                                onClick={handleNavClick}
                            >
                                Dashboard
                            </Link>
                        </li>
                        <li>
                            <Link 
                                href="/admin/curtains" 
                                className="flex items-center py-3 px-4 hover:bg-gray-700"
                                onClick={handleNavClick}
                            >
                                Quản lý rèm cửa
                            </Link>
                        </li>
                        <li>
                            <Link 
                                href="/admin/categories" 
                                className="flex items-center py-3 px-4 hover:bg-gray-700"
                                onClick={handleNavClick}
                            >
                                Danh mục sản phẩm
                            </Link>
                        </li>
                        <li>
                            <Link 
                                href="/admin/banners" 
                                className="flex items-center py-3 px-4 hover:bg-gray-700"
                                onClick={handleNavClick}
                            >
                                Quản lý Banner
                            </Link>
                        </li>
                        <li>
                            <Link 
                                href="/admin/projects" 
                                className="flex items-center py-3 px-4 hover:bg-gray-700"
                                onClick={handleNavClick}
                            >
                                Quản lý công trình
                            </Link>
                        </li>
                        <li>
                            <Link 
                                href="/admin/contacts" 
                                className="flex items-center py-3 px-4 hover:bg-gray-700"
                                onClick={handleNavClick}
                            >
                                Quản lý liên hệ
                            </Link>
                        </li>
                        <li>
                            <Link 
                                href="/admin/posts" 
                                className="flex items-center py-3 px-4 hover:bg-gray-700"
                                onClick={handleNavClick}
                            >
                                Quản lý bài viết
                            </Link>
                        </li>
                        <li>
                            <Link 
                                href="/" 
                                className="flex items-center py-3 px-4 hover:bg-gray-700"
                                onClick={handleNavClick}
                            >
                                Về Trang Chính
                            </Link>
                        </li>
                        <li>
                            <button 
                                onClick={() => {
                                    handleNavClick();
                                    handleLogout();
                                }}
                                className="w-full text-left flex items-center py-3 px-4 hover:bg-gray-700 text-red-300"
                            >
                                Đăng xuất
                            </button>
                        </li>
                    </ul>
                </nav>
            </div>

            {/* Backdrop for mobile */}
            {sidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
                    onClick={() => setSidebarOpen(false)}
                ></div>
            )}

            {/* Main content */}
            <div className="flex-1 md:ml-0 overflow-x-hidden">
                <div className="p-4 sm:p-6 md:p-8">
                    {children}
                </div>
            </div>
        </div>
    );
}