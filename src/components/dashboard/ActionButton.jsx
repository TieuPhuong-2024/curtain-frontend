'use client';

import Link from 'next/link';

const variantConfigs = {
  primary: 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm hover:shadow-md',
  secondary: 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 hover:border-gray-300',
  success: 'bg-emerald-600 text-white hover:bg-emerald-700',
  danger: 'bg-rose-600 text-white hover:bg-rose-700',
  ghost: 'text-gray-600 hover:bg-gray-100 hover:text-gray-900',
  outline: 'border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400',
};

const sizeConfigs = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg',
};

export default function ActionButton({
  children,
  variant = 'primary',
  size = 'md',
  href,
  onClick,
  icon,
  iconPosition = 'left',
  loading = false,
  disabled = false,
  className = '',
  fullWidth = false,
}) {
  const isLink = !!href && !onClick;
  const Component = isLink ? Link : 'button';

  const commonClasses = `
    inline-flex items-center justify-center rounded-xl font-medium
    transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed
    ${variantConfigs[variant]} ${sizeConfigs[size]} ${fullWidth ? 'w-full' : ''}
    ${className}
  `.trim();

  return (
    <Component
      href={isLink ? href : undefined}
      onClick={onClick}
      disabled={disabled || loading}
      className={commonClasses}
    >
      {loading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      )}
      {!loading && icon && iconPosition === 'left' && <span className="mr-2">{icon}</span>}
      {children}
      {!loading && icon && iconPosition === 'right' && <span className="ml-2">{icon}</span>}
    </Component>
  );
}