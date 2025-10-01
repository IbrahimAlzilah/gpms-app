import React, { ReactNode, useState } from 'react'
import Header from './Header'
import Sidebar from './Sidebar'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../notifications/Toast'

interface DashboardLayoutProps {
  children: ReactNode
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { user } = useAuth()
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onMenuClick={toggleSidebar} />
      
      <div className="flex h-screen pt-[4.3rem]">
        {/* Sidebar Overlay for Mobile */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden"
            onClick={closeSidebar}
          />
        )}
        
        {/* Sidebar */}
        <div className={`
          fixed inset-y-0 left-0 z-[100] w-64 transform transition-transform duration-300 ease-in-out lg:static lg:translate-x-0
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
          <Sidebar onClose={closeSidebar} />
        </div>
        
        {/* Main Content */}
        <main className="relative h-full w-full flex-1 overflow-auto">
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

export default DashboardLayout

// New Way of Layout
// import React, { ReactNode } from 'react'
// import ResponsiveLayout from './ResponsiveLayout'

// interface DashboardLayoutProps {
//   children: ReactNode
// }

// const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
//   return <ResponsiveLayout>{children}</ResponsiveLayout>
// }

// export default DashboardLayout
