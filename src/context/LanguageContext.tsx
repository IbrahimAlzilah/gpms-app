import React, { createContext, useContext, ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { useTheme } from './ThemeContext'

interface LanguageContextType {
  changeLanguage: (lang: 'ar' | 'en') => void
  currentLanguage: string
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}

interface LanguageProviderProps {
  children: ReactNode
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const { i18n, t } = useTranslation()
  const { setLanguage } = useTheme()

  const changeLanguage = (lang: 'ar' | 'en') => {
    i18n.changeLanguage(lang)
    setLanguage(lang)
  }

  const value: LanguageContextType = {
    changeLanguage,
    currentLanguage: i18n.language,
    t
  }

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  )
}
