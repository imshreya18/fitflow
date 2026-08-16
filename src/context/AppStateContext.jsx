import { createContext, useContext, useState, useCallback } from 'react'
import { notifications as initialNotifications, currentSong } from '@/data/mockData'

const AppStateContext = createContext(null)

export function AppStateProvider({ children }) {
  const [notifications, setNotifications] = useState(initialNotifications)
  const [toast, setToast] = useState(null)
  const [nowPlaying, setNowPlaying] = useState(null) // playlist object or null
  const [isPlaying, setIsPlaying] = useState(false)
  const [song] = useState(currentSong)

  const unreadCount = notifications.filter((n) => !n.read).length

  const markAllRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }, [])

  const markRead = useCallback((id) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }, [])

  const showToast = useCallback((message) => {
    setToast(message)
    window.clearTimeout(showToast._t)
    showToast._t = window.setTimeout(() => setToast(null), 2600)
  }, [])

  const playPlaylist = useCallback((playlist) => {
    setNowPlaying(playlist)
    setIsPlaying(true)
  }, [])

  return (
    <AppStateContext.Provider
      value={{
        notifications,
        unreadCount,
        markAllRead,
        markRead,
        toast,
        showToast,
        nowPlaying,
        setNowPlaying,
        isPlaying,
        setIsPlaying,
        song,
        playPlaylist,
      }}
    >
      {children}
    </AppStateContext.Provider>
  )
}

export function useAppState() {
  const ctx = useContext(AppStateContext)
  if (!ctx) throw new Error('useAppState must be used within AppStateProvider')
  return ctx
}
