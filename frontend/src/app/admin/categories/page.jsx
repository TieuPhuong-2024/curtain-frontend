"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { deleteCategory, getCategories } from '@/lib/api';
import Image from "next/image";
import { FaEdit, FaPlus, FaTrash, FaSearch, FaFileExcel } from 'react-icons/fa';
import * as XLSX from 'xlsx';

export default function CategoryListPage() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const router = useRouter();

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            setLoading(true);
            setError("");
            const data = await getCategories();
            setCategories(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = () => {
        router.push("/admin/categories/add");
    };

    const handleEdit = (id) => {
        router.push(`/admin/categories/edit/${id}`);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Bạn có chắc muốn xóa danh mục này?")) return;
        try {
            await deleteCategory(id);
            fetchCategories(); // Refresh the list after deletion
            alert("Xóa danh mục thành công!");
        } catch (err) {
            alert(err.message);
        }
    };

    const handleExportExcel = () => {
        const dataToExport = filteredCategories.map(category => ({
            'Tên danh mục': category.name,
            'Ngày tạo': category.createdAt ? new Date(category.createdAt).toLocaleDateString('vi-VN') : 'N/A',
            'Số sản phẩm': category.productCount || 0
        }));
        const worksheet = XLSX.utils.json_to_sheet(dataToExport);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Categories');
        XLSX.writeFile(workbook, 'danh_sach_danh_muc.xlsx');
    };

    // Filter categories based on search term
    const filteredCategories = categories.filter(category =>
        category.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Apply pagination
    const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);
    const paginatedCategories = filteredCategories.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
        <div>
            <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
                <h1 className="text-2xl font-bold">Quản lý danh mục sản phẩm</h1>
                <div className="flex flex-wrap gap-2">
                    <button onClick={handleExportExcel}
                        className="cursor-pointer bg-green-600 text-white px-4 py-2 rounded-md flex items-center hover:bg-green-700 transition">
                        <FaFileExcel className="mr-2" />
                        Xuất Excel
                    </button>
                    <button
                        onClick={handleAdd}
                        className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-md flex items-center hover:bg-blue-700 transition"
                    >
                        <FaPlus className="mr-2" /> Thêm Mới
                    </button>
                </div>
            </div>

            {/* Search Bar */}
            <div className="mb-6 relative">
                <input
                    type="text"
                    placeholder="Tìm kiếm danh mục..."
                    className="w-full p-3 pl-10 rounded-md border border-gray-300"
                    value={searchTerm}
                    onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setCurrentPage(1);
                    }}
                />
                <FaSearch className="absolute left-3 top-3.5 text-gray-400" />
            </div>
            {loading ? (
                <div className="text-center py-8">
                    <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
                    <p className="mt-2">Đang tải dữ liệu...</p>
                </div>
            ) : error ? (
                <div className="text-center py-8 bg-red-100 text-red-600 p-4 rounded-lg">
                    {error}
                    <button
                        onClick={fetchCategories}
                        className="cursor-pointer mt-4 bg-blue-600 text-white px-4 py-2 rounded-md"
                    >
                        Thử lại
                    </button>
                </div>
            ) : (
                <>
                    {filteredCategories.length === 0 ? (
                        <div className="text-center py-8 bg-white rounded-lg shadow">
                            <p className="text-gray-500">Không tìm thấy danh mục phù hợp</p>
                        </div>
                    ) : (
                        <div className="bg-white rounded-lg shadow overflow-x-auto">
                            {/* Regular table for md screens and up */}
                            <table className="min-w-full divide-y divide-gray-200 hidden md:table">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Ảnh
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Tên danh mục
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Thao tác
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {paginatedCategories.map((cat) => (
                                        <tr key={cat._id || cat} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="relative w-10 h-10">
                                                    <Image
                                                        src={cat.image || '/images/curtain-placeholder.jpg'}
                                                        alt={cat.name || cat}
                                                        fill
                                                        className="rounded-full object-cover"
                                                    />
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">{cat.name || cat}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <div className="flex space-x-2">
                                                    <button
                                                        onClick={() => handleEdit(cat._id || cat)}
                                                        className="cursor-pointer text-blue-600 hover:text-blue-900"
                                                    >
                                                        <FaEdit size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(cat._id || cat)}
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
                                {paginatedCategories.map((cat) => (
                                    <div key={cat._id || cat} className="p-4 hover:bg-gray-50">
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center">
                                                <div className="h-10 w-10 flex-shrink-0 mr-3">
                                                    <div className="relative w-10 h-10">
                                                        <Image
                                                            src={cat.image || '/images/curtain-placeholder.jpg'}
                                                            alt={cat.name || cat}
                                                            fill
                                                            className="rounded-full object-cover"
                                                        />
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="font-medium">{cat.name || cat}</div>
                                                </div>
                                            </div>
                                            <div className="flex space-x-3">
                                                <button
                                                    onClick={() => handleEdit(cat._id || cat)}
                                                    className="text-green-500 bg-green-50 p-2 rounded-full hover:bg-green-100"
                                                >
                                                    <FaEdit size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(cat._id || cat)}
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
                    {filteredCategories.length > 0 && (
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
