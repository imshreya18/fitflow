import { cx } from '@/lib/utils'

const variants = {
  primary: 'bg-[var(--primary)] text-[var(--primary-fg)] hover:opacity-90',
  secondary: 'bg-[var(--surface-2)] text-[var(--text)] hover:bg-[var(--surface-3)]',
  outline: 'bg-transparent border border-[var(--border)] text-[var(--text)] hover:bg-[var(--surface-2)]',
  ghost: 'bg-transparent text-[var(--text)] hover:bg-[var(--surface-2)]',
  energy: 'bg-[var(--energy)] text-white hover:opacity-90',
  danger: 'bg-transparent text-red-500 hover:bg-red-500/10',
}

const sizes = {
  sm: 'text-sm px-3 py-1.5 rounded-lg',
  md: 'text-sm px-4 py-2.5 rounded-xl',
  lg: 'text-base px-6 py-3.5 rounded-2xl',
  icon: 'p-2.5 rounded-full',
}

export default function Button({
  as: As = 'button',
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...props
}) {
  return (
    <As
      className={cx(
        'inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 active:scale-[0.97] disabled:opacity-50 disabled:pointer-events-none whitespace-nowrap',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </As>
  )
}
