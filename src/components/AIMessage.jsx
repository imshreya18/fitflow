import { useState } from 'react'
import { motion } from 'framer-motion'
import { Sparkles, ThumbsUp, ThumbsDown, Copy, RefreshCw, Check } from 'lucide-react'
import { cx } from '@/lib/utils'

export default function AIMessage({ message, onAction }) {
  const [feedback, setFeedback] = useState(null)
  const [copied, setCopied] = useState(false)
  const isUser = message.role === 'user'

  const copy = () => {
    navigator.clipboard?.writeText(message.text)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className={cx('flex gap-3 max-w-[85%]', isUser ? 'ml-auto flex-row-reverse' : '')}
    >
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-[var(--primary)] text-[var(--primary-fg)] flex items-center justify-center shrink-0">
          <Sparkles size={15} />
        </div>
      )}
      <div className={cx('flex flex-col gap-1.5', isUser && 'items-end')}>
        <div
          className={cx(
            'px-4 py-3 rounded-2xl text-sm leading-relaxed',
            isUser ? 'bg-[var(--primary)] text-[var(--primary-fg)] rounded-tr-sm' : 'bg-[var(--surface-2)] text-[var(--text)] rounded-tl-sm'
          )}
        >
          {message.text}
        </div>

        {message.action && (
          <button
            onClick={() => onAction?.(message.action)}
            className="text-sm font-semibold text-[var(--primary)] bg-[var(--primary-soft)] px-3.5 py-2 rounded-xl hover:opacity-90 transition-opacity"
          >
            {message.action}
          </button>
        )}

        {!isUser && (
          <div className="flex items-center gap-1 text-[var(--text-soft)] pl-1">
            <button onClick={() => setFeedback(feedback === 'up' ? null : 'up')} aria-label="Good response" className={cx('p-1.5 rounded-lg hover:bg-[var(--surface-2)]', feedback === 'up' && 'text-[var(--primary)]')}>
              <ThumbsUp size={13} />
            </button>
            <button onClick={() => setFeedback(feedback === 'down' ? null : 'down')} aria-label="Bad response" className={cx('p-1.5 rounded-lg hover:bg-[var(--surface-2)]', feedback === 'down' && 'text-red-500')}>
              <ThumbsDown size={13} />
            </button>
            <button onClick={copy} aria-label="Copy message" className="p-1.5 rounded-lg hover:bg-[var(--surface-2)]">
              {copied ? <Check size={13} /> : <Copy size={13} />}
            </button>
            <button aria-label="Regenerate response" className="p-1.5 rounded-lg hover:bg-[var(--surface-2)]">
              <RefreshCw size={13} />
            </button>
          </div>
        )}
      </div>
    </motion.div>
  )
}
