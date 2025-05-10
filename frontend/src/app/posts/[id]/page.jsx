'use client';

import { useState, useEffect, use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { format } from 'date-fns';
import { getPostById, getPosts } from '@/lib/api';
import PostCard from '@/components/PostCard';
import { renderCKEditorContent } from '@/utils/ckeditorConverter';
import '@/app/styles/content-styles.css';

export default function PostDetail({ params }) {
  const postId = use(params).id;

  const [post, setPost] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch post data
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const fetchedPost = await getPostById(postId);
        setPost(fetchedPost);

        // Fetch related posts with the same tags
        if (fetchedPost.tags && fetchedPost.tags.length > 0) {
          // Use the first tag to find related posts
          const tag = fetchedPost.tags[0];
          const response = await getPosts(1, 3, 'published', tag);
          // Filter out the current post
          const filtered = response.posts.filter(p => p._id !== postId);
          setRelatedPosts(filtered);
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

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return '';
    return format(new Date(dateString), 'dd/MM/yyyy');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="max-w-4xl mx-auto py-10 px-4">
        <div className="bg-red-100 text-red-700 p-4 rounded">
          {error || 'Không tìm thấy bài viết'}
        </div>
        <div className="mt-4">
          <Link href="/posts" className="text-blue-600 hover:underline">
            Quay lại trang bài viết
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
      {/* Navigation link */}
      <div className="mb-6">
        <Link href="/posts" className="text-blue-600 hover:underline flex items-center">
          ← Quay lại
        </Link>
      </div>

      {/* Article header */}
      <article className="max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{post.title}</h1>

          {post.summary && (
            <p className="text-xl text-gray-600 mb-6">{post.summary}</p>
          )}

          <div className="flex items-center text-gray-500 text-sm">
            <span>Đăng ngày {formatDate(post.createdAt)}</span>
            <span className="mx-2">•</span>
            <span>{post.viewCount} lượt xem ({post.uniqueViewCount} độc giả)</span>
          </div>
        </header>

        {/* Featured image */}
        {post.featuredImage && (
          <div className="relative h-[400px] w-full mb-8 rounded-lg overflow-hidden">
            <Image
              src={post.featuredImage}
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        {/* Post content */}
        <div className="prose prose-lg max-w-none mb-12 post-content">
          <div
            className="ck-content"
            dangerouslySetInnerHTML={{ __html: renderCKEditorContent(post.content) }}
          />
        </div>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="mb-12">
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <Link
                  key={tag}
                  href={`/posts?tag=${tag}`}
                  className="px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-sm hover:bg-gray-300"
                >
                  {tag}
                </Link>
              ))}
            </div>
          </div>
        )}
      </article>

      {/* Related posts */}
      {relatedPosts.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6">Related Posts</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {relatedPosts.map((relatedPost) => (
              <Link key={relatedPost._id} href={`/posts/${relatedPost._id}`}>
                <PostCard post={relatedPost} />
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}