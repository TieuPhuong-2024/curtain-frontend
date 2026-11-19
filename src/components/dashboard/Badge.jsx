'use client';

const variantConfigs = {
  default: 'bg-gray-100 text-gray-700 border border-gray-200',
  success: 'bg-emerald-100 text-emerald-700 border border-emerald-200',
  warning: 'bg-amber-100 text-amber-700 border border-amber-200',
  danger: 'bg-rose-100 text-rose-700 border border-rose-200',
  info: 'bg-blue-100 text-blue-700 border border-blue-200',
  primary: 'bg-indigo-100 text-indigo-700 border border-indigo-200',
};

export default function Badge({ children, variant = 'default', size = 'md', className = '' }) {
  const base = 'inline-flex items-center rounded-full border font-medium uppercase tracking-tighter transition-colors';
  const sizeConfigs = {
    sm: 'text-[10px] px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
    lg: 'text-sm px-3 py-1.5',
  };

  return (
    <span className={`${base} ${variantConfigs[variant]} ${sizeConfigs[size]} ${className}`}>
      {children}
    </span>
  );
}