import { createContext, useContext, useEffect, useState } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'

const ThemeContext = createContext(null)

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

export function ThemeProvider({ children }) {
  const [storedTheme, setStoredTheme] = useLocalStorage('theme', 'light')
  const [systemTheme, setSystemTheme] = useState('light')
  const [mounted, setMounted] = useState(false)

  // Get system theme preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    
    const handleChange = (e) => {
      setSystemTheme(e.matches ? 'dark' : 'light')
    }

    setSystemTheme(mediaQuery.matches ? 'dark' : 'light')
    mediaQuery.addEventListener('change', handleChange)

    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  // Apply theme to document
  useEffect(() => {
    const root = document.documentElement
    
    // Remove dark class first
    root.classList.remove('dark')
    
    // Then add it only if needed
    if (storedTheme === 'dark') {
      root.classList.add('dark')
    } else if (storedTheme === 'system' && systemTheme === 'dark') {
      root.classList.add('dark')
    }
    
    setMounted(true)
  }, [storedTheme, systemTheme])

  const setTheme = (theme) => {
    setStoredTheme(theme)
  }

  const toggleTheme = () => {
    setStoredTheme(current => {
      if (current === 'light') return 'dark'
      if (current === 'dark') return 'system'
      return 'light'
    })
  }

  const getCurrentTheme = () => {
    if (storedTheme === 'system') {
      return systemTheme
    }
    return storedTheme
  }

  const value = {
    theme: storedTheme,
    currentTheme: getCurrentTheme(),
    systemTheme,
    setTheme,
    toggleTheme,
    mounted
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}
