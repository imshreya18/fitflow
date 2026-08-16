import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Leaf, ArrowRight, Flame, Target, Sparkles } from 'lucide-react'
import Button from '@/components/ui/Button'
import { ProgressRing } from '@/components/ui/Progress'

export default function Landing() {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--bg)' }}>
      <header className="max-w-6xl w-full mx-auto flex items-center justify-between px-6 py-6">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-[var(--primary)] flex items-center justify-center">
            <Leaf size={18} className="text-[var(--primary-fg)]" />
          </div>
          <span className="font-display font-bold text-lg tracking-tight">FitFlow</span>
        </div>
        <Button as={Link} to="/auth" variant="ghost" size="sm">Log In</Button>
      </header>

      <main className="flex-1 max-w-6xl w-full mx-auto px-6 flex flex-col lg:flex-row items-center gap-12 py-8 lg:py-16">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex-1 max-w-xl"
        >
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-[var(--primary)] bg-[var(--primary-soft)] px-3 py-1.5 rounded-full mb-6">
            <Sparkles size={13} /> Fitness, simplified
          </span>
          <h1 className="font-display text-4xl sm:text-5xl font-bold leading-[1.1] tracking-tight mb-5">
            Your fitness journey,<br />simplified.
          </h1>
          <p className="text-lg text-[var(--text-soft)] mb-8 leading-relaxed">
            Build better habits, discover workouts you enjoy, and see your progress without the overwhelm.
          </p>
          <div className="flex flex-wrap items-center gap-3 mb-10">
            <Button as={Link} to="/onboarding" size="lg">
              Get Started <ArrowRight size={18} />
            </Button>
            <Button as={Link} to="/app/home" variant="outline" size="lg">
              Explore FitFlow
            </Button>
          </div>
          <div className="flex items-center gap-3 border-l-2 border-[var(--primary)] pl-4">
            <p className="italic text-[var(--text-soft)]">"Small steps. Stronger you."</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="flex-1 w-full max-w-md relative"
        >
          <div className="absolute inset-0 bg-[var(--primary)] opacity-[0.06] rounded-[2.5rem] blur-2xl" />
          <div className="relative bg-[var(--surface)] border border-[var(--border)] rounded-[2rem] p-6 card-shadow">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-sm text-[var(--text-soft)]">Good morning</p>
                <p className="font-display font-semibold text-lg">Prashansa 👋</p>
              </div>
              <div className="flex items-center gap-1.5 bg-[var(--energy-soft)] text-[var(--energy)] px-3 py-1.5 rounded-full text-sm font-semibold">
                <Flame size={15} /> 7
              </div>
            </div>

            <div className="bg-[var(--surface-2)] rounded-2xl p-5 mb-4 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-[var(--primary)] mb-1">Today</p>
                <p className="font-display font-bold">Full Body Flow</p>
                <p className="text-sm text-[var(--text-soft)]">30 min · Beginner</p>
              </div>
              <ProgressRing value={80} size={64} strokeWidth={7}>
                <span className="font-display font-bold text-sm">24/30</span>
              </ProgressRing>
            </div>

            <div className="flex items-center gap-3 bg-[var(--surface-2)] rounded-2xl p-4">
              <div className="w-10 h-10 rounded-full bg-[var(--primary-soft)] text-[var(--primary)] flex items-center justify-center">
                <Target size={18} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Improve Fitness</p>
                <div className="h-1.5 rounded-full bg-[var(--surface-3)] mt-1.5 overflow-hidden">
                  <div className="h-full rounded-full bg-[var(--primary)]" style={{ width: '80%' }} />
                </div>
              </div>
              <span className="text-sm font-semibold text-[var(--primary)]">80%</span>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  )
}
