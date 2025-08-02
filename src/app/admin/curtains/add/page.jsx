'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaUpload, FaPlus, FaTimes, FaEdit, FaSave } from 'react-icons/fa';
import { createCurtain, uploadImage, getColors, createColor, getColorById, updateColor } from '@/lib/api';
import { getCategories, createCategory } from '@/lib/categoryApi';

export default function AddCurtain() {
    const [priceType, setPriceType] = useState('fixed');
    const [priceData, setPriceData] = useState({
        value: '',
        min: '',
        max: '',
        old: '',
        new: ''
    });

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
        category: '',
        material: '',
        color: '',
        width: '',
        height: '',
        mainImage: '',
        inStock: true
    });

    const [categories, setCategories] = useState([]);
    const [colors, setColors] = useState([]);

    // State for Add/Edit Color Modal
    const [showColorModal, setShowColorModal] = useState(false);
    const [newColorName, setNewColorName] = useState('');
    const [newColorHexCode, setNewColorHexCode] = useState('');
    const [addColorError, setAddColorError] = useState(null);
    const [isAddingColor, setIsAddingColor] = useState(false);
    const [isEditingColor, setIsEditingColor] = useState(false);
    const [currentColorId, setCurrentColorId] = useState(null);
    const [selectedColor, setSelectedColor] = useState(null);

    // State for Add Category
    const [showAddCategory, setShowAddCategory] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [isAddingCategory, setIsAddingCategory] = useState(false);
    const [categoryImage, setCategoryImage] = useState(null);
    const [categoryImagePreview, setCategoryImagePreview] = useState('');
    const categoryFileInputRef = useRef(null);

    // Handle category image selection
    const handleCategoryImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setCategoryImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setCategoryImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    // Handle category image button click
    const handleCategoryImageButtonClick = () => {
        categoryFileInputRef.current.click();
    };

    // Function to handle adding a new category
    const handleAddCategory = async () => {
        if (!newCategoryName.trim()) return;

        setIsAddingCategory(true);
        setError(null);

        try {
            let imageUrl = '';

            // Upload image if selected
            if (categoryImage) {
                const uploadResult = await uploadImage(categoryImage);
                imageUrl = uploadResult.url;
            }

            // Create new category with image
            const newCategory = await createCategory({
                name: newCategoryName.trim(),
                image: imageUrl
            });

            // Add new category to the list
            setCategories(prev => [...prev, newCategory]);

            // Auto-select the newly created category
            setFormData(prev => ({
                ...prev,
                category: newCategory._id
            }));

            // Reset form
            setNewCategoryName('');
            setCategoryImage(null);
            setCategoryImagePreview('');
            setShowAddCategory(false);

        } catch (error) {
            console.error('Error adding category:', error);
            setError('Có lỗi xảy ra khi thêm danh mục mới. Vui lòng thử lại.');
        } finally {
            setIsAddingCategory(false);
        }
    };

    const fetchAllColors = async () => {
        try {
            const colorRes = await getColors();
            setColors(colorRes || []);
        } catch (error) {
            console.error('Error fetching colors:', error);
            setColors([]);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const catRes = await getCategories();
                setCategories(catRes || []);
            } catch (error) {
                console.error('Error fetching categories:', error);
                setCategories([]);
            }
            await fetchAllColors();
        };
        fetchData();
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        // Special case for color to ensure we don't override the handleColorChange functionality
        if (name === 'color') {
            return;
        }

        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    // Handle color selection to display color details
    const handleColorChange = async (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });

        if (value) {
            try {
                const colorData = await getColorById(value);
                setSelectedColor(colorData);
            } catch (error) {
                console.error('Error fetching color details:', error);
            }
        } else {
            setSelectedColor(null);
        }
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
        setFormData(prev => ({ ...prev, mainImage: '' }));
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setAddColorError(null); // Clear color error on main submit

        // Validate form
        if (
            !formData.name ||
            !formData.description ||
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
                price: {
                    type: priceType,
                    ...(priceType === 'fixed' && { value: parseFloat(priceData.value) }),
                    ...(priceType === 'range' && { min: parseFloat(priceData.min), max: parseFloat(priceData.max) }),
                    ...(priceType === 'discount' && { old: parseFloat(priceData.old), new: parseFloat(priceData.new) }),
                },
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

    const handleOpenAddColorModal = () => {
        setNewColorName('');
        setNewColorHexCode('');
        setAddColorError(null);
        setShowColorModal(true);
        setIsEditingColor(false);
        setCurrentColorId(null);
    };

    const handleOpenEditColorModal = async (colorId) => {
        setAddColorError(null);
        setIsEditingColor(true);
        setCurrentColorId(colorId);

        try {
            const colorData = await getColorById(colorId);
            setNewColorName(colorData.name || '');
            setNewColorHexCode(colorData.hexCode || '');
            setShowColorModal(true);
        } catch (error) {
            console.error('Error fetching color for edit:', error);
            alert('Có lỗi xảy ra khi tải thông tin màu sắc.');
        }
    };

    const handleCloseColorModal = () => {
        setShowColorModal(false);
        setAddColorError(null);
        setIsEditingColor(false);
        setCurrentColorId(null);
    };

    const handleSaveColor = async () => {
        if (!newColorName.trim()) {
            setAddColorError('Tên màu sắc không được để trống.');
            return;
        }

        setIsAddingColor(true);
        setAddColorError(null);

        try {
            const colorData = { name: newColorName, hexCode: newColorHexCode || '#808080' };

            if (isEditingColor && currentColorId) {
                // Update existing color
                await updateColor(currentColorId, colorData);
            } else {
                // Create new color
                const savedColor = await createColor(colorData);
                setFormData(prev => ({ ...prev, color: savedColor._id })); // Auto-select new color
            }

            await fetchAllColors(); // Refresh color list
            handleCloseColorModal();

            // If we're editing the currently selected color, refresh the selected color data
            if (formData.color === currentColorId) {
                const updatedColor = await getColorById(currentColorId);
                setSelectedColor(updatedColor);
            }
        } catch (error) {
            console.error('Error saving color:', error);
            setAddColorError(error.response?.data?.message || 'Lỗi khi lưu màu sắc.');
        } finally {
            setIsAddingColor(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-4 flex items-center">
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
                        <div className="mb-4">
                            <div className="flex justify-between items-center mb-2">
                                <label className="block text-gray-700 text-sm font-bold" htmlFor="category">
                                    Danh mục <span className="text-red-500">*</span>
                                </label>
                                <button
                                    type="button"
                                    onClick={() => setShowAddCategory(!showAddCategory)}
                                    className="cursor-pointer text-xs text-blue-600 hover:text-blue-800 flex items-center"
                                >
                                    <FaPlus className="mr-1" /> {showAddCategory ? 'Hủy' : 'Thêm mới'}
                                </button>
                            </div>

                            {showAddCategory && (
                                <div className="mb-3 space-y-3">
                                    <div className="flex">
                                        <input
                                            type="text"
                                            value={newCategoryName}
                                            onChange={(e) => setNewCategoryName(e.target.value)}
                                            placeholder="Tên danh mục mới"
                                            className="flex-1 shadow appearance-none border rounded-l py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        />
                                        <button
                                            type="button"
                                            onClick={handleAddCategory}
                                            disabled={!newCategoryName.trim() || isAddingCategory}
                                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-r focus:outline-none focus:shadow-outline disabled:opacity-50"
                                        >
                                            {isAddingCategory ? 'Đang thêm...' : 'Thêm'}
                                        </button>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex items-center">
                                            <button
                                                type="button"
                                                onClick={handleCategoryImageButtonClick}
                                                className="cursor-pointer text-sm text-blue-600 hover:text-blue-800 flex items-center"
                                            >
                                                <FaUpload className="mr-1" /> Tải lên hình ảnh
                                            </button>
                                            <input
                                                type="file"
                                                ref={categoryFileInputRef}
                                                onChange={handleCategoryImageChange}
                                                accept="image/*"
                                                className="hidden"
                                            />
                                        </div>
                                        {categoryImagePreview && (
                                            <div className="relative w-20 h-20 border rounded-md overflow-hidden">
                                                <img
                                                    src={categoryImagePreview}
                                                    alt="Category preview"
                                                    className="w-full h-full object-cover"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setCategoryImage(null);
                                                        setCategoryImagePreview('');
                                                    }}
                                                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                                                    title="Xóa ảnh"
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            <select
                                id="category"
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
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
                                Loại giá <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={priceType}
                                onChange={e => setPriceType(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-md mb-2"
                            >
                                <option value="fixed">Giá cố định</option>
                                <option value="range">Khoảng giá</option>
                                <option value="discount">Giá giảm</option>
                                <option value="contact">Liên hệ</option>
                            </select>
                            {priceType === 'fixed' && (
                                <input
                                    type="number"
                                    placeholder="Giá (VNĐ)"
                                    className="w-full p-2 border border-gray-300 rounded-md"
                                    value={priceData.value}
                                    onChange={e => setPriceData({ ...priceData, value: e.target.value })}
                                    min="0"
                                    required
                                />
                            )}
                            {priceType === 'range' && (
                                <div className="flex gap-2">
                                    <input
                                        type="number"
                                        placeholder="Giá thấp nhất"
                                        className="w-1/2 p-2 border border-gray-300 rounded-md"
                                        value={priceData.min}
                                        onChange={e => setPriceData({ ...priceData, min: e.target.value })}
                                        min="0"
                                        required
                                    />
                                    <input
                                        type="number"
                                        placeholder="Giá cao nhất"
                                        className="w-1/2 p-2 border border-gray-300 rounded-md"
                                        value={priceData.max}
                                        onChange={e => setPriceData({ ...priceData, max: e.target.value })}
                                        min="0"
                                        required
                                    />
                                </div>
                            )}
                            {priceType === 'discount' && (
                                <div className="flex gap-2">
                                    <input
                                        type="number"
                                        placeholder="Giá cũ"
                                        className="w-1/2 p-2 border border-gray-300 rounded-md"
                                        value={priceData.old}
                                        onChange={e => setPriceData({ ...priceData, old: e.target.value })}
                                        min="0"
                                        required
                                    />
                                    <input
                                        type="number"
                                        placeholder="Giá mới"
                                        className="w-1/2 p-2 border border-gray-300 rounded-md"
                                        value={priceData.new}
                                        onChange={e => setPriceData({ ...priceData, new: e.target.value })}
                                        min="0"
                                        required
                                    />
                                </div>
                            )}
                            {priceType === 'contact' && (
                                <div className="text-gray-500 italic">Giá sẽ hiển thị là "Liên hệ"</div>
                            )}
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
                            <div className="flex items-center gap-2 mt-1">
                                <select
                                    name="color"
                                    id="color"
                                    value={formData.color}
                                    onChange={handleColorChange}
                                    required
                                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                >
                                    <option value="">Chọn màu sắc</option>
                                    {colors.map(color => (
                                        <option key={color._id} value={color._id}>
                                            {color.name}
                                        </option>
                                    ))}
                                </select>
                                <button
                                    type="button"
                                    onClick={handleOpenAddColorModal}
                                    className="p-2 border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
                                    title="Thêm màu mới"
                                >
                                    <FaPlus />
                                </button>
                            </div>

                            {/* Display selected color details */}
                            {selectedColor && (
                                <div className="mt-2 flex items-center space-x-3">
                                    <div
                                        className="w-6 h-6 border border-gray-300"
                                        style={{ backgroundColor: selectedColor.hexCode || '#808080' }}
                                    ></div>
                                    <div className="text-sm text-gray-600">
                                        {selectedColor.name} - {selectedColor.hexCode || 'Không có mã màu'}
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => handleOpenEditColorModal(selectedColor._id)}
                                        className="text-blue-500 hover:text-blue-700"
                                        title="Chỉnh sửa màu"
                                    >
                                        <FaEdit size={14} />
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Kích thước - Chiều rộng */}
                        {/* <div>
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
                        </div> */}

                        {/* Kích thước - Chiều cao */}
                        {/* <div>
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
                        </div> */}

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
                                        className="cursor-pointer bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-md flex items-center"
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
                                                className="cursor-pointer absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-80 hover:bg-red-600"
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
                                className="cursor-pointer bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-md flex items-center"
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
                                            className="cursor-pointer absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-80 hover:bg-red-600"
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
                            className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-md mr-2"
                        >
                            Hủy
                        </Link>
                        <button
                            type="submit"
                            className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-md flex items-center hover:bg-blue-700 transition disabled:opacity-50"
                            disabled={isSubmitting}
                        >
                            <FaSave className="mr-2" /> {isSubmitting ? 'Đang xử lý...' : 'Lưu'}
                        </button>
                    </div>
                </form>
            </div>

            {/* Add/Edit Color Modal */}
            {showColorModal && (
                <>
                    {/* Backdrop with blur effect */}
                    <div className="fixed inset-0 backdrop-blur-sm bg-gray-600/40 z-40"></div>

                    {/* Modal */}
                    <div className="fixed inset-0 overflow-y-auto h-full w-full z-50 flex justify-center items-center">
                        <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md relative">
                            <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
                                {isEditingColor ? 'Chỉnh sửa màu sắc' : 'Thêm màu sắc mới'}
                            </h3>
                            <div>
                                <label htmlFor="newColorName" className="block text-sm font-medium text-gray-700">Tên màu</label>
                                <input
                                    type="text"
                                    name="newColorName"
                                    id="newColorName"
                                    value={newColorName}
                                    onChange={(e) => setNewColorName(e.target.value)}
                                    className="mt-1 mb-2 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="newColorHexCode" className="block text-sm font-medium text-gray-700">Mã Hex</label>
                                <div className="flex mt-1 mb-4">
                                    <input
                                        type="text"
                                        name="newColorHexCode"
                                        id="newColorHexCode"
                                        value={newColorHexCode}
                                        onChange={(e) => setNewColorHexCode(e.target.value)}
                                        placeholder="#RRGGBB"
                                        className="block w-full px-3 py-2 border border-gray-300 rounded-l-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    />
                                    <input
                                        type="color"
                                        value={newColorHexCode || '#808080'}
                                        onChange={(e) => setNewColorHexCode(e.target.value)}
                                        className="h-10 w-10 border border-gray-300 rounded-r-md"
                                    />
                                </div>
                                {newColorHexCode && (
                                    <div className="flex items-center mb-4">
                                        <div className="w-6 h-6 mr-2 border border-gray-300" style={{ backgroundColor: newColorHexCode }}></div>
                                        <span className="text-sm text-gray-600">Xem trước màu sắc</span>
                                    </div>
                                )}
                            </div>
                            {addColorError && (
                                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-3 text-sm">
                                    {addColorError}
                                </div>
                            )}
                            <div className="flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={handleCloseColorModal}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                    disabled={isAddingColor}
                                >
                                    Hủy
                                </button>
                                <button
                                    type="button"
                                    onClick={handleSaveColor}
                                    className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                    disabled={isAddingColor}
                                >
                                    {isAddingColor ? 'Đang lưu...' : isEditingColor ? 'Cập nhật' : 'Lưu màu'}
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
