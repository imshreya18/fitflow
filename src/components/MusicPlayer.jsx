import { useEffect, useState } from 'react'
import { Play, Pause, SkipBack, SkipForward, Volume2, Shuffle, Repeat } from 'lucide-react'
import Card from '@/components/ui/Card'
import { useAppState } from '@/context/AppStateContext'
import { songQueue } from '@/data/mockData'

function formatTime(sec) {
  const m = Math.floor(sec / 60)
  const s = Math.floor(sec % 60)
  return `${m}:${String(s).padStart(2, '0')}`
}

export default function MusicPlayer() {
  const { nowPlaying, isPlaying, setIsPlaying, song } = useAppState()
  const [elapsed, setElapsed] = useState(song.elapsed)
  const [volume, setVolume] = useState(70)

  useEffect(() => {
    if (!isPlaying) return
    const t = setInterval(() => {
      setElapsed((e) => (e + 1 >= song.duration ? 0 : e + 1))
    }, 1000)
    return () => clearInterval(t)
  }, [isPlaying, song.duration])

  if (!nowPlaying) {
    return (
      <Card className="p-8 text-center">
        <p className="text-[var(--text-soft)]">Select a playlist below to start listening.</p>
      </Card>
    )
  }

  return (
    <Card className="p-6 sm:p-7">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-16 h-16 rounded-2xl bg-[var(--primary-soft)] flex items-center justify-center text-2xl shrink-0">
          {nowPlaying.emoji}
        </div>
        <div className="min-w-0">
          <p className="font-display font-bold text-lg truncate">{song.title}</p>
          <p className="text-sm text-[var(--text-soft)] truncate">{song.artist} · {nowPlaying.title}</p>
        </div>
      </div>

      <input
        type="range"
        min={0}
        max={song.duration}
        value={elapsed}
        onChange={(e) => setElapsed(Number(e.target.value))}
        className="w-full accent-[var(--primary)] mb-1.5"
        aria-label="Song progress"
      />
      <div className="flex justify-between text-xs text-[var(--text-soft)] mb-6">
        <span>{formatTime(elapsed)}</span>
        <span>{formatTime(song.duration)}</span>
      </div>

      <div className="flex items-center justify-center gap-6 mb-6">
        <button aria-label="Shuffle" className="text-[var(--text-soft)] hover:text-[var(--text)] transition-colors">
          <Shuffle size={18} />
        </button>
        <button aria-label="Previous" className="text-[var(--text)]">
          <SkipBack size={22} fill="currentColor" />
        </button>
        <button
          onClick={() => setIsPlaying((p) => !p)}
          aria-label={isPlaying ? 'Pause' : 'Play'}
          className="w-14 h-14 rounded-full bg-[var(--primary)] text-[var(--primary-fg)] flex items-center justify-center hover:opacity-90 transition-opacity"
        >
          {isPlaying ? <Pause size={22} fill="currentColor" /> : <Play size={22} fill="currentColor" className="ml-0.5" />}
        </button>
        <button aria-label="Next" className="text-[var(--text)]">
          <SkipForward size={22} fill="currentColor" />
        </button>
        <button aria-label="Repeat" className="text-[var(--text-soft)] hover:text-[var(--text)] transition-colors">
          <Repeat size={18} />
        </button>
      </div>

      <div className="flex items-center gap-3 mb-2">
        <Volume2 size={17} className="text-[var(--text-soft)]" />
        <input
          type="range"
          min={0}
          max={100}
          value={volume}
          onChange={(e) => setVolume(Number(e.target.value))}
          className="flex-1 accent-[var(--primary)]"
          aria-label="Volume"
        />
      </div>

      <div className="mt-6 pt-6 border-t border-[var(--border)]">
        <p className="text-xs font-semibold uppercase tracking-wide text-[var(--text-soft)] mb-3">Up Next</p>
        <div className="flex flex-col gap-1">
          {songQueue.slice(1).map((s, i) => (
            <div key={i} className="flex items-center justify-between py-2 px-2 rounded-lg hover:bg-[var(--surface-2)] transition-colors">
              <div>
                <p className="text-sm font-medium">{s.title}</p>
                <p className="text-xs text-[var(--text-soft)]">{s.artist}</p>
              </div>
              <span className="text-xs text-[var(--text-soft)]">{s.duration}</span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  )
}
