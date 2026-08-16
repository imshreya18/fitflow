import Card from '@/components/ui/Card'
import { cx } from '@/lib/utils'

export default function StatCard({ icon: Icon, label, value, tone = 'primary', className }) {
  const toneClasses = {
    primary: 'text-[var(--primary)] bg-[var(--primary-soft)]',
    energy: 'text-[var(--energy)] bg-[var(--energy-soft)]',
    neutral: 'text-[var(--text)] bg-[var(--surface-2)]',
  }
  return (
    <Card className={cx('p-4 flex flex-col gap-2.5', className)}>
      <div className={cx('w-9 h-9 rounded-full flex items-center justify-center', toneClasses[tone])}>
        <Icon size={17} />
      </div>
      <div>
        <p className="font-display text-xl font-bold leading-none mb-1">{value}</p>
        <p className="text-xs text-[var(--text-soft)]">{label}</p>
      </div>
    </Card>
  )
}
