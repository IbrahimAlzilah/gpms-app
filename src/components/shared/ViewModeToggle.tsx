import React from 'react'
import { Grid3X3, List } from 'lucide-react'
import { cn } from '@/lib/utils'

export type ViewMode = 'table' | 'grid'

interface ViewModeToggleProps {
  viewMode: ViewMode
  onViewModeChange: (mode: ViewMode) => void
  className?: string
}

export const ViewModeToggle: React.FC<ViewModeToggleProps> = ({
  viewMode,
  onViewModeChange,
  className
}) => {
  return (
    <div className={cn('flex bg-gray-100 rounded-lg p-1', className)}>
      <button
        title="جدول"
        onClick={() => onViewModeChange('table')}
        className={cn(
          'px-3 py-1 rounded-md text-sm font-medium transition-colors',
          viewMode === 'table'
            ? 'bg-white text-gray-900 shadow-sm'
            : 'text-gray-600 hover:text-gray-900'
        )}
      >
        <List size={20} className="mr-1 rtl:mr-0 rtl:ml-1" />
      </button>
      <button
        title="شبكة"
        onClick={() => onViewModeChange('grid')}
        className={cn(
          'px-3 py-1 rounded-md text-sm font-medium transition-colors',
          viewMode === 'grid'
            ? 'bg-white text-gray-900 shadow-sm'
            : 'text-gray-600 hover:text-gray-900'
        )}
      >
        <Grid3X3 size={20} className="mr-1 rtl:mr-0 rtl:ml-1" />
      </button>
    </div>
  )
}

export default ViewModeToggle

