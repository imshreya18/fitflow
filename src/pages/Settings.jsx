import { useState } from 'react'
import { User, Bell, Heart, Palette, Eye, Shield, LogOut, ChevronRight } from 'lucide-react'
import Header from '@/components/layout/Header'
import Card from '@/components/ui/Card'
import Switch from '@/components/ui/Switch'
import ThemeSelector from '@/components/ThemeSelector'
import { user } from '@/data/mockData'
import { useTheme } from '@/context/ThemeContext'

function Section({ icon: Icon, title, children }) {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-2 mb-3 px-1">
        <Icon size={16} className="text-[var(--text-soft)]" />
        <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--text-soft)]">{title}</h2>
      </div>
      {children}
    </div>
  )
}

function Row({ label, sub, right, onClick }) {
  return (
    <button onClick={onClick} className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-[var(--surface-2)] rounded-2xl transition-colors text-left">
      <div className="flex-1 min-w-0">
        <p className="font-medium">{label}</p>
        {sub && <p className="text-sm text-[var(--text-soft)] truncate">{sub}</p>}
      </div>
      {right}
    </button>
  )
}

export default function Settings() {
  const { reducedMotion, setReducedMotion, fontScale, setFontScale } = useTheme()
  const [notifWorkout, setNotifWorkout] = useState(true)
  const [notifStreak, setNotifStreak] = useState(true)
  const [notifCommunity, setNotifCommunity] = useState(false)

  return (
    <div className="max-w-2xl mx-auto">
      <Header back title="Settings" />

      <Section icon={User} title="Account">
        <Card className="p-2">
          <Row label={user.name} sub={user.handle} right={<ChevronRight size={18} className="text-[var(--text-soft)]" />} />
          <Row label="Phone / Email" sub="prashansa@fitflow.app" right={<ChevronRight size={18} className="text-[var(--text-soft)]" />} />
        </Card>
      </Section>

      <Section icon={Heart} title="Preferences">
        <Card className="p-2">
          <Row label="Workout preferences" sub={`${user.workoutPreference} · ${user.fitnessLevel}`} right={<ChevronRight size={18} className="text-[var(--text-soft)]" />} />
          <Row label="Interests" sub={user.interests.join(', ')} right={<ChevronRight size={18} className="text-[var(--text-soft)]" />} />
        </Card>
      </Section>

      <Section icon={Bell} title="Notifications">
        <Card className="p-2">
          <div className="flex items-center gap-3 px-4 py-3.5">
            <span className="flex-1 font-medium">Workout reminders</span>
            <Switch checked={notifWorkout} onChange={setNotifWorkout} label="Workout reminders" />
          </div>
          <div className="flex items-center gap-3 px-4 py-3.5">
            <span className="flex-1 font-medium">Streak alerts</span>
            <Switch checked={notifStreak} onChange={setNotifStreak} label="Streak alerts" />
          </div>
          <div className="flex items-center gap-3 px-4 py-3.5">
            <span className="flex-1 font-medium">Community activity</span>
            <Switch checked={notifCommunity} onChange={setNotifCommunity} label="Community activity" />
          </div>
        </Card>
      </Section>

      <Section icon={Palette} title="Appearance">
        <ThemeSelector />
      </Section>

      <Section icon={Eye} title="Accessibility">
        <Card className="p-2">
          <div className="flex items-center gap-3 px-4 py-3.5">
            <span className="flex-1 font-medium">Reduced motion</span>
            <Switch checked={reducedMotion} onChange={setReducedMotion} label="Reduced motion" />
          </div>
          <div className="px-4 py-3.5">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium">Font size</span>
              <span className="text-sm text-[var(--text-soft)]">{Math.round(fontScale * 100)}%</span>
            </div>
            <input
              type="range"
              min={0.85}
              max={1.3}
              step={0.05}
              value={fontScale}
              onChange={(e) => setFontScale(Number(e.target.value))}
              className="w-full accent-[var(--primary)]"
              aria-label="Font size"
            />
          </div>
        </Card>
      </Section>

      <Section icon={Shield} title="Privacy">
        <Card className="p-2">
          <Row label="Privacy settings" sub="Manage your data & visibility" right={<ChevronRight size={18} className="text-[var(--text-soft)]" />} />
        </Card>
      </Section>

      <button className="flex items-center gap-2 text-red-500 font-medium px-4 py-3 hover:bg-red-500/5 rounded-xl transition-colors w-full mb-6">
        <LogOut size={17} /> Log out
      </button>
    </div>
  )
}
