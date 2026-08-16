import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, Check } from 'lucide-react'
import Button from '@/components/ui/Button'
import {
  onboardingGoals,
  fitnessLevels,
  workoutTimes,
  weeklyFrequencies,
  onboardingInterests,
} from '@/data/mockData'

const steps = ['Goal', 'Level', 'Time', 'Frequency', 'Interests']

function OptionCard({ label, emoji, selected, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 w-full text-left px-4 py-4 rounded-2xl border transition-all ${
        selected
          ? 'border-[var(--primary)] bg-[var(--primary-soft)] text-[var(--primary)]'
          : 'border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--surface-2)]'
      }`}
    >
      {emoji && <span className="text-xl">{emoji}</span>}
      <span className="font-medium flex-1">{label}</span>
      {selected && <Check size={18} />}
    </button>
  )
}

export default function Onboarding() {
  const [step, setStep] = useState(0)
  const [goal, setGoal] = useState(null)
  const [level, setLevel] = useState(null)
  const [time, setTime] = useState(null)
  const [frequency, setFrequency] = useState(null)
  const [interests, setInterests] = useState([])
  const navigate = useNavigate()

  const toggleInterest = (item) => {
    setInterests((prev) => (prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]))
  }

  const canContinue = [!!goal, !!level, !!time, !!frequency, interests.length > 0][step]

  const next = () => {
    if (step === steps.length - 1) {
      navigate('/app/home')
    } else {
      setStep((s) => s + 1)
    }
  }

  const back = () => {
    if (step === 0) navigate(-1)
    else setStep((s) => s - 1)
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--bg)' }}>
      <div className="max-w-lg w-full mx-auto px-6 pt-8 pb-4 flex-1 flex flex-col">
        <div className="flex items-center gap-3 mb-8">
          <button onClick={back} aria-label="Back" className="p-2 -ml-2 rounded-full hover:bg-[var(--surface-2)] transition-colors">
            <ChevronLeft size={22} />
          </button>
          <div className="flex-1 flex gap-1.5">
            {steps.map((s, i) => (
              <div key={s} className="flex-1 h-1.5 rounded-full bg-[var(--surface-3)] overflow-hidden">
                <motion.div
                  className="h-full bg-[var(--primary)] rounded-full"
                  initial={false}
                  animate={{ width: i <= step ? '100%' : '0%' }}
                  transition={{ duration: 0.4 }}
                />
              </div>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={{ duration: 0.28 }}
            className="flex-1"
          >
            {step === 0 && (
              <>
                <p className="text-sm font-semibold text-[var(--primary)] mb-1.5">Step 1 of 5</p>
                <h1 className="font-display text-2xl font-bold mb-6">What's your goal?</h1>
                <div className="grid grid-cols-1 gap-3">
                  {onboardingGoals.map((g) => (
                    <OptionCard key={g.id} label={g.label} emoji={g.emoji} selected={goal === g.id} onClick={() => setGoal(g.id)} />
                  ))}
                </div>
              </>
            )}

            {step === 1 && (
              <>
                <p className="text-sm font-semibold text-[var(--primary)] mb-1.5">Step 2 of 5</p>
                <h1 className="font-display text-2xl font-bold mb-6">What's your fitness level?</h1>
                <div className="grid grid-cols-1 gap-3">
                  {fitnessLevels.map((l) => (
                    <OptionCard key={l} label={l} selected={level === l} onClick={() => setLevel(l)} />
                  ))}
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <p className="text-sm font-semibold text-[var(--primary)] mb-1.5">Step 3 of 5</p>
                <h1 className="font-display text-2xl font-bold mb-6">How much time can you give?</h1>
                <div className="grid grid-cols-2 gap-3">
                  {workoutTimes.map((t) => (
                    <OptionCard key={t} label={t} selected={time === t} onClick={() => setTime(t)} />
                  ))}
                </div>
              </>
            )}

            {step === 3 && (
              <>
                <p className="text-sm font-semibold text-[var(--primary)] mb-1.5">Step 4 of 5</p>
                <h1 className="font-display text-2xl font-bold mb-6">How many days a week?</h1>
                <div className="grid grid-cols-1 gap-3">
                  {weeklyFrequencies.map((f) => (
                    <OptionCard key={f} label={f} selected={frequency === f} onClick={() => setFrequency(f)} />
                  ))}
                </div>
              </>
            )}

            {step === 4 && (
              <>
                <p className="text-sm font-semibold text-[var(--primary)] mb-1.5">Step 5 of 5</p>
                <h1 className="font-display text-2xl font-bold mb-2">What are you interested in?</h1>
                <p className="text-[var(--text-soft)] mb-6">Pick a few — you can change these anytime.</p>
                <div className="flex flex-wrap gap-2.5">
                  {onboardingInterests.map((item) => (
                    <button
                      key={item}
                      onClick={() => toggleInterest(item)}
                      className={`px-4 py-2.5 rounded-full text-sm font-medium border transition-colors ${
                        interests.includes(item)
                          ? 'bg-[var(--primary)] text-[var(--primary-fg)] border-[var(--primary)]'
                          : 'bg-[var(--surface)] border-[var(--border)] hover:bg-[var(--surface-2)]'
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="pt-8">
          <Button size="lg" className="w-full" disabled={!canContinue} onClick={next}>
            {step === steps.length - 1 ? 'Create My FitFlow' : 'Continue'}
          </Button>
        </div>
      </div>
    </div>
  )
}
