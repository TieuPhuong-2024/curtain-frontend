'use client';

import {use, useEffect, useState, useRef} from 'react';
import {useRouter} from 'next/navigation';
import Link from 'next/link';
import {FaArrowLeft, FaUpload, FaPlus, FaTimes} from 'react-icons/fa';
import {getCurtainById, updateCurtain, uploadImage, getCategories, getImagesByCurtainId, addImageToCurtain, deleteImage} from '@/lib/api';

export default function EditCurtain({params}) {
    const router = useRouter();
    const {id} = use(params);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const fileInputRef = useRef(null);
    
    // Thêm state cho nhiều hình ảnh
    const [imageList, setImageList] = useState([]);
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
                const data = await getCategories();
                setCategories(data);
            } catch (error) {
                console.error('Error fetching categories:', error);
                setCategories([]);
            }
        };
        fetchCategories();
    }, []);

    useEffect(() => {
        fetchCurtainData();
    }, [id]);

    const fetchCurtainData = async () => {
        try {
            setIsLoading(true);
            setError(null);

            // Fetch curtain data
            const curtainData = await getCurtainById(id);
            
            // Fetch images separately if not included in response
            let images = curtainData.images || [];
            if (!curtainData.images || !Array.isArray(curtainData.images) || curtainData.images.length === 0) {
                try {
                    images = await getImagesByCurtainId(id);
                } catch (imgErr) {
                    console.error('Error fetching images:', imgErr);
                }
            }
            
            setImageList(images);
            
            // Map the curtain data to the form
            setFormData({
                name: curtainData.name || '',
                description: curtainData.description || '',
                price: curtainData.price || '',
                category: curtainData.category?._id || curtainData.category || '',
                material: curtainData.material || '',
                color: curtainData.color || '',
                width: curtainData.size?.width || '',
                height: curtainData.size?.height || '',
                mainImage: curtainData.mainImage || curtainData.image || '',
                inStock: curtainData.inStock !== undefined ? curtainData.inStock : true
            });

            setIsLoading(false);
        } catch (error) {
            console.error('Error fetching curtain:', error);
            setError('Có lỗi xảy ra khi tải thông tin sản phẩm. Vui lòng thử lại sau.');
            setIsLoading(false);
        }
    };

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

    // Function to remove main image
    const handleRemoveMainImage = () => {
        setSelectedFile(null);
        setImagePreview(null);
        setFormData({
            ...formData,
            mainImage: ''
        });
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
            // Upload each file and add to curtain
            for (const file of files) {
                // Upload the file first
                const uploadResult = await uploadImage(file);
                
                // Add the image to the curtain
                const imageData = {
                    url: uploadResult.url,
                    isMain: false
                };
                
                const savedImage = await addImageToCurtain(id, imageData);
                
                // Add to image list with local preview
                setImageList(prev => [
                    ...prev, 
                    {
                        ...savedImage,
                        preview: URL.createObjectURL(file)
                    }
                ]);
            }
            
            alert('Đã thêm hình ảnh thành công!');
        } catch (error) {
            console.error('Error uploading additional images:', error);
            setError('Có lỗi xảy ra khi tải lên hình ảnh. Vui lòng thử lại sau.');
        } finally {
            setIsSubmitting(false);
            e.target.value = null; // Reset file input
        }
    };
    
    const handleRemoveImage = async (imageId) => {
        if (!imageId) return;
        
        if (!confirm('Bạn có chắc chắn muốn xóa hình ảnh này?')) {
            return;
        }
        
        setIsSubmitting(true);
        
        try {
            await deleteImage(imageId);
            // Refresh image list
            setImageList(prev => prev.filter(img => img._id !== imageId));
            alert('Đã xóa hình ảnh thành công!');
        } catch (error) {
            console.error('Error deleting image:', error);
            setError('Có lỗi xảy ra khi xóa hình ảnh. Vui lòng thử lại sau.');
        } finally {
            setIsSubmitting(false);
        }
    };
    
    const handleSetMainImage = async (imageUrl) => {
        setFormData({
            ...formData,
            mainImage: imageUrl
        });
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
                mainImage: mainImageUrl
            };

            // Gọi API để cập nhật sản phẩm
            await updateCurtain(id, curtainData);

            setIsSubmitting(false);
            alert('Cập nhật sản phẩm thành công!');
            router.push('/admin/curtains');

        } catch (error) {
            console.error('Error updating curtain:', error);
            setIsSubmitting(false);
            setError('Có lỗi xảy ra khi cập nhật sản phẩm. Vui lòng thử lại sau.');
        }
    };

    if (isLoading) {
        return (
            <div className="container mx-auto px-4 py-8 flex justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-4 flex items-center">
                <Link href="/admin/curtains" className="text-blue-500 flex items-center mr-4">
                    <FaArrowLeft className="mr-1"/> Quay lại
                </Link>
                <h1 className="text-2xl font-bold">Chỉnh sửa sản phẩm</h1>
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
                                                className="cursor-pointer absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center"
                                                title="Xóa ảnh"
                                            >
                                                <FaTimes />
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* Current image */}
                                {!imagePreview && formData.mainImage && (
                                    <div className="mt-2">
                                        <p className="text-sm text-gray-500 mb-1">Hình ảnh chính hiện tại:</p>
                                        <div className="relative w-full h-40 border border-gray-300 rounded-md overflow-hidden">
                                            <img
                                                src={formData.mainImage}
                                                alt="Current"
                                                className="w-full h-full object-contain"
                                            />
                                            <button
                                                type="button"
                                                onClick={handleRemoveMainImage}
                                                className="cursor-pointer absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center"
                                                title="Xóa ảnh"
                                            >
                                                <FaTimes />
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
                        <div className="flex justify-between items-center">
                            <label className="block text-sm font-medium text-gray-700">
                                Tất cả hình ảnh
                            </label>
                            <button
                                type="button"
                                onClick={handleAdditionalFileButtonClick}
                                className="cursor-pointer bg-green-500 text-white px-4 py-2 rounded-md flex items-center text-sm"
                            >
                                <FaPlus className="mr-2" /> Thêm hình ảnh
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
                        
                        {/* Hiển thị tất cả hình ảnh */}
                        {imageList.length > 0 ? (
                            <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-4">
                                {imageList.map((img) => (
                                    <div key={img._id} className="relative group">
                                        <div 
                                            className={`relative h-32 border rounded-md overflow-hidden ${
                                                formData.mainImage === img.url ? 'border-2 border-blue-500' : 'border-gray-300'
                                            }`}
                                        >
                                            <img 
                                                src={img.preview || img.url} 
                                                alt={img.isMain ? "Main Image" : "Additional Image"}
                                                className="w-full h-full object-cover"
                                            />
                                            {formData.mainImage === img.url && (
                                                <div className="absolute top-1 left-1 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                                                    Chính
                                                </div>
                                            )}
                                        </div>
                                        
                                        <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                            {formData.mainImage !== img.url && (
                                                <button
                                                    type="button"
                                                    onClick={() => handleSetMainImage(img.url)}
                                                    className="cursor-pointer bg-blue-500 text-white rounded-full p-2 mx-1"
                                                    title="Đặt làm ảnh chính"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                                    </svg>
                                                </button>
                                            )}
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveImage(img._id)}
                                                className="cursor-pointer bg-red-500 text-white rounded-full p-2 mx-1"
                                                title="Xóa ảnh này"
                                            >
                                                <FaTimes size={16} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="mt-3 border border-dashed border-gray-300 rounded-md p-4 text-center text-gray-500">
                                Chưa có hình ảnh nào. Nhấn "Thêm hình ảnh" để thêm mới.
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
                            {isSubmitting ? 'Đang xử lý...' : 'Cập nhật sản phẩm'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
} 
