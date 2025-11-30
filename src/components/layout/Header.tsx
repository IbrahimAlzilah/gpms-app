import React, { useState, useRef, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useLanguage } from '../../context/LanguageContext'
import { useTheme } from '../../context/ThemeContext'
import NotificationPanel from '../notifications/NotificationPanel'
import {
  Menu,
  Settings,
  LogOut,
  User,
  Globe,
  Sun,
  Moon,
  Search,
  Bell
} from 'lucide-react'
import { cn } from '../../lib/utils'

interface HeaderProps {
  onMenuClick?: () => void
  sidebarWidth?: number
}

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const { user, logout } = useAuth()
  const { t, changeLanguage, currentLanguage } = useLanguage()
  const { theme, toggleTheme } = useTheme()
  const [showUserMenu, setShowUserMenu] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  const handleLogout = () => {
    logout()
    setShowUserMenu(false)
  }

  const toggleLanguage = () => {
    changeLanguage(currentLanguage === 'ar' ? 'en' : 'ar')
  }

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-200 bg-white/80 backdrop-blur-md dark:bg-gray-950/80 dark:border-gray-800 transition-all duration-300">
      <div className="flex h-16 items-center justify-between px-4 lg:px-6">
        {/* Left Section: Mobile Menu & Search */}
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 -ml-2 rounded-md text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors"
            aria-label="Toggle Menu"
          >
            <Menu size={20} />
          </button>

          {/* Search Bar */}
          <div className="hidden md:flex items-center relative max-w-md w-full">
            <div className="relative w-64 group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400 group-focus-within:text-gpms-primary transition-colors" />
              </div>
              <input
                type="text"
                placeholder={t('common.search')}
                className="w-full pl-10 pr-4 py-2 text-sm bg-gray-100/50 border-none rounded-full focus:ring-2 focus:ring-gpms-primary/20 focus:bg-white transition-all duration-200 dark:bg-gray-900 dark:text-gray-100"
              />
            </div>
          </div>
        </div>

        {/* Right Section: Actions */}
        <div className="flex items-center gap-3">
          {/* Language Toggle */}
          <button
            onClick={toggleLanguage}
            className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 transition-all"
            title={currentLanguage === 'ar' ? 'Switch to English' : 'التبديل إلى العربية'}
          >
            <Globe size={18} />
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="hidden sm:flex p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 transition-all"
            title={theme === 'light' ? 'Switch to Dark Mode' : 'التبديل إلى الوضع المظلم'}
          >
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          </button>

          {/* Notifications */}
          <div className="relative">
            <NotificationPanel />
          </div>

          {/* User Profile */}
          <div className="relative ml-2" ref={menuRef}>
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-3 p-1 px-1.5 rounded-full hover:bg-gray-50 dark:hover:bg-gray-800 transition-all border border-border hover:border-gray-200 dark:hover:border-gray-700"
            >
              <div className="w-8 h-8 rounded-full bg-gpms-dark flex items-center justify-center text-white shadow-sm ring-2 ring-white dark:ring-gray-950">
                <User size={16} />
              </div>
              <div className="hidden lg:flex flex-col items-start text-sm">
                <span className="font-medium text-gray-700 dark:text-gray-200 leading-none">{user?.fullName}</span>
                <span className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{t(`common.${user?.role}`)}</span>
              </div>
            </button>

            {/* Dropdown Menu */}
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-56 origin-top-right rounded-xl bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none animate-in fade-in zoom-in-95 duration-200 dark:bg-gray-900 dark:ring-gray-800 z-50">
                <div className="p-2 space-y-1">
                  <div className="px-3 py-2 border-b border-gray-100 dark:border-gray-800 lg:hidden">
                    <p className="font-medium text-gray-900 dark:text-gray-100">{user?.fullName}</p>
                    <p className="text-xs text-gray-500">{t(`common.${user?.role}`)}</p>
                  </div>

                  <button className="flex w-full items-center gap-2 px-3 py-2 text-sm text-gray-700 rounded-lg hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors">
                    <User size={16} />
                    {t('common.profile')}
                  </button>
                  <button className="flex w-full items-center gap-2 px-3 py-2 text-sm text-gray-700 rounded-lg hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors">
                    <Settings size={16} />
                    {t('common.settings')}
                  </button>

                  <div className="h-px bg-gray-100 dark:bg-gray-800 my-1" />

                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-600 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
                  >
                    <LogOut size={16} />
                    {t('common.logout')}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
