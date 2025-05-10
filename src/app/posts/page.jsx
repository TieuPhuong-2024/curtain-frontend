'use client';

import { useState, useEffect } from 'react';
import { getPosts } from '@/lib/api';
import PostCard from '@/components/PostCard';

export default function Posts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedTag, setSelectedTag] = useState('');
  const [allTags, setAllTags] = useState([]);

  // Fetch posts
  const fetchPosts = async () => {
    setLoading(true);
    try {
      // Only show published posts on the public-facing page
      const response = await getPosts(currentPage, 9, 'published', selectedTag);
      setPosts(response.posts);
      setTotalPages(response.pagination.pages);
      
      // Extract all unique tags from posts
      const tags = [];
      response.posts.forEach(post => {
        if (post.tags) {
          post.tags.forEach(tag => {
            if (!tags.includes(tag)) {
              tags.push(tag);
            }
          });
        }
      });
      setAllTags(tags);
    } catch (err) {
      setError('Failed to load posts');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [currentPage, selectedTag]);

  return (
    <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Blog</h1>
        <p className="text-gray-600">Các bài viết mới nhất</p>
      </div>

      {/* Tags filter */}
      {allTags.length > 0 && (
        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedTag('')}
              className={`px-3 py-1 rounded-full text-sm ${
                selectedTag === ''
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Tất cả
            </button>
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`px-3 py-1 rounded-full text-sm ${
                  selectedTag === tag
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      )}

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
              <p className="text-gray-500">Không tìm thấy bài viết nào</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <PostCard key={post._id} post={post} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-12">
              <div className="flex space-x-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-4 py-2 rounded ${
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