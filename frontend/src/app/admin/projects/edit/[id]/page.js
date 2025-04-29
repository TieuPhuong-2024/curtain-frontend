'use client'

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { FaSave, FaArrowLeft, FaPlus, FaTrash, FaCheckCircle, FaTimesCircle, FaExclamationCircle } from 'react-icons/fa';
import Link from 'next/link';
import axios from 'axios';
import { toast, Toaster } from 'react-hot-toast';
import ImageUploader from '@/components/ImageUploader';
import VideoUploader from '@/components/VideoUploader';

export default function EditProject({ params }) {
    const { id } = use(params);
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [loadingData, setLoadingData] = useState(true);
    const [error, setError] = useState(null);
    
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        location: '',
        type: '',
        images: [],
        videos: []
    });
    
    const [videoUrl, setVideoUrl] = useState('');
    
    useEffect(() => {
        const fetchProject = async () => {
            try {
                setLoadingData(true);
                const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/projects/${id}`);
                setFormData(response.data);
                setLoadingData(false);
            } catch (error) {
                console.error('Error fetching project:', error);
                setError('Không thể tải dữ liệu công trình. Vui lòng thử lại sau.');
                setLoadingData(false);
            }
        };
        
        fetchProject();
    }, [id]);
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleVideoUrlChange = (e) => {
        setVideoUrl(e.target.value);
    };
    
    const handleAddVideo = () => {
        if (!videoUrl) return;
        if (!videoUrl.startsWith('http://') && !videoUrl.startsWith('https://')) {
            toast.error('URL video không hợp lệ!');
            return;
        }
        
        setFormData({
            ...formData,
            videos: [...formData.videos, videoUrl]
        });
        setVideoUrl('');
    };
    
    const handleRemoveVideo = (index) => {
        const newVideos = [...formData.videos];
        newVideos.splice(index, 1);
        setFormData({ ...formData, videos: newVideos });
    };
    
    const handleImageUpload = (uploadedImages) => {
        setFormData({
            ...formData,
            images: [...formData.images, ...uploadedImages]
        });
    };
    
    const handleVideoUpload = (uploadedVideos) => {
        setFormData({
            ...formData,
            videos: [...formData.videos, ...uploadedVideos]
        });
    };
    
    const handleRemoveImage = (index) => {
        const newImages = [...formData.images];
        newImages.splice(index, 1);
        setFormData({ ...formData, images: newImages });
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validate required fields
        const requiredFields = ['title', 'description', 'location', 'type'];
        const missingFields = requiredFields.filter(field => !formData[field]);
        
        if (missingFields.length > 0) {
            toast.error(`Vui lòng điền đầy đủ thông tin: ${missingFields.join(', ')}`);
            return;
        }
        
        if (formData.images.length === 0) {
            toast.error('Vui lòng thêm ít nhất một hình ảnh!');
            return;
        }
        
        try {
            setLoading(true);
            const response = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/projects/${id}`, formData, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            if (response.data) {
                toast.success('Cập nhật công trình thành công!');
                router.push('/admin/projects');
            }
        } catch (error) {
            console.error('Error updating project:', error);
            const errorMessage = error.response?.data?.message || 
                               (error.response?.status === 413 ? 'Dữ liệu quá lớn!' : 'Lỗi khi cập nhật công trình!');
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };
    
    if (loadingData) {
        return (
            <div className="p-6 flex items-center justify-center h-screen">
                <div className="text-center">
                    <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
                    <p className="mt-4 text-gray-600">Đang tải dữ liệu...</p>
                </div>
            </div>
        );
    }
    
    if (error) {
        return (
            <div className="p-6 flex items-center justify-center h-screen">
                <div className="text-center text-red-600">
                    <p>{error}</p>
                    <button 
                        onClick={() => router.push('/admin/projects')}
                        className="cursor-pointer mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
                    >
                        Quay lại danh sách
                    </button>
                </div>
            </div>
        );
    }
    
    return (
        <div className="p-6">
            <Toaster position="top-center" />
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Chỉnh Sửa Công Trình</h1>
                <Link href="/admin/projects" className="text-blue-600 hover:text-blue-800 flex items-center">
                    <FaArrowLeft className="mr-2" /> Quay lại
                </Link>
            </div>
            
            <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Tên công trình <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Nhập tên công trình"
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Địa điểm <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Nhập địa điểm công trình"
                        />
                    </div>
                </div>
                
                <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Loại công trình <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        name="type"
                        value={formData.type}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Ví dụ: Biệt thự, Chung cư, Văn phòng, Khách sạn..."
                    />
                </div>
                
                <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Mô tả <span className="text-red-500">*</span>
                    </label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Nhập mô tả chi tiết về công trình"
                        rows={4}
                    />
                </div>
                
                <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Hình ảnh <span className="text-red-500">*</span>
                    </label>
                    <ImageUploader onUpload={handleImageUpload} />
                    
                    {/* Display uploaded images */}
                    <div className="mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {formData.images.map((img, index) => (
                            <div key={index} className="relative group rounded-md overflow-hidden border">
                                <img
                                    src={img}
                                    alt={`Project image ${index + 1}`}
                                    className="w-full h-32 object-cover"
                                />
                                <button
                                    type="button"
                                    onClick={() => handleRemoveImage(index)}
                                    className="cursor-pointer absolute inset-0 bg-black bg-opacity-50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <FaTrash />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
                
                <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Video
                    </label>
                    <VideoUploader onUpload={handleVideoUpload} />

                    <div className="mt-4 flex gap-2">
                        <input
                            type="text"
                            value={videoUrl}
                            onChange={handleVideoUrlChange}
                            placeholder="Nhập URL video..."
                            className="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                            type="button"
                            onClick={handleAddVideo}
                            className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition flex items-center"
                        >
                            <FaPlus className="mr-2" /> Thêm
                        </button>
                    </div>
                    
                    {/* Display added videos */}
                    <div className="mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {formData.videos.map((video, index) => (
                            <div key={index} className="relative group rounded-md overflow-hidden border">
                                <video
                                    src={video}
                                    className="w-full h-32 object-cover"
                                    controls
                                />
                                <button
                                    type="button"
                                    onClick={() => handleRemoveVideo(index)}
                                    className="cursor-pointer absolute inset-0 bg-black bg-opacity-50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <FaTrash />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
                
                <div className="mt-8 flex justify-end">
                    <button
                        type="submit"
                        disabled={loading}
                        className={`cursor-pointer bg-blue-600 text-white px-6 py-2 rounded-md flex items-center hover:bg-blue-700 transition ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                        {loading ? (
                            <>
                                <div className="h-5 w-5 border-t-2 border-r-2 border-white rounded-full animate-spin mr-2"></div>
                                Đang xử lý...
                            </>
                        ) : (
                            <>
                                <FaSave className="mr-2" /> Lưu thay đổi
                            </>
                        )}
                    </button>
                    <Link href="/admin/projects" className="bg-gray-500 text-white px-6 py-2 rounded-md flex items-center hover:bg-gray-600 transition ml-2">
                        <FaTimesCircle className="mr-2" /> Hủy
                    </Link>
                </div>
            </form>
        </div>
    );
}