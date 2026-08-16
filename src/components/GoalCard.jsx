import { Link } from 'react-router-dom'
import { Target, ChevronRight } from 'lucide-react'
import Card from '@/components/ui/Card'
import { ProgressRing } from '@/components/ui/Progress'

export default function GoalCard({ goal, linkTo = '/app/goals' }) {
  return (
    <Card className="p-5 flex items-center gap-5">
      <ProgressRing value={goal.progress} size={72} strokeWidth={7}>
        <span className="font-display font-bold text-sm">{goal.progress}%</span>
      </ProgressRing>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold uppercase tracking-wide text-[var(--text-soft)] flex items-center gap-1.5 mb-1">
          <Target size={13} /> Your Goal
        </p>
        <h3 className="font-display font-semibold text-lg mb-1">{goal.title}</h3>
        <p className="text-sm text-[var(--text-soft)]">{goal.current} / {goal.target} {goal.unit?.replace(/\/week$/, 'this week') || ''}</p>
      </div>
      <Link to={linkTo} aria-label="View goal" className="p-2 rounded-full hover:bg-[var(--surface-2)] transition-colors shrink-0">
        <ChevronRight size={20} className="text-[var(--text-soft)]" />
      </Link>
    </Card>
  )
}
