import { useState } from 'react';
import { FaUpload } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { uploadVideo } from '../lib/api';

export default function VideoUploader({ onUpload }) {
    const [uploading, setUploading] = useState(false);

    const handleVideoUpload = async (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        try {
            setUploading(true);
            const uploadPromises = files.map(async (file) => {
                const result = await uploadVideo(file);
                return result.url;
            });

            const uploadedVideos = await Promise.all(uploadPromises);
            onUpload(uploadedVideos);
        } catch (error) {
            console.error('Error uploading video:', error);
            toast.error('Lỗi khi tải lên video!');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="flex items-center space-x-4">
            <label className="flex items-center px-4 py-2 bg-white border rounded-md cursor-pointer hover:bg-gray-50">
                <FaUpload className="mr-2" />
                <span>{uploading ? 'Đang tải lên...' : 'Chọn video'}</span>
                <input
                    type="file"
                    className="hidden"
                    onChange={handleVideoUpload}
                    accept="video/*"
                    multiple
                    disabled={uploading}
                />
            </label>
            {uploading && (
                <div className="h-5 w-5 border-t-2 border-r-2 border-blue-500 rounded-full animate-spin" />
            )}
        </div>
    );
}
