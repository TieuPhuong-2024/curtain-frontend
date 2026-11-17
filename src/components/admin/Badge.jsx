const tones = {
  neutral: 'border-[var(--a-line-strong)] bg-[var(--a-surface)] text-[var(--a-muted)]',
  cham: 'border-[rgba(44,70,87,0.25)] bg-[var(--a-cham-soft)] text-[var(--a-cham-deep)]',
  brass: 'border-[rgba(176,138,79,0.35)] bg-[var(--a-brass-soft)] text-[#7c5e31]',
  success: 'border-[rgba(62,107,79,0.25)] bg-[var(--a-success-soft)] text-[var(--a-success)]',
  warning: 'border-[rgba(169,118,47,0.28)] bg-[var(--a-warning-soft)] text-[var(--a-warning)]',
  danger: 'border-[rgba(156,59,54,0.25)] bg-[var(--a-danger-soft)] text-[var(--a-danger)]',
};

export default function Badge({ tone = 'neutral', dot = false, children, className = '' }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-[4px] border px-2 py-[3px] text-[11px] font-medium leading-none ${
        tones[tone] || tones.neutral
      } ${className}`}
    >
      {dot && <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" aria-hidden="true" />}
      {children}
    </span>
  );
}
