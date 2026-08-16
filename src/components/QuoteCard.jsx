import { useState } from 'react'
import { Quote, RefreshCw } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Card from '@/components/ui/Card'
import { quotes } from '@/data/mockData'

export default function QuoteCard() {
  const [index, setIndex] = useState(0)

  return (
    <Card className="p-6 sm:p-7 relative overflow-hidden bg-[var(--primary)] border-none">
      <div className="absolute -right-6 -top-6 opacity-10">
        <Quote size={120} className="text-white" />
      </div>
      <div className="relative flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-white/70 mb-3">Daily Motivation</p>
          <AnimatePresence mode="wait">
            <motion.p
              key={index}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.3 }}
              className="font-display text-lg sm:text-xl text-white font-semibold leading-snug max-w-md"
            >
              "{quotes[index]}"
            </motion.p>
          </AnimatePresence>
        </div>
        <button
          aria-label="New quote"
          onClick={() => setIndex((i) => (i + 1) % quotes.length)}
          className="shrink-0 p-2.5 rounded-full bg-white/15 hover:bg-white/25 transition-colors text-white"
        >
          <RefreshCw size={16} />
        </button>
      </div>
    </Card>
  )
}
