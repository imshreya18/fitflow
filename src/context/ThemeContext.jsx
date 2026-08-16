import { createContext, useContext, useEffect, useState } from 'react'

const ThemeContext = createContext(null)

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => localStorage.getItem('fitflow-theme') || 'default')
  const [reducedMotion, setReducedMotion] = useState(() => localStorage.getItem('fitflow-reduced-motion') === 'true')
  const [fontScale, setFontScale] = useState(() => Number(localStorage.getItem('fitflow-font-scale')) || 1)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('fitflow-theme', theme)
  }, [theme])

  useEffect(() => {
    document.documentElement.classList.toggle('reduce-motion', reducedMotion)
    localStorage.setItem('fitflow-reduced-motion', String(reducedMotion))
  }, [reducedMotion])

  useEffect(() => {
    document.documentElement.style.fontSize = `${fontScale * 100}%`
    localStorage.setItem('fitflow-font-scale', String(fontScale))
  }, [fontScale])

  return (
    <ThemeContext.Provider value={{ theme, setTheme, reducedMotion, setReducedMotion, fontScale, setFontScale }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider')
  return ctx
}
