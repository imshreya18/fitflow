import { motion } from 'framer-motion'
import { Flame } from 'lucide-react'
import Header from '@/components/layout/Header'
import Card from '@/components/ui/Card'
import { user, streakCalendar } from '@/data/mockData'
import { cx } from '@/lib/utils'

export default function Streaks() {
  return (
    <div>
      <Header title="Streaks" subtitle="Consistency over perfection." />

      <Card className="p-8 sm:p-10 flex flex-col items-center text-center mb-6 bg-[var(--surface-2)] border-none">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', bounce: 0.5 }}
        >
          <Flame size={56} className="text-[var(--energy)] mb-2" fill="var(--energy)" />
        </motion.div>
        <p className="font-display text-6xl font-bold mb-1">{user.currentStreak}</p>
        <p className="font-semibold text-[var(--text-soft)] mb-3">Day Streak</p>
        <p className="text-[var(--text-soft)] max-w-sm">You've shown up {user.currentStreak} days in a row. That's the kind of consistency that builds lasting habits.</p>
      </Card>

      <Card className="p-5 sm:p-6 mb-6">
        <h3 className="font-display font-bold text-lg mb-4">Last 5 Weeks</h3>
        <div className="grid grid-cols-7 gap-2">
          {streakCalendar.map((v, i) => (
            <div
              key={i}
              className={cx(
                'aspect-square rounded-lg',
                v === 1 ? 'bg-[var(--primary)]' : 'bg-[var(--surface-3)]'
              )}
              title={v === 1 ? 'Completed' : 'Missed'}
            />
          ))}
        </div>
        <div className="flex items-center gap-4 mt-4 text-xs text-[var(--text-soft)]">
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-[var(--primary)]" /> Completed</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-[var(--surface-3)]" /> Missed</span>
        </div>
      </Card>

      <Card className="p-5 sm:p-6 bg-[var(--primary-soft)] border-none">
        <p className="text-[var(--primary)] font-medium leading-relaxed">
          One missed day doesn't erase your progress. What matters is showing up again tomorrow.
        </p>
      </Card>
    </div>
  )
}
