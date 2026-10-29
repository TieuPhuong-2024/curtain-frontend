'use client';

import Link from 'next/link';
import Image from 'next/image';
import { FaHardHat, FaMapMarkerAlt, FaStar } from 'react-icons/fa';
import { ROUTES_PATH } from '@/utils/constant';

export default function ProjectListCard({ project, priority = false }) {
  const projectId = project._id || project.id;
  const href = `/${ROUTES_PATH.CONG_TRINH}/${projectId}`;

  return (
    <Link
      href={href}
      className="group block bg-[#fffaf6] rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a67c52]"
    >
      <div className="relative h-52 w-full overflow-hidden">
        {project.thumbnail ? (
          <Image
            src={project.thumbnail}
            alt={project.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority={priority}
            className="object-cover group-hover:scale-[1.03] transition-transform duration-500"
          />
        ) : (
          <div className="h-full w-full bg-[#f3e6d8] flex items-center justify-center">
            <FaHardHat className="text-[#a67c52] text-4xl opacity-60" />
          </div>
        )}
        {project.type && (
          <span className="absolute top-3 left-3 text-xs font-semibold text-[#5b4636] bg-[#f3e6d8] border border-[#d6a77a]/40 px-2.5 py-1 rounded-full">
            {project.type}
          </span>
        )}
        {project.featured && (
          <span className="absolute top-3 right-3 text-xs font-semibold text-white bg-[#a67c52] px-2.5 py-1 rounded-full flex items-center gap-1">
            <FaStar className="text-[10px]" aria-hidden />
            Nổi bật
          </span>
        )}
      </div>
      <div className="p-5">
        <h3 className="text-lg font-bold text-[#5b4636] mb-2 line-clamp-2 group-hover:text-[#8a6642]">
          {project.title}
        </h3>
        {(project.shortDescription || project.description) && (
          <p className="text-sm text-[#7d6e5d] mb-3 line-clamp-2">
            {project.shortDescription || project.description}
          </p>
        )}
        {project.location && (
          <p className="flex items-center gap-1.5 text-xs text-[#7d6e5d] mb-3">
            <FaMapMarkerAlt className="shrink-0 text-[#a67c52]" aria-hidden />
            {project.location}
          </p>
        )}
        <span className="text-sm font-semibold text-[#a67c52] group-hover:underline">
          Xem chi tiết
        </span>
      </div>
    </Link>
  );
}
