import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Mic, Type, AudioWaveform, X } from 'lucide-react'
import Header from '@/components/layout/Header'
import { cx } from '@/lib/utils'

const modes = [
  { id: 'type', label: 'Type', icon: Type },
  { id: 'speak', label: 'Speak', icon: Mic },
  { id: 'voice', label: 'Voice-to-Voice', icon: AudioWaveform },
]

const stateCopy = {
  idle: 'Tap to speak',
  listening: "I'm listening...",
  processing: 'Thinking...',
  speaking: 'FitFlow is speaking...',
}

function Waveform({ active }) {
  return (
    <div className="flex items-end gap-1.5 h-12">
      {Array.from({ length: 9 }).map((_, i) => (
        <motion.span
          key={i}
          className="w-1.5 rounded-full bg-[var(--primary)]"
          animate={active ? { height: [8, 28, 12, 36, 8] } : { height: 8 }}
          transition={{ duration: 1.1, repeat: active ? Infinity : 0, delay: i * 0.06, ease: 'easeInOut' }}
        />
      ))}
    </div>
  )
}

export default function Voice() {
  const [mode, setMode] = useState('speak')
  const [state, setState] = useState('idle') // idle | listening | processing | speaking
  const navigate = useNavigate()

  useEffect(() => {
    if (state === 'listening') {
      const t = setTimeout(() => setState('processing'), 2200)
      return () => clearTimeout(t)
    }
    if (state === 'processing') {
      const t = setTimeout(() => setState('speaking'), 1400)
      return () => clearTimeout(t)
    }
    if (state === 'speaking') {
      const t = setTimeout(() => setState('idle'), 2600)
      return () => clearTimeout(t)
    }
  }, [state])

  if (mode === 'type') {
    navigate('/app/coach')
    return null
  }

  return (
    <div className="max-w-md mx-auto flex flex-col min-h-[calc(100vh-4rem)]">
      <Header back title="Voice Assistant" />

      <div className="flex justify-center gap-2 mb-10">
        {modes.map((m) => (
          <button
            key={m.id}
            onClick={() => setMode(m.id)}
            className={cx(
              'flex items-center gap-1.5 px-3.5 py-2 rounded-full text-sm font-medium border transition-colors',
              mode === m.id ? 'bg-[var(--primary)] text-[var(--primary-fg)] border-[var(--primary)]' : 'bg-[var(--surface)] border-[var(--border)] hover:bg-[var(--surface-2)]'
            )}
          >
            <m.icon size={15} /> {m.label}
          </button>
        ))}
      </div>

      <div className="flex-1 flex flex-col items-center justify-center gap-8">
        <AnimatePresence mode="wait">
          <motion.p
            key={state}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="font-display text-xl font-semibold text-center"
          >
            {stateCopy[state]}
          </motion.p>
        </AnimatePresence>

        <Waveform active={state === 'listening' || state === 'speaking'} />

        <motion.button
          onClick={() => setState(state === 'idle' ? 'listening' : 'idle')}
          animate={state === 'listening' ? { scale: [1, 1.06, 1] } : { scale: 1 }}
          transition={{ duration: 1.4, repeat: state === 'listening' ? Infinity : 0 }}
          aria-label={state === 'idle' ? 'Start speaking' : 'Stop'}
          className={cx(
            'w-32 h-32 rounded-full flex items-center justify-center transition-colors shadow-lg',
            state === 'idle' ? 'bg-[var(--primary)] text-[var(--primary-fg)]' : 'bg-[var(--energy)] text-white'
          )}
        >
          {state === 'idle' ? <Mic size={40} /> : <X size={36} />}
        </motion.button>

        <p className="text-sm text-[var(--text-soft)] text-center max-w-xs">
          {mode === 'voice' ? 'Speak naturally \u2014 FitFlow will respond back with voice.' : 'Tap the mic and ask about your workout, goals, or progress.'}
        </p>
      </div>
    </div>
  )
}
