import { Link } from 'react-router-dom'
import { Star, ArrowRight, Dumbbell, Flower2, Wind, Waves, HeartPulse, Sparkles } from 'lucide-react'
import Card from '@/components/ui/Card'
import { ProgressBar } from '@/components/ui/Progress'
import { cx } from '@/lib/utils'

const tagIcon = {
  'Full Body': Dumbbell,
  Strength: Dumbbell,
  Mobility: Wind,
  Yoga: Flower2,
  Cardio: HeartPulse,
  Recovery: Sparkles,
}

const colorMap = {
  primary: { bg: 'bg-[var(--primary-soft)]', text: 'text-[var(--primary)]' },
  energy: { bg: 'bg-[var(--energy-soft)]', text: 'text-[var(--energy)]' },
  accent: { bg: 'bg-[var(--surface-3)]', text: 'text-[var(--text)]' },
}

export default function CourseCard({ course, className, wide = false }) {
  const Icon = tagIcon[course.tag] || Waves
  const colors = colorMap[course.color] || colorMap.primary

  return (
    <Card className={cx('p-4 flex flex-col gap-3 hover:-translate-y-0.5 transition-transform', wide ? 'w-full' : 'w-64 shrink-0', className)}>
      <div className={cx('h-28 rounded-2xl flex items-center justify-center', colors.bg)}>
        <Icon size={36} className={colors.text} strokeWidth={1.6} />
      </div>
      <div className="flex-1 flex flex-col gap-1.5">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-medium text-[var(--text-soft)]">{course.instructor}</span>
          <span className="flex items-center gap-1 text-xs font-medium text-[var(--text-soft)]">
            <Star size={12} className="fill-current text-[var(--energy)]" style={{ color: 'var(--energy)' }} /> {course.rating}
          </span>
        </div>
        <h3 className="font-display font-semibold leading-tight">{course.title}</h3>
        <p className="text-xs text-[var(--text-soft)]">{course.duration} \u00b7 {course.lessons} lessons \u00b7 {course.level}</p>
      </div>

      {course.progress > 0 ? (
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-medium text-[var(--text-soft)]">Progress</span>
            <span className="text-xs font-semibold">{course.progress}%</span>
          </div>
          <ProgressBar value={course.progress} className="mb-3" />
          <Link
            to={`/app/courses/${course.id}`}
            className="flex items-center justify-center gap-1.5 w-full py-2 rounded-xl bg-[var(--primary)] text-[var(--primary-fg)] text-sm font-medium hover:opacity-90 transition-opacity"
          >
            Continue <ArrowRight size={15} />
          </Link>
        </div>
      ) : (
        <Link
          to={`/app/courses/${course.id}`}
          className="flex items-center justify-center gap-1.5 w-full py-2 rounded-xl bg-[var(--surface-2)] text-sm font-medium hover:bg-[var(--surface-3)] transition-colors"
        >
          View Course <ArrowRight size={15} />
        </Link>
      )}
    </Card>
  )
}
