import React, { ReactNode, useState } from 'react'
import Header from './Header'
import Sidebar from './Sidebar'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../notifications/Toast'
import { useLanguage } from '../../context/LanguageContext'

interface ResponsiveLayoutProps {
  children: ReactNode
}

const ResponsiveLayout: React.FC<ResponsiveLayoutProps> = ({ children }) => {
  const { user } = useAuth()
  const { currentLanguage } = useLanguage()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const { ToastContainer } = useToast()

  if (!user) {
    return null
  }

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  const closeSidebar = () => {
    setIsSidebarOpen(false)
  }

  const isRTL = currentLanguage === 'ar'

  return (
    <div className="min-h-screen bg-gray-50" dir={isRTL ? 'rtl' : 'ltr'}>
      <Header onMenuClick={toggleSidebar} />
      
      <div className="flex h-screen pt-[5rem]">
        {/* Sidebar Overlay for Mobile */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 z-10 bg-black bg-opacity-50 lg:hidden"
            onClick={closeSidebar}
          />
        )}
        
        {/* Sidebar */}
        <div className={`
          fixed inset-y-0 z-20 w-64 transform transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? 'translate-x-0' : isRTL ? 'translate-x-full' : '-translate-x-full'}
          lg:translate-x-0 lg:static lg:transform-none
          ${isRTL ? 'rtl-sidebar' : 'ltr-sidebar'}
        `}>
          <Sidebar onClose={closeSidebar} />
        </div>
        
        {/* Main Content */}
        <main className={`
          relative h-full w-full flex-1 overflow-auto transition-all duration-300
          ${isRTL ? '22rtl-main' : '22ltr-main'}
        `}>
          <div className="p-4 lg:p-6">
            <div className="max-w-8xl mx-auto">
              {children}
            </div>
          </div>
        </main>
      </div>
      
      {/* Toast Container */}
      <ToastContainer />
    </div>
  )
}

export default ResponsiveLayout
