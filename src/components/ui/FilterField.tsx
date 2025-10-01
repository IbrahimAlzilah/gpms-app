import React from 'react'
import { cn } from '../../lib/utils'

interface FilterOption {
  value: string
  label: string
}

interface FilterFieldProps {
  label: string
  value: string
  onChange: (value: string) => void
  options: FilterOption[]
  className?: string
}

const FilterField: React.FC<FilterFieldProps> = ({
  label,
  value,
  onChange,
  options,
  className
}) => {
  return (
    <div className={cn('', className)}>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )
}

interface FilterToggleFieldProps {
  label: string
  value: string
  onChange: (value: string) => void
  options: { value: string; label: string }[]
  className?: string
}

export const FilterToggleField: React.FC<FilterToggleFieldProps> = ({
  label,
  value,
  onChange,
  options,
  className
}) => {
  return (
    <div className={cn('', className)}>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <div className="flex space-x-2 rtl:space-x-reverse">
        {options.map((option) => (
          <button
            key={option.value}
            onClick={() => onChange(option.value)}
            className={cn(
              'flex-1 px-3 py-2 text-sm rounded-lg border transition-colors',
              value === option.value
                ? 'bg-blue-50 border-blue-200 text-blue-700'
                : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
            )}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  )
}

export default FilterField
