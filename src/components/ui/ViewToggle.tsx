import React from 'react'
import { cn } from '../../lib/utils'
import { Grid3X3, List } from 'lucide-react'

interface ViewToggleProps {
  viewMode: 'table' | 'grid'
  onViewModeChange: (mode: 'table' | 'grid') => void
  className?: string
}

const ViewToggle: React.FC<ViewToggleProps> = ({
  viewMode,
  onViewModeChange,
  className
}) => {
  return (
    <div className={cn(
      "flex items-center bg-gray-100 rounded-lg p-1",
      className
    )}>
      <button
        onClick={() => onViewModeChange('table')}
        className={cn(
          'flex items-center px-3 py-1 rounded-md text-sm font-medium transition-colors',
          viewMode === 'table'
            ? 'bg-white text-gray-900 shadow-sm'
            : 'text-gray-600 hover:text-gray-900'
        )}
      >
        <List size={16} className="mr-1 rtl:mr-0 rtl:ml-1" />
        جدول
      </button>
      <button
        onClick={() => onViewModeChange('grid')}
        className={cn(
          'flex items-center px-3 py-1 rounded-md text-sm font-medium transition-colors',
          viewMode === 'grid'
            ? 'bg-white text-gray-900 shadow-sm'
            : 'text-gray-600 hover:text-gray-900'
        )}
      >
        <Grid3X3 size={16} className="mr-1 rtl:mr-0 rtl:ml-1" />
        شبكة
      </button>
    </div>
  )
}

export default ViewToggle
