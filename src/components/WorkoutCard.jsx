import { Link } from 'react-router-dom'
import { Play, Sliders, Clock, BarChart3, ListChecks } from 'lucide-react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'

export default function WorkoutCard({ workout }) {
  return (
    <Card className="p-6 sm:p-8 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--primary-soft)] via-transparent to-transparent opacity-70 pointer-events-none" />
      <div className="relative flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--primary)] mb-2">Today's Workout</p>
          <h2 className="font-display text-2xl sm:text-3xl font-bold mb-4">{workout.title}</h2>
          <div className="flex flex-wrap items-center gap-4 text-sm text-[var(--text-soft)]">
            <span className="flex items-center gap-1.5"><Clock size={16} /> {workout.duration} min</span>
            <span className="flex items-center gap-1.5"><BarChart3 size={16} /> {workout.level}</span>
            <span className="flex items-center gap-1.5"><ListChecks size={16} /> {workout.exerciseCount} exercises</span>
          </div>
        </div>
        <div className="flex sm:flex-col gap-2 shrink-0">
          <Button as={Link} to="/app/workout" size="lg" className="shadow-sm">
            <Play size={18} fill="currentColor" /> Start Workout
          </Button>
          <Button variant="secondary" size="md" className="justify-center">
            <Sliders size={16} /> Customize
          </Button>
        </div>
      </div>
    </Card>
  )
}
