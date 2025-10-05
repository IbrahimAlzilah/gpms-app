import React from 'react'
import { cn } from '../../lib/utils'
import Button from '../ui/Button'

interface SubMenuProps {
    items: {
        key: string
        label: string
        icon?: React.ReactNode
        count?: number // Optional count badge
    }[]
    activeKey: string
    onChange: (key: string) => void
    orientation?: 'vertical' | 'horizontal' // Default: vertical
    size?: 'sm' | 'md' | 'lg' // Default: md
    className?: string
    fullWidth?: boolean // Default: false
    showDividers?: boolean // Default: true
}

const SubMenu: React.FC<SubMenuProps> = ({
    items,
    activeKey,
    onChange,
    orientation = 'vertical',
    size = 'md',
    className,
    fullWidth = false,
    showDividers = true
}) => {
    const sizeClasses = {
        sm: {
            padding: 'px-2 py-1.5',
            text: 'text-sm',
            icon: 'w-4 h-4',
            gap: 'gap-2'
        },
        md: {
            padding: 'px-3 py-2',
            text: 'text-sm',
            icon: 'w-5 h-5',
            gap: 'gap-2'
        },
        lg: {
            padding: 'px-4 py-3',
            text: 'text-base',
            icon: 'w-6 h-6',
            gap: 'gap-3'
        }
    }

    const currentSize = sizeClasses[size]

    return (
        <div className={cn(
            'flex',
            orientation === 'vertical' ? 'flex-col' : 'flex-row overflow-x-auto',
            orientation === 'vertical' && 'space-y-1',
            orientation === 'horizontal' && 'space-x-1 rtl:space-x-reverse',
            className
        )}>
            {items.map((item, index) => {
                const isActive = activeKey === item.key

                return (
                    <React.Fragment key={item.key}>
                        <Button
                            variant={isActive ? 'default' : 'ghost'}
                            size="sm"
                            onClick={() => onChange(item.key)}
                            className={cn(
                                'flex items-center justify-start transition-all duration-200',
                                currentSize.gap,
                                currentSize.padding,
                                currentSize.text,
                                fullWidth && 'w-full',
                                isActive ? 'bg-gpms-dark text-white shadow-sm' : 'hover:bg-gray-100',
                                orientation === 'horizontal' && 'whitespace-nowrap flex-shrink-0'
                            )}
                            title={item.label}
                        >
                            {/* Icon */}
                            {item.icon && (
                                <span className={cn(currentSize.icon, 'flex-shrink-0')}>
                                    {item.icon}
                                </span>
                            )}

                            {/* Label */}
                            <span className={cn(
                                'flex-1 text-right rtl:text-left',
                                orientation === 'horizontal' && 'hidden md:block'
                            )}>
                                {item.label}
                            </span>

                            {/* Count Badge */}
                            {item.count !== undefined && item.count > 0 && (
                                <span className={cn(
                                    'flex items-center justify-center min-w-[20px] h-5 px-1 text-xs font-medium rounded-full transition-colors',
                                    isActive ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-600'
                                )}>
                                    {item.count > 99 ? '99+' : item.count}
                                </span>
                            )}
                        </Button>

                        {/* Divider */}
                        {showDividers && index < items.length - 1 && (
                            <div className={cn(
                                'bg-gray-200',
                                orientation === 'vertical' ? 'h-px w-full' : 'w-px h-8'
                            )} />
                        )}
                    </React.Fragment>
                )
            })}</div>
    )
}

export default SubMenu
