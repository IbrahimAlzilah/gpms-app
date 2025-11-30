import { useMemo, useState, useEffect } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
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

// Types
interface NavigationItem {
  name?: string;
  nameKey?: string;
  href: string;
  icon: React.ComponentType<any>;
  hasSubMenu?: boolean;
  subMenuItems?: Array<{ key: string; label?: string; labelKey?: string; icon: React.ReactElement; route: string }>;
  key?: string
}

interface SubMenuStates {
  [key: string]: boolean
}

const Sidebar = ({ onClose, collapsed = false, onToggle }: SidebarProps) => {
  const { user } = useAuth()
  const { t, currentLanguage } = useLanguage()
  const location = useLocation()

  const [subMenuStates, setSubMenuStates] = useState<SubMenuStates>({})
  const isRTL = useMemo(() => currentLanguage === 'ar', [currentLanguage])

  // Sync collapse state
  useEffect(() => {
    try {
      localStorage.setItem('sidebar:collapsed', collapsed ? '1' : '0')
    } catch { }
  }, [collapsed])

  // Restore submenu states
  useEffect(() => {
    try {
      const raw = localStorage.getItem('sidebar:submenus')
      if (raw) {
        setSubMenuStates(JSON.parse(raw) as SubMenuStates)
      }
    } catch { }
  }, [])

  // Prepare navigation items
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

  // Handlers
  const handleNavClick = () => {
    // Close submenus on nav click if desired, or keep them open. 
    // Usually better to keep them open unless it's mobile.
    if (window.innerWidth < 1024) {
      onClose?.()
    }
  }

  const toggleSubMenu = (key: string) => {
    setSubMenuStates(prev => {
      const next = { ...prev, [key]: !prev[key] }
      try { localStorage.setItem('sidebar:submenus', JSON.stringify(next)) } catch { }
      return next
    })
  }

  return (
    <div className="flex h-full flex-col bg-white dark:bg-gray-950">
      {/* Header Section */}
      <div className={cn(
        "flex items-center h-16 px-4 border-b border-gray-100 dark:border-gray-800 transition-all duration-300",
        collapsed ? "justify-center" : "justify-between"
      )}>
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gpms-primary/10 flex items-center justify-center text-gpms-primary">
            {/* Use a logo icon or image here */}
            <img src="/logo.png" alt="GPMS" className="w-8 h-8 object-contain" />
          </div>

          {!collapsed && (
            <div className="flex flex-col animate-in fade-in duration-300">
              <span className="text-lg font-bold text-gray-900 dark:text-gray-100 leading-none tracking-tight">
                GPMS
              </span>
              <span className="text-[10px] text-gray-500 dark:text-gray-400 font-medium truncate max-w-[120px]">
                {t('app.subtitle')}
              </span>
            </div>
          )}
        </div>

        {!collapsed && onToggle && (
          <button
            onClick={onToggle}
            className="p-1.5 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors lg:flex hidden"
          >
            {isRTL ? <ChevronsRight size={18} /> : <ChevronsLeft size={18} />}
          </button>
        )}
      </div>

      {/* Navigation Section */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1 custom-scrollbar">
        {navigationItems.map((item) => {
          const Icon = item.icon
          const isActive = location.pathname === item.href ||
            (item.href !== '/dashboard' && location.pathname.startsWith(item.href))

          if (item.hasSubMenu) {
            const subMenuKey = (item as any).key || item.href
            return (
              <SubMenu
                key={item.name}
                items={(item.subMenuItems || []).map(s => ({ key: s.key, label: s.label || '', icon: s.icon, route: s.route }))}
                isOpen={subMenuStates[subMenuKey] || false}
                onToggle={() => toggleSubMenu(subMenuKey)}
                onItemClick={handleNavClick}
                isActive={isActive} // Parent is active if child is active? Logic might need check
                collapsed={collapsed}
                isRTL={isRTL}
                icon={Icon}
                title={item.name as string}
              />
            )
          }

          return (
            <NavLink
              key={item.name}
              to={item.href}
              onClick={handleNavClick}
              title={collapsed ? item.name : undefined}
              className={({ isActive }) => cn(
                'group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 relative overflow-hidden',
                isActive
                  ? 'bg-gpms-dark text-white shadow-md shadow-gpms-dark/20'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800/50 dark:hover:text-gray-100',
                collapsed ? 'justify-center' : ''
              )}
            >
              <Icon
                size={20}
                className={cn(
                  "flex-shrink-0 transition-transform duration-200",
                  !collapsed && (isRTL ? "ml-3" : "mr-3"),
                  collapsed && "group-hover:scale-110"
                )}
              />

              {!collapsed && (
                <span className="truncate flex-1">{item.name}</span>
              )}

              {/* Active Indicator for collapsed state */}
              {collapsed && isActive && (
                <div className="absolute inset-y-0 left-0 w-1 bg-white/20 rounded-r-full" />
              )}
            </NavLink>
          )
        })}
      </nav>

      {/* Footer / User Info (Optional) */}
      <div className="p-4 border-t border-gray-100 dark:border-gray-800">
        {/* Could put user profile summary here if not in header */}
        {onToggle && collapsed && (
          <button
            onClick={onToggle}
            className="w-full flex justify-center p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 transition-colors"
          >
            {isRTL ? <ChevronsLeft size={20} /> : <ChevronsRight size={20} />}
          </button>
        )}
      </div>
    </div>
  )
}

export default Sidebar