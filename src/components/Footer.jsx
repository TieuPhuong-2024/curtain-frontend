'use client';

import Link from 'next/link';
import {FaEnvelope, FaFacebook, FaInstagram, FaMapMarkerAlt, FaPhone, FaTwitter, FaYoutube} from 'react-icons/fa';
import styles from '@/styles/modules/Footer.module.css';
import { useSettings } from '@/lib/SettingsContext';

export default function Footer() {
    const { getValue } = useSettings();
    const siteName = getValue('global.siteName');
    const siteDescription = getValue('global.siteDescription');
    const hotline = getValue('global.hotline');
    const email = getValue('global.email');
    const address = getValue('global.address');
    const youtubeUrl = getValue('global.youtubeUrl');

    return (
        <footer className={styles.footer}>
            <div className={styles.footerContainer}>
                <div className={styles.footerContent}>
                    <div className={styles.footerGrid}>
                        {/* About Section */}
                        <div className={styles.footerSection}>
                            <h3 className={styles.footerTitle}>{siteName}</h3>
                            {siteDescription && (
                                <p className={styles.footerDescription}>{siteDescription}</p>
                            )}
                            {youtubeUrl && (
                                <div className={styles.socialLinks}>
                                    <a href={youtubeUrl} className={styles.socialLink}>
                                        <FaYoutube size={20} className={styles.socialIcon}/>
                                    </a>
                                </div>
                            )}
                        </div>

                        {/* Quick Links */}
                        <div className={styles.footerSection}>
                            <h3 className={styles.footerTitle}>Liên kết nhanh</h3>
                            <ul className={styles.footerLinks}>
                                <li>
                                    <Link href="/" className={styles.footerLink}>
                                        Trang chủ
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/products" className={styles.footerLink}>
                                        Sản phẩm
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/cong-trinh" className={styles.footerLink}>
                                       Công trình
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/posts" className={styles.footerLink}>
                                        Blog
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/about" className={styles.footerLink}>
                                        Giới thiệu
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/contact" className={styles.footerLink}>
                                        Liên hệ
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        {/* Contact Info */}
                        <div className={styles.footerSection}>
                            <h3 className={styles.footerTitle}>Thông tin liên hệ</h3>
                            <ul className={styles.contactInfo}>
                                {address && (
                                    <li>
                                        <FaMapMarkerAlt className={styles.contactIcon}/>
                                        <span>{address}</span>
                                    </li>
                                )}
                                {hotline && (
                                    <li>
                                        <FaPhone className={styles.contactIcon}/>
                                        <span>{hotline}</span>
                                    </li>
                                )}
                                {email && (
                                    <li>
                                        <FaEnvelope className={styles.contactIcon}/>
                                        <span>{email}</span>
                                    </li>
                                )}
                            </ul>
                        </div>
                    </div>

                    <div className={styles.footerDivider}>
                        <p className={styles.copyright}>
                            &copy; {new Date().getFullYear()} {siteName}. Tất cả các quyền được bảo lưu.
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
} 