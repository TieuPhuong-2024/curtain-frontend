'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaArrowRight, FaMapMarkerAlt, FaStar } from 'react-icons/fa';
import { ROUTES_PATH } from '@/utils/constant';
import styles from '@/styles/modules/ProjectListCard.module.css';

const FALLBACK_IMAGE = '/images/curtain-placeholder.jpg';

export default function ProjectListCard({ project, priority = false }) {
  const projectId = project._id || project.id;
  const href = `/${ROUTES_PATH.CONG_TRINH}/${projectId}`;
  const [imageSrc, setImageSrc] = useState(project.thumbnail || FALLBACK_IMAGE);

  useEffect(() => {
    setImageSrc(project.thumbnail || FALLBACK_IMAGE);
  }, [project.thumbnail]);

  return (
    <Link href={href} className={styles.card}>
      <span className={styles.media}>
        <Image
          src={imageSrc}
          alt={project.title}
          fill
          sizes="(max-width: 700px) 100vw, (max-width: 1024px) 50vw, 33vw"
          priority={priority}
          className={styles.image}
          onError={() => {
            if (imageSrc !== FALLBACK_IMAGE) setImageSrc(FALLBACK_IMAGE);
          }}
        />
        {project.type && <span className={styles.type}>{project.type}</span>}
        {project.featured && (
          <span className={styles.featured}>
            <FaStar aria-hidden="true" /> Nổi bật
          </span>
        )}
      </span>

      <span className={styles.body}>
        {project.location && (
          <span className={styles.location}>
            <FaMapMarkerAlt aria-hidden="true" />
            {project.location}
          </span>
        )}
        <h3 className={styles.title}>{project.title}</h3>
        {(project.shortDescription || project.description) && (
          <span className={styles.description}>
            {project.shortDescription || project.description}
          </span>
        )}
        <span className={styles.more}>
          Xem công trình
          <FaArrowRight className={styles.moreIcon} aria-hidden="true" />
        </span>
      </span>
    </Link>
  );
}
