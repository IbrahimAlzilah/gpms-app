import React from 'react'
import { cn } from '../../lib/utils'
import Button from './Button'
import { Filter, ChevronDown } from 'lucide-react'

interface FilterButtonProps {
  onClick: () => void
  isOpen: boolean
  hasActiveFilters: boolean
  className?: string
}

const FilterButton: React.FC<FilterButtonProps> = ({
  onClick,
  isOpen,
  hasActiveFilters,
  className
}) => {
  return (
    <Button
      onClick={onClick}
      variant="outline"
      className={cn(
        'flex items-center space-x-2 rtl:space-x-reverse',
        hasActiveFilters && 'bg-blue-50 border-blue-200 text-blue-700',
        className
      )}
    >
      <Filter size={16} />
      <span>تصفية</span>
      {hasActiveFilters && (
        <div className="w-2 h-2 bg-blue-500 rounded-full" />
      )}
      <ChevronDown 
        size={16} 
        className={cn(
          'transition-transform duration-200',
          isOpen && 'rotate-180'
        )} 
      />
    </Button>
  )
}

export default FilterButton
