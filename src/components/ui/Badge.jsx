import { cx } from '@/lib/utils'

export default function Badge({ className, children, tone = 'neutral' }) {
  const tones = {
    neutral: 'bg-[var(--surface-2)] text-[var(--text-soft)]',
    primary: 'bg-[var(--primary-soft)] text-[var(--primary)]',
    energy: 'bg-[var(--energy-soft)] text-[var(--energy)]',
  }
  return (
    <span className={cx('inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full', tones[tone], className)}>
      {children}
    </span>
  )
}
