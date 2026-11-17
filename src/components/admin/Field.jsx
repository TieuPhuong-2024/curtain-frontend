export const controlClass =
  'w-full rounded-[var(--a-radius-sm)] border border-[var(--a-line-strong)] bg-[var(--a-surface)] px-3 py-2 text-sm text-[var(--a-ink)] placeholder:text-[var(--a-faint)] transition focus:border-[var(--a-cham)] focus:outline-none focus:ring-[3px] focus:ring-[rgba(44,70,87,0.12)]';

export const selectClass =
  'h-9 rounded-[var(--a-radius-sm)] border border-[var(--a-line-strong)] bg-[var(--a-surface)] px-2.5 text-[13px] text-[var(--a-ink)] transition focus:border-[var(--a-cham)] focus:outline-none focus:ring-[3px] focus:ring-[rgba(44,70,87,0.12)]';

export default function Field({ label, htmlFor, hint, error, required, children, className = '' }) {
  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && (
        <label htmlFor={htmlFor} className="flex items-center gap-1 text-[13px] font-medium text-[var(--a-muted)]">
          {label}
          {required && (
            <span className="text-[var(--a-danger)]" aria-hidden="true">
              *
            </span>
          )}
        </label>
      )}
      {children}
      {error ? (
        <p className="text-[12px] leading-relaxed text-[var(--a-danger)]">{error}</p>
      ) : hint ? (
        <p className="text-[12px] leading-relaxed text-[var(--a-faint)]">{hint}</p>
      ) : null}
    </div>
  );
}
