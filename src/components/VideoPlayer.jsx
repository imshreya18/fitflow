import { useState } from 'react'
import { Play, Pause, Volume2, VolumeX, Maximize, Settings, Captions } from 'lucide-react'
import { cx } from '@/lib/utils'

const speeds = [0.5, 0.75, 1, 1.25, 1.5, 2]

export default function VideoPlayer({ title, className }) {
  const [playing, setPlaying] = useState(false)
  const [progress, setProgress] = useState(28)
  const [muted, setMuted] = useState(false)
  const [captions, setCaptions] = useState(false)
  const [speedMenu, setSpeedMenu] = useState(false)
  const [speed, setSpeed] = useState(1)

  return (
    <div className={cx('relative rounded-3xl overflow-hidden bg-[var(--text)] aspect-video group', className)}>
      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[var(--primary)]/40 to-black/40">
        <button
          onClick={() => setPlaying((p) => !p)}
          aria-label={playing ? 'Pause video' : 'Play video'}
          className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center hover:scale-105 transition-transform"
        >
          {playing ? <Pause size={26} className="text-[var(--text)]" fill="currentColor" /> : <Play size={26} className="text-[var(--text)] ml-1" fill="currentColor" />}
        </button>
      </div>

      {captions && (
        <div className="absolute bottom-16 left-1/2 -translate-x-1/2 bg-black/70 text-white text-sm px-3 py-1 rounded-md">
          Keep your core tight through the full movement.
        </div>
      )}

      <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
        <span className="text-white text-sm font-medium bg-black/30 px-3 py-1.5 rounded-full backdrop-blur-sm truncate max-w-[70%]">
          {title}
        </span>
      </div>

      <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
        <input
          type="range"
          min={0}
          max={100}
          value={progress}
          onChange={(e) => setProgress(Number(e.target.value))}
          className="w-full accent-white h-1 mb-3 cursor-pointer"
          aria-label="Video progress"
        />
        <div className="flex items-center justify-between text-white">
          <div className="flex items-center gap-3">
            <button onClick={() => setPlaying((p) => !p)} aria-label="Toggle play">
              {playing ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" />}
            </button>
            <button onClick={() => setMuted((m) => !m)} aria-label="Toggle mute">
              {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
            </button>
            <span className="text-xs tabular-nums">{Math.round((progress / 100) * 18)}:{String(Math.round(((progress / 100) * 18 * 60) % 60)).padStart(2, '0')} / 18:00</span>
          </div>
          <div className="flex items-center gap-3 relative">
            <button onClick={() => setCaptions((c) => !c)} aria-label="Toggle captions" className={captions ? 'opacity-100' : 'opacity-60'}>
              <Captions size={18} />
            </button>
            <button onClick={() => setSpeedMenu((s) => !s)} aria-label="Playback speed" className="text-xs font-semibold">
              {speed}x
            </button>
            {speedMenu && (
              <div className="absolute bottom-8 right-8 bg-black/85 rounded-lg py-1.5 flex flex-col min-w-[64px]">
                {speeds.map((s) => (
                  <button
                    key={s}
                    onClick={() => { setSpeed(s); setSpeedMenu(false) }}
                    className={cx('px-3 py-1 text-xs text-left hover:bg-white/10', s === speed && 'text-[var(--accent)] font-semibold')}
                  >
                    {s}x
                  </button>
                ))}
              </div>
            )}
            <button aria-label="Settings" className="opacity-80 hover:opacity-100">
              <Settings size={17} />
            </button>
            <button aria-label="Fullscreen" className="opacity-80 hover:opacity-100">
              <Maximize size={17} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
