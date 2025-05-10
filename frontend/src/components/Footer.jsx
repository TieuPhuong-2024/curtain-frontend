import Link from 'next/link';
import {FaEnvelope, FaFacebook, FaInstagram, FaMapMarkerAlt, FaPhone, FaTwitter, FaYoutube} from 'react-icons/fa';

export default function Footer() {
    return (
        <footer className="bg-gray-800 text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* About Section */}
                    <div>
                        <h3 className="text-xl font-bold mb-4">Tuấn Rèm</h3>
                        <p className="text-gray-300 mb-4">
                            Chúng tôi cung cấp các loại rèm cửa cao cấp với đa dạng mẫu mã,
                            chất liệu và màu sắc để phù hợp với mọi không gian sống.
                        </p>
                        <div className="flex space-x-4">
                            <a href="https://www.youtube.com/@Tu%E1%BA%A5nR%C3%A8mB%C3%ACnhD%C6%B0%C6%A1ng" className="text-gray-300 hover:text-white">
                                <FaYoutube size={20}/>
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-xl font-bold mb-4">Liên kết nhanh</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link href="/" className="text-gray-300 hover:text-white">
                                    Trang chủ
                                </Link>
                            </li>
                            <li>
                                <Link href="/products" className="text-gray-300 hover:text-white">
                                    Sản phẩm
                                </Link>
                            </li>
                            <li>
                                <Link href="/cong-trinh" className="text-gray-300 hover:text-white">
                                   Công trình
                                </Link>
                            </li>
                            <li>
                                <Link href="/posts" className="text-gray-300 hover:text-white">
                                    Blog
                                </Link>
                            </li>
                            <li>
                                <Link href="/about" className="text-gray-300 hover:text-white">
                                    Giới thiệu
                                </Link>
                            </li>
                            <li>
                                <Link href="/contact" className="text-gray-300 hover:text-white">
                                    Liên hệ
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className="text-xl font-bold mb-4">Thông tin liên hệ</h3>
                        <ul className="space-y-2">
                            <li className="flex items-center">
                                <FaMapMarkerAlt className="mr-2"/>
                                <span>15/7A Tân Lập - Đông Hoà - Dĩ An - Bình Dương</span>
                            </li>
                            <li className="flex items-center">
                                <FaPhone className="mr-2"/>
                                <span>0937 543 809</span>
                            </li>
                            <li className="flex items-center">
                                <FaEnvelope className="mr-2"/>
                                <span>tuanremgiare@gmail.com</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-700 mt-8 pt-8 text-center">
                    <p className="text-gray-300">
                        &copy; {new Date().getFullYear()} Tuấn Rèm. Tất cả các quyền được bảo lưu.
                    </p>
                </div>
            </div>
        </footer>
    );
} 