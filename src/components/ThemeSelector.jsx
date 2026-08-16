import { Check } from 'lucide-react'
import { themes } from '@/data/mockData'
import { useTheme } from '@/context/ThemeContext'
import { cx } from '@/lib/utils'

export default function ThemeSelector() {
  const { theme, setTheme } = useTheme()

  return (
    <div className="grid sm:grid-cols-2 gap-3">
      {themes.map((t) => (
        <button
          key={t.id}
          onClick={() => setTheme(t.id)}
          className={cx(
            'flex items-center gap-3 p-4 rounded-2xl border text-left transition-colors',
            theme === t.id ? 'border-[var(--primary)] bg-[var(--primary-soft)]' : 'border-[var(--border)] hover:bg-[var(--surface-2)]'
          )}
        >
          <div className="flex -space-x-2 shrink-0">
            {t.swatch.map((c, i) => (
              <span key={i} className="w-6 h-6 rounded-full border-2 border-[var(--surface)]" style={{ background: c }} />
            ))}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium">{t.name}</p>
            <p className="text-xs text-[var(--text-soft)] truncate">{t.description}</p>
          </div>
          {theme === t.id && <Check size={18} className="text-[var(--primary)] shrink-0" />}
        </button>
      ))}
    </div>
  )
}
