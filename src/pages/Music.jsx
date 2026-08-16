import { useState } from 'react'
import { Play } from 'lucide-react'
import Header from '@/components/layout/Header'
import Card from '@/components/ui/Card'
import MusicPlayer from '@/components/MusicPlayer'
import { playlists } from '@/data/mockData'
import { useAppState } from '@/context/AppStateContext'
import { cx } from '@/lib/utils'

const categories = ['All', 'Focus', 'High Energy', 'Chill', 'Running', 'Strength', 'Yoga', 'Motivation']

export default function Music() {
  const [category, setCategory] = useState('All')
  const { nowPlaying, playPlaylist } = useAppState()

  const filtered = category === 'All' ? playlists : playlists.filter((p) => p.category === category)

  return (
    <div>
      <Header title="Music for Workouts" subtitle="Set the mood for every session" />

      <div className="mb-6">
        <MusicPlayer />
      </div>

      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2 mb-5 -mx-1 px-1">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={cx(
              'px-4 py-2 rounded-full text-sm font-medium border transition-colors shrink-0',
              category === cat ? 'bg-[var(--primary)] text-[var(--primary-fg)] border-[var(--primary)]' : 'bg-[var(--surface)] border-[var(--border)] hover:bg-[var(--surface-2)]'
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((pl) => (
          <Card key={pl.id} className={cx('p-5 flex items-center gap-4', nowPlaying?.id === pl.id && 'border-[var(--primary)]')}>
            <div className="w-14 h-14 rounded-2xl bg-[var(--primary-soft)] flex items-center justify-center text-2xl shrink-0">
              {pl.emoji}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-display font-semibold truncate">{pl.title}</p>
              <p className="text-xs text-[var(--text-soft)]">{pl.songs} songs · {pl.duration}</p>
            </div>
            <button
              onClick={() => playPlaylist(pl)}
              aria-label={`Play ${pl.title}`}
              className="w-10 h-10 rounded-full bg-[var(--primary)] text-[var(--primary-fg)] flex items-center justify-center hover:opacity-90 transition-opacity shrink-0"
            >
              <Play size={16} fill="currentColor" className="ml-0.5" />
            </button>
          </Card>
        ))}
      </div>
    </div>
  )
}
