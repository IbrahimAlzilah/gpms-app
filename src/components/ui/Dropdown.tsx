import React, { useState } from 'react'
import { cn } from '../../lib/utils'
import { ChevronDown, ChevronUp } from 'lucide-react'

interface DropdownProps {
  trigger: React.ReactNode
  children: React.ReactNode
  className?: string
  align?: 'left' | 'right'
}

const Dropdown: React.FC<DropdownProps> = ({
  trigger,
  children,
  className,
  align = 'left'
}) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-1 rtl:space-x-reverse"
      >
        {trigger}
        {isOpen ? (
          <ChevronUp size={16} className="text-gray-400" />
        ) : (
          <ChevronDown size={16} className="text-gray-400" />
        )}
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div
            className={cn(
              'absolute z-20 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 py-1',
              align === 'right' ? 'right-0' : 'left-0',
              className
            )}
          >
            {children}
          </div>
        </>
      )}
    </div>
  )
}

const DropdownItem: React.FC<{
  children: React.ReactNode
  onClick?: () => void
  className?: string
}> = ({ children, onClick, className }) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors',
        className
      )}
    >
      {children}
    </button>
  )
}

export { Dropdown, DropdownItem }
