import Link from 'next/link';
import {FaEnvelope, FaFacebook, FaInstagram, FaMapMarkerAlt, FaPhone, FaTwitter, FaYoutube} from 'react-icons/fa';
import styles from '@/styles/modules/Footer.module.css';

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <div className={styles.footerContainer}>
                <div className={styles.footerContent}>
                    <div className={styles.footerGrid}>
                        {/* About Section */}
                        <div className={styles.footerSection}>
                            <h3 className={styles.footerTitle}>Tuấn Rèm</h3>
                            <p className={styles.footerDescription}>
                                Chúng tôi cung cấp các loại rèm cửa cao cấp với đa dạng mẫu mã,
                                chất liệu và màu sắc để phù hợp với mọi không gian sống.
                            </p>
                            <div className={styles.socialLinks}>
                                <a href="https://www.youtube.com/@Tu%E1%BA%A5nR%C3%A8mB%C3%ACnhD%C6%B0%C6%A1ng" className={styles.socialLink}>
                                    <FaYoutube size={20} className={styles.socialIcon}/>
                                </a>
                            </div>
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
                                <li>
                                    <FaMapMarkerAlt className={styles.contactIcon}/>
                                    <span>15/7A Tân Lập - Đông Hoà - Dĩ An - Bình Dương</span>
                                </li>
                                <li>
                                    <FaPhone className={styles.contactIcon}/>
                                    <span>0937 543 809</span>
                                </li>
                                <li>
                                    <FaEnvelope className={styles.contactIcon}/>
                                    <span>tuanremgiare@gmail.com</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className={styles.footerDivider}>
                        <p className={styles.copyright}>
                            &copy; {new Date().getFullYear()} Tuấn Rèm. Tất cả các quyền được bảo lưu.
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
} 