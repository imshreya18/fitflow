import { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import {
  Home,
  Dumbbell,
  LayoutGrid,
  LineChart,
  Sparkles,
  User,
  Settings,
  Leaf,
} from 'lucide-react'

import { getCurrentUser, getGoals } from '@/lib/api'
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
  const [user, setUser] = useState(null)
  const [goal, setGoal] = useState('Your goal')

  useEffect(() => {
    async function loadUserData() {
      try {
        // GET CURRENT USER
        const currentUser = await getCurrentUser()

        console.log('Sidebar user:', currentUser)

        setUser(currentUser)

        // GET USER GOALS
        try {
          const goalsData = await getGoals()

          console.log('Sidebar goals:', goalsData)

          const goals = Array.isArray(goalsData)
            ? goalsData
            : Array.isArray(goalsData?.goals)
              ? goalsData.goals
              : []

          if (goals.length > 0) {
            const firstGoal = goals[0]

            setGoal(
              firstGoal?.title ||
              firstGoal?.name ||
              firstGoal?.goal ||
              'Your goal'
            )
          }
        } catch (err) {
          console.error('Sidebar goals error:', err)
          setGoal('Your goal')
        }
      } catch (err) {
        console.error('Sidebar user error:', err)
        setUser(null)
      }
    }

    loadUserData()
  }, [])

  // ==================================================
  // DISPLAY NAME
  // ==================================================
  // Prefer the real name returned by /api/auth/me.
  // Only use email as a fallback if name is missing.

  const displayName =
    user?.name?.trim() ||
    user?.user_metadata?.name?.trim() ||
    user?.email?.split('@')[0] ||
    'User'

  // ==================================================
  // INITIALS
  // ==================================================

  const initials =
    displayName
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join('') || 'U'

  return (
    <aside className="hidden lg:flex flex-col w-64 shrink-0 h-screen sticky top-0 border-r border-[var(--border)] bg-[var(--surface)] px-5 py-6">

      {/* ==================================================
          LOGO
      ================================================== */}

      <div className="flex items-center gap-2 px-2 mb-8">
        <div className="w-9 h-9 rounded-xl bg-[var(--primary)] flex items-center justify-center">
          <Leaf
            size={18}
            className="text-[var(--primary-fg)]"
          />
        </div>

        <span className="font-display font-bold text-lg tracking-tight">
          FitFlow
        </span>
      </div>

      {/* ==================================================
          MAIN NAVIGATION
      ================================================== */}

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
            <Icon
              size={19}
              strokeWidth={2.1}
            />

            {label}
          </NavLink>
        ))}
      </nav>

      {/* ==================================================
          BOTTOM SECTION
      ================================================== */}

      <div className="flex flex-col gap-1 pt-4 border-t border-[var(--border)]">

        {/* SETTINGS */}

        <NavLink
          to="/app/settings"
          className={({ isActive }) =>
            cx(
              'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors',
              isActive
                ? 'bg-[var(--primary-soft)] text-[var(--primary)]'
                : 'text-[var(--text-soft)] hover:bg-[var(--surface-2)] hover:text-[var(--text)]'
            )
          }
        >
          <Settings
            size={19}
            strokeWidth={2.1}
          />

          Settings
        </NavLink>

        {/* USER PROFILE */}

        <NavLink
          to="/app/profile"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[var(--surface-2)] transition-colors"
        >
          {/* Avatar */}

          <div className="w-8 h-8 rounded-full bg-[var(--primary-soft)] text-[var(--primary)] flex items-center justify-center text-xs font-semibold shrink-0">
            {initials}
          </div>

          {/* User information */}

          <div className="flex flex-col leading-tight min-w-0">
            <span className="text-sm font-medium truncate">
              {displayName}
            </span>

            <span className="text-xs text-[var(--text-soft)] truncate">
              {goal}
            </span>
          </div>
        </NavLink>
      </div>
    </aside>
  )
}