import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Music2, CheckCircle2, PartyPopper } from 'lucide-react'
import Button from '@/components/ui/Button'
import { ProgressBar, ProgressRing } from '@/components/ui/Progress'
import { exercises as initialExercises, todaysWorkout } from '@/data/mockData'
import { useAppState } from '@/context/AppStateContext'

export default function Workout() {
  const [exercises, setExercises] = useState(initialExercises)
  const [activeIndex, setActiveIndex] = useState(() => Math.max(0, initialExercises.findIndex((e) => e.active)))
  const [setsDone, setSetsDone] = useState(2)
  const [resting, setResting] = useState(false)
  const [restTime, setRestTime] = useState(0)
  const [finished, setFinished] = useState(false)
  const navigate = useNavigate()
  const { showToast } = useAppState()

  const current = exercises[activeIndex]

  useEffect(() => {
    if (!resting) return
    if (restTime <= 0) { setResting(false); return }
    const t = setTimeout(() => setRestTime((r) => r - 1), 1000)
    return () => clearTimeout(t)
  }, [resting, restTime])

  const completeSet = () => {
    if (setsDone < current.sets) {
      setSetsDone((s) => s + 1)
      setResting(true)
      setRestTime(current.restSeconds)
    } else {
      goToNext()
    }
  }

  const goToNext = () => {
    setExercises((prev) => prev.map((e, i) => (i === activeIndex ? { ...e, done: true } : e)))
    if (activeIndex < exercises.length - 1) {
      setActiveIndex((i) => i + 1)
      setSetsDone(0)
      setResting(false)
    } else {
      setFinished(true)
    }
  }

  const skip = () => {
    showToast('Exercise skipped')
    goToNext()
  }

  if (finished) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-6">
        <motion.div initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', bounce: 0.5 }}>
          <div className="w-20 h-20 rounded-full bg-[var(--primary-soft)] text-[var(--primary)] flex items-center justify-center mx-auto mb-6">
            <PartyPopper size={32} />
          </div>
        </motion.div>
        <h1 className="font-display text-2xl font-bold mb-2">Workout complete! 🎉</h1>
        <p className="text-[var(--text-soft)] mb-8 max-w-xs">
          Great work finishing {todaysWorkout.title}. That's day 8 of your streak.
        </p>
        <div className="flex gap-3">
          <Button size="lg" onClick={() => navigate('/app/home')}>Back to Home</Button>
          <Button size="lg" variant="secondary" onClick={() => navigate('/app/progress')}>View Progress</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-lg mx-auto">
      <div className="flex items-center justify-between mb-6">
        <button onClick={() => navigate('/app/home')} aria-label="Close workout" className="p-2 -ml-2 rounded-full hover:bg-[var(--surface-2)] transition-colors">
          <X size={22} />
        </button>
        <p className="text-sm font-medium text-[var(--text-soft)]">Exercise {activeIndex + 1} of {exercises.length}</p>
        <button onClick={() => navigate('/app/music')} aria-label="Music" className="p-2 -mr-2 rounded-full hover:bg-[var(--surface-2)] transition-colors">
          <Music2 size={20} />
        </button>
      </div>

      <ProgressBar value={((activeIndex + (finished ? 1 : setsDone / current.sets)) / exercises.length) * 100} className="mb-8" />

      <AnimatePresence mode="wait">
        <motion.div
          key={activeIndex}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.3 }}
        >
          <p className="text-center text-sm font-semibold text-[var(--primary)] mb-1.5">{todaysWorkout.title}</p>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-center mb-2">{current.name}</h1>
          <p className="text-center text-[var(--text-soft)] mb-8">
            {current.sets} × {current.reps}{current.unit === 'sec' ? ' sec' : ''}
          </p>

          <div className="flex justify-center mb-8">
            {resting ? (
              <ProgressRing value={(restTime / current.restSeconds) * 100} size={180} strokeWidth={12} color="var(--energy)">
                <div className="text-center">
                  <p className="font-display text-4xl font-bold">{restTime}</p>
                  <p className="text-xs text-[var(--text-soft)] uppercase tracking-wide mt-1">Rest</p>
                </div>
              </ProgressRing>
            ) : (
              <ProgressRing value={(setsDone / current.sets) * 100} size={180} strokeWidth={12}>
                <div className="text-center">
                  <p className="font-display text-4xl font-bold">{setsDone}/{current.sets}</p>
                  <p className="text-xs text-[var(--text-soft)] uppercase tracking-wide mt-1">Sets</p>
                </div>
              </ProgressRing>
            )}
          </div>

          <div className="flex justify-center gap-2 mb-10">
            {Array.from({ length: current.sets }).map((_, i) => (
              <div key={i} className="flex flex-col items-center gap-1.5">
                {i < setsDone ? (
                  <CheckCircle2 size={22} className="text-[var(--primary)]" />
                ) : (
                  <div className="w-[22px] h-[22px] rounded-full border-2 border-[var(--border)]" />
                )}
                <span className="text-xs text-[var(--text-soft)]">Set {i + 1}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="flex flex-col gap-3">
        <Button size="lg" onClick={resting ? () => setResting(false) : completeSet}>
          {resting ? 'Skip Rest' : setsDone < current.sets ? 'Complete Set' : 'Next Exercise'}
        </Button>
        <Button variant="secondary" size="md" onClick={skip}>Skip Exercise</Button>
      </div>
    </div>
  )
}
