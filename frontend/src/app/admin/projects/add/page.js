'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FaSave, FaTimes } from 'react-icons/fa';
import Link from 'next/link';
import { toast } from 'react-toastify';
import ImageUploader from '@/components/ImageUploader';
import { uploadImage, uploadVideo, createProject } from '@/lib/api';

// Custom upload adapter for CKEditor
class MyUploadAdapter {
    constructor(loader) {
        this.loader = loader;
    }

    upload() {
        return this.loader.file
            .then(file => {
                // Check file type to determine upload method
                if (file.type.startsWith('video/')) {
                    return uploadVideo(file);
                } else {
                    return uploadImage(file);
                }
            })
            .then(response => {
                if (response && response.url) {
                    return { default: response.url };
                }
                return Promise.reject('Upload failed');
            });
    }

    abort() {
        // Abort upload implementation
    }
}

// Custom upload adapter plugin
function MyCustomUploadAdapterPlugin(editor) {
    editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
        return new MyUploadAdapter(loader);
    };
}

// CKEditor imports
let CKEditor; // For dynamic import
let ClassicEditor; // For dynamic import

export default function AddProject() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [editorLoaded, setEditorLoaded] = useState(false);

    const [formData, setFormData] = useState({
        title: '',
        location: '',
        type: '',
        shortDescription: '',
        thumbnail: null,
        detailedContent: '',
        featured: false,
        published: true,
    });

    // Dynamically load CKEditor
    useEffect(() => {
        CKEditor = require('@ckeditor/ckeditor5-react').CKEditor;
        ClassicEditor = require('@ckeditor/ckeditor5-build-classic');
        setEditorLoaded(true);
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    const handleEditorChange = (event, editor) => {
        const data = editor.getData();
        setFormData({ ...formData, detailedContent: data });
    };

    const handleThumbnailUpload = (uploadedImages) => {
        if (uploadedImages && uploadedImages.length > 0) {
            setFormData({
                ...formData,
                thumbnail: uploadedImages[0]
            });
        } else {
            setFormData({
                ...formData,
                thumbnail: null
            });
        }
    };

    const handleRemoveThumbnail = () => {
        setFormData({ ...formData, thumbnail: null });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const requiredFields = ['title', 'location', 'type', 'shortDescription', 'detailedContent'];
        const missingFields = requiredFields.filter(field => !formData[field]);

        if (missingFields.length > 0) {
            toast.error(`Vui lòng điền đầy đủ thông tin: ${missingFields.join(', ')}`);
            return;
        }

        if (!formData.thumbnail) {
            toast.error('Vui lòng tải lên ảnh thumbnail!');
            return;
        }

        // Chỉ gửi các trường cần thiết
        const payload = {
            title: formData.title,
            shortDescription: formData.shortDescription,
            detailedContent: formData.detailedContent,
            location: formData.location,
            type: formData.type,
            thumbnail: formData.thumbnail,
            featured: formData.featured || false,
            published: formData.published
        };

        try {
            setLoading(true);
            const result = await createProject(payload);

            if (result) {
                toast.success('Thêm công trình thành công!');
                router.push('/admin/projects');
            }
        } catch (error) {
            console.error("Error adding project:", error.response || error);
            let errorMessage = error.response?.data?.message || 'Lỗi khi thêm công trình!';
            if (error.response?.status === 413) {
                errorMessage = 'Dữ liệu quá lớn!';
            }
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Thêm Công Trình Mới</h1>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                            Tên công trình <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="title"
                            id="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Nhập tên công trình"
                        />
                    </div>

                    <div>
                        <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                            Địa điểm <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="location"
                            id="location"
                            value={formData.location}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Nhập địa điểm công trình"
                        />
                    </div>
                </div>

                <div className="mb-6">
                    <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                        Loại công trình <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        name="type"
                        id="type"
                        value={formData.type}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Ví dụ: Biệt thự, Chung cư, Văn phòng..."
                    />
                </div>

                <div className="mb-6">
                    <label htmlFor="shortDescription" className="block text-sm font-medium text-gray-700 mb-1">
                        Mô tả ngắn <span className="text-red-500">*</span>
                    </label>
                    <textarea
                        name="shortDescription"
                        id="shortDescription"
                        value={formData.shortDescription}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Mô tả ngắn gọn về công trình (khoảng 1-2 câu)"
                        rows={3}
                    />
                </div>

                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Ảnh Thumbnail <span className="text-red-500">*</span>
                    </label>
                    <ImageUploader onUpload={handleThumbnailUpload} maxFiles={1} />
                    {formData.thumbnail && (
                        <div className="mt-2 relative w-40 h-40 border rounded-md overflow-hidden">
                            <img
                                src={formData.thumbnail}
                                alt="Thumbnail preview"
                                className="w-full h-full object-cover"
                            />
                            <button
                                type="button"
                                onClick={handleRemoveThumbnail}
                                className="cursor-pointer absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 text-xs"
                            >
                                <FaTimes />
                            </button>
                        </div>
                    )}
                </div>

                <div className="mb-6">
                    <label htmlFor="detailedContent" className="block text-sm font-medium text-gray-700 mb-1">
                        Nội dung chi tiết <span className="text-red-500">*</span>
                    </label>
                    {editorLoaded && CKEditor && ClassicEditor ? (
                        <CKEditor
                            editor={ClassicEditor}
                            data={formData.detailedContent}
                            onChange={handleEditorChange}
                            config={{
                                placeholder: "Nhập nội dung chi tiết của công trình tại đây...",
                                extraPlugins: [MyCustomUploadAdapterPlugin],
                                toolbar: {
                                    items: [
                                        'heading', '|',
                                        'bold', 'italic', 'link', '|',
                                        'bulletedList', 'numberedList', '|',
                                        'insertTable', '|',
                                        'imageUpload', 'mediaEmbed', '|',
                                        'undo', 'redo'
                                    ]
                                },
                                image: {
                                    toolbar: [
                                        'imageStyle:full',
                                        'imageStyle:side',
                                        '|',
                                        'imageTextAlternative'
                                    ]
                                },
                                mediaEmbed: {
                                    previewsInData: true
                                }
                            }}
                        />
                    ) : (
                        <p>Đang tải trình soạn thảo...</p>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                        <label htmlFor="featured" className="flex items-center text-sm font-medium text-gray-700">
                            <input
                                type="checkbox"
                                name="featured"
                                id="featured"
                                checked={formData.featured}
                                onChange={handleChange}
                                className="mr-2 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                            Đánh dấu là công trình nổi bật
                        </label>
                    </div>
                    <div>
                        <label htmlFor="published" className="flex items-center text-sm font-medium text-gray-700">
                            <input
                                type="checkbox"
                                name="published"
                                id="published"
                                checked={formData.published}
                                onChange={handleChange}
                                className="mr-2 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                            Hiển thị công khai
                        </label>
                    </div>
                </div>

                <div className="mt-8 flex justify-end space-x-3">
                    <Link href="/admin/projects" className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md mr-2 hover:bg-gray-400">
                        Hủy
                    </Link>
                    <button
                        type="submit"
                        disabled={loading}
                        className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-md flex items-center hover:bg-blue-700 transition disabled:opacity-50"
                    >
                        <FaSave className="mr-2" /> {loading ? 'Đang lưu...' : 'Lưu'}
                    </button>
                </div>
            </form>
        </div>
    );
}