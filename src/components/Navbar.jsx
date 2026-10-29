'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FaBars, FaHome, FaInfoCircle, FaPhone, FaTimes, FaSearch, FaUser, FaSignInAlt, FaSignOutAlt, FaBlog, FaShoppingCart, FaCog } from 'react-icons/fa';
import { useAuth } from '@/lib/AuthContext';
import { usePathname } from 'next/navigation';
import styles from '@/styles/modules/Navbar.module.css';

// Action Button Component
const ActionButton = ({ href, icon, label, badge, onClick }) => {
    return (
        <div className={styles.actionButton}>
            {onClick ? (
                <button
                    onClick={onClick}
                    className={styles.actionButton}
                >
                    <span className={styles.actionIcon}>{icon}</span>
                    <span className={styles.actionLabel}>{label}</span>
                    {badge > 0 && (
                        <span className={styles.actionBadge}>
                            {badge}
                        </span>
                    )}
                </button>
            ) : (
                <Link href={href} className={styles.actionButtonLink}>
                    <span className={styles.actionIcon}>{icon}</span>
                    <span className={styles.actionLabel}>{label}</span>
                    {badge > 0 && (
                        <span className={styles.actionBadge}>
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
    const pathname = usePathname() || '';
    const router = useRouter();

    const navItems = [
        {
            href: '/',
            label: 'Trang chủ',
            icon: <FaHome className="mr-2" />,
            match: (path) => path === '/' || path === '/index',
        },
        {
            href: '/products',
            label: 'Sản phẩm',
            icon: <FaShoppingCart className="mr-2" />,
            match: (path) => path.startsWith('/products'),
        },
        {
            href: '/cong-trinh',
            label: 'Công trình',
            icon: <FaInfoCircle className="mr-2" />,
            match: (path) => path.startsWith('/cong-trinh'),
        },
        {
            href: '/posts',
            label: 'Blog',
            icon: <FaBlog className="mr-2" />,
            match: (path) => path.startsWith('/posts'),
        },
        {
            href: '/contact',
            label: 'Liên hệ',
            icon: <FaPhone className="mr-2" />,
            match: (path) => path.startsWith('/contact'),
        },
        {
            href: '/about',
            label: 'Giới thiệu',
            icon: <FaInfoCircle className="mr-2" />,
            match: (path) => path.startsWith('/about'),
        }
    ]

    // Add admin menu for admin
    const adminNavItems = [
        {
            href: '/admin',
            label: 'Quản trị',
            icon: <FaCog className="mr-2" />,
            match: (path) => path.startsWith('/admin'),
        }
    ];

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    // Effect để theo dõi cuộn và thay đổi style navbar
    useEffect(() => {
        console.log('path name: ', pathname);
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
        <nav className={`${styles.navbar} ${scrolled ? styles.navbarScrolled : ''}`}>
            <div className={styles.navbarContainer}>
                <div className="flex justify-between items-center">
                    {/* Left side with logo and navigation */}
                    <div className="flex items-center">
                        <Link
                            href="/"
                            className={styles.logo}
                        >
                            <img
                                src="/images/logo-2.png"
                                alt="Tuấn Rèm"
                                className={styles.logoImage}
                            />
                        </Link>

                        {/* Desktop Navigation - Hidden on smaller screens and when not wide enough */}
                        <div className={`hidden ${isWideScreen ? 'lg:flex' : 'xl:flex'} space-x-6 lg:space-x-8`}>
                            {navItems.map(({ href, label, match }) => {
                                const isActive = match(pathname)
                                return (
                                    <Link
                                        key={href}
                                        href={href}
                                        className={`text-sm lg:text-base font-medium transition-all duration-300 whitespace-nowrap px-3 py-2 rounded-lg relative overflow-hidden group ${isActive
                                            ? 'text-primary bg-primary/5 font-semibold'
                                            : 'text-text-primary hover:text-primary hover:bg-primary/5'
                                            }`}
                                    >
                                        <span className="relative z-10">{label}</span>
                                        {isActive && (
                                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full"></div>
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    </Link>
                                )
                            })}
                            
                            {/* Hiển thị menu Quản trị cho admin trong desktop navigation */}
                            {isAdmin && (
                                <Link
                                    href="/admin"
                                    className={`text-sm lg:text-base font-medium transition-all duration-300 whitespace-nowrap px-3 py-2 rounded-lg relative overflow-hidden group ${pathname.startsWith('/admin') 
                                        ? 'text-primary bg-primary/5 font-semibold' 
                                        : 'text-text-primary hover:text-primary hover:bg-primary/5'
                                        }`}
                                >
                                    <span className="relative z-10">Quản trị</span>
                                    {pathname.startsWith('/admin') && (
                                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full"></div>
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                </Link>
                            )}
                        </div>
                    </div>

                    {/* Desktop Right Side (Search & Actions) */}
                    <div className={`hidden ${isWideScreen ? 'lg:flex' : 'xl:flex'} items-center`}>
                        {/* Search form */}
                        <form onSubmit={handleSearch} className="relative ml-1 sm:ml-2 xl:ml-6">
                            <input
                                type="text"
                                placeholder="Tìm kiếm sản phẩm..."
                                className="w-24 xs:w-28 sm:w-32 md:w-36 lg:w-40 xl:w-64 pl-4 lg:pl-5 xl:pl-6 pr-8 lg:pr-10 xl:pr-12 py-2 lg:py-2.5 xl:py-3 border border-gray-200 rounded-full text-xs lg:text-sm bg-gray-50/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white transition-all duration-300 shadow-sm hover:shadow-md"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <button
                                type="submit"
                                className="cursor-pointer absolute right-3 xl:right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-primary transition-colors duration-200 p-1 hover:bg-primary/10 rounded-full"
                            >
                                <FaSearch className="text-xs lg:text-sm" />
                            </button>
                        </form>

                        {/* Action buttons */}
                        <div className="flex items-center ml-1 sm:ml-2 lg:ml-2 xl:ml-6">
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
            <div className={`${isOpen ? 'block' : 'hidden'} ${isWideScreen ? 'lg:hidden' : 'xl:hidden'} bg-white/95 backdrop-blur-lg shadow-xl border-b border-primary/10 max-h-[calc(100vh-70px)] overflow-y-auto`}>
                <div className="px-4 py-2 space-y-1">
                    {navItems.map(({ href, label, icon, match }) => {
                        const isActive = match(pathname)
                        return (
                            <Link
                                key={href}
                                href={href}
                                onClick={() => setIsOpen(false)}
                                className={`block py-2 transition-colors font-medium ${isActive ? 'text-primary font-bold' : 'text-text-primary hover:text-primary'
                                    }`}
                            >
                                <span className={`inline-flex items-center ${isActive ? 'underline' : ''}`}>
                                    {icon}
                                    <span>{label}</span>
                                </span>
                            </Link>
                        )
                    })}
                    {isAdmin && (
                        <Link href="/admin" className={`block py-2 text-text-primary hover:text-primary font-medium ${pathname.startsWith('/admin') ? 'text-primary font-bold' : ''}`} onClick={() => setIsOpen(false)}>
                            <span className={`inline-flex items-center ${pathname.startsWith('/admin') ? 'underline' : ''}`}><FaCog className="mr-2" /> Quản trị</span>
                        </Link>
                    )}
                    {user ? (
                        <>
                            <Link href="/account" className={`block py-2 text-text-primary hover:text-primary font-medium ${pathname.startsWith('/account') ? 'text-primary font-bold' : ''}`} onClick={() => setIsOpen(false)}>
                                <span className={`inline-flex items-center ${pathname.startsWith('/account') ? 'underline' : ''}`}><FaUser className="mr-2" /> Tài khoản</span>
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
                        <Link href="/login" className={`block py-2 text-text-primary hover:text-primary font-medium ${pathname.startsWith('/login') ? 'text-primary font-bold' : ''}`} onClick={() => setIsOpen(false)}>
                            <span className={`inline-flex items-center ${pathname.startsWith('/login') ? 'underline' : ''}`}><FaSignInAlt className="mr-2" /> Đăng nhập</span>
                        </Link>
                    )}
                </div>

                {/* Mobile search */}
                <div className="px-4 py-3 border-t border-gray-100">
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
