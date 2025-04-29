"use client";

import { useEffect, useState } from "react";
import { createBanner, deleteBanner, getBanners, updateBanner, } from "@/lib/api";
import ImageUploader from "@/components/ImageUploader";
import { FaTrash } from "react-icons/fa";

export default function AdminBannerPage() {
    const [banners, setBanners] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [form, setForm] = useState({
        title: "",
        description: "",
        image: "",
        link: "",
        isActive: true,
        order: 0,
    });
    const [editingId, setEditingId] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    const fetchData = async () => {
        setLoading(true);
        try {
            const data = await getBanners();
            setBanners(data);
        } catch (err) {
            setError("Không thể tải danh sách banner.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleImageUpload = (uploadedImages) => {
        setForm({
            ...form,
            image: uploadedImages[0]
        });
    };

    const handleRemoveImage = () => {
        setForm({ ...form, image: "" });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            if (editingId) {
                await updateBanner(editingId, form);
            } else {
                await createBanner(form);
            }
            setForm({ title: "", description: "", image: "", link: "", isActive: true, order: 0 });
            setEditingId(null);
            fetchData();
        } catch (err) {
            alert("Có lỗi xảy ra khi lưu banner.");
        } finally {
            setSubmitting(false);
        }
    };

    const handleEdit = (banner) => {
        setForm({
            title: banner.title || "",
            description: banner.description || "",
            image: banner.image || "",
            link: banner.link || "",
            isActive: banner.isActive,
            order: banner.order || 0,
        });
        setEditingId(banner._id);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Bạn chắc chắn muốn xóa banner này?")) return;
        setSubmitting(true);
        try {
            await deleteBanner(id);
            fetchData();
        } catch (err) {
            alert("Không thể xóa banner.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto py-12 px-4">
            <h1 className="text-2xl font-bold mb-6">Quản lý Banner</h1>
            <form
                className="space-y-4 bg-white p-6 rounded shadow mb-8"
                onSubmit={handleSubmit}
            >
                <div>
                    <label className="block font-medium mb-1">Tiêu đề</label>
                    <input
                        type="text"
                        name="title"
                        className="w-full border px-3 py-2 rounded"
                        value={form.title}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label className="block font-medium mb-1">Mô tả</label>
                    <textarea
                        name="description"
                        className="w-full border px-3 py-2 rounded"
                        value={form.description}
                        onChange={handleChange}
                    />
                </div>
                <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Hình ảnh <span className="text-red-500">*</span>
                    </label>
                    <ImageUploader onUpload={handleImageUpload} isMultiple={false} />

                    {/* Display uploaded images */}
                    <div className="mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {form.image && (
                            <div className="relative group rounded-md overflow-hidden border">
                                <img
                                    src={form.image}
                                    alt={`Banner image`}
                                    className="w-full h-32 object-cover"
                                />
                                <button
                                    type="button"
                                    onClick={() => handleRemoveImage()}
                                    className="cursor-pointer absolute inset-0 bg-black bg-opacity-50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <FaTrash />
                                </button>
                            </div>
                        )}
                    </div>
                </div>
                <div>
                    <label className="block font-medium mb-1">Link (URL, tùy chọn)</label>
                    <input
                        type="text"
                        name="link"
                        className="w-full border px-3 py-2 rounded"
                        value={form.link}
                        onChange={handleChange}
                    />
                </div>
                <div className="flex items-center space-x-4">
                    <label className="flex items-center">
                        <input
                            type="checkbox"
                            name="isActive"
                            checked={form.isActive}
                            onChange={handleChange}
                            className="mr-2"
                        />
                        Hiển thị
                    </label>
                    <div>
                        <label className="font-medium mr-1">Thứ tự</label>
                        <input
                            type="number"
                            name="order"
                            className="border px-2 py-1 rounded w-20"
                            value={form.order}
                            onChange={handleChange}
                            min={0}
                        />
                    </div>
                </div>
                <div className="flex space-x-2">
                    <button
                        type="submit"
                        className="cursor-pointer bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
                        disabled={submitting}
                    >
                        {editingId ? "Cập nhật" : "Thêm mới"}
                    </button>
                    {editingId && (
                        <button
                            type="button"
                            className="cursor-pointer px-4 py-2 rounded border"
                            onClick={() => {
                                setEditingId(null);
                                setForm({ title: "", description: "", image: "", link: "", isActive: true, order: 0 });
                            }}
                            disabled={submitting}
                        >
                            Hủy
                        </button>
                    )}
                </div>
            </form>
            <h2 className="text-xl font-semibold mb-4">Danh sách Banner</h2>
            {loading ? (
                <div>Đang tải...</div>
            ) : error ? (
                <div className="text-red-500">{error}</div>
            ) : banners.length === 0 ? (
                <div>Chưa có banner nào.</div>
            ) : (
                <table className="w-full border text-sm">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="border px-2 py-1">Tiêu đề</th>
                            <th className="border px-2 py-1">Ảnh</th>
                            <th className="border px-2 py-1">Hiển thị</th>
                            <th className="border px-2 py-1">Thứ tự</th>
                            <th className="border px-2 py-1">Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {banners.map((b) => (
                            <tr key={b._id} className="border-b">
                                <td className="border px-2 py-1">{b.title}</td>
                                <td className="border px-2 py-1">
                                    <img src={b.image} alt={b.title} className="w-24 h-12 object-cover rounded" />
                                </td>
                                <td className="border px-2 py-1 text-center">{b.isActive ? "✔" : "✖"}</td>
                                <td className="border px-2 py-1 text-center">{b.order}</td>
                                <td className="border px-2 py-1 text-center">
                                    <button
                                        className="cursor-pointer text-blue-600 hover:underline mr-2"
                                        onClick={() => handleEdit(b)}
                                        disabled={submitting}
                                    >
                                        Sửa
                                    </button>
                                    <button
                                        className="cursor-pointer text-red-600 hover:underline"
                                        onClick={() => handleDelete(b._id)}
                                        disabled={submitting}
                                    >
                                        Xóa
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}
