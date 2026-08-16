import { useEffect, useRef, useState } from 'react'
import { Sparkles, Mic } from 'lucide-react'
import { Link } from 'react-router-dom'
import Header from '@/components/layout/Header'
import AIMessage from '@/components/AIMessage'
import ChatInput from '@/components/ChatInput'
import { aiInitialMessages, aiSuggestedPrompts } from '@/data/mockData'
import { useAppState } from '@/context/AppStateContext'

const responses = {
  'i only have 15 minutes today': {
    text: "No problem. I've adapted today's workout to fit 15 minutes while keeping your goal in mind.",
    action: 'Apply 15-minute workout',
  },
  "i'm feeling tired": {
    text: "That's okay \u2014 rest matters too. I've swapped today's session for a lighter mobility flow so you can still show up without overdoing it.",
    action: 'Apply lighter workout',
  },
  'make today\u2019s workout easier': {
    text: "Got it, I've reduced the intensity and rest periods for today's Full Body Flow. You'll still hit your minutes goal.",
    action: 'Apply easier workout',
  },
  'what should i do tomorrow?': {
    text: "Based on your recovery, I'd suggest a 20-minute mobility and core session tomorrow, then back to strength on Thursday.",
  },
  'help me stay consistent': {
    text: "You're already on a 7-day streak, which is great. Try setting a fixed time each morning \u2014 consistency compounds fastest at the same time of day.",
  },
}

function fallbackResponse() {
  return {
    text: "I've noted that. Based on your recent activity, I'd recommend keeping today's session light and focusing on form over intensity.",
  }
}

export default function AICoach() {
  const [messages, setMessages] = useState(aiInitialMessages)
  const [typing, setTyping] = useState(false)
  const { showToast } = useAppState()
  const endRef = useRef(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, typing])

  const send = (text) => {
    const userMsg = { id: crypto.randomUUID(), role: 'user', text }
    setMessages((m) => [...m, userMsg])
    setTyping(true)
    setTimeout(() => {
      const reply = responses[text.toLowerCase()] || fallbackResponse()
      setMessages((m) => [...m, { id: crypto.randomUUID(), role: 'assistant', ...reply }])
      setTyping(false)
    }, 1100)
  }

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] lg:h-[calc(100vh-5rem)] max-w-2xl mx-auto">
      <Header title="FitFlow Coach 🤖" subtitle="Your personal fitness companion." />

      <div className="flex-1 overflow-y-auto flex flex-col gap-4 pb-4 pr-1">
        {messages.map((m) => (
          <AIMessage key={m.id} message={m} onAction={() => showToast(`${m.action} applied`)} />
        ))}
        {typing && (
          <div className="flex items-center gap-2 pl-11">
            <div className="flex gap-1 px-4 py-3 rounded-2xl bg-[var(--surface-2)] rounded-tl-sm">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="w-1.5 h-1.5 rounded-full bg-[var(--text-soft)] animate-bounce"
                  style={{ animationDelay: `${i * 0.12}s` }}
                />
              ))}
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {messages.length <= 2 && (
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-3">
          {aiSuggestedPrompts.map((p) => (
            <button
              key={p}
              onClick={() => send(p)}
              className="shrink-0 text-sm font-medium px-3.5 py-2 rounded-full border border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--surface-2)] transition-colors"
            >
              {p}
            </button>
          ))}
        </div>
      )}

      <div className="pb-2">
        <ChatInput onSend={send} />
      </div>
    </div>
  )
}
