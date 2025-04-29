'use client';

import { useState, useEffect } from 'react';
import { getPosts, deletePost } from '@/lib/api';
import PostCard from '@/components/PostCard';
import { useRouter } from 'next/navigation';

export default function AdminPosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const router = useRouter();

  // Fetch posts
  const fetchPosts = async () => {
    setLoading(true);
    try {
      const response = await getPosts(currentPage, 12, statusFilter);
      setPosts(response.posts);
      setTotalPages(response.pagination.pages);
    } catch (err) {
      setError('Failed to load posts');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [currentPage, statusFilter]);

  // Handle delete post
  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this post?')) {
      try {
        await deletePost(id);
        // Refresh the posts list
        fetchPosts();
      } catch (err) {
        alert('Failed to delete post');
        console.error(err);
      }
    }
  };

  // Handle create new post
  const handleCreatePost = () => {
    router.push('/admin/posts/new');
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Quản lý Bài viết</h1>
        <button
          onClick={handleCreatePost}
          className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Thêm bài viết mới
        </button>
      </div>

      {/* Filters */}
      <div className="mb-6 bg-white p-4 rounded shadow">
        <div className="flex gap-4">
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700">
              Trạng thái
            </label>
            <select
              id="status"
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">Tất cả</option>
              <option value="published">Đã xuất bản</option>
              <option value="draft">Bản nháp</option>
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center my-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="bg-red-100 text-red-700 p-4 rounded">
          {error}
        </div>
      ) : (
        <>
          {posts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No posts found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => (
                <div key={post._id} className="relative">
                  <PostCard post={post} isAdmin={true} />
                  
                  {/* Admin Actions Overlay */}
                  <div className="absolute top-0 right-0 p-2 flex gap-2">
                    <button 
                      onClick={() => router.push(`/admin/posts/${post._id}`)}
                      className="cursor-pointer bg-blue-600 text-white p-2 rounded hover:bg-blue-700 text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(post._id)}
                      className="cursor-pointer bg-red-600 text-white p-2 rounded hover:bg-red-700 text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-8">
              <div className="flex space-x-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`cursor-pointer px-4 py-2 rounded ${
                      currentPage === page
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}