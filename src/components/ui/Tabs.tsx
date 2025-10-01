import React from 'react'
import { cn } from '../../lib/utils'

interface TabsProps {
  children: React.ReactNode
  defaultValue?: string
  className?: string
}

interface TabListProps {
  children: React.ReactNode
  className?: string
}

interface TabProps {
  value: string
  children: React.ReactNode
  isActive?: boolean
  onClick?: () => void
  className?: string
}

interface TabContentProps {
  value: string
  children: React.ReactNode
  isActive?: boolean
  className?: string
}

const Tabs: React.FC<TabsProps> = ({ children, defaultValue, className }) => {
  return (
    <div className={cn('w-full', className)}>
      {children}
    </div>
  )
}

const TabList: React.FC<TabListProps> = ({ children, className }) => {
  return (
    <div className={cn('flex space-x-1 rtl:space-x-reverse border-b border-gray-200', className)}>
      {children}
    </div>
  )
}

const Tab: React.FC<TabProps> = ({ 
  value, 
  children, 
  isActive = false, 
  onClick, 
  className 
}) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        'px-4 py-2 text-sm font-medium border-b-2 transition-colors',
        isActive
          ? 'border-gpms-dark text-gpms-dark'
          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
        className
      )}
    >
      {children}
    </button>
  )
}

const TabContent: React.FC<TabContentProps> = ({ 
  value, 
  children, 
  isActive = false, 
  className 
}) => {
  if (!isActive) return null
  
  return (
    <div className={cn('mt-4', className)}>
      {children}
    </div>
  )
}

export { Tabs, TabList, Tab, TabContent }
