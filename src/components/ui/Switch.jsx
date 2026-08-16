import { cx } from '@/lib/utils'

export default function Switch({ checked, onChange, label }) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={cx(
        'relative inline-flex h-7 w-12 items-center rounded-full transition-colors shrink-0',
        checked ? 'bg-[var(--primary)]' : 'bg-[var(--surface-3)]'
      )}
    >
      <span
        className={cx(
          'inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform',
          checked ? 'translate-x-6' : 'translate-x-1'
        )}
      />
    </button>
  )
}
