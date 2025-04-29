'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { getPostById, updatePost, uploadImage } from '@/lib/api';
import BlockNoteEditor from '@/components/BlockNoteEditor';
import Image from 'next/image';

export default function EditPost({ params }) {
  const postId = use(params).id;
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [tags, setTags] = useState('');
  const [status, setStatus] = useState('draft');
  const [featuredImage, setFeaturedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [content, setContent] = useState(null);

  // Fetch post data
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const post = await getPostById(postId);

        // Set form data
        setTitle(post.title);
        setSummary(post.summary || '');
        setStatus(post.status);
        setFeaturedImage(post.featuredImage);
        setImagePreview(post.featuredImage);
        setContent(post.content);

        // Convert tags array to comma-separated string
        if (post.tags && Array.isArray(post.tags)) {
          setTags(post.tags.join(', '));
        }

        setLoading(false);
      } catch (err) {
        setError('Failed to load post');
        console.error(err);
        setLoading(false);
      }
    };

    fetchPost();
  }, [postId]);

  // Handle featured image upload
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Preview the image
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);

    // Upload the image to server
    try {
      const response = await uploadImage(file);
      setFeaturedImage(response.url);
    } catch (err) {
      setError('Failed to upload image');
      console.error(err);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !content) {
      setError('Title and content are required');
      return;
    }

    setSaving(true);
    setError(null);

    try {
      // Process tags from comma-separated string to array
      const tagsArray = tags
        ? tags.split(',').map(tag => tag.trim()).filter(tag => tag)
        : [];

      // Create post data
      const postData = {
        title,
        content,
        summary: summary || null,
        tags: tagsArray,
        status,
        featuredImage: featuredImage || null
      };

      // Send to API
      await updatePost(postId, postData);

      // Redirect to posts list
      router.push('/admin/posts');
    } catch (err) {
      setError('Failed to update post');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Chỉnh sửa bài viết</h1>
        <button
          type="button"
          onClick={() => router.back()}
          className="cursor-pointer text-blue-600 hover:underline"
        >
          Quay lại
        </button>
      </div>

      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Title */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
            Tiêu đề *
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>

        {/* Summary */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="summary">
            Tóm tắt
          </label>
          <textarea
            id="summary"
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            rows="3"
          />
        </div>

        {/* Featured Image */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Hình ảnh nổi bật
          </label>
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <input
                type="file"
                onChange={handleImageUpload}
                accept="image/*"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            {imagePreview && (
              <div className="relative h-20 w-20 border rounded">
                <Image
                  src={imagePreview}
                  alt="Preview"
                  fill
                  className="object-cover rounded"
                />
              </div>
            )}
          </div>
        </div>

        {/* Tags */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="tags">
            Tags (phân cách bởi dấu phẩy)
          </label>
          <input
            id="tags"
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="tag1, tag2, tag3"
          />
        </div>

        {/* Status */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="status">
            Trạng thái
          </label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          >
            <option value="draft">Bản nháp</option>
            <option value="published">Xuất bản</option>
          </select>
        </div>

        {/* Content Editor */}
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Nội dung *
          </label>
          <BlockNoteEditor initialContent={null} onChange={(newContent) => {
            setContent(newContent);
          }} />
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className={`cursor-pointer bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 ${saving ? 'opacity-50 cursor-not-allowed' : ''
              }`}
          >
            {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
          </button>
        </div>
      </form>
    </div>
  );
} 