import { Outlet } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import Sidebar from './Sidebar'
import BottomNavigation from './BottomNavigation'
import MiniPlayer from '@/components/MiniPlayer'
import { useAppState } from '@/context/AppStateContext'

export default function AppShell() {
  const { toast, nowPlaying } = useAppState()

  return (
    <div className="min-h-screen flex" style={{ background: 'var(--bg)' }}>
      <Sidebar />
      <div className="flex-1 min-w-0 flex flex-col">
        <main className="flex-1 px-4 sm:px-6 lg:px-10 pt-6 lg:pt-8 pb-28 lg:pb-10 max-w-[1400px] w-full mx-auto">
          <Outlet />
        </main>
      </div>
      {nowPlaying && <MiniPlayer />}
      <BottomNavigation />

      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="fixed bottom-24 lg:bottom-8 left-1/2 -translate-x-1/2 z-50 bg-[var(--text)] text-[var(--bg)] px-4 py-2.5 rounded-full text-sm font-medium shadow-lg"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
