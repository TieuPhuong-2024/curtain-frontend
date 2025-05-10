'use client';

import Link from 'next/link';
import Image from 'next/image';
import { format } from 'date-fns';

const PostCard = ({ post, isAdmin = false }) => {
  
  // Format date for display
  const formattedDate = post.createdAt 
    ? format(new Date(post.createdAt), 'dd/MM/yyyy')
    : '';


  return (
    <div
      className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
    >
      {/* Featured image */}
      <div className="relative h-48 w-full">
        {post.featuredImage ? (
          <Image 
            src={post.featuredImage} 
            alt={post.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover"
          />
        ) : (
          <div className="h-full w-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-400">No Image</span>
          </div>
        )}
        {post.status === 'draft' && (
          <div className="absolute top-2 right-2 bg-amber-500 text-white text-xs px-2 py-1 rounded">
            Draft
          </div>
        )}
      </div>
      
      {/* Content */}
      <div className="p-4">
        <h3 className="text-xl font-semibold mb-2 line-clamp-2">{post.title}</h3>
        
        {post.summary && (
          <p className="text-gray-600 mb-4 line-clamp-3">{post.summary}</p>
        )}
        
        <div className="flex justify-between items-center text-sm text-gray-500">
          <div className="flex items-center">
            <span>{formattedDate}</span>
            <span className="mx-2">•</span>
            <span>{post.viewCount} lượt xem ({post.uniqueViewCount} độc giả)</span>
          </div>
          
          <div className="text-blue-600">
            {!isAdmin ? (
              <Link href={`/posts/${post._id}`} className="hover:underline font-medium">Read more</Link>
            ) : (
              <Link href={`/admin/posts/${post._id}`} className="hover:underline font-medium">Edit</Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostCard;