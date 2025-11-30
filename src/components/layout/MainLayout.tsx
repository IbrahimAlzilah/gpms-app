import { ReactNode, useEffect, useMemo, useState } from 'react'
import Header from './Header'
import Sidebar from './Sidebar'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../notifications/Toast'
import { useLanguage } from '../../context/LanguageContext'
import { cn } from '../../lib/utils'

const MainLayout = ({ children }: { children: ReactNode }) => {
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

  // Responsive breakpoint tracking
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

  const handleMenuClick = () => {
    if (isMobile) {
      setIsDrawerOpen(true)
    } else {
      setIsCollapsed(!isCollapsed)
    }
  }

  const closeDrawer = () => setIsDrawerOpen(false)

  return (
    <div className="flex h-screen w-full overflow-hidden bg-gray-50 dark:bg-gray-900">
      {/* Sidebar Backdrop (Mobile) */}
      {isMobile && isDrawerOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity lg:hidden"
          onClick={closeDrawer}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 z-50 flex flex-col border-r border-gray-200 bg-white shadow-sm transition-all duration-300 ease-in-out dark:border-gray-800 dark:bg-gray-950 lg:static',
          isMobile 
            ? (isDrawerOpen ? (isRTL ? 'right-0' : 'left-0') : (isRTL ? '-right-full' : '-left-full'))
            : (isCollapsed ? 'w-20' : 'w-64'),
          isMobile && 'w-64'
        )}
      >
        <Sidebar 
          collapsed={isMobile ? false : isCollapsed}
          onToggle={isMobile ? closeDrawer : () => setIsCollapsed(!isCollapsed)}
          onClose={isMobile ? closeDrawer : undefined}
        />
      </aside>

      {/* Main Content Wrapper */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header 
          onMenuClick={handleMenuClick} 
          sidebarWidth={0} // Not needed with flex layout
        />

        {/* Scrollable Content Area */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 lg:p-6 scroll-smooth">
          <div className="mx-auto max-w-7xl animate-in fade-in slide-in-from-bottom-4 duration-500">
            {children}
          </div>
        </main>
      </div>

      <ToastContainer />
    </div>
  )
}

export default MainLayout
