'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FaBars, FaHome, FaInfoCircle, FaPhone, FaShoppingCart, FaTimes, FaSearch, FaUser, FaHeart, FaSignInAlt, FaSignOutAlt, FaBlog } from 'react-icons/fa';
import { useAuth } from '@/lib/AuthContext';

// Action Button Component
const ActionButton = ({ href, icon, label, badge, onClick }) => {
    return (
        <div className="relative mx-0.5 sm:mx-1 md:mx-1 lg:mx-1.5 xl:mx-2">
            {onClick ? (
                <button
                    onClick={onClick}
                    className="cursor-pointer flex flex-col items-center justify-center p-1 lg:p-1.5 xl:p-2 text-text-primary hover:text-primary transition-colors w-7 xs:w-8 sm:w-10 lg:w-12 xl:w-14"
                >
                    <span className="text-sm lg:text-base xl:text-lg">{icon}</span>
                    <span className="text-[8px] sm:text-[9px] lg:text-[10px] xl:text-xs mt-0.5 xl:mt-1 whitespace-nowrap font-medium">{label}</span>
                    {badge > 0 && (
                        <span className="absolute -top-1 -right-1 bg-primary text-white text-xs w-4 h-4 md:w-5 md:h-5 flex items-center justify-center rounded-full">
                            {badge}
                        </span>
                    )}
                </button>
            ) : (
                <Link href={href} className="flex flex-col items-center justify-center p-1 lg:p-1.5 xl:p-2 text-text-primary hover:text-primary transition-colors w-7 xs:w-8 sm:w-10 lg:w-12 xl:w-14">
                    <span className="text-sm lg:text-base xl:text-lg">{icon}</span>
                    <span className="text-[8px] sm:text-[9px] lg:text-[10px] xl:text-xs mt-0.5 xl:mt-1 whitespace-nowrap font-medium">{label}</span>
                    {badge > 0 && (
                        <span className="absolute -top-1 -right-1 bg-primary text-white text-xs w-4 h-4 md:w-5 md:h-5 flex items-center justify-center rounded-full">
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
    const [isWideScreen, setIsWideScreen] = useState(true);
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

    // Effect to track screen width
    useEffect(() => {
        const handleResize = () => {
            setIsWideScreen(window.innerWidth >= 1220);
        };

        // Initial check
        handleResize();

        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

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
                    <div className="flex items-center">
                        <Link
                            href="/"
                            className="flex items-center mr-1 xs:mr-2 sm:mr-4 md:mr-5 lg:mr-6 xl:mr-8 whitespace-nowrap flex-shrink-0 group"
                        >
                            <div className={`${scrolled ? 'bg-white shadow-md' : 'bg-white/90 shadow-sm'} rounded-lg p-1 xs:p-1.5 transition-all duration-300 group-hover:shadow-lg group-hover:scale-105`}>
                                <img
                                    src="/images/logo-2.png"
                                    alt="Tuấn Rèm"
                                    className="h-7 xs:h-8 sm:h-9 md:h-11 lg:h-14 w-auto object-contain drop-shadow-sm"
                                />
                            </div>
                        </Link>

                        {/* Desktop Navigation - Hidden on smaller screens and when not wide enough */}
                        <div className={`hidden ${isWideScreen ? 'lg:flex' : 'xl:flex'} space-x-1.5 sm:space-x-2 md:space-x-3 lg:space-x-3.5 xl:space-x-5 2xl:space-x-8`}>
                            <Link href="/" className="text-text-primary hover:text-primary transition-colors whitespace-nowrap text-xs lg:text-sm xl:text-base font-medium">
                                Trang chủ
                            </Link>
                            <Link href="/products" className="text-text-primary hover:text-primary transition-colors whitespace-nowrap text-xs lg:text-sm xl:text-base font-medium">
                                Sản phẩm
                            </Link>
                            <Link href="/cong-trinh" className="text-text-primary hover:text-primary transition-colors whitespace-nowrap text-xs lg:text-sm xl:text-base font-medium">
                                Công trình
                            </Link>
                            <Link href="/posts" className="text-text-primary hover:text-primary transition-colors whitespace-nowrap text-xs lg:text-sm xl:text-base font-medium">
                                Blog
                            </Link>
                            <Link href="/about" className="text-text-primary hover:text-primary transition-colors whitespace-nowrap text-xs lg:text-sm xl:text-base font-medium">
                                Giới thiệu
                            </Link>
                            <Link href="/contact" className="text-text-primary hover:text-primary transition-colors whitespace-nowrap text-xs lg:text-sm xl:text-base font-medium">
                                Liên hệ
                            </Link>
                            {isAdmin && (
                                <Link
                                    href="/admin"
                                    className="text-text-primary hover:text-primary transition-colors whitespace-nowrap text-xs lg:text-sm xl:text-base font-medium"
                                    onClick={e => {
                                        if (!user || userRole !== 'admin') {
                                            e.preventDefault();
                                            logout();
                                        }
                                    }}
                                >
                                    Quản trị
                                </Link>
                            )}
                        </div>
                    </div>

                    {/* Desktop Right Side (Search & Actions) */}
                    <div className={`hidden ${isWideScreen ? 'lg:flex' : 'xl:flex'} items-center`}>
                        {/* Search form */}
                        <form onSubmit={handleSearch} className="relative ml-1 sm:ml-2 xl:ml-4">
                            <input
                                type="text"
                                placeholder="Tìm kiếm sản phẩm..."
                                className="w-24 xs:w-28 sm:w-32 md:w-36 lg:w-40 xl:w-56 pl-2 lg:pl-3 xl:pl-4 pr-7 lg:pr-8 xl:pr-10 py-1 lg:py-1.5 xl:py-2 border rounded-full text-xs lg:text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <button
                                type="submit"
                                className="cursor-pointer absolute right-2 xl:right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-primary"
                            >
                                <FaSearch className="text-xs lg:text-sm" />
                            </button>
                        </form>

                        {/* Action buttons */}
                        <div className="flex items-center ml-1 sm:ml-2 lg:ml-2 xl:ml-6">
                            <ActionButton href="/favorites" icon={<FaHeart />} label="Yêu thích" badge={0} />
                            {/* <ActionButton href="/cart" icon={<FaShoppingCart />} label="Giỏ hàng" badge={0} /> */}

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

                    {/* Mobile icons */}
                    <div className={`${isWideScreen ? 'lg:hidden' : 'xl:hidden'} flex items-center space-x-0.5 xs:space-x-1 sm:space-x-2`}>
                        <Link href="/favorites" className="p-1 xs:p-1.5 sm:p-2 text-text-primary hover:text-primary">
                            <FaHeart className="text-sm xs:text-base sm:text-lg" />
                        </Link>
                        <Link href="/cart" className="p-1 xs:p-1.5 sm:p-2 text-text-primary hover:text-primary">
                            <FaShoppingCart className="text-sm xs:text-base sm:text-lg" />
                        </Link>
                        {user && (
                            <Link href="/account" className="p-1 xs:p-1.5 sm:p-2 text-text-primary hover:text-primary">
                                <FaUser className="text-sm xs:text-base sm:text-lg" />
                            </Link>
                        )}
                        <button
                            onClick={toggleMenu}
                            className="cursor-pointer p-1 xs:p-1.5 sm:p-2 text-text-primary hover:text-primary focus:outline-none"
                            aria-expanded={isOpen}
                        >
                            <span className="sr-only">{isOpen ? 'Đóng menu' : 'Mở menu'}</span>
                            {isOpen ? <FaTimes className="text-sm xs:text-base sm:text-lg" /> : <FaBars className="text-sm xs:text-base sm:text-lg" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <div className={`${isOpen ? 'block' : 'hidden'} ${isWideScreen ? 'lg:hidden' : 'xl:hidden'} bg-white shadow-lg max-h-[calc(100vh-70px)] overflow-y-auto`}>
                <div className="px-4 py-2 space-y-1">
                    <Link href="/" className="block py-2 text-text-primary hover:text-primary" onClick={() => setIsOpen(false)}>
                        <span className="inline-flex items-center font-medium"><FaHome className="mr-2" /> Trang chủ</span>
                    </Link>
                    <Link href="/about" className="block py-2 text-text-primary hover:text-primary" onClick={() => setIsOpen(false)}>
                        <span className="inline-flex items-center font-medium"><FaInfoCircle className="mr-2" /> Giới thiệu</span>
                    </Link>
                    <Link href="/products" className="block py-2 text-text-primary hover:text-primary" onClick={() => setIsOpen(false)}>
                        <span className="inline-flex items-center font-medium"><FaShoppingCart className="mr-2" /> Sản phẩm</span>
                    </Link>
                    <Link href="/cong-trinh" className="block py-2 text-text-primary hover:text-primary" onClick={() => setIsOpen(false)}>
                        <span className="inline-flex items-center font-medium"><FaInfoCircle className="mr-2" /> Công trình</span>
                    </Link>
                    <Link href="/posts" className="block py-2 text-text-primary hover:text-primary" onClick={() => setIsOpen(false)}>
                        <span className="inline-flex items-center font-medium"><FaBlog className="mr-2" /> Blog</span>
                    </Link>
                    <Link href="/contact" className="block py-2 text-text-primary hover:text-primary" onClick={() => setIsOpen(false)}>
                        <span className="inline-flex items-center font-medium"><FaPhone className="mr-2" /> Liên hệ</span>
                    </Link>
                    {isAdmin && (
                        <Link href="/admin" className="block py-2 text-text-primary hover:text-primary" onClick={() => setIsOpen(false)}>
                            <span className="inline-flex items-center font-medium"><FaUser className="mr-2" /> Quản trị</span>
                        </Link>
                    )}
                    {user ? (
                        <>
                            <Link href="/account" className="block py-2 text-text-primary hover:text-primary" onClick={() => setIsOpen(false)}>
                                <span className="inline-flex items-center font-medium"><FaUser className="mr-2" /> Tài khoản</span>
                            </Link>
                            <button
                                onClick={() => {
                                    setIsOpen(false);
                                    handleLogout();
                                }}
                                className="cursor-pointer w-full text-left block py-2 text-text-primary hover:text-primary"
                            >
                                <span className="inline-flex items-center font-medium"><FaSignOutAlt className="mr-2" /> Đăng xuất</span>
                            </button>
                        </>
                    ) : (
                        <Link href="/login" className="block py-2 text-text-primary hover:text-primary" onClick={() => setIsOpen(false)}>
                            <span className="inline-flex items-center font-medium"><FaSignInAlt className="mr-2" /> Đăng nhập</span>
                        </Link>
                    )}

                    <Link href="/favorites" className="block py-2 text-text-primary hover:text-primary" onClick={() => setIsOpen(false)}>
                        <span className="inline-flex items-center font-medium"><FaHeart className="mr-2" /> Yêu thích</span>
                    </Link>
                    <Link href="/cart" className="block py-2 text-text-primary hover:text-primary" onClick={() => setIsOpen(false)}>
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
                            onClick={() => setIsOpen(false)}
                        >
                            <FaSearch />
                        </button>
                    </form>
                </div>
            </div>
        </nav>
    );
}