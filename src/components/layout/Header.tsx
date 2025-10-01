import React, { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useLanguage } from '../../context/LanguageContext'
import { useTheme } from '../../context/ThemeContext'
import NotificationPanel from '../notifications/NotificationPanel'
import { 
  Menu,  
  Settings, 
  Send,
  LogOut, 
  User,
  Globe,
  Sun,
  Moon,
  Search
} from 'lucide-react'

interface HeaderProps {
  onMenuClick?: () => void
  sidebarWidth?: number
}

const Header: React.FC<HeaderProps> = ({ onMenuClick, sidebarWidth = 0 }) => {
  const { user, logout } = useAuth()
  const { t, changeLanguage, currentLanguage } = useLanguage()
  const { theme, toggleTheme } = useTheme()
  const [showUserMenu, setShowUserMenu] = useState(false)

  const handleLogout = () => {
    logout()
    setShowUserMenu(false)
  }

  const toggleLanguage = () => {
    changeLanguage(currentLanguage === 'ar' ? 'en' : 'ar')
  }

  const isRTL = currentLanguage === 'ar'
  const logicalStart = isRTL ? 'right' as const : 'left' as const
  const logicalEnd = isRTL ? 'left' as const : 'right' as const

  return (
    <header
      className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-[100] px-4 py-2"
      style={{ [logicalStart]: sidebarWidth, [logicalEnd]: 0 }}
    >
      <div className="flex items-center justify-between">
        {/* Start Section */}
        <div className="flex items-center 1space-x-4 rtl:space-x-reverse">
          {/* Menu Toggle Button */}
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-md hover:bg-gray-100"
          >
            <Menu size={20} />
          </button>
          
          {/* Search Bar */}
          <div className="hidden md:block relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder={t('common.search')}
              className="input-field w-64 pl-10 pr-4 py-2"
            />
          </div>
        </div>

        {/* End Section Actions */}
        <div className="flex items-center space-x-3 rtl:space-x-reverse">
          {/* Language Toggle */}
          <button
            onClick={toggleLanguage}
            className="p-2 rounded-md bg-gray-100 hover:bg-gray-200 transition-colors"
            title={currentLanguage === 'ar' ? 'Switch to English' : 'التبديل إلى العربية'}
          >
            <Globe size={20} className="text-gray-600" />
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="hidden lg:block p-2 rounded-md bg-gray-100 hover:bg-gray-200 transition-colors"
            title={theme === 'light' ? 'Switch to Dark Mode' : 'التبديل إلى الوضع المظلم'}
          >
            {theme === 'light' ? (
              <Moon size={20} className="text-gray-600" />
            ) : (
              <Sun size={20} className="text-gray-600" />
            )}
          </button>

          {/* Notifications */}
          <NotificationPanel />

          {/* Settings */}
          <button className="hidden lg:block p-2 rounded-md bg-gray-100 hover:bg-gray-200 transition-colors">
            <Send size={20} className="text-gray-600" />
          </button>

          {/* User Profile */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-3 rtl:space-x-reverse p-2 rounded-md hover:bg-gray-100 transition-colors"
            >
              <div className="w-8 h-8 bg-gpms-dark rounded-full flex items-center justify-center">
                <User size={18} className="text-white" />
              </div>
              <div className="hidden md:block text-right rtl:text-right">
                <p className="text-sm font-medium text-gray-900 hidden lg:block">{user?.fullName}</p>
                <p className="text-xs text-gray-500 hidden lg:block">{t(`common.${user?.role}`)}</p>
              </div>
            </button>

            {/* Profile Dropdown */}
            {showUserMenu && (
              <div className="absolute right-0 lg:left-0 rtl:left-0 rtl:right-auto lg:rtl:right-auto lg:rtl:left-0 mt-0 w-40 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-50">
                <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  <User size={16} className="mr-2 rtl:mr-0 rtl:ml-2" />
                  {t('common.profile')}
                </button>
                <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  <Settings size={16} className="mr-2 rtl:mr-0 rtl:ml-2" />
                  {t('common.settings')}
                </button>
                <hr className="my-1" />
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  <LogOut size={16} className="mr-2 rtl:mr-0 rtl:ml-2" />
                  {t('common.logout')}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Click outside to close dropdowns */}
      {(showUserMenu) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setShowUserMenu(false);
            // setShowNotifications(false);
          }}
        />
      )}
    </header>
  )
}

export default Header
