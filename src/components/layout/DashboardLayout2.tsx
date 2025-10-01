import React, { ReactNode, useEffect, useMemo, useState } from 'react'
import Header from './Header'
import Sidebar from './Sidebar'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../notifications/Toast'
import { useLanguage } from '../../context/LanguageContext'

interface DashboardLayoutProps {
  children: ReactNode
}

const EXPANDED_WIDTH = 256 // 64 tailwind
const COLLAPSED_WIDTH = 80
const HEADER_HEIGHT_REM = 4.3 // header height

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
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
  const logicalStart = isRTL ? 'right' : 'left'

  const handleMenuClick = () => {
    if (isMobile) {
      setIsDrawerOpen(true)
    } else {
      setIsCollapsed(!isCollapsed)
    }
  }

  const closeDrawer = () => setIsDrawerOpen(false)

  return (
    // <div className="min-h-screen bg-gray-50" dir={isRTL ? 'rtl' : 'ltr'}>
    <div className="min-h-screen relative flex flex-row flex-1 h-full w-full bg-gray-50">
      {/* Desktop sidebar (fixed) */}
      <div
        // className={`hidden lg:block 1fixed sticky ${isRTL ? 'right-0' : 'left-0'} z-[50] bg-white border-gray-200 shadow-sm`}
        className={`hidden lg:block 1fixed sticky start-0 z-[50] bg-white border-gray-200 shadow-sm`}
        style={{ width: sidebarWidth, top: 0, bottom: 0 , blockSize: '100dvh'}}
      >
        <Sidebar collapsed={isCollapsed} onToggle={() => setIsCollapsed(!isCollapsed)} />
      </div>

      {/* Mobile off-canvas sidebar */}
      {isMobile && (
        <>
          {/* Overlay */}
          {isDrawerOpen && (
            <div
              className="fixed inset-0 z-[150] bg-black/40"
              onClick={closeDrawer}
            />
          )}
          {/* Drawer */}
          <div
            className={`fixed inset-y-0 ${isRTL ? 'right-0' : 'left-0'} z-[160] bg-white shadow-xl transform transition-transform duration-300 ease-in-out`}
            style={{
              width: EXPANDED_WIDTH,
              transform: isDrawerOpen ? 'translateX(0)' : `translateX(${isRTL ? '100%' : '-100%'})`
            }}
          >
            <Sidebar collapsed={false} onToggle={closeDrawer} />
          </div>
        </>
      )}

      {/* Main content: fixed container; only main scrolls */}
      <div
        style={{
        //   [logicalStart]: isMobile ? 0 : sidebarWidth,
        //   position: 'fixed',
        //   top: `${HEADER_HEIGHT_REM}rem`,
        //   bottom: 0,
        //   right: isRTL ? undefined : 0,
        //   left: isRTL ? 0 : undefined,
          // width: isMobile ? '100%' : `calc(100% - ${sidebarWidth}px)`
        }}

        className="min-h-screen relative flex flex-col flex-auto h-full max-w-full"
      >
        {/* Header */}
        <Header onMenuClick={handleMenuClick} sidebarWidth={isMobile ? 0 : sidebarWidth} />

        {/* Page Content */}
        <main className="1h-full 1w-full 1overflow-auto     transition-width relative h-full w-full flex-1 overflow-auto p-4 lg:p-6">
          {/* <div className="p-4 lg:p-6"> */}
            <div className="max-w-8xl mx-auto">
              {children}
            </div>
          {/* </div> */}
        </main>
      </div>

      <ToastContainer />
    </div>
  )
}

export default DashboardLayout
