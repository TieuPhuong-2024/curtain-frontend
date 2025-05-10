"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getCategories, updateCategory, uploadImage } from '@/lib/api';
import Image from "next/image";
import { FaTimes } from "react-icons/fa";

export default function EditCategoryPage() {
    const router = useRouter();
    const params = useParams();
    const id = params?.id;
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [image, setImage] = useState("");
    const [imageFile, setImageFile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!id) return;
        getCategories()
            .then((data) => {
                const category = data.find(cat => cat._id === id);
                if (category) {
                    setName(category.name || "");
                    setDescription(category.description || "");
                    setImage(category.image || "");
                } else {
                    setError("Không tìm thấy danh mục");
                }
            })
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    }, [id]);

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = () => {
            setImage(reader.result);
        };
        reader.readAsDataURL(file);

        setImageFile(file);
    };

    const handleRemoveImage = () => {
        setImage("");
        setImageFile(null);
        const fileInput = document.getElementById('file-upload');
        if (fileInput) {
            fileInput.value = '';
        }
    };

    const handleImageUpload = async () => {
        if (!imageFile) return image;

        try {
            setUploadingImage(true);
            const uploadedImage = await uploadImage(imageFile);
            return uploadedImage.url;
        } catch (err) {
            setError("Không thể tải lên hình ảnh. " + err.message);
            return null;
        } finally {
            setUploadingImage(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError("");

        try {
            let finalImageUrl = image;

            if (imageFile) {
                const newUrl = await handleImageUpload();
                if (newUrl) {
                    finalImageUrl = newUrl;
                } else {
                    setSaving(false);
                    return;
                }
            } else if (image === "") {
                finalImageUrl = "";
            }

            await updateCategory(id, { name, description, image: finalImageUrl });
            router.push("/admin/categories");
        } catch (err) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
            <p className="text-lg text-gray-600">Đang tải dữ liệu...</p>
        </div>
    );

    if (error && !loading) return (
        <div className="max-w-lg mx-auto my-10 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative" role="alert">
            <strong className="font-bold">Lỗi!</strong>
            <span className="block sm:inline"> {error}</span>
        </div>
    );

    return (
        <div className="max-w-lg mx-auto my-10 bg-white p-8 rounded-xl shadow-lg">
            <h1 className="text-3xl font-bold mb-8 text-indigo-600 text-center">Sửa danh mục sản phẩm</h1>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="category-name" className="block mb-2 text-sm font-medium text-gray-700">Tên danh mục:</label>
                    <input
                        id="category-name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out bg-gray-50 placeholder-gray-400"
                        placeholder="Nhập tên danh mục"
                        autoFocus
                    />
                </div>

                <div>
                    <label htmlFor="category-description" className="block mb-2 text-sm font-medium text-gray-700">Mô tả:</label>
                    <textarea
                        id="category-description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out bg-gray-50 placeholder-gray-400 min-h-[100px] resize-y"
                        placeholder="Nhập mô tả danh mục (không bắt buộc)"
                    />
                </div>

                <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">Hình ảnh đại diện:</label>

                    <div
                        className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center bg-gray-50 hover:border-indigo-500 transition-all duration-300 ease-in-out cursor-pointer mb-3 relative overflow-hidden"
                        onClick={(e) => {
                            if (e.target !== e.currentTarget && e.target.tagName !== 'DIV' && e.target.tagName !== 'SPAN' && e.target.tagName !== 'svg' && e.target.tagName !== 'path' && e.target.tagName !== 'polyline' && e.target.tagName !== 'line') {
                                return;
                            }
                            document.getElementById('file-upload').click();
                        }}
                    >
                        <div className="flex flex-col items-center justify-center gap-3">
                            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-500">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                <polyline points="17 8 12 3 7 8"></polyline>
                                <line x1="12" y1="3" x2="12" y2="15"></line>
                            </svg>
                            <div className="font-medium text-gray-700">
                                Click để chọn hình ảnh hoặc kéo thả vào đây
                            </div>
                            <div className="text-xs text-gray-500">
                                Hỗ trợ file: JPG, PNG, GIF
                            </div>
                        </div>
                        <input
                            id="file-upload"
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="absolute top-0 left-0 opacity-0 w-full h-full cursor-pointer z-[-1]"
                        />
                    </div>

                    {image && (
                        <div className="mt-4 relative h-48 w-full group">
                            <Image
                                src={image}
                                alt="Category preview"
                                fill
                                className="object-cover rounded-lg shadow-md"
                            />
                            <button
                                type="button"
                                onClick={handleRemoveImage}
                                className="cursor-pointer absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center"
                                aria-label="Remove image"
                            >
                                <FaTimes />
                            </button>
                        </div>
                    )}
                </div>

                {uploadingImage && (
                    <div className="text-sm text-indigo-600 flex items-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Đang tải ảnh lên...
                    </div>
                )}

                {error && !saving && <p className="text-red-500 text-sm text-center">{error}</p>}

                <div className="flex items-center justify-end space-x-4 pt-2">
                    <button
                        type="button"
                        className="cursor-pointer px-6 py-2.5 bg-gray-200 text-gray-700 font-semibold text-sm rounded-lg hover:bg-gray-300 transition-colors duration-150 ease-in-out"
                        onClick={() => router.push("/admin/categories")}
                        disabled={saving || uploadingImage}
                    >
                        Huỷ
                    </button>
                    <button
                        type="submit"
                        disabled={saving || uploadingImage}
                        className="cursor-pointer px-6 py-2.5 bg-indigo-600 text-white font-semibold text-sm rounded-lg hover:bg-indigo-700 transition-colors duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                        {saving ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Đang lưu...
                            </>
                        ) : "Lưu thay đổi"}
                    </button>
                </div>
            </form>
        </div>
    );
}
