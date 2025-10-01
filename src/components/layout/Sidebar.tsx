import React, { useMemo } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useLanguage } from '../../context/LanguageContext'
import { cn } from '../../lib/utils'
import {
  LayoutDashboard,
  FolderOpen,
  FileText,
  Send,
  Upload,
  Users,
  Calendar,
  BarChart3,
  Award,
  Shield,
  FileCheck,
  UserPlus,
  FileBarChart,
  Megaphone,
  UserCheck,
  ChevronsLeft,
  ChevronsRight,
  X
} from 'lucide-react'

export interface SidebarProps {
  onClose?: () => void
  collapsed?: boolean
  onToggle?: () => void
}

const Sidebar: React.FC<SidebarProps> = ({ onClose, collapsed = false, onToggle }) => {
  const { user } = useAuth()
  const { t, currentLanguage } = useLanguage()
  const location = useLocation()

  const isRTL = useMemo(() => currentLanguage === 'ar', [currentLanguage])

  const getNavigationItems = () => {
    if (!user) return []

    const baseItems = [
      {
        name: t('common.dashboard'),
        href: '/dashboard',
        icon: LayoutDashboard
      }
    ]

    switch (user.role) {
      case 'student':
        return [
          ...baseItems,
          {
            name: t('navigation.projects'),
            href: '/projects',
            icon: FolderOpen
          },
          {
            name: t('navigation.proposals'),
            href: '/proposals',
            icon: FileText
          },
          {
            name: t('navigation.requests'),
            href: '/requests',
            icon: Send
          },
          {
            name: t('navigation.documents'),
            href: '/documents',
            icon: Upload
          },
          {
            name: 'إدارة المجموعة',
            href: '/group-management',
            icon: UserPlus
          },
          {
            name: t('navigation.grades'),
            href: '/grades',
            icon: Award
          }
        ]

      case 'supervisor':
        return [
          ...baseItems,
          {
            name: t('navigation.list') + ' ' + t('navigation.projects'),
            href: '/projects',
            icon: FolderOpen
          },
          {
            name: t('navigation.proposals'),
            href: '/proposals',
            icon: FileText
          },
          {
            name: t('navigation.requests'),
            href: '/requests',
            icon: Send
          },
          {
            name: t('navigation.documents'),
            href: '/supervisor/documents',
            icon: FileCheck
          },
          {
            name: t('navigation.grades'),
            href: '/supervisor/grades',
            icon: Award
          }
        ]

      case 'committee':
        return [
          ...baseItems,
          {
            name: t('navigation.proposals'),
            href: '/proposals',
            icon: FileText
          },
          {
            name: t('navigation.projects'),
            href: '/projects',
            icon: FolderOpen
          },
          {
            name: t('navigation.schedules'),
            href: '/schedules',
            icon: Calendar
          },
          {
            name: 'إعلان الفترات',
            href: '/announcements',
            icon: Megaphone
          },
          {
            name: 'توزيع اللجان',
            href: '/distribution',
            icon: UserCheck
          },
          {
            name: 'إصدار التقارير',
            href: '/committee-reports',
            icon: FileBarChart
          }
        ]

      case 'discussion':
        return [
          ...baseItems,
          {
            name: t('navigation.projects'),
            href: '/projects',
            icon: FolderOpen
          },
          {
            name: t('navigation.evaluations'),
            href: '/evaluations',
            icon: Award
          }
        ]

      case 'admin':
        return [
          ...baseItems,
          {
            name: t('navigation.users'),
            href: '/users',
            icon: Users
          },
          {
            name: t('navigation.reports'),
            href: '/reports',
            icon: BarChart3
          },
          {
            name: t('navigation.permissions'),
            href: '/permissions',
            icon: Shield
          }
        ]

      default:
        return baseItems
    }
  }

  const navigationItems = getNavigationItems()

  const handleNavClick = () => {
    if (onClose) {
      onClose()
    }
  }

  const renderItem = (item: { name: string; href: string; icon: any }) => {
    const Icon = item.icon
    const isActive = location.pathname === item.href || 
      (item.href !== '/dashboard' && location.pathname.startsWith(item.href))

    return (
      <NavLink
        key={item.name}
        to={item.href}
        onClick={handleNavClick}
        title={collapsed ? item.name : undefined}
        className={cn(
          'flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors',
          isActive
            ? 'bg-gpms-dark text-white'
            : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900',
          collapsed ? 'justify-center' : ''
        )}
      >
        <Icon size={20} className={`${!collapsed ? 'mr-3 rtl:ml-3 rtl:mr-0' : ''}`} />
        {!collapsed && <span className="truncate">{item.name}</span>}
      </NavLink>
    )
  }

  return (
    <>
    <aside
      className="h-full w-inherit bg-white border-gray-200 shadow-sm flex flex-col"
      style={{ width: collapsed ? 80 : 256 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-[0.875rem] min-h-[4.3rem] border-b border-gray-100">
        <div className="flex items-center space-x-3 rtl:space-x-reverse">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center">
            <img src='./logo.png' alt='Logo' />
          </div>
          {!collapsed && (
            <div>
              <h1 className="text-xl font-bold text-gray-900" style={{lineHeight: 1}}>GPMS</h1>
              <p className="text-sm text-gray-500">نظام إدارة مشاريع التخرج</p>
            </div>
            )}
        </div>
        {onToggle && (
          <button
            onClick={onToggle}
            className="p-2 rounded hover:bg-gray-100"
            title={collapsed ? 'Expand' : 'Collapse'}
          >
            {collapsed ? (
              isRTL ? <ChevronsRight size={18} /> : <ChevronsLeft size={18} />
            ) : (
              isRTL ? <ChevronsLeft size={18} /> : <ChevronsRight size={18} />
            )}
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-2 overflow-y-auto">
        {navigationItems.map((item) => renderItem(item))}
      </nav>
    </aside>
    </>
  )
}

export default Sidebar
