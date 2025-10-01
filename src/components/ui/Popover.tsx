import React, { useState, useRef, useEffect } from 'react'
import { cn } from '../../lib/utils'

interface PopoverProps {
  children: React.ReactNode
  content: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
  side?: 'top' | 'bottom' | 'left' | 'right'
  align?: 'start' | 'center' | 'end'
  className?: string
}

const Popover: React.FC<PopoverProps> = ({
  children,
  content,
  open: controlledOpen,
  onOpenChange,
  side = 'bottom',
  align = 'end',
  className
}) => {
  const [internalOpen, setInternalOpen] = useState(false)
  const triggerRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  const isOpen = controlledOpen !== undefined ? controlledOpen : internalOpen

  const handleOpenChange = (newOpen: boolean) => {
    if (onOpenChange) {
      onOpenChange(newOpen)
    } else {
      setInternalOpen(newOpen)
    }
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isOpen &&
        triggerRef.current &&
        contentRef.current &&
        !triggerRef.current.contains(event.target as Node) &&
        !contentRef.current.contains(event.target as Node)
      ) {
        handleOpenChange(false)
      }
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        handleOpenChange(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('keydown', handleEscape)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, handleOpenChange])

  const getPositionClasses = () => {
    const sideClasses = {
      top: 'bottom-full mb-2',
      bottom: 'top-full mt-2',
      left: 'right-full mr-2',
      right: 'left-full ml-2'
    }

    const alignClasses = {
      start: side === 'top' || side === 'bottom' ? 'left-0' : 'top-0',
      center: side === 'top' || side === 'bottom' ? 'left-1/2 -translate-x-1/2' : 'top-1/2 -translate-y-1/2',
      end: side === 'top' || side === 'bottom' ? 'right-0' : 'bottom-0'
    }

    return `${sideClasses[side]} ${alignClasses[align]}`
  }

  return (
    <div className="relative inline-block">
      <div ref={triggerRef}>
        {children}
      </div>
      
      {isOpen && (
        <div
          ref={contentRef}
          className={cn(
            'absolute z-[9999] w-80 bg-white rounded-lg shadow-xl border border-gray-200 p-4',
            getPositionClasses(),
            className
          )}
          style={{ zIndex: 9999 }}
        >
          {console.log('Rendering popover content:', content)}
          {content}
        </div>
      )}
    </div>
  )
}

export default Popover
