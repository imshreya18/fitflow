import { cx } from '@/lib/utils'

export default function Input({ className, error, ...props }) {
  return (
    <input
      className={cx(
        'w-full px-4 py-3 rounded-xl bg-[var(--surface-2)] border text-[var(--text)] placeholder:text-[var(--text-soft)] outline-none transition-colors',
        'focus:border-[var(--primary)] focus:bg-[var(--surface)]',
        error ? 'border-red-400' : 'border-transparent',
        className
      )}
      {...props}
    />
  )
}
