import React, { ReactNode, useEffect, useMemo, useState } from 'react'
import Header from './Header'
import Sidebar from './Sidebar'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../notifications/Toast'
import { useLanguage } from '../../context/LanguageContext'
import { cn } from '../../lib/utils'

interface MainLayoutProps {
  children: ReactNode
}

const EXPANDED_WIDTH = 256 // 64 tailwind
const COLLAPSED_WIDTH = 80

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { user } = useAuth()
  const { currentLanguage } = useLanguage()
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false)
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false)
  const [isMobile, setIsMobile] = useState<boolean>(false)
  const { ToastContainer } = useToast()

  const isRTL = useMemo(() => currentLanguage === 'ar', [currentLanguage])

  // Persisted sidebar collapse state (desktop)
  useEffect(() => {
    const saved = localStorage.getItem('gpms:sidebar-collapsed')
    if (saved !== null) {
      setIsCollapsed(saved === '1')
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('gpms:sidebar-collapsed', isCollapsed ? '1' : '0')
  }, [isCollapsed])

  // Responsive breakpoint tracking (match Tailwind lg: 1024px)
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 1023.5px)')
    const update = () => setIsMobile(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (isDrawerOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
  }, [isDrawerOpen])

  if (!user) {
    return null
  }

  const sidebarWidth = isCollapsed ? COLLAPSED_WIDTH : EXPANDED_WIDTH

  const handleMenuClick = () => {
    if (isMobile) {
      setIsDrawerOpen(true)
    } else {
      setIsCollapsed(!isCollapsed)
    }
  }

  const closeDrawer = () => setIsDrawerOpen(false)

  return (
    <div className="min-h-screen relative flex flex-row flex-1 h-full w-full bg-gray-50">
      {/* 1. Sidebar (Desktop sticky / Mobile fixed Drawer) */}
      <div
        className={cn(
          'lg:block fixed lg:sticky inset-y-0 start-0 z-[200] bg-white border-gray-200 transition-all duration-300 ease-in-out shadow-sm',
          isMobile && isDrawerOpen ? 'translate-x-0' : (isMobile ? 'invisible translate-x-[-100%]' : '') // Ensure mobile drawer visibility logic is correct
        )}
        style={{
          blockSize: '100dvh',
          width: isMobile ? EXPANDED_WIDTH : sidebarWidth,
          // Mobile drawer state
          transform: isMobile ? (isDrawerOpen ? 'translateX(0)' : `translateX(${isRTL ? '100%' : '-100%'})`) : undefined,
        }}
      >
        <Sidebar collapsed={isMobile ? false : isCollapsed}
          onToggle={isMobile ? closeDrawer : () => setIsCollapsed(!isCollapsed)}
        />
      </div>

      {/* 2. Mobile Drawer Overlay (Only visible on Mobile when drawer is open) */}
      {isMobile && isDrawerOpen && (
        <div className="fixed inset-0 z-[150] bg-black/40 lg:hidden" onClick={closeDrawer} />
      )}

      {/* 3. Main content */}
      <div className="min-h-screen relative flex flex-col flex-auto h-full max-w-full">
        {/* Header */}
        <Header onMenuClick={handleMenuClick} sidebarWidth={isMobile ? 0 : sidebarWidth} />

        {/* Page Content */}
        <main className="transition-width relative h-full w-full flex-1 overflow-auto p-4 lg:p-6">
          <div className="max-w-8xl mx-auto">
            {children}
          </div>
        </main>
      </div>

      <ToastContainer />
    </div>
  )
}

export default MainLayout
