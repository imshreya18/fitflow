import { Link } from 'react-router-dom'
import { Settings, Flame, Dumbbell, Target, BarChart3, Clock, ChevronRight, LogOut } from 'lucide-react'
import Header from '@/components/layout/Header'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import { user } from '@/data/mockData'

const links = [
  { to: '/app/goals', label: 'Goals', icon: Target },
  { to: '/app/streaks', label: 'Streaks', icon: Flame },
  { to: '/app/progress', label: 'Progress', icon: BarChart3 },
  { to: '/app/settings', label: 'Settings', icon: Settings },
]

export default function Profile() {
  return (
    <div className="max-w-2xl mx-auto">
      <Header />

      <div className="flex flex-col items-center text-center mb-8">
        <div className="w-24 h-24 rounded-full bg-[var(--primary-soft)] text-[var(--primary)] flex items-center justify-center text-3xl font-display font-bold mb-4">
          {user.avatar}
        </div>
        <h1 className="font-display text-2xl font-bold mb-1">{user.name}</h1>
        <p className="text-[var(--text-soft)] mb-4">{user.handle}</p>
        <div className="flex flex-wrap justify-center gap-2">
          <Badge tone="primary">{user.goal}</Badge>
          <Badge>{user.fitnessLevel}</Badge>
          <Badge>{user.workoutPreference}/session</Badge>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-8">
        <Card className="p-4 text-center">
          <p className="font-display text-xl font-bold flex items-center justify-center gap-1"><Flame size={16} className="text-[var(--energy)]" /> {user.currentStreak}</p>
          <p className="text-xs text-[var(--text-soft)] mt-1">Day streak</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="font-display text-xl font-bold">{user.totalWorkouts}</p>
          <p className="text-xs text-[var(--text-soft)] mt-1">Workouts</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="font-display text-xl font-bold">{user.weeklyGoalDays}/wk</p>
          <p className="text-xs text-[var(--text-soft)] mt-1">Weekly goal</p>
        </Card>
      </div>

      <Card className="p-2 mb-6">
        {links.map(({ to, label, icon: Icon }, i) => (
          <Link
            key={to}
            to={to}
            className={`flex items-center gap-3 px-4 py-3.5 hover:bg-[var(--surface-2)] rounded-2xl transition-colors ${i !== links.length - 1 ? '' : ''}`}
          >
            <Icon size={18} className="text-[var(--text-soft)]" />
            <span className="flex-1 font-medium">{label}</span>
            <ChevronRight size={18} className="text-[var(--text-soft)]" />
          </Link>
        ))}
      </Card>

      <Card className="p-2 mb-4">
        <div className="flex items-center gap-3 px-4 py-3.5">
          <Dumbbell size={18} className="text-[var(--text-soft)]" />
          <div className="flex-1">
            <p className="font-medium">Workout preference</p>
            <p className="text-sm text-[var(--text-soft)]">{user.workoutPreference} sessions</p>
          </div>
        </div>
        <div className="flex items-center gap-3 px-4 py-3.5">
          <Clock size={18} className="text-[var(--text-soft)]" />
          <div className="flex-1">
            <p className="font-medium">Total active time</p>
            <p className="text-sm text-[var(--text-soft)]">2h 15m this week</p>
          </div>
        </div>
      </Card>

      <button className="flex items-center gap-2 text-red-500 font-medium px-4 py-3 hover:bg-red-500/5 rounded-xl transition-colors w-full">
        <LogOut size={17} /> Log out
      </button>
    </div>
  )
}
