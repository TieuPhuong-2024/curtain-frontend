'use client'

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { FaSave, FaArrowLeft, FaTimes } from 'react-icons/fa';
import Link from 'next/link';
import { toast } from 'react-toastify';
import ImageUploader from '@/components/ImageUploader';
import Image from 'next/image';
import { uploadImage, uploadVideo, getProjectById, updateProject } from '@/lib/api';

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
let CKEditorComponent; // Renamed for clarity
let ClassicEditorBuild; // Renamed for clarity

export default function EditProject() {
    const router = useRouter();
    const params = useParams();
    const id = params?.id;

    const [loading, setLoading] = useState(false);
    const [loadingData, setLoadingData] = useState(true);
    const [error, setError] = useState(null);
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

    useEffect(() => {
        // Dynamically import CKEditor components only on client-side
        import('@ckeditor/ckeditor5-react').then(module => {
            CKEditorComponent = module.CKEditor;
            import('@ckeditor/ckeditor5-build-classic').then(buildModule => {
                ClassicEditorBuild = buildModule.default; // .default is often needed for classic builds
                setEditorLoaded(true);
            }).catch(err => console.error("Failed to load ClassicEditor build:", err));
        }).catch(err => console.error("Failed to load CKEditor component:", err));
    }, []);

    useEffect(() => {
        if (id) {
            setLoadingData(true);
            const fetchProject = async () => {
                try {
                    const projectData = await getProjectById(id);
                    console.log('Fetched project data:', projectData); // Add logging for debugging

                    // Kiểm tra nếu projectData có chứa thumbnail và featured
                    const thumbnailUrl = projectData.thumbnail ||
                        (projectData.images && projectData.images.length > 0 ? projectData.images[0] : null);

                    setFormData({
                        title: projectData.title || '',
                        location: projectData.location || '',
                        type: projectData.type || '',
                        shortDescription: projectData.shortDescription || projectData.description || '',
                        thumbnail: thumbnailUrl,
                        detailedContent: projectData.detailedContent || projectData.description || '',
                        featured: projectData.featured === true,
                        published: typeof projectData.published === 'boolean' ? projectData.published : true,
                    });
                } catch (err) {
                    console.error('Error fetching project:', err);
                    setError('Không thể tải dữ liệu công trình. Vui lòng thử lại sau.');
                } finally {
                    setLoadingData(false);
                }
            };
            fetchProject();
        }
    }, [id]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleEditorChange = (event, editor) => {
        const data = editor.getData();
        setFormData(prev => ({ ...prev, detailedContent: data }));
    };

    const handleThumbnailUpload = (uploadedImages) => {
        if (uploadedImages && uploadedImages.length > 0) {
            setFormData(prev => ({ ...prev, thumbnail: uploadedImages[0] }));
        }
    };

    const handleRemoveThumbnail = () => {
        setFormData(prev => ({ ...prev, thumbnail: null }));
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
            toast.error('Vui lòng có ảnh thumbnail!');
            return;
        }

        setLoading(true);
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
            await updateProject(id, payload);
            toast.success('Cập nhật công trình thành công!');
            router.push('/admin/projects');
        } catch (error) {
            console.error("Error updating project:", error.response || error);
            let errorMessage = error.response?.data?.message || 'Lỗi khi cập nhật công trình!';
            if (error.response?.status === 413) errorMessage = 'Dữ liệu quá lớn!';
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    if (loadingData && !editorLoaded) {
        return (
            <div className="p-6 flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
                    <p className="mt-4 text-gray-600">Đang tải trang chỉnh sửa...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6 flex flex-col items-center justify-center min-h-screen">
                <div className="text-center text-red-600 mb-4">
                    <p>{error}</p>
                </div>
                <Link href="/admin/projects" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition flex items-center">
                    <FaArrowLeft className="mr-2" /> Quay lại danh sách
                </Link>
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Chỉnh Sửa Công Trình</h1>
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
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                                onError={(e) => {
                                    console.error('Error loading thumbnail:', e);
                                    e.target.src = '/placeholder-image.jpg'; // Optional fallback
                                }}
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
                    {editorLoaded && CKEditorComponent ? (
                        <CKEditorComponent
                            editor={ClassicEditorBuild}
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
                        disabled={loading || loadingData}
                        className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-md flex items-center hover:bg-blue-700 transition disabled:opacity-50"
                    >
                        <FaSave className="mr-2" /> {loading ? 'Đang cập nhật...' : 'Cập nhật'}
                    </button>
                </div>
            </form>
        </div>
    );
}