import { cx } from '@/lib/utils'

export default function Card({ className, children, as: As = 'div', ...props }) {
  return (
    <As
      className={cx(
        'bg-[var(--surface)] border border-[var(--border)] rounded-3xl card-shadow',
        className
      )}
      {...props}
    >
      {children}
    </As>
  )
}
