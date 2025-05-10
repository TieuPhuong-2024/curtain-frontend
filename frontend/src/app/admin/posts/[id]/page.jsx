'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { getPostById, updatePost } from '@/lib/api';
import ImageUploader from '@/components/ImageUploader';
import { toast } from 'react-toastify';
import { uploadImage, uploadVideo } from '@/lib/api';
import { FaSave, FaTimes } from 'react-icons/fa';

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

// CKEditor imports for direct use
let CKEditor;
let ClassicEditor;

export default function EditPost() {
  const router = useRouter();
  const params = useParams();
  const postId = params?.id;

  const [formData, setFormData] = useState({
    title: '',
    summary: '',
    content: '',
    tags: '',
    status: 'draft',
    featuredImage: null,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editorLoaded, setEditorLoaded] = useState(false);

  // Dynamically load CKEditor
  useEffect(() => {
    CKEditor = require('@ckeditor/ckeditor5-react').CKEditor;
    ClassicEditor = require('@ckeditor/ckeditor5-build-classic');
    setEditorLoaded(true);
  }, []);

  // Fetch post data
  useEffect(() => {
    if (postId) {
      const fetchPost = async () => {
        setLoading(true);
        try {
          const post = await getPostById(postId);
          setFormData({
            title: post.title || '',
            summary: post.summary || '',
            content: post.content || '',
            tags: post.tags && Array.isArray(post.tags) ? post.tags.join(', ') : '',
            status: post.status || 'draft',
            featuredImage: post.featuredImage || null,
          });
        } catch (err) {
          toast.error('Không thể tải dữ liệu bài viết: ' + (err.response?.data?.message || err.message));
          console.error(err);
        } finally {
          setLoading(false);
        }
      };
      fetchPost();
    }
  }, [postId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleEditorChange = (event, editor) => {
    const data = editor.getData();
    setFormData(prev => ({ ...prev, content: data }));
  };

  // Handle featured image upload
  const handleImageUpload = (urls) => {
    if (urls && urls.length > 0) {
      setFormData(prev => ({ ...prev, featuredImage: urls[0] }));
    } else {
      setFormData(prev => ({ ...prev, featuredImage: null }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.content) {
      toast.error('Tiêu đề và nội dung là bắt buộc');
      return;
    }

    setSaving(true);

    try {
      const tagsArray = formData.tags
        ? formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
        : [];

      const postData = {
        title: formData.title,
        content: formData.content,
        summary: formData.summary || null,
        tags: tagsArray,
        status: formData.status,
        featuredImage: formData.featuredImage || null
      };

      await updatePost(postId, postData);
      toast.success("Cập nhật bài viết thành công!");
      router.push('/admin/posts');
    } catch (err) {
      toast.error('Không thể cập nhật bài viết: ' + (err.response?.data?.message || err.message));
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
      </div>

      <form onSubmit={handleSubmit}>
        {/* Title */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
            Tiêu đề *
          </label>
          <input
            id="title"
            name="title"
            type="text"
            value={formData.title}
            onChange={handleChange}
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
            name="summary"
            value={formData.summary}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            rows="3"
          />
        </div>

        {/* Featured Image */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Hình ảnh nổi bật
          </label>
          <ImageUploader onUpload={handleImageUpload} maxFiles={1} />

          {formData.featuredImage && (
            <div className="mt-4 relative group rounded-md overflow-hidden border w-40 h-24">
              <img
                src={formData.featuredImage}
                alt="Featured image"
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, featuredImage: null }))}
                className="cursor-pointer absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 text-xs"
              >
                <FaTimes />
              </button>
            </div>
          )}
        </div>

        {/* Tags */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="tags">
            Tags (phân cách bởi dấu phẩy)
          </label>
          <input
            id="tags"
            name="tags"
            type="text"
            value={formData.tags}
            onChange={handleChange}
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
            name="status"
            value={formData.status}
            onChange={handleChange}
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
          {editorLoaded && CKEditor && ClassicEditor ? (
            <CKEditor
              editor={ClassicEditor}
              data={formData.content}
              onChange={handleEditorChange}
              config={{
                placeholder: "Nhập nội dung bài viết tại đây...",
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
            <p>Đang tải trình soạn thảo / Đang tải nội dung...</p>
          )}
        </div>

        {/* Submit Button */}
        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={() => router.back()}
            className="cursor-pointer bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-md mr-2"
          >
            Hủy
          </button>
          <button
            type="submit"
            disabled={saving || loading}
            className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-md flex items-center hover:bg-blue-700 transition disabled:opacity-50"
          >
            <FaSave className='mr-2' /> {saving ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Đang xử lý...
              </>
            ) : (
              'Cập nhật'
            )}
          </button>
        </div>
      </form>
    </div>
  );
} 