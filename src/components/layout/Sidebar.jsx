import { NavLink } from 'react-router-dom'
import { Home, Dumbbell, LayoutGrid, LineChart, Sparkles, User, Settings, Leaf } from 'lucide-react'
import { user } from '@/data/mockData'
import { cx } from '@/lib/utils'

const navItems = [
  { to: '/app/home', label: 'Home', icon: Home },
  { to: '/app/courses', label: 'Courses', icon: LayoutGrid },
  { to: '/app/workout', label: 'Workout', icon: Dumbbell },
  { to: '/app/progress', label: 'Progress', icon: LineChart },
  { to: '/app/coach', label: 'AI Coach', icon: Sparkles },
  { to: '/app/profile', label: 'Profile', icon: User },
]

export default function Sidebar() {
  return (
    <aside className="hidden lg:flex flex-col w-64 shrink-0 h-screen sticky top-0 border-r border-[var(--border)] bg-[var(--surface)] px-5 py-6">
      <div className="flex items-center gap-2 px-2 mb-8">
        <div className="w-9 h-9 rounded-xl bg-[var(--primary)] flex items-center justify-center">
          <Leaf size={18} className="text-[var(--primary-fg)]" />
        </div>
        <span className="font-display font-bold text-lg tracking-tight">FitFlow</span>
      </div>

      <nav className="flex-1 flex flex-col gap-1">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cx(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors',
                isActive
                  ? 'bg-[var(--primary-soft)] text-[var(--primary)]'
                  : 'text-[var(--text-soft)] hover:bg-[var(--surface-2)] hover:text-[var(--text)]'
              )
            }
          >
            <Icon size={19} strokeWidth={2.1} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="flex flex-col gap-1 pt-4 border-t border-[var(--border)]">
        <NavLink
          to="/app/settings"
          className={({ isActive }) =>
            cx(
              'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors',
              isActive ? 'bg-[var(--primary-soft)] text-[var(--primary)]' : 'text-[var(--text-soft)] hover:bg-[var(--surface-2)] hover:text-[var(--text)]'
            )
          }
        >
          <Settings size={19} strokeWidth={2.1} />
          Settings
        </NavLink>
        <NavLink to="/app/profile" className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[var(--surface-2)] transition-colors">
          <div className="w-8 h-8 rounded-full bg-[var(--primary-soft)] text-[var(--primary)] flex items-center justify-center text-xs font-semibold">
            {user.avatar}
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-sm font-medium">{user.name}</span>
            <span className="text-xs text-[var(--text-soft)]">{user.goal}</span>
          </div>
        </NavLink>
      </div>
    </aside>
  )
}
