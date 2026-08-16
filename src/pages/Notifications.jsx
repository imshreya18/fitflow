import { useState } from 'react'
import Header from '@/components/layout/Header'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { useAppState } from '@/context/AppStateContext'
import { cx } from '@/lib/utils'

const categories = ['All', 'Streaks', 'Workouts', 'Goals', 'Community', 'Courses']

export default function Notifications() {
  const { notifications, markAllRead, markRead } = useAppState()
  const [category, setCategory] = useState('All')

  const filtered = category === 'All' ? notifications : notifications.filter((n) => n.category === category)

  return (
    <div className="max-w-2xl mx-auto">
      <Header back title="Notifications" />

      <div className="flex items-center justify-between mb-5">
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1 -mx-1 px-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={cx(
                'px-3.5 py-1.5 rounded-full text-sm font-medium border transition-colors shrink-0',
                category === cat ? 'bg-[var(--primary)] text-[var(--primary-fg)] border-[var(--primary)]' : 'bg-[var(--surface)] border-[var(--border)] hover:bg-[var(--surface-2)]'
              )}
            >
              {cat}
            </button>
          ))}
        </div>
        <Button variant="ghost" size="sm" onClick={markAllRead} className="shrink-0 ml-2">
          Mark all read
        </Button>
      </div>

      <div className="flex flex-col gap-2.5">
        {filtered.map((n) => (
          <Card
            key={n.id}
            as="button"
            onClick={() => markRead(n.id)}
            className={cx('p-4 flex items-start gap-3.5 text-left w-full', !n.read && 'bg-[var(--primary-soft)] border-none')}
          >
            <span className="text-xl shrink-0 mt-0.5">{n.icon}</span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2 mb-0.5">
                <p className="font-medium truncate">{n.title}</p>
                {!n.read && <span className="w-2 h-2 rounded-full bg-[var(--energy)] shrink-0" />}
              </div>
              <p className="text-sm text-[var(--text-soft)] mb-1">{n.body}</p>
              <p className="text-xs text-[var(--text-soft)]">{n.time}</p>
            </div>
          </Card>
        ))}
        {filtered.length === 0 && (
          <p className="text-center text-[var(--text-soft)] py-16">No notifications in this category.</p>
        )}
      </div>
    </div>
  )
}
