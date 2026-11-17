'use client';

import { useState } from 'react';
import { FaImage } from 'react-icons/fa';

export default function Thumb({ src, alt = '', className = '', rounded = 'rounded-[6px]' }) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <span
        className={`flex items-center justify-center border border-[var(--a-line)] bg-[var(--a-raised)] text-[var(--a-line-strong)] ${rounded} ${className}`}
        aria-hidden="true"
      >
        <FaImage className="h-4 w-4" />
      </span>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setFailed(true)}
      className={`border border-[var(--a-line)] bg-[var(--a-raised)] object-cover ${rounded} ${className}`}
    />
  );
}
