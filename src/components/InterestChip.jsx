import { cx } from '@/lib/utils'

export default function InterestChip({ emoji, label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={cx(
        'flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium border transition-colors shrink-0',
        active
          ? 'bg-[var(--primary)] text-[var(--primary-fg)] border-[var(--primary)]'
          : 'bg-[var(--surface)] text-[var(--text)] border-[var(--border)] hover:bg-[var(--surface-2)]'
      )}
    >
      <span>{emoji}</span> {label}
    </button>
  )
}
