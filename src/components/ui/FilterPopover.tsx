import React, { ReactNode } from 'react'
import { cn } from '../../lib/utils'
import { Card, CardContent } from './Card'
import Button from './Button'
import { X, RotateCcw, Check } from 'lucide-react'

interface FilterPopoverProps {
  isOpen: boolean
  onClose: () => void
  onApply: () => void
  onClear: () => void
  title: string
  children: ReactNode
  className?: string
}

const FilterPopover: React.FC<FilterPopoverProps> = ({
  isOpen,
  onClose,
  onApply,
  onClear,
  title,
  children,
  className
}) => {
  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-10"
        onClick={onClose}
      />
      
      {/* Popover */}
      <div className={cn(
        'absolute top-full right-0 rtl:right-auto rtl:left-0 mt-2 z-20 w-80',
        className
      )}>
        <Card className="shadow-lg border border-gray-200">
          <CardContent className="p-4">
            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">{title}</h3>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Content */}
              {children}

              {/* Action Buttons */}
              <div className="flex space-x-2 rtl:space-x-reverse pt-2 border-t border-gray-200">
                <Button
                  onClick={onClear}
                  variant="outline"
                  size="sm"
                  className="flex-1"
                >
                  <RotateCcw size={14} className="mr-1 rtl:mr-0 rtl:ml-1" />
                  مسح الكل
                </Button>
                <Button
                  onClick={onApply}
                  size="sm"
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  <Check size={14} className="mr-1 rtl:mr-0 rtl:ml-1" />
                  تطبيق
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}

export default FilterPopover
