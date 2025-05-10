'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FaEdit, FaPlus, FaSearch, FaTrash, FaEye, FaFileExcel } from 'react-icons/fa';
import { deleteCurtain, getCategories, getCurtains } from '@/lib/api';
import * as XLSX from 'xlsx';

export default function CurtainsList() {
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const [curtains, setCurtains] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchCurtains();
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const data = await getCategories();
            setCategories(Array.isArray(data) ? data : []);
        } catch (error) {
            setCategories([]);
        }
    };

    const fetchCurtains = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await getCurtains();
            setCurtains(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching curtains:', error);
            setError('Không thể tải dữ liệu rèm cửa. Vui lòng thử lại sau.');
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
            try {
                await deleteCurtain(id);
                // Cập nhật danh sách sau khi xóa thành công
                fetchCurtains();
                alert('Xóa sản phẩm thành công!');
            } catch (error) {
                console.error('Error deleting curtain:', error);
                alert('Có lỗi xảy ra khi xóa sản phẩm');
            }
        }
    };

    const filteredCurtains = curtains.filter(curtain => {
        const matchesSearch = curtain.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (typeof curtain.category === 'object' ? curtain.category?.name?.toLowerCase().includes(searchTerm.toLowerCase()) : curtain.category?.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesCategory = selectedCategory ? (typeof curtain.category === 'object' ? curtain.category?._id === selectedCategory : curtain.category === selectedCategory) : true;
        return matchesSearch && matchesCategory;
    });

    const totalPages = Math.ceil(filteredCurtains.length / itemsPerPage);
    const paginatedCurtains = filteredCurtains.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const handleExportExcel = () => {
        const dataToExport = filteredCurtains.map(curtain => ({
            'Tên sản phẩm': curtain.name,
            'Danh mục': typeof curtain.category === 'object' ? curtain.category?.name : curtain.category,
            'Giá': curtain.price,
            'Chất liệu': curtain.material,
            'Màu sắc': curtain.color?.name || '',
            'Kích thước': curtain.size ? `${curtain.size.width} x ${curtain.size.height}` : '',
            'Còn hàng': curtain.inStock ? 'Có' : 'Không',
        }));
        const worksheet = XLSX.utils.json_to_sheet(dataToExport);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Curtains');
        XLSX.writeFile(workbook, 'danh_sach_rem_cua.xlsx');
    };


    return (
        <div>
            <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
                <h1 className="text-2xl font-bold">Quản Lý Rèm Cửa</h1>
                <div className="flex flex-wrap gap-2">
                    <button onClick={handleExportExcel}
                        className="cursor-pointer bg-green-600 text-white px-4 py-2 rounded-md flex items-center hover:bg-green-700 transition">
                        <FaFileExcel className="mr-2" />
                        Xuất Excel
                    </button>
                    <Link
                        href="/admin/curtains/add"
                        className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-md flex items-center hover:bg-blue-700 transition"
                    >
                        <FaPlus className="mr-2" /> Thêm Mới
                    </Link>
                </div>
            </div>
            <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
                <div className="w-full md:w-1/3">
                    <select
                        className="w-full p-3 rounded-md border border-gray-300"
                        value={selectedCategory}
                        onChange={e => {
                            setSelectedCategory(e.target.value);
                            setCurrentPage(1);
                        }}
                    >
                        <option value="">Tất cả danh mục</option>
                        {Array.isArray(categories) && categories.map(cat => (
                            <option key={cat._id} value={cat._id}>{cat.name}</option>
                        ))}
                    </select>
                </div>
                {/* Search Bar */}
                <div className="w-full md:w-2/3 relative">
                    <input
                        type="text"
                        placeholder="Tìm kiếm theo tên hoặc danh mục..."
                        className="w-full p-3 pl-10 rounded-md border border-gray-300"
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setCurrentPage(1);
                        }}
                    />
                    <FaSearch className="absolute left-3 top-3.5 text-gray-400" />
                </div>
            </div>

            {loading ? (
                <div className="text-center py-8">
                    <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
                    <p className="mt-2">Đang tải dữ liệu...</p>
                </div>
            ) : error ? (
                <div className="text-center py-8 bg-white rounded-lg shadow">
                    <p className="text-red-500">{error}</p>
                    <button
                        onClick={fetchCurtains}
                        className="cursor-pointer mt-4 bg-blue-600 text-white px-4 py-2 rounded-md"
                    >
                        Thử lại
                    </button>
                </div>
            ) : (
                <>
                    {filteredCurtains.length === 0 ? (
                        <div className="text-center py-8 bg-white rounded-lg shadow">
                            <p className="text-gray-500">Không tìm thấy sản phẩm phù hợp</p>
                        </div>
                    ) : (
                        <div className="bg-white rounded-lg shadow overflow-x-auto">
                            {/* Regular table for md screens and up */}
                            <table className="min-w-full divide-y divide-gray-200 hidden md:table">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Sản phẩm
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Danh mục
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Giá
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Trạng thái
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Thao tác
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {paginatedCurtains.map((curtain) => (
                                        <tr key={curtain._id}>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="h-10 w-10 flex-shrink-0">
                                                        <img
                                                            className="h-10 w-10 rounded-full object-cover"
                                                            src={curtain.mainImage || curtain.image || '/placeholder-curtain.jpg'}
                                                            alt={curtain.name}
                                                        />
                                                    </div>
                                                    <div className="ml-4">
                                                        <div
                                                            className="text-sm font-medium text-gray-900">{curtain.name}</div>
                                                        <div className="text-sm text-gray-500">{curtain.color?.name || 'N/A'}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div
                                                    className="text-sm text-gray-900">{typeof curtain.category === 'object' ? curtain.category?.name : curtain.category}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">
                                                    {new Intl.NumberFormat('vi-VN', {
                                                        style: 'currency',
                                                        currency: 'VND'
                                                    }).format(curtain.price)}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${curtain.inStock
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-red-100 text-red-800'
                                                    }`}>
                                                    {curtain.inStock ? 'Còn hàng' : 'Hết hàng'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <div className="flex space-x-2">
                                                    <Link
                                                        href={`/admin/curtains/edit/${curtain._id}`}
                                                        className="text-blue-600 hover:text-blue-900"
                                                    >
                                                        <FaEdit size={18} />
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDelete(curtain._id)}
                                                        className="cursor-pointer text-red-600 hover:text-red-900"
                                                    >
                                                        <FaTrash size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            {/* Card view for mobile */}
                            <div className="md:hidden divide-y divide-gray-200">
                                {paginatedCurtains.map((curtain) => (
                                    <div key={curtain._id} className="p-4 hover:bg-gray-50">
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center">
                                                <div className="h-10 w-10 flex-shrink-0 mr-3">
                                                    <img
                                                        className="h-10 w-10 rounded-full object-cover"
                                                        src={curtain.mainImage || curtain.image || '/placeholder-curtain.jpg'}
                                                        alt={curtain.name}
                                                    />
                                                </div>
                                                <div>
                                                    <div className="font-medium">{curtain.name}</div>
                                                    <div className="text-xs text-gray-500">
                                                        {typeof curtain.category === 'object' ? curtain.category?.name : curtain.category}
                                                    </div>
                                                </div>
                                            </div>
                                            <span className={`px-2 text-xs leading-5 font-semibold rounded-full ${curtain.inStock
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-red-100 text-red-800'
                                                }`}>
                                                {curtain.inStock ? 'Còn hàng' : 'Hết hàng'}
                                            </span>
                                        </div>
                                        <div className="mt-2 flex justify-between items-center">
                                            <div className="text-sm font-semibold">
                                                {new Intl.NumberFormat('vi-VN', {
                                                    style: 'currency',
                                                    currency: 'VND'
                                                }).format(curtain.price)}
                                            </div>
                                            <div className="flex space-x-3">
                                                <Link
                                                    href={`/products/${curtain._id}`}
                                                    className="text-blue-500 bg-blue-50 p-2 rounded-full hover:bg-blue-100"
                                                >
                                                    <FaEye size={16} />
                                                </Link>
                                                <Link
                                                    href={`/admin/curtains/edit/${curtain._id}`}
                                                    className="text-green-500 bg-green-50 p-2 rounded-full hover:bg-green-100"
                                                >
                                                    <FaEdit size={16} />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(curtain._id)}
                                                    className="text-red-500 bg-red-50 p-2 rounded-full hover:bg-red-100"
                                                >
                                                    <FaTrash size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Pagination */}
                    {filteredCurtains.length > 0 && (
                        <div className="mt-6 flex justify-center">
                            <nav className="flex items-center space-x-1">
                                <button
                                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                    disabled={currentPage === 1}
                                    className={`px-3 py-1 rounded-md 
                                    ${currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-blue-600 hover:bg-blue-50'}`}
                                >
                                    &laquo;
                                </button>

                                {[...Array(totalPages)].map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setCurrentPage(index + 1)}
                                        className={`px-3 py-1 rounded-md ${currentPage === index + 1
                                                ? 'bg-blue-600 text-white'
                                                : 'text-blue-600 hover:bg-blue-50'
                                            }`}
                                    >
                                        {index + 1}
                                    </button>
                                ))}

                                <button
                                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                                    disabled={currentPage === totalPages}
                                    className={`px-3 py-1 rounded-md
                                    ${currentPage === totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-blue-600 hover:bg-blue-50'}`}
                                >
                                    &raquo;
                                </button>
                            </nav>
                        </div>
                    )}
                </>
            )}
        </div>
    );
} 