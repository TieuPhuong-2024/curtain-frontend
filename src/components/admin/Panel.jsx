export default function Panel({ children, className = '' }) {
  return (
    <section
      className={`overflow-hidden rounded-[var(--a-radius)] border border-[var(--a-line)] bg-[var(--a-surface)] ${className}`}
    >
      {children}
    </section>
  );
}

export function PanelHeader({ title, description, children }) {
  return (
    <div className="flex flex-col gap-3 border-b border-[var(--a-line)] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 className="text-[15px] font-semibold text-[var(--a-ink)]">{title}</h2>
        {description && (
          <p className="mt-0.5 text-[13px] leading-relaxed text-[var(--a-muted)]">{description}</p>
        )}
      </div>
      {children && <div className="flex items-center gap-2">{children}</div>}
    </div>
  );
}
