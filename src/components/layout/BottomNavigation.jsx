import { NavLink } from 'react-router-dom'
import { Home, Dumbbell, LayoutGrid, LineChart, Sparkles } from 'lucide-react'
import { cx } from '@/lib/utils'

const navItems = [
  { to: '/app/home', label: 'Home', icon: Home },
  { to: '/app/courses', label: 'Courses', icon: LayoutGrid },
  { to: '/app/workout', label: 'Workout', icon: Dumbbell },
  { to: '/app/progress', label: 'Progress', icon: LineChart },
  { to: '/app/coach', label: 'Coach', icon: Sparkles },
]

export default function BottomNavigation() {
  return (
    <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-[var(--surface)]/95 backdrop-blur border-t border-[var(--border)] pb-[max(env(safe-area-inset-bottom),0.5rem)]">
      <div className="flex items-stretch justify-between px-2 pt-1.5">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cx(
                'flex-1 flex flex-col items-center gap-1 py-1.5 rounded-xl text-[11px] font-medium transition-colors',
                isActive ? 'text-[var(--primary)]' : 'text-[var(--text-soft)]'
              )
            }
          >
            {({ isActive }) => (
              <>
                <div className={cx('p-1.5 rounded-full transition-colors', isActive && 'bg-[var(--primary-soft)]')}>
                  <Icon size={20} strokeWidth={isActive ? 2.4 : 2} />
                </div>
                {label}
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
