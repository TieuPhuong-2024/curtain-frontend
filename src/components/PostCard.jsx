'use client';

import Link from 'next/link';
import Image from 'next/image';
import { format } from 'date-fns';
import { ROUTES_PATH } from '@/utils/constant';

const PostCard = ({ post, isAdmin = false }) => {
  const formattedDate = post.createdAt
    ? format(new Date(post.createdAt), 'dd/MM/yyyy')
    : '';

  const postId = post._id || post.id;
  const detailHref = isAdmin
    ? `/admin/posts/${postId}`
    : `/${ROUTES_PATH.POSTS}/${postId}`;

  const cardInner = (
    <>
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

      <div className="p-4">
        <h3 className="text-xl font-semibold mb-2 line-clamp-2 text-[#5b4636]">{post.title}</h3>

        {post.summary && (
          <p className="text-[#7d6e5d] mb-4 line-clamp-3">{post.summary}</p>
        )}

        <div className="flex justify-between items-center text-sm text-[#7d6e5d] gap-2">
          <div className="flex flex-wrap items-center min-w-0">
            <span>{formattedDate}</span>
            <span className="mx-2 hidden sm:inline">•</span>
            <span className="hidden sm:inline">
              {post.viewCount} lượt xem ({post.uniqueViewCount} độc giả)
            </span>
          </div>

          <span className="text-[#a67c52] font-medium shrink-0 group-hover:underline">
            {isAdmin ? 'Edit' : 'Đọc tiếp'}
          </span>
        </div>
      </div>
    </>
  );

  return (
    <Link
      href={detailHref}
      className="group block bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition-shadow focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a67c52]"
    >
      {cardInner}
    </Link>
  );
};

export default PostCard;
