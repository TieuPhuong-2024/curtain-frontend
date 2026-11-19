'use client';

import { useState } from 'react';
import { FaCloudUploadAlt, FaDesktop, FaFolderOpen, FaImage } from 'react-icons/fa';

import { uploadImagesFromDevice, uploadImageFromUrl } from '../lib/api';
import Button from './admin/Button';
import { controlClass } from './admin/Field';

const ImageUploader = ({ onUpload, isMultiple = true }) => {
  const [uploadType, setUploadType] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const [previews, setPreviews] = useState([]);

  const handleSelectUploadType = (type) => {
    setUploadType(type);
    setError('');
  };

  const handleUrlChange = (event) => {
    setImageUrl(event.target.value);
    setError('');
  };

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    if (!files.length) return;

    setSelectedFiles(files);
    setError('');

    Promise.all(
      files.map(
        (file) =>
          new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.readAsDataURL(file);
          })
      )
    ).then(setPreviews);
  };

  const uploadFromDevice = async () => {
    if (!selectedFiles.length) {
      setError('Chọn ít nhất một tệp ảnh trước khi tải lên.');
      return;
    }

    setIsUploading(true);
    setError('');

    try {
      const data = await uploadImagesFromDevice(selectedFiles);
      onUpload(data.urls);
      setUploadType(null);
      setSelectedFiles([]);
      setPreviews([]);
    } catch (err) {
      setError(`Không tải được ảnh: ${err.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  const saveFromUrl = async () => {
    if (!imageUrl) {
      setError('Nhập URL ảnh trước khi lưu.');
      return;
    }

    setIsUploading(true);
    setError('');

    try {
      const data = await uploadImageFromUrl(imageUrl);
      onUpload([data.url]);
      setUploadType(null);
      setImageUrl('');
    } catch (err) {
      setError(`Không lưu được URL ảnh: ${err.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  const handleCancel = () => {
    setUploadType(null);
    setSelectedFiles([]);
    setImageUrl('');
    setError('');
    setPreviews([]);
  };

  return (
    <div>
      {previews.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-2">
          {previews.map((preview, index) => (
            <img
              key={index}
              src={preview}
              alt={`Xem trước ${index + 1}`}
              className="h-24 w-40 rounded-[6px] border border-[var(--a-line)] object-cover"
            />
          ))}
        </div>
      )}

      {!uploadType && (
        <div className="flex flex-wrap gap-2">
          <Button icon={FaDesktop} onClick={() => handleSelectUploadType('device')}>
            Tải lên từ thiết bị
          </Button>
          <Button icon={FaCloudUploadAlt} onClick={() => handleSelectUploadType('cloud')}>
            Lấy từ URL
          </Button>
        </div>
      )}

      {uploadType === 'device' && (
        <div className="rounded-[var(--a-radius-sm)] border border-dashed border-[var(--a-line-strong)] bg-[var(--a-raised)] p-4">
          <div className="flex flex-col items-center gap-2 text-center">
            <FaImage className="h-5 w-5 text-[var(--a-faint)]" aria-hidden="true" />
            <label className="cursor-pointer">
              <span className="inline-flex h-8 items-center gap-1.5 rounded-[var(--a-radius-sm)] border border-[var(--a-line-strong)] bg-[var(--a-surface)] px-3 text-[12.5px] font-medium text-[var(--a-ink)] transition hover:border-[var(--a-muted)]">
                <FaFolderOpen className="h-3.5 w-3.5" aria-hidden="true" />
                Chọn ảnh
              </span>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="sr-only"
                multiple={isMultiple}
              />
            </label>
            <p className="text-[12px] text-[var(--a-faint)]">
              {selectedFiles.length
                ? `Đã chọn ${selectedFiles.length} tệp`
                : isMultiple
                  ? 'Có thể chọn nhiều ảnh cùng lúc'
                  : 'Chọn một ảnh'}
            </p>
          </div>

          {selectedFiles.length > 0 && (
            <ul className="mt-3 space-y-1 border-t border-[var(--a-line)] pt-3">
              {selectedFiles.map((file, index) => (
                <li key={index} className="truncate text-[12.5px] text-[var(--a-muted)]">
                  {file.name}
                </li>
              ))}
            </ul>
          )}

          <div className="mt-3 flex gap-2">
            <Button
              variant="primary"
              size="sm"
              onClick={uploadFromDevice}
              loading={isUploading}
              disabled={!selectedFiles.length}
            >
              {isUploading ? 'Đang tải…' : 'Tải lên'}
            </Button>
            <Button size="sm" onClick={handleCancel} disabled={isUploading}>
              Hủy
            </Button>
          </div>
        </div>
      )}

      {uploadType === 'cloud' && (
        <div className="rounded-[var(--a-radius-sm)] border border-[var(--a-line)] bg-[var(--a-raised)] p-4">
          <input
            type="url"
            placeholder="https://..."
            value={imageUrl}
            onChange={handleUrlChange}
            className={controlClass}
            aria-label="URL ảnh"
          />
          <div className="mt-3 flex gap-2">
            <Button
              variant="primary"
              size="sm"
              onClick={saveFromUrl}
              loading={isUploading}
              disabled={!imageUrl}
            >
              {isUploading ? 'Đang lưu…' : 'Lưu URL'}
            </Button>
            <Button size="sm" onClick={handleCancel} disabled={isUploading}>
              Hủy
            </Button>
          </div>
        </div>
      )}

      {error && <p className="mt-2 text-[12.5px] text-[var(--a-danger)]">{error}</p>}
    </div>
  );
};

export default ImageUploader;
