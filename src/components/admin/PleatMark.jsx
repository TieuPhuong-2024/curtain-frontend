export default function PleatMark({ tone = 'cham', className = '' }) {
  const bars =
    tone === 'light'
      ? ['bg-white/85', 'bg-[var(--a-brass)]', 'bg-white/45']
      : ['bg-[var(--a-cham)]', 'bg-[var(--a-brass)]', 'bg-[var(--a-line-strong)]'];

  return (
    <span aria-hidden="true" className={`inline-flex items-end gap-[3px] ${className}`}>
      <span className={`h-3 w-[3px] rounded-full ${bars[0]}`} />
      <span className={`h-5 w-[3px] rounded-full ${bars[1]}`} />
      <span className={`h-4 w-[3px] rounded-full ${bars[2]}`} />
    </span>
  );
}
