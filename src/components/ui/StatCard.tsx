import React from 'react'
import { cn } from '../../lib/utils'

interface StatCardProps {
  title: string
  value: string | number
  change?: string
  changeType?: 'positive' | 'negative' | 'neutral'
  icon?: React.ReactNode
  className?: string
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  changeType = 'neutral',
  icon,
  className
}) => {
  const changeColors = {
    positive: 'text-green-600',
    negative: 'text-red-600',
    neutral: 'text-gray-600'
  }

  return (
    <div className={cn('bg-white rounded-xl p-6 shadow-sm border border-gray-200', className)}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {change && (
            <p className={cn('text-xs mt-1', changeColors[changeType])}>
              {change}
            </p>
          )}
        </div>
        {icon && (
          <div className="w-12 h-12 bg-gpms-light rounded-lg flex items-center justify-center">
            {icon}
          </div>
        )}
      </div>
    </div>
  )
}

export default StatCard
