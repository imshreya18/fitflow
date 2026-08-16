import { Link } from 'react-router-dom'
import { Play, Pause, X } from 'lucide-react'
import { useAppState } from '@/context/AppStateContext'

export default function MiniPlayer() {
  const { nowPlaying, setNowPlaying, isPlaying, setIsPlaying, song } = useAppState()
  if (!nowPlaying) return null

  return (
    <div className="fixed bottom-16 lg:bottom-4 inset-x-0 lg:inset-x-auto lg:left-72 lg:right-6 z-30 px-3 lg:px-0">
      <Link
        to="/app/music"
        className="max-w-2xl mx-auto lg:mx-0 flex items-center gap-3 bg-[var(--text)] text-[var(--bg)] rounded-2xl px-4 py-3 shadow-lg"
      >
        <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-lg shrink-0">
          {nowPlaying.emoji}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium truncate">{song.title}</p>
          <p className="text-xs opacity-60 truncate">{nowPlaying.title}</p>
        </div>
        <button
          onClick={(e) => { e.preventDefault(); setIsPlaying((p) => !p) }}
          aria-label={isPlaying ? 'Pause' : 'Play'}
          className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors shrink-0"
        >
          {isPlaying ? <Pause size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" />}
        </button>
        <button
          onClick={(e) => { e.preventDefault(); setNowPlaying(null) }}
          aria-label="Close player"
          className="p-2 rounded-full hover:bg-white/10 transition-colors shrink-0"
        >
          <X size={16} />
        </button>
      </Link>
    </div>
  )
}
