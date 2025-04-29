"use client";

import { useState } from 'react';

const ImageUploader = ({ onUpload, isMultiple = true }) => {
  const [uploadType, setUploadType] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const [previews, setPreviews] = useState([]);

  // Handle upload type selection
  const handleSelectUploadType = (type) => {
    setUploadType(type);
    setError('');
  };

  // Handle URL input change
  const handleUrlChange = (e) => {
    setImageUrl(e.target.value);
    setError('');
  };

  // Handle file selection
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setSelectedFiles(files);
      setError('');

      // Create previews for each file
      const newPreviews = files.map(file => {
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = () => {
            resolve(reader.result);
          };
          reader.readAsDataURL(file);
        });
      });

      Promise.all(newPreviews).then(previewUrls => {
        setPreviews(previewUrls);
      });
    }
  };

  // Upload images from device
  const uploadFromDevice = async () => {
    if (selectedFiles.length === 0) {
      setError('Vui lòng chọn ít nhất một tệp ảnh');
      return;
    }

    setIsUploading(true);
    setError('');

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const formData = new FormData();

      // Append all files to formData with the name 'images'
      selectedFiles.forEach(file => {
        formData.append('images', file);
      });

      const response = await fetch(`${API_URL}/upload/multiple-from-device`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Lỗi khi tải lên ảnh');
      }

      const data = await response.json();
      onUpload(data.urls);
      setUploadType(null);
      setSelectedFiles([]);
      setPreviews([]);
    } catch (err) {
      setError('Lỗi khi tải lên ảnh: ' + err.message);
    } finally {
      setIsUploading(false);
    }
  };

  // Save image from URL
  const saveFromUrl = async () => {
    if (!imageUrl) {
      setError('Vui lòng nhập URL ảnh');
      return;
    }

    setIsUploading(true);
    setError('');

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const response = await fetch(`${API_URL}/upload/from-url`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ imageUrl }),
      });

      if (!response.ok) {
        throw new Error('Lỗi khi lưu URL ảnh');
      }

      const data = await response.json();
      onUpload([data.url]);
      setUploadType(null);
      setImageUrl('');
    } catch (err) {
      setError('Lỗi khi lưu URL ảnh: ' + err.message);
    } finally {
      setIsUploading(false);
    }
  };

  // Cancel upload
  const handleCancel = () => {
    setUploadType(null);
    setSelectedFiles([]);
    setImageUrl('');
    setError('');
    setPreviews([]);
  };

  return (
    <div className="mb-4">
      <label className="block font-medium mb-1">Ảnh</label>

      {/* Preview images */}
      {previews.length > 0 && (
        <div className="mb-2 flex flex-wrap gap-2">
          {previews.map((preview, index) => (
            <div key={index} className="relative inline-block">
              <img
                src={preview}
                alt={`Preview ${index + 1}`}
                className="w-40 h-24 object-cover rounded border"
              />
            </div>
          ))}
        </div>
      )}

      {/* Upload type selection */}
      {!uploadType && (
        <div className="flex space-x-2 mb-2">
          <button
            type="button"
            className="cursor-pointer bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
            onClick={() => handleSelectUploadType('device')}
          >
            Tải lên từ thiết bị
          </button>
          <button
            type="button"
            className="cursor-pointer bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
            onClick={() => handleSelectUploadType('cloud')}
          >
            Tải lên từ cloud
          </button>
        </div>
      )}

      {/* Upload from device form */}
      {uploadType === 'device' && (
        <div className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center">
          <label className="cursor-pointer">
            <span className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition">
              Chọn ảnh
            </span>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
              multiple={isMultiple}
            />
          </label>
          <p className="mt-2 text-gray-600">Không có ảnh được chọn</p>
          <ul className="mt-2">
            {selectedFiles.map((file, index) => (
              <li key={index} className="text-gray-800">{file.name}</li>
            ))}
          </ul>
          <div className="flex space-x-2">
            <button
              type="button"
              className="cursor-pointer bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700"
              onClick={uploadFromDevice}
              disabled={isUploading || selectedFiles.length === 0}
            >
              {isUploading ? 'Đang tải...' : 'Tải lên'}
            </button>
            <button
              type="button"
              className="cursor-pointer px-3 py-1 rounded border"
              onClick={handleCancel}
              disabled={isUploading}
            >
              Hủy
            </button>
          </div>
        </div>
      )}

      {/* Upload from cloud form */}
      {uploadType === 'cloud' && (
        <div className="mb-2">
          <input
            type="text"
            placeholder="Nhập URL ảnh"
            value={imageUrl}
            onChange={handleUrlChange}
            className="w-full border px-3 py-2 rounded mb-2"
          />
          <div className="flex space-x-2">
            <button
              type="button"
              className="cursor-pointer bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700"
              onClick={saveFromUrl}
              disabled={isUploading || !imageUrl}
            >
              {isUploading ? 'Đang lưu...' : 'Lưu URL'}
            </button>
            <button
              type="button"
              className="cursor-pointer px-3 py-1 rounded border"
              onClick={handleCancel}
              disabled={isUploading}
            >
              Hủy
            </button>
          </div>
        </div>
      )}

      {/* Error message */}
      {error && <div className="text-red-500 text-sm mt-1">{error}</div>}
    </div>
  );
};

export default ImageUploader;
