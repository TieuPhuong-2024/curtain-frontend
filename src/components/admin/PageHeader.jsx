import PleatMark from './PleatMark';

export default function PageHeader({ title, description, meta, actions }) {
  return (
    <header className="flex flex-col gap-5 border-b border-[var(--a-line)] pb-6 sm:flex-row sm:items-end sm:justify-between">
      <div className="flex items-start gap-4">
        <PleatMark className="mt-2 shrink-0" />
        <div className="min-w-0">
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <h1 className="text-[26px] font-semibold leading-tight tracking-[-0.02em] text-[var(--a-ink)]">
              {title}
            </h1>
            {meta != null && (
              <span className="text-[13px] tabular-nums text-[var(--a-faint)]">{meta}</span>
            )}
          </div>
          {description && (
            <p className="mt-1.5 max-w-[62ch] text-sm leading-relaxed text-[var(--a-muted)]">
              {description}
            </p>
          )}
        </div>
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2 sm:justify-end">{actions}</div>}
    </header>
  );
}
