import { FaRegFolderOpen } from 'react-icons/fa';

export default function EmptyState({
  icon: Icon = FaRegFolderOpen,
  title,
  description,
  action,
  compact = false,
}) {
  return (
    <div className={`flex flex-col items-center justify-center px-6 text-center ${compact ? 'py-10' : 'py-16'}`}>
      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--a-cham-soft)] text-[var(--a-cham)]">
        <Icon className="h-5 w-5" aria-hidden="true" />
      </span>
      <h3 className="mt-4 text-[15px] font-semibold text-[var(--a-ink)]">{title}</h3>
      {description && (
        <p className="mt-1.5 max-w-sm text-[13px] leading-relaxed text-[var(--a-muted)]">{description}</p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
