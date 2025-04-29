'use client'

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaPlus, FaEdit, FaTrash, FaSearch, FaEye, FaCheckCircle, FaTimesCircle, FaExclamationCircle } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-hot-toast';

export default function AdminProjects() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [confirmDelete, setConfirmDelete] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/projects`);
            setProjects(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching projects:', error);
            setError('Không thể tải dữ liệu. Vui lòng thử lại sau.');
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/projects/${id}`);
            toast.success('Xóa công trình thành công!');
            setConfirmDelete(null);
            fetchProjects();
        } catch (error) {
            console.error('Error deleting project:', error);
            toast.error('Lỗi khi xóa công trình!');
        }
    };

    const filteredProjects = projects.filter(project => 
        project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.type.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const renderProjectImage = (project) => {
        if (project.images && project.images.length > 0) {
            return (
                <div className="relative w-20 h-20 overflow-hidden rounded">
                    <Image 
                        src={project.images[0]} 
                        alt={project.title} 
                        fill
                        style={{ objectFit: 'cover' }}
                    />
                </div>
            );
        }
        return (
            <div className="w-20 h-20 bg-gray-200 flex items-center justify-center rounded">
                <span className="text-gray-400">No image</span>
            </div>
        );
    };

    return (
        <div className="p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800 mb-4 sm:mb-0">Quản lý Công Trình</h1>
                <Link href="/admin/projects/add" className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center hover:bg-blue-700 transition">
                    <FaPlus className="mr-2" /> Thêm công trình mới
                </Link>
            </div>

            <div className="bg-white rounded-xl shadow-sm mb-6">
                <div className="p-4 border-b">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Tìm kiếm công trình..."
                            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <FaSearch className="absolute left-3 top-3 text-gray-400" />
                    </div>
                </div>

                {loading ? (
                    <div className="p-8 text-center">
                        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
                        <p className="mt-4 text-gray-600">Đang tải dữ liệu...</p>
                    </div>
                ) : error ? (
                    <div className="p-8 text-center text-red-600">
                        <p>{error}</p>
                        <button 
                            onClick={fetchProjects}
                            className="mt-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
                        >
                            Thử lại
                        </button>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        {filteredProjects.length === 0 ? (
                            <div className="p-8 text-center text-gray-600">
                                <p>Không tìm thấy công trình nào.</p>
                            </div>
                        ) : (
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hình ảnh</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên công trình</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Địa điểm</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Loại</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredProjects.map((project) => (
                                        <tr key={project._id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {renderProjectImage(project)}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm font-medium text-gray-900">{project.title}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm text-gray-500">{project.location}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                                    {project.type}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <div className="flex space-x-2">
                                                    <Link href={`/cong-trinh?id=${project._id}`} target="_blank" className="text-indigo-600 hover:text-indigo-900" title="Xem">
                                                        <FaEye />
                                                    </Link>
                                                    <Link href={`/admin/projects/edit/${project._id}`} className="text-blue-600 hover:text-blue-900" title="Sửa">
                                                        <FaEdit />
                                                    </Link>
                                                    {confirmDelete === project._id ? (
                                                        <div className="flex items-center space-x-2">
                                                            <button
                                                                onClick={() => handleDelete(project._id)}
                                                                className="text-red-600 hover:text-red-900"
                                                                title="Xác nhận xóa"
                                                            >
                                                                Xác nhận
                                                            </button>
                                                            <button
                                                                onClick={() => setConfirmDelete(null)}
                                                                className="text-gray-600 hover:text-gray-900"
                                                                title="Hủy"
                                                            >
                                                                Hủy
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <button
                                                            onClick={() => setConfirmDelete(project._id)}
                                                            className="text-red-600 hover:text-red-900"
                                                            title="Xóa"
                                                        >
                                                            <FaTrash />
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
} 