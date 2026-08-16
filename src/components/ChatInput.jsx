import { useState } from 'react'
import { Send, Mic } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function ChatInput({ onSend }) {
  const [value, setValue] = useState('')

  const submit = (e) => {
    e.preventDefault()
    if (!value.trim()) return
    onSend(value.trim())
    setValue('')
  }

  return (
    <form onSubmit={submit} className="flex items-center gap-2 bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-2 pl-4">
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Ask your coach anything..."
        className="flex-1 bg-transparent outline-none text-sm py-2"
        aria-label="Message"
      />
      <Link
        to="/app/voice"
        aria-label="Switch to voice"
        className="p-2.5 rounded-xl text-[var(--text-soft)] hover:bg-[var(--surface-2)] transition-colors"
      >
        <Mic size={18} />
      </Link>
      <button
        type="submit"
        aria-label="Send message"
        disabled={!value.trim()}
        className="p-2.5 rounded-xl bg-[var(--primary)] text-[var(--primary-fg)] disabled:opacity-40 hover:opacity-90 transition-opacity"
      >
        <Send size={18} />
      </button>
    </form>
  )
}
