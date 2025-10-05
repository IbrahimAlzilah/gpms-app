import React, { useMemo, useState, useEffect } from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useLanguage } from '../../context/LanguageContext'
import { cn } from '../../lib/utils'
import SubMenu from '../ui/SubMenu'
import { ChevronsLeft, ChevronsRight } from 'lucide-react'
import { baseNavigation, roleNavigation } from '../../config/navigation.config'

export interface SidebarProps {
  onClose?: () => void
  collapsed?: boolean
  onToggle?: () => void
}

// تعريف أنواع البيانات للعناصر والمصطلحات الوظيفية
interface NavigationItem { name?: string; nameKey?: string; href: string; icon: React.ComponentType<any>; hasSubMenu?: boolean; subMenuItems?: Array<{ key: string; label?: string; labelKey?: string; icon: React.ReactElement; route: string }>; key?: string }

interface SubMenuStates {
  [key: string]: boolean
}

const Sidebar: React.FC<SidebarProps> = ({ onClose, collapsed = false, onToggle }) => {
  const { user } = useAuth()
  const { t, currentLanguage } = useLanguage()
  const location = useLocation()
  const navigate = useNavigate()

  // إدارة حالة جميع الـ SubMenus بشكل ديناميكي
  const [subMenuStates, setSubMenuStates] = useState<SubMenuStates>({})
  const isRTL = useMemo(() => currentLanguage === 'ar', [currentLanguage])

  // مزامنة حالة الطي مع localStorage
  useEffect(() => {
    try {
      localStorage.setItem('sidebar:collapsed', collapsed ? '1' : '0')
    } catch {}
  }, [collapsed])

  useEffect(() => {
    try {
      const stored = localStorage.getItem('sidebar:collapsed')
      const storedCollapsed = stored === '1'
      if (onToggle && typeof stored === 'string' && storedCollapsed !== collapsed) {
        onToggle()
      }
    } catch {}
    // نجري هذه المزامنة مرة واحدة عند التحميل
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // تحديث حالة SubMenus بناءً على المسار الحالي
  useEffect(() => {
    const newStates: SubMenuStates = {}

    if (user?.role === 'student' && location.pathname.includes('/student/proposals')) {
      newStates.proposals = true
    }

    setSubMenuStates(newStates)
  }, [location.pathname, user?.role])

  // تعريف عناصر التنقل بشكل محسن ومنظم
  const navigationItems = useMemo((): NavigationItem[] => {
    if (!user) return []
    const mapWithI18n = (items: NavigationItem[]) => items.map((item) => ({
      ...item,
      name: (item as any).nameKey ? t((item as any).nameKey) : item.name,
      subMenuItems: item.subMenuItems?.map(sub => ({ ...sub, label: (sub as any).labelKey ? t((sub as any).labelKey) : sub.label }))
    }))

    return [
      ...mapWithI18n(baseNavigation as any),
      ...mapWithI18n((roleNavigation as any)[user.role] || [])
    ]
  }, [user, t])

  // معالجات الأحداث - مُحسنة ومنظمة
  const handleNavClick = useMemo(() => {
    return () => {
      // إغلاق جميع الـ SubMenus عند الانتقال لصفحة أخرى
      setSubMenuStates({})
      onClose?.()
    }
  }, [onClose])

  const handleSubMenuClick = useMemo(() => {
    return () => {
      onClose?.()
    }
  }, [onClose])

  const createSubMenuToggleHandler = useMemo(() => {
    return (subMenuKey: string) => {
      return () => {
        const isCurrentlyActive = location.pathname.includes('/student/proposals')

        if (isCurrentlyActive) {
          setSubMenuStates(prev => ({
            ...prev,
            [subMenuKey]: !prev[subMenuKey]
          }))
        } else {
          // التنقل للعنصر الأول في الـ SubMenu إذا لم نكن في الصفحة النشطة
          const firstItem = navigationItems.find(item => (item as any).key === subMenuKey)?.subMenuItems?.[0]
          if (firstItem) {
            navigate(firstItem.route)
          }
        }
      }
    }
  }, [location.pathname, navigate, navigationItems])

  // رندر عنصر القائمة مع تحسينات للأداء
  const renderNavigationItem = useMemo(() => {
    return (item: NavigationItem) => {
      const Icon = item.icon
      const isActive = location.pathname === item.href ||
        (item.href !== '/dashboard' && location.pathname.startsWith(item.href))

      // التعامل مع العناصر التي لها SubMenu
      if (item.hasSubMenu && user?.role === 'student') {
        const subMenuKey = (item as any).key || 'proposals'
        const isSubMenuActive = location.pathname.includes('/student/proposals')
        const isSubMenuOpen = subMenuStates[subMenuKey] || false

        return (
          <SubMenu
            key={item.name}
            items={(item.subMenuItems || []).map(s => ({ key: s.key, label: s.label || '', icon: s.icon, route: s.route }))}
            isOpen={isSubMenuOpen}
            onToggle={createSubMenuToggleHandler(subMenuKey)}
            onItemClick={handleSubMenuClick}
            isActive={isSubMenuActive}
            collapsed={collapsed}
            isRTL={isRTL}
            icon={Icon}
            title={item.name as string}
          />
        )
      }

      // العناصر العادية
      return (
        <NavLink
          key={item.name}
          to={item.href}
          onClick={handleNavClick}
          title={collapsed ? item.name : undefined}
          className={cn(
            'flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors',
            isActive ? 'bg-gpms-dark text-white' : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900',
            collapsed ? 'justify-center' : ''
          )}
        >
          <Icon size={20} className={!collapsed ? 'mr-3 rtl:ml-3 rtl:mr-0' : ''} />
          {!collapsed && <span className="truncate">{item.name}</span>}
        </NavLink>
      )
    }
  }, [navigationItems, handleNavClick, handleSubMenuClick, createSubMenuToggleHandler, collapsed, isRTL, user?.role, subMenuStates, location.pathname])

  return (
    <aside
      className="h-full w-inherit bg-white border-gray-200 shadow-sm flex flex-col"
      style={{ width: collapsed ? 80 : 256 }}
    >
      {/* Header Section */}
      <header className="flex items-center justify-between px-3 py-[0.875rem] min-h-[4.3rem] border-b border-gray-100">
        <div className="flex items-center space-x-3 rtl:space-x-reverse">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center">
            <img src='./logo.png' alt='Logo' />
          </div>
          {!collapsed && (
            <div>
              <h1 className="text-xl font-bold text-gray-900" style={{ lineHeight: 1 }}>
                GPMS
              </h1>
              <p className="text-sm text-gray-500">
                نظام إدارة مشاريع التخرج
              </p>
            </div>
          )}
        </div>

        {onToggle && (
          <button
            onClick={onToggle}
            className="p-2 rounded hover:bg-gray-100 transition-colors"
            title={collapsed ? 'Expand' : 'Collapse'}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? (
              isRTL ? <ChevronsRight size={18} /> : <ChevronsLeft size={18} />
            ) : (
              isRTL ? <ChevronsLeft size={18} /> : <ChevronsRight size={18} />
            )}
          </button>
        )}
      </header>

      {/* Navigation Section */}
      <nav className="flex-1 p-3 space-y-2 overflow-y-auto">
        {navigationItems.map(renderNavigationItem)}
      </nav>
    </aside>
  )
}

export default Sidebar