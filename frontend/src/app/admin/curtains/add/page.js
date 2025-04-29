'use client';

import {useEffect, useState, useRef} from 'react';
import {useRouter} from 'next/navigation';
import Link from 'next/link';
import {FaArrowLeft, FaUpload, FaPlus, FaTimes} from 'react-icons/fa';
import {createCurtain, getCategories, uploadImage} from '@/lib/api';

export default function AddCurtain() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const fileInputRef = useRef(null);
    
    // Thêm state cho nhiều hình ảnh
    const [additionalImages, setAdditionalImages] = useState([]);
    const additionalFileInputRef = useRef(null);
    
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        category: '',
        material: '',
        color: '',
        width: '',
        height: '',
        mainImage: '',
        inStock: true
    });

    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await getCategories();
                setCategories(res);
            } catch (error) {
                setCategories([]);
            }
        };
        fetchCategories();
    }, []);

    const handleChange = (e) => {
        const {name, value, type, checked} = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);

            // Create a preview URL for the selected image
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleFileButtonClick = () => {
        fileInputRef.current.click();
    };
    
    // Xử lý thêm hình ảnh phụ
    const handleAdditionalFileButtonClick = () => {
        additionalFileInputRef.current.click();
    };
    
    const handleAdditionalFileChange = async (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;
        
        setIsSubmitting(true);
        
        try {
            // Upload each file and add to additional images
            for (const file of files) {
                const uploadResult = await uploadImage(file);
                setAdditionalImages(prev => [...prev, {
                    url: uploadResult.url,
                    file: file,
                    preview: URL.createObjectURL(file)
                }]);
            }
        } catch (error) {
            console.error('Error uploading additional images:', error);
            setError('Có lỗi xảy ra khi tải lên hình ảnh. Vui lòng thử lại sau.');
        } finally {
            setIsSubmitting(false);
            e.target.value = null; // Reset file input
        }
    };
    
    const handleRemoveAdditionalImage = (index) => {
        setAdditionalImages(prev => prev.filter((_, i) => i !== index));
    };

    const handleRemoveMainImage = () => {
        setSelectedFile(null);
        setImagePreview(null);
        setFormData(prev => ({...prev, mainImage: ''}));
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        // Validate form
        if (
            !formData.name ||
            !formData.description ||
            !formData.price ||
            !formData.category ||
            !formData.material ||
            !formData.color ||
            !formData.width ||
            !formData.height
        ) {
            setError('Vui lòng điền đầy đủ thông tin sản phẩm');
            return;
        }

        // Validate image
        if (!selectedFile && !formData.mainImage) {
            setError('Vui lòng chọn hình ảnh chính cho sản phẩm');
            return;
        }

        try {
            setIsSubmitting(true);
            let mainImageUrl = formData.mainImage;

            // Upload image if a file is selected
            if (selectedFile) {
                try {
                    const uploadResult = await uploadImage(selectedFile);
                    mainImageUrl = uploadResult.url;
                } catch (uploadError) {
                    console.error('Error uploading image:', uploadError);
                    setIsSubmitting(false);
                    setError('Có lỗi xảy ra khi tải lên hình ảnh. Vui lòng thử lại sau.');
                    return;
                }
            }

            // Chuẩn bị dữ liệu gửi đến API
            const curtainData = {
                ...formData,
                price: parseFloat(formData.price),
                size: {
                    width: parseFloat(formData.width),
                    height: parseFloat(formData.height)
                },
                mainImage: mainImageUrl,
                additionalImages: additionalImages.map(img => img.url)
            };

            // Gọi API để tạo rèm cửa mới
            await createCurtain(curtainData);

            setIsSubmitting(false);
            alert('Thêm sản phẩm thành công!');
            router.push('/admin/curtains');

        } catch (error) {
            console.error('Error adding curtain:', error);
            setIsSubmitting(false);
            setError('Có lỗi xảy ra khi thêm sản phẩm. Vui lòng thử lại sau.');
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-4 flex items-center">
                <Link href="/admin/curtains" className="text-blue-500 flex items-center mr-4">
                    <FaArrowLeft className="mr-1"/> Quay lại
                </Link>
                <h1 className="text-2xl font-bold">Thêm sản phẩm mới</h1>
            </div>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            <div className="bg-white rounded-lg shadow p-6">
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Tên sản phẩm */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Tên sản phẩm <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="name"
                                className="w-full p-2 border border-gray-300 rounded-md"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {/* Danh mục */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Danh mục <span className="text-red-500">*</span>
                            </label>
                            <select
                                name="category"
                                className="w-full p-2 border border-gray-300 rounded-md"
                                value={formData.category}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Chọn danh mục</option>
                                {categories.map((category) => (
                                    <option key={category._id} value={category._id}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Giá */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Giá (VNĐ) <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                name="price"
                                className="w-full p-2 border border-gray-300 rounded-md"
                                value={formData.price}
                                onChange={handleChange}
                                min="0"
                                required
                            />
                        </div>

                        {/* Chất liệu */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Chất liệu <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="material"
                                className="w-full p-2 border border-gray-300 rounded-md"
                                value={formData.material}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {/* Màu sắc */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Màu sắc <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="color"
                                className="w-full p-2 border border-gray-300 rounded-md"
                                value={formData.color}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {/* Kích thước - Chiều rộng */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Chiều rộng (cm) <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                name="width"
                                className="w-full p-2 border border-gray-300 rounded-md"
                                value={formData.width}
                                onChange={handleChange}
                                min="0"
                                required
                            />
                        </div>

                        {/* Kích thước - Chiều cao */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Chiều cao (cm) <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                name="height"
                                className="w-full p-2 border border-gray-300 rounded-md"
                                value={formData.height}
                                onChange={handleChange}
                                min="0"
                                required
                            />
                        </div>

                        {/* Hình ảnh chính */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Hình ảnh chính <span className="text-red-500">*</span>
                            </label>
                            <div className="flex flex-col space-y-2">
                                <div className="flex items-center">
                                    <input
                                        type="text"
                                        name="mainImage"
                                        placeholder="URL hình ảnh (tùy chọn)"
                                        className="flex-grow p-2 border border-gray-300 rounded-md"
                                        value={formData.mainImage}
                                        onChange={handleChange}
                                    />
                                    <span className="mx-2 text-gray-500">hoặc</span>
                                    <button
                                        type="button"
                                        onClick={handleFileButtonClick}
                                        className="cursor-pointer bg-gray-200 text-gray-700 px-4 py-2 rounded-md flex items-center"
                                    >
                                        <FaUpload className="mr-2" /> Tải lên
                                    </button>
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleFileChange}
                                        accept="image/*"
                                        className="hidden"
                                    />
                                </div>

                                {/* Image preview */}
                                {imagePreview && (
                                    <div className="mt-2">
                                        <p className="text-sm text-gray-500 mb-1">Xem trước:</p>
                                        <div className="relative w-full h-40 border border-gray-300 rounded-md overflow-hidden">
                                            <img
                                                src={imagePreview}
                                                alt="Preview"
                                                className="w-full h-full object-contain"
                                            />
                                            <button
                                                type="button"
                                                onClick={handleRemoveMainImage}
                                                className="cursor-pointer absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-80 hover:opacity-100"
                                                title="Xóa ảnh này"
                                            >
                                                <FaTimes size={14} />
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                        
                        {/* Tình trạng */}
                        <div className="flex items-center mt-4">
                            <input
                                type="checkbox"
                                name="inStock"
                                id="inStock"
                                className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                                checked={formData.inStock}
                                onChange={handleChange}
                            />
                            <label htmlFor="inStock" className="ml-2 block text-sm text-gray-700">
                                Còn hàng
                            </label>
                        </div>
                    </div>
                    
                    {/* Hình ảnh phụ */}
                    <div className="mt-6">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Hình ảnh phụ
                        </label>
                        <div className="mt-2">
                            <button
                                type="button"
                                onClick={handleAdditionalFileButtonClick}
                                className="cursor-pointer bg-gray-200 text-gray-700 px-4 py-2 rounded-md flex items-center"
                            >
                                <FaPlus className="mr-2" /> Thêm hình ảnh phụ
                            </button>
                            <input
                                type="file"
                                multiple
                                ref={additionalFileInputRef}
                                onChange={handleAdditionalFileChange}
                                accept="image/*"
                                className="hidden"
                            />
                        </div>
                        
                        {/* Hiển thị hình ảnh phụ đã chọn */}
                        {additionalImages.length > 0 && (
                            <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-4">
                                {additionalImages.map((img, index) => (
                                    <div key={index} className="relative group">
                                        <div className="relative h-32 border rounded-md overflow-hidden">
                                            <img 
                                                src={img.preview || img.url} 
                                                alt={`Additional ${index}`}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveAdditionalImage(index)}
                                            className="cursor-pointer absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-80 hover:opacity-100"
                                            title="Xóa ảnh này"
                                        >
                                            <FaTimes size={14} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Mô tả sản phẩm */}
                    <div className="mt-6">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Mô tả <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            name="description"
                            rows="4"
                            className="w-full p-2 border border-gray-300 rounded-md"
                            value={formData.description}
                            onChange={handleChange}
                            required
                        ></textarea>
                    </div>

                    <div className="mt-6 flex justify-end">
                        <Link
                            href="/admin/curtains"
                            className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md mr-2"
                        >
                            Hủy
                        </Link>
                        <button
                            type="submit"
                            className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-md"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Đang xử lý...' : 'Thêm sản phẩm'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
