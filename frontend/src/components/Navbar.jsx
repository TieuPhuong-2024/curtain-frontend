'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FaBars, FaHome, FaInfoCircle, FaPhone, FaShoppingCart, FaTimes, FaSearch, FaUser, FaHeart, FaSignInAlt, FaSignOutAlt, FaBlog } from 'react-icons/fa';
import { useAuth } from '@/lib/AuthContext';

// Action Button Component
const ActionButton = ({ href, icon, label, badge, onClick }) => {
    return (
        <div className="relative">
            {onClick ? (
                <button
                    onClick={onClick}
                    className="cursor-pointer flex flex-col items-center justify-center p-2 text-text-primary hover:text-primary transition-colors"
                >
                    <span className="text-lg">{icon}</span>
                    <span className="text-xs mt-1 whitespace-nowrap font-medium">{label}</span>
                    {badge > 0 && (
                        <span className="absolute -top-1 -right-1 bg-primary text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                            {badge}
                        </span>
                    )}
                </button>
            ) : (
                <Link href={href} className="flex flex-col items-center justify-center p-2 text-text-primary hover:text-primary transition-colors">
                    <span className="text-lg">{icon}</span>
                    <span className="text-xs mt-1 whitespace-nowrap font-medium">{label}</span>
                    {badge > 0 && (
                        <span className="absolute -top-1 -right-1 bg-primary text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                            {badge}
                        </span>
                    )}
                </Link>
            )}
        </div>
    );
};

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const { user, userRole, logout, isAdmin } = useAuth();
    const router = useRouter();

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    // Effect để theo dõi cuộn và thay đổi style navbar
    useEffect(() => {
        const handleScroll = () => {
            const isScrolled = window.scrollY > 20;
            if (isScrolled !== scrolled) {
                setScrolled(isScrolled);
            }
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [scrolled]);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
            setSearchQuery('');
            if (isOpen) {
                setIsOpen(false);
            }
        }
    };

    const handleLogout = async () => {
        await logout();
    };

    return (
        <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${scrolled
                ? 'bg-white/95 backdrop-blur-sm shadow-md py-2'
                : 'bg-white py-4'
            }`}>
            <div className="container-custom">
                <div className="flex justify-between items-center">
                    {/* Left side with logo and navigation */}
                    <div className="flex items-center flex-shrink-0">
                        <Link
                            href="/"
                            className="flex items-center mr-8 whitespace-nowrap flex-shrink-0"
                        >
                            <img src="/images/tuan-rem-logo.png" alt="Tuấn Rèm" className="h-12 w-auto" />
                        </Link>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex space-x-5 lg:space-x-6 mr-6 lg:mr-10">
                            <Link href="/" className="text-text-primary hover:text-primary transition-colors whitespace-nowrap text-sm font-medium">
                                Trang chủ
                            </Link>
                            <Link href="/products" className="text-text-primary hover:text-primary transition-colors whitespace-nowrap text-sm font-medium">
                                Sản phẩm
                            </Link>
                            <Link href="/cong-trinh" className="text-text-primary hover:text-primary transition-colors whitespace-nowrap text-sm font-medium">
                                Công trình
                            </Link>
                            <Link href="/posts" className="text-text-primary hover:text-primary transition-colors whitespace-nowrap text-sm font-medium">
                                Blog
                            </Link>
                            <Link href="/about" className="text-text-primary hover:text-primary transition-colors whitespace-nowrap text-sm font-medium">
                                Giới thiệu
                            </Link>
                            <Link href="/contact" className="text-text-primary hover:text-primary transition-colors whitespace-nowrap text-sm font-medium">
                                Liên hệ
                            </Link>
                            {isAdmin && (
                                <Link href="/admin" className="text-text-primary hover:text-primary transition-colors whitespace-nowrap text-sm font-medium">
                                    Quản trị
                                </Link>
                            )}
                        </div>
                    </div>

                    {/* Desktop Right Side (Search & Actions) */}
                    <div className="hidden md:flex items-center space-x-6">
                        {/* Search form */}
                        <form onSubmit={handleSearch} className="relative ml-4">
                            <input
                                type="text"
                                placeholder="Tìm kiếm sản phẩm..."
                                className="w-56 pl-4 pr-10 py-2 border rounded-full text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <button
                                type="submit"
                                className="cursor-pointer absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-primary"
                            >
                                <FaSearch />
                            </button>
                        </form>

                        {/* Action buttons */}
                        <div className="flex items-center space-x-3">
                            <ActionButton href="/favorites" icon={<FaHeart />} label="Yêu thích" badge={0} />
                            <ActionButton href="/cart" icon={<FaShoppingCart />} label="Giỏ hàng" badge={0} />

                            {user ? (
                                <>
                                    <ActionButton
                                        href="/account"
                                        icon={<FaUser />}
                                        label={userRole === 'admin' ? 'Admin' : 'Tài khoản'}
                                    />
                                    <ActionButton
                                        onClick={handleLogout}
                                        icon={<FaSignOutAlt />}
                                        label="Đăng xuất"
                                    />
                                </>
                            ) : (
                                <ActionButton
                                    href="/login"
                                    icon={<FaSignInAlt />}
                                    label="Đăng nhập"
                                />
                            )}
                        </div>
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={toggleMenu}
                            className="cursor-pointer inline-flex items-center justify-center p-2 rounded-md text-text-primary hover:text-primary focus:outline-none transition-colors"
                            aria-expanded={isOpen}
                        >
                            <span className="sr-only">{isOpen ? 'Đóng menu' : 'Mở menu'}</span>
                            {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <div className={`${isOpen ? 'block' : 'hidden'} md:hidden bg-white shadow-lg`}>
                <div className="px-4 py-2 space-y-1">
                    <Link href="/" className="block py-2 text-text-primary hover:text-primary">
                        <span className="inline-flex items-center font-medium"><FaHome className="mr-2" /> Trang chủ</span>
                    </Link>
                    <Link href="/about" className="block py-2 text-text-primary hover:text-primary">
                        <span className="inline-flex items-center font-medium"><FaInfoCircle className="mr-2" /> Giới thiệu</span>
                    </Link>
                    <Link href="/products" className="block py-2 text-text-primary hover:text-primary">
                        <span className="inline-flex items-center font-medium"><FaShoppingCart className="mr-2" /> Sản phẩm</span>
                    </Link>
                    <Link href="/cong-trinh" className="block py-2 text-text-primary hover:text-primary">
                        <span className="inline-flex items-center font-medium"><FaInfoCircle className="mr-2" /> Công trình</span>
                    </Link>
                    <Link href="/posts" className="block py-2 text-text-primary hover:text-primary">
                        <span className="inline-flex items-center font-medium"><FaBlog className="mr-2" /> Blog</span>
                    </Link>
                    <Link href="/contact" className="block py-2 text-text-primary hover:text-primary">
                        <span className="inline-flex items-center font-medium"><FaPhone className="mr-2" /> Liên hệ</span>
                    </Link>
                    {isAdmin && (
                        <Link href="/admin" className="block py-2 text-text-primary hover:text-primary">
                            <span className="inline-flex items-center font-medium"><FaUser className="mr-2" /> Quản trị</span>
                        </Link>
                    )}
                    {user ? (
                        <>
                            <Link href="/account" className="block py-2 text-text-primary hover:text-primary">
                                <span className="inline-flex items-center font-medium"><FaUser className="mr-2" /> Tài khoản</span>
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="cursor-pointer w-full text-left block py-2 text-text-primary hover:text-primary"
                            >
                                <span className="inline-flex items-center font-medium"><FaSignOutAlt className="mr-2" /> Đăng xuất</span>
                            </button>
                        </>
                    ) : (
                        <Link href="/login" className="block py-2 text-text-primary hover:text-primary">
                            <span className="inline-flex items-center font-medium"><FaSignInAlt className="mr-2" /> Đăng nhập</span>
                        </Link>
                    )}

                    <Link href="/favorites" className="block py-2 text-text-primary hover:text-primary">
                        <span className="inline-flex items-center font-medium"><FaHeart className="mr-2" /> Yêu thích</span>
                    </Link>
                    <Link href="/cart" className="block py-2 text-text-primary hover:text-primary">
                        <span className="inline-flex items-center font-medium"><FaShoppingCart className="mr-2" /> Giỏ hàng</span>
                    </Link>
                </div>

                {/* Mobile search */}
                <div className="px-4 py-3 border-t">
                    <form onSubmit={handleSearch} className="relative">
                        <input
                            type="text"
                            placeholder="Tìm kiếm sản phẩm..."
                            className="w-full pl-4 pr-10 py-2 border rounded-full text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <button
                            type="submit"
                            className="cursor-pointer absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-primary"
                        >
                            <FaSearch />
                        </button>
                    </form>
                </div>
            </div>
        </nav>
    );
}