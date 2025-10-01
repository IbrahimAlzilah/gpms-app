import React, { useState, useEffect } from 'react'
import { cn } from '../../lib/utils'
import Button from './Button'
import { SearchBar } from './Filter'
import { Filter, X, RotateCcw } from 'lucide-react'

interface FilterOption {
  value: string
  label: string
}

interface AdvancedFilterProps {
  statusOptions: FilterOption[]
  priorityOptions: FilterOption[]
  typeOptions?: FilterOption[]
  sortOptions: FilterOption[]
  statusFilter: string
  priorityFilter: string
  typeFilter?: string
  sortBy: string
  sortOrder: 'asc' | 'desc'
  onStatusChange: (value: string) => void
  onPriorityChange: (value: string) => void
  onTypeChange?: (value: string) => void
  onSortChange: (value: string) => void
  onSortOrderChange: (order: 'asc' | 'desc') => void
  onApply: () => void
  onClear: () => void
  className?: string
}

const AdvancedFilter: React.FC<AdvancedFilterProps> = ({
  statusOptions,
  priorityOptions,
  typeOptions,
  sortOptions,
  statusFilter,
  priorityFilter,
  typeFilter,
  sortBy,
  sortOrder,
  onStatusChange,
  onPriorityChange,
  onTypeChange,
  onSortChange,
  onSortOrderChange,
  onApply,
  onClear,
  className
}) => {
  const [tempSearch, setTempSearch] = useState('')
  const [tempStatus, setTempStatus] = useState(statusFilter)
  const [tempPriority, setTempPriority] = useState(priorityFilter)
  const [tempType, setTempType] = useState(typeFilter || 'all')
  const [tempSortBy, setTempSortBy] = useState(sortBy)
  const [tempSortOrder, setTempSortOrder] = useState(sortOrder)

  const handleClear = () => {
    setTempSearch('all')
    setTempStatus('all')
    setTempPriority('all')
    setTempType('all')
    setTempSortBy('updatedAt')
    setTempSortOrder('desc')
    onClear()
  }

  // Apply changes immediately when values change
  useEffect(() => {
    onStatusChange(tempStatus)
    onPriorityChange(tempPriority)
    if (onTypeChange) onTypeChange(tempType)
    onSortChange(tempSortBy)
    onSortOrderChange(tempSortOrder)
  }, [tempStatus, tempPriority, tempType, tempSortBy, tempSortOrder])

  return (
    <div className={cn('space-y-4', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">تصفية متقدمة</h3>
        <button
          onClick={onClear}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      {/* Filter Fields */}
      <div className="space-y-4">
        {/* search Filter */}
        <div className="mb-4">
          <SearchBar
            value={tempSearch}
            onChange={setTempSearch}
            placeholder="البحث ..."
            className="w-full"
          />
        </div>
        {/* Status Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            الحالة
          </label>
          <select
            value={tempStatus}
            onChange={(e) => setTempStatus(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-gpms-light focus:border-transparent"
          >
            {statusOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Priority Filter */}
        {/* <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            الأولوية
          </label>
          <select
            value={tempPriority}
            onChange={(e) => setTempPriority(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-gpms-light focus:border-transparent"
          >
            {priorityOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div> */}

        {/* Type Filter */}
        {typeOptions && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              النوع
            </label>
            <select
              value={tempType}
              onChange={(e) => setTempType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-gpms-light focus:border-transparent"
            >
              {typeOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Sort By */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            ترتيب حسب
          </label>
          <select
          value={tempSortBy}
            onChange={(e) => setTempSortBy(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-gpms-light focus:border-transparent"
          >
            {sortOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Sort Order */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            اتجاه الترتيب
          </label>
          <div className="flex space-x-2 rtl:space-x-reverse">
            <button
              onClick={() => setTempSortOrder('asc')}
              className={cn(
                'flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                tempSortOrder === 'asc'
                  ? 'bg-gpms-light text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              )}
            >
              تصاعدي ↑
            </button>
            <button
              onClick={() => setTempSortOrder('desc')}
              className={cn(
                'flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                tempSortOrder === 'desc'
                  ? 'bg-gpms-light text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              )}
            >
              تنازلي ↓
            </button>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end pt-4 border-t border-gray-200">
        <Button
          onClick={handleClear}
          variant="outline"
          size="sm"
        >
          <RotateCcw size={16} className="mr-1 rtl:mr-0 rtl:ml-1" />
          مسح الكل
        </Button>
      </div>
    </div>
  )
}

export default AdvancedFilter
