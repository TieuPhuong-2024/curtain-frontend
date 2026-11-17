'use client';

export default function LoadingSpinner({ size = 'md', className = '' }) {
  const sizeConfigs = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  };

  return (
    <div className={`animate-spin rounded-full border-2 border-gray-200 border-t-indigo-600 ${sizeConfigs[size]} ${className}`} />
  );
}