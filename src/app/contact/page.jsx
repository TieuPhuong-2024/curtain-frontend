'use client';

import { createContact } from '@/lib/api';
import { useState } from 'react';
import { FaClock, FaEnvelope, FaMapMarkerAlt, FaPhone } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
        website: '' // honeypot field
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Check honeypot field
        if (formData.website) {
            // If honeypot is filled, silently reject but appear successful
            toast.success('Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi trong thời gian sớm nhất.');
            return;
        }

        // Validate form
        if (!formData.name || !formData.email || !formData.phone || !formData.message) {
            toast.error('Vui lòng điền đầy đủ thông tin bắt buộc');
            return;
        }

        try {
            const response = await createContact(formData);
            if (!response.success) {
                throw new Error('Có lỗi xảy ra khi gửi yêu cầu');
            }

            const successMessage = response.message || 'Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi trong thời gian sớm nhất.';
            toast.success(successMessage);

            // Reset form after successful submission
            setFormData({
                name: '',
                email: '',
                phone: '',
                subject: '',
                message: '',
                website: ''
            });
        } catch (error) {
            const errorMessage = error.message || 'Không thể gửi yêu cầu tư vấn. Vui lòng thử lại sau.';
            toast.error(errorMessage);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} closeOnClick pauseOnHover draggable />
            
            <h1 className="text-3xl font-bold mb-2">Liên Hệ Với Chúng Tôi</h1>
            <p className="text-gray-600 mb-8">Chúng tôi luôn sẵn sàng hỗ trợ bạn với mọi thắc mắc và yêu cầu</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Contact Information */}
                <div className="md:col-span-1">
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-semibold mb-4">Thông Tin Liên Hệ</h2>
                        <div className="space-y-4">
                            <div className="flex items-start">
                                <FaMapMarkerAlt className="text-indigo-600 mt-1 mr-3" size={20} />
                                <div>
                                    <h3 className="font-medium">Địa chỉ</h3>
                                    <p className="text-gray-600">15/7A Tân Lập - Đông Hoà - Dĩ An - Bình Dương</p>
                                </div>
                            </div>

                            <div className="flex items-start">
                                <FaPhone className="text-indigo-600 mt-1 mr-3" size={20} />
                                <div>
                                    <h3 className="font-medium">Điện thoại</h3>
                                    <p className="text-gray-600">0937 543 809</p>
                                </div>
                            </div>

                            <div className="flex items-start">
                                <FaEnvelope className="text-indigo-600 mt-1 mr-3" size={20} />
                                <div>
                                    <h3 className="font-medium">Email</h3>
                                    <p className="text-gray-600">tuanremgiare@gmail.com</p>
                                </div>
                            </div>

                            <div className="flex items-start">
                                <FaClock className="text-indigo-600 mt-1 mr-3" size={20} />
                                <div>
                                    <h3 className="font-medium">Giờ làm việc</h3>
                                    <p className="text-gray-600">Thứ Hai - Thứ Bảy: 8:00 - 20:00</p>
                                    <p className="text-gray-600">Chủ Nhật: 9:00 - 18:00</p>
                                </div>
                            </div>
                            {/* Google Maps */}
                            <div className="w-full h-[400px] rounded-lg overflow-hidden shadow-md">
                                <iframe
                                    src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d979.4783043103389!2d106.7964363!3d10.894199799999999!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3174d9c911c29f63%3A0x61e3f2694805f3f7!2zxJDGsOG7nW5nIELDoCBIdXnhu4duIFRoYW5oIFF1YW4!5e0!3m2!1svi!2s!4v1746425217612!5m2!1svi!2s"
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0 }}
                                    allowFullScreen=""
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                ></iframe>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Contact Form */}
                <div className="md:col-span-2">
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-semibold mb-4">Gửi Yêu Cầu Tư Vấn</h2>

                        <form onSubmit={handleSubmit}>
                            {/* Honeypot field - hidden from real users */}
                            <input
                                type="text"
                                id="website"
                                name="website"
                                value={formData.website}
                                onChange={handleChange}
                                style={{ display: 'none' }}
                                tabIndex="-1"
                                aria-hidden="true"
                            />

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label htmlFor="name" className="block mb-1 font-medium">
                                        Họ và tên <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        required
                                    />
                                </div>

                                <div>
                                    <label htmlFor="email" className="block mb-1 font-medium">
                                        Email <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label htmlFor="phone" className="block mb-1 font-medium">
                                        Số điện thoại <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="tel"
                                        id="phone"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        required
                                    />
                                </div>

                                <div>
                                    <label htmlFor="subject" className="block mb-1 font-medium">
                                        Chủ đề
                                    </label>
                                    <input
                                        type="text"
                                        id="subject"
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>
                            </div>

                            <div className="mb-4">
                                <label htmlFor="message" className="block mb-1 font-medium">
                                    Nội dung tin nhắn <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    id="message"
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    rows="5"
                                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    required
                                ></textarea>
                            </div>

                            <button
                                type="submit"
                                className="cursor-pointer bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-6 rounded-md"
                            >
                                Gửi yêu cầu
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}