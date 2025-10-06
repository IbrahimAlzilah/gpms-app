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
    const handleToggle = () => {
        // Only toggle open/close. Do NOT navigate automatically.
        onToggle()
    }

    return (
        <div>
            {/* Main Menu Button */}
            <button
                onClick={handleToggle}
                title={collapsed ? title : undefined}
                className={cn(
                    'flex items-center px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 w-full group relative',
                    isActive ? 'bg-gpms-dark text-white shadow-sm' : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900',
                    collapsed ? 'justify-center' : ''
                )}
            >
                <Icon size={20} className={!collapsed ? 'mr-3 rtl:ml-3 rtl:mr-0' : ''} />

                {!collapsed && (
                    <>
                        <span className="truncate flex-1 text-start">{title}</span>
                        <div className={cn(
                            'transition-transform duration-300 ease-in-out',
                            isOpen ? 'rotate-90' : 'rotate-0'
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

            {/* Sub Menu Items */}
            {!collapsed && (
                <div className={cn(
                    'overflow-hidden transition-all duration-300 ease-in-out',
                    isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                )}>
                    <div className="mt-2 mr-8 rtl:ml-8 rtl:mr-0 space-y-1">
                        {items.map((item) => (
                            <NavLink
                                key={item.key}
                                to={item.route}
                                onClick={onItemClick}
                                className={({ isActive: itemIsActive }) =>
                                    cn(
                                        'w-full flex items-center px-4 py-2 text-sm rounded-md transition-all duration-200 group hover:bg-gray-100 hover:text-gray-900',
                                        itemIsActive ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-500 rtl:border-l-2 rtl:border-r-0' : 'text-gray-600'
                                    )
                                }
                            >
                                <span className="mr-3 rtl:ml-3 rtl:mr-0 text-gray-400 group-hover:text-gray-600 transition-colors">
                                    {item.icon}
                                </span>
                                <span className="flex-1 text-start font-medium">{item.label}</span>
                            </NavLink>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}

export default React.memo(SubMenu)
