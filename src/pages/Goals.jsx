import { useState } from 'react'
import { CheckCircle2, Circle, Plus, Pencil } from 'lucide-react'
import Header from '@/components/layout/Header'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { ProgressRing } from '@/components/ui/Progress'
import { goals as initialGoals, milestones } from '@/data/mockData'
import { useAppState } from '@/context/AppStateContext'

export default function Goals() {
  const [goals] = useState(initialGoals)
  const { showToast } = useAppState()
  const primary = goals.find((g) => g.primary) || goals[0]

  return (
    <div>
      <Header title="Goals" subtitle="Set the pace, we'll help you keep it." />

      <Card className="p-6 sm:p-8 mb-6 flex flex-col sm:flex-row items-center gap-6 bg-[var(--primary)] border-none">
        <ProgressRing value={primary.progress} size={110} strokeWidth={9} color="white" trackColor="rgba(255,255,255,0.25)">
          <span className="font-display font-bold text-xl text-white">{primary.progress}%</span>
        </ProgressRing>
        <div className="flex-1 text-center sm:text-left">
          <p className="text-white/70 text-sm font-medium mb-1">{primary.emoji} Main Goal</p>
          <h1 className="font-display text-2xl font-bold text-white mb-2">{primary.title}</h1>
          <p className="text-white/80">Target: {primary.target} {primary.unit} · Current: {primary.current}</p>
        </div>
        <Button variant="secondary" className="bg-white/15 text-white hover:bg-white/25 shrink-0" onClick={() => showToast('Goal editor opened')}>
          <Pencil size={15} /> Edit Goal
        </Button>
      </Card>

      <h2 className="font-display text-lg font-bold mb-4">Milestones</h2>
      <div className="grid sm:grid-cols-2 gap-3 mb-8">
        {milestones.map((m) => (
          <Card key={m.id} className={`p-4 flex items-center gap-3 ${m.done ? 'bg-[var(--primary-soft)] border-none' : ''}`}>
            {m.done ? (
              <CheckCircle2 size={22} className="text-[var(--primary)] shrink-0" />
            ) : (
              <Circle size={22} className="text-[var(--border)] shrink-0" />
            )}
            <span className={`font-medium ${m.done ? 'text-[var(--primary)]' : 'text-[var(--text-soft)]'}`}>{m.title}</span>
          </Card>
        ))}
      </div>

      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display text-lg font-bold">Other Goals</h2>
        <Button variant="secondary" size="sm" onClick={() => showToast('New goal created')}>
          <Plus size={15} /> Add Goal
        </Button>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        {goals.filter((g) => !g.primary).map((g) => (
          <Card key={g.id} className="p-5 flex items-center gap-4">
            <ProgressRing value={g.progress} size={60} strokeWidth={6}>
              <span className="text-xs font-bold">{g.progress}%</span>
            </ProgressRing>
            <div>
              <p className="font-display font-semibold">{g.emoji} {g.title}</p>
              <p className="text-sm text-[var(--text-soft)]">{g.current} / {g.target} {g.unit}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
