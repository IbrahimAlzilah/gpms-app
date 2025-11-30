import React from 'react'
import { NavLink } from 'react-router-dom'
import { cn } from '../../lib/utils'
import { ChevronDown, ChevronRight } from 'lucide-react'

export interface SubMenuItem {
    key: string
    label: string
    icon: React.ReactElement
    route: string
}

export interface SubMenuProps {
    items: SubMenuItem[]
    isOpen: boolean
    onToggle: () => void
    onItemClick: () => void
    isActive: boolean
    collapsed: boolean
    isRTL: boolean
    icon: React.ComponentType<{ size?: number; className?: string }>
    title: string
    subMenuKey?: string
}

const SubMenu: React.FC<SubMenuProps> = ({
    items,
    isOpen,
    onToggle,
    onItemClick,
    isActive,
    collapsed,
    isRTL,
    icon: Icon,
    title,
}) => {
    return (
        <div className="relative">
            {/* Main Menu Button */}
            <button
                onClick={onToggle}
                title={collapsed ? title : undefined}
                className={cn(
                    'group flex items-center w-full px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 relative overflow-hidden',
                    isActive && !isOpen
                        ? 'bg-gpms-dark/10 text-gpms-dark dark:text-white dark:bg-gpms-dark/20'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800/50 dark:hover:text-gray-100',
                    collapsed ? 'justify-center' : ''
                )}
            >
                <Icon
                    size={20}
                    className={cn(
                        "flex-shrink-0 transition-transform duration-200",
                        !collapsed && (isRTL ? "ml-3" : "mr-3"),
                        collapsed && "group-hover:scale-110",
                        isActive && "text-gpms-dark dark:text-gpms-primary"
                    )}
                />

                {!collapsed && (
                    <>
                        <span className="truncate flex-1 text-start">{title}</span>
                        <div className={cn(
                            'transition-transform duration-300 ease-in-out text-gray-400',
                            isOpen ? 'rotate-180' : 'rotate-0'
                        )}>
                            <ChevronDown size={16} />
                        </div>
                    </>
                )}

                {/* Active Indicator (Left Border) */}
                {isActive && !collapsed && (
                    <div className="absolute inset-y-0 left-0 w-1 bg-gpms-dark rounded-r-full opacity-0 group-hover:opacity-100 transition-opacity" />
                )}
            </button>

            {/* Sub Menu Items */}
            {!collapsed && (
                <div className={cn(
                    'grid transition-all duration-300 ease-in-out',
                    isOpen ? 'grid-rows-[1fr] opacity-100 mt-1' : 'grid-rows-[0fr] opacity-0'
                )}>
                    <div className="overflow-hidden">
                        <div className="space-y-1 pl-10 pr-2 rtl:pr-10 rtl:pl-2 border-l-2 border-gray-100 rtl:border-l-0 rtl:border-r-2 rtl:border-gray-100 dark:border-gray-800 ml-4 rtl:mr-4 rtl:ml-0">
                            {items.map((item) => (
                                <NavLink
                                    key={item.key}
                                    to={item.route}
                                    onClick={onItemClick}
                                    className={({ isActive: itemIsActive }) =>
                                        cn(
                                            'flex items-center px-3 py-2 text-sm rounded-md transition-all duration-200 group/item',
                                            itemIsActive
                                                ? 'bg-gpms-primary/10 text-gpms-primary font-medium'
                                                : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-800/50'
                                        )
                                    }
                                >
                                    <span className="truncate">{item.label}</span>
                                </NavLink>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default React.memo(SubMenu)
