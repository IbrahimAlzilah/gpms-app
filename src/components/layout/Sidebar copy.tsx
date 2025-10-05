import React, { useMemo, useState, useEffect } from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
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
  ChevronDown,
  ChevronRight,
  FolderOpen as MyProposalsIcon,
  Users as GroupProposalsIcon,
  CheckCircle2 as ApprovedProposalsIcon
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
  const navigate = useNavigate()
  const [isProposalsSubMenuOpen, setIsProposalsSubMenuOpen] = useState(false)

  const isRTL = useMemo(() => currentLanguage === 'ar', [currentLanguage])

  // إدارة حالة SubMenu بناءً على المسار الحالي
  useEffect(() => {
    if (user?.role === 'student') {
      if (location.pathname.includes('/student/proposals')) {
        setIsProposalsSubMenuOpen(true)
      } else {
        setIsProposalsSubMenuOpen(false)
      }
    }
  }, [location.pathname, user?.role])


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
    // إغلاق SubMenu عند النقر على عنصر آخر
    setIsProposalsSubMenuOpen(false)

    if (onClose) {
      onClose()
    }
  }

  // دالة للتعامل مع النقر على عناصر SubMenu
  const handleSubMenuClick = () => {
    // نضمن أن SubMenu يبقى مفتوحاً عند النقر على عناصره
    setIsProposalsSubMenuOpen(true)

    if (onClose) {
      onClose()
    }
  }


  // دالة للتعامل مع فتح/إغلاق SubMenu المقترحات
  const handleProposalsToggle = () => {
    const isInProposals = location.pathname.includes('/student/proposals')

    if (isInProposals) {
      // إذا كنا في صفحة المقترحات، يمكن فتح/إغلاق SubMenu
      setIsProposalsSubMenuOpen(!isProposalsSubMenuOpen)
    } else {
      // إذا لم نكن في صفحة المقترحات، انتقل إلى صفحة المقترحات وافتح SubMenu
      navigate('/student/proposals/my')
    }
  }

  const renderItem = (item: { name: string; href: string; icon: any }) => {
    const Icon = item.icon
    const isActive = location.pathname === item.href ||
      (item.href !== '/dashboard' && location.pathname.startsWith(item.href))

    // معالجة خاصة لعنصر المقترحات للطلاب
    if (item.name === t('navigation.proposals') && user?.role === 'student') {
      const isProposalsActive = location.pathname.includes('/student/proposals')

      return (
        <div key={item.name}>
          <button
            onClick={handleProposalsToggle}
            title={collapsed ? item.name : undefined}
            className={cn(
              'flex items-center px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 w-full group relative',
              isProposalsActive
                ? 'bg-gpms-dark text-white shadow-sm'
                : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900',
              collapsed ? 'justify-center' : ''
            )}
          >
            <Icon size={20} className={`${!collapsed ? 'mr-3 rtl:ml-3 rtl:mr-0' : ''}`} />
            {!collapsed && (
              <>
                <span className="truncate flex-1 text-start">{item.name}</span>
                <div className={cn(
                  'transition-transform duration-300 ease-in-out',
                  isProposalsSubMenuOpen ? 'rotate-90' : 'rotate-0'
                )}>
                  {isRTL ? (
                    <ChevronRight size={16} className="mr-2 rtl:ml-2 rtl:mr-0" />
                  ) : (
                    <ChevronDown size={16} className="mr-2 rtl:ml-2 rtl:mr-0" />
                  )}
                </div>
              </>
            )}
          </button>

          {/* SubMenu للمقترحات */}
          <div className={cn(
            'overflow-hidden transition-all duration-300 ease-in-out',
            isProposalsSubMenuOpen && isProposalsActive ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0',
            !collapsed ? 'block' : 'hidden'
          )}>
            <div className="mt-2 mr-8 rtl:ml-8 rtl:mr-0 space-y-1">
              {[
                {
                  key: 'my',
                  label: 'مقترحاتي',
                  icon: <MyProposalsIcon className="w-4 h-4" />
                },
                {
                  key: 'group',
                  label: 'مقترحات مجموعتي',
                  icon: <GroupProposalsIcon className="w-4 h-4" />
                },
                {
                  key: 'approved',
                  label: 'المقترحات المعتمدة',
                  icon: <ApprovedProposalsIcon className="w-4 h-4" />
                }
              ].map((subItem) => {
                const routes = {
                  my: '/student/proposals/my',
                  group: '/student/proposals/group',
                  approved: '/student/proposals/approved'
                }
                const route = routes[subItem.key as keyof typeof routes]

                return (
                  <NavLink
                    key={subItem.key}
                    to={route}
                    onClick={handleSubMenuClick}
                    className={({ isActive }) => cn(
                      'w-full flex items-center px-4 py-2 text-sm rounded-md transition-all duration-200 group',
                      'hover:bg-gray-100 hover:text-gray-900',
                      isActive
                        ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-500 rtl:border-l-2 rtl:border-r-0'
                        : 'text-gray-600'
                    )}
                  >
                    <span className="mr-3 rtl:ml-3 rtl:mr-0 text-gray-400 group-hover:text-gray-600 transition-colors">
                      {subItem.icon}
                    </span>
                    <span className="flex-1 text-start font-medium">
                      {subItem.label}
                    </span>
                  </NavLink>
                )
              })}
            </div>
          </div>
        </div>
      )
    }

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
                <h1 className="text-xl font-bold text-gray-900" style={{ lineHeight: 1 }}>GPMS</h1>
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
