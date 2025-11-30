import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

type Theme = 'light' | 'dark'
type Language = 'ar' | 'en'

interface ThemeContextType {
  theme: Theme
  language: Language
  toggleTheme: () => void
  setLanguage: (lang: Language) => void
  isRTL: boolean
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

interface ThemeProviderProps {
  children: ReactNode
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  // Initialize theme from localStorage or system preference
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('gpms-theme') as Theme
      if (savedTheme) return savedTheme
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    }
    return 'light'
  })

  // Initialize language from localStorage or default to 'ar'
  const [language, setLanguage] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      const savedLang = localStorage.getItem('gpms-language') as Language
      return savedLang || 'ar'
    }
    return 'ar'
  })

  // Apply theme class
  useEffect(() => {
    const root = window.document.documentElement
    root.classList.remove('light', 'dark')
    root.classList.add(theme)
    localStorage.setItem('gpms-theme', theme)
  }, [theme])

  // Apply language direction
  useEffect(() => {
    const root = window.document.documentElement
    root.dir = language === 'ar' ? 'rtl' : 'ltr'
    root.lang = language
    localStorage.setItem('gpms-language', language)
  }, [language])

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light')
  }

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang)
  }

  const isRTL = language === 'ar'

  const value: ThemeContextType = {
    theme,
    language,
    toggleTheme,
    setLanguage: handleSetLanguage,
    isRTL
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}
