'use client';

const variants = {
  primary:
    'border border-transparent bg-[var(--a-cham)] text-white hover:bg-[var(--a-cham-deep)] disabled:hover:bg-[var(--a-cham)]',
  secondary:
    'border border-[var(--a-line-strong)] bg-[var(--a-surface)] text-[var(--a-ink)] hover:border-[var(--a-muted)] hover:bg-[var(--a-raised)]',
  ghost:
    'border border-transparent text-[var(--a-muted)] hover:bg-[var(--a-raised)] hover:text-[var(--a-ink)]',
  danger:
    'border border-[rgba(156,59,54,0.3)] bg-[var(--a-surface)] text-[var(--a-danger)] hover:bg-[var(--a-danger-soft)]',
  dangerSolid:
    'border border-transparent bg-[var(--a-danger)] text-white hover:bg-[#85302c]',
};

const sizes = {
  sm: 'h-8 gap-1.5 px-3 text-[12.5px]',
  md: 'h-9 gap-2 px-4 text-[13px]',
};

export function buttonClasses(variant = 'secondary', size = 'md', extra = '') {
  return `inline-flex select-none items-center justify-center whitespace-nowrap rounded-[var(--a-radius-sm)] font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
    variants[variant] || variants.secondary
  } ${sizes[size] || sizes.md} ${extra}`;
}

export default function Button({
  variant = 'secondary',
  size = 'md',
  icon: Icon,
  iconRight: IconRight,
  loading = false,
  children,
  className = '',
  type = 'button',
  disabled,
  ...props
}) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={buttonClasses(variant, size, className)}
      {...props}
    >
      {loading ? (
        <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
      ) : (
        Icon && <Icon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
      )}
      {children}
      {IconRight && !loading && <IconRight className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />}
    </button>
  );
}
