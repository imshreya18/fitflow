import { Link, useNavigate } from 'react-router-dom'
import { Bell, Leaf, ChevronLeft } from 'lucide-react'
import { useAppState } from '@/context/AppStateContext'
import { user } from '@/data/mockData'

export default function Header({ title, back = false, subtitle }) {
  const { unreadCount } = useAppState()
  const navigate = useNavigate()

  return (
    <header className="flex items-center justify-between gap-3 mb-6">
      <div className="flex items-center gap-3 min-w-0">
        {back && (
          <button
            onClick={() => navigate(-1)}
            aria-label="Go back"
            className="p-2 -ml-2 rounded-full hover:bg-[var(--surface-2)] transition-colors shrink-0"
          >
            <ChevronLeft size={22} />
          </button>
        )}
        <div className="lg:hidden flex items-center gap-2 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-[var(--primary)] flex items-center justify-center">
            <Leaf size={16} className="text-[var(--primary-fg)]" />
          </div>
        </div>
        {title && (
          <div className="min-w-0">
            <h1 className="font-display font-bold text-xl truncate">{title}</h1>
            {subtitle && <p className="text-sm text-[var(--text-soft)] truncate">{subtitle}</p>}
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <Link
          to="/app/notifications"
          aria-label="Notifications"
          className="relative p-2.5 rounded-full hover:bg-[var(--surface-2)] transition-colors"
        >
          <Bell size={20} />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[var(--energy)]" />
          )}
        </Link>
        <Link to="/app/profile" className="w-9 h-9 rounded-full bg-[var(--primary-soft)] text-[var(--primary)] flex items-center justify-center text-xs font-semibold">
          {user.avatar}
        </Link>
      </div>
    </header>
  )
}
