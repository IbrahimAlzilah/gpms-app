import React, { useState, useRef, useEffect } from 'react'
import { cn } from '../../lib/utils'

interface SimplePopoverProps {
  children: React.ReactNode
  content: React.ReactNode
  className?: string
}

const SimplePopover: React.FC<SimplePopoverProps> = ({
  children,
  content,
  className
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const triggerRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isOpen &&
        triggerRef.current &&
        contentRef.current &&
        !triggerRef.current.contains(event.target as Node) &&
        !contentRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false)
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
  }, [isOpen])

  return (
    <div className="relative inline-block">
      <div ref={triggerRef} onClick={() => setIsOpen(!isOpen)}>
        {children}
      </div>
      
      {isOpen && (
        <div
          ref={contentRef}
          className={cn(
            'absolute top-full right-0 rtl:right-auto rtl:left-0 mt-2 z-[9999] w-80 bg-white rounded-lg shadow-xl border border-gray-200 p-4',
            className
          )}
        >
          {content}
        </div>
      )}
    </div>
  )
}

export default SimplePopover
