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
  const [mounted, setMounted] = useState(false)

  

  // Apply theme to document
  useEffect(() => {
    const root = document.documentElement
    
    // Remove dark class first
    root.classList.remove('dark')
    
    // Then add it only if needed
    if (storedTheme === 'dark') {
      root.classList.add('dark')
    }
    
    setMounted(true)
  }, [storedTheme])

  const setTheme = (theme) => {
    setStoredTheme(theme)
  }

  const toggleTheme = () => {
    setStoredTheme(current => (current === 'light' ? 'dark' : 'light'))
  }

  const getCurrentTheme = () => {
    return storedTheme
  }

  const value = {
    theme: storedTheme,
    currentTheme: getCurrentTheme(),
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
