import React from 'react'
import { cn } from '@/lib/utils'

export type Priority = 'low' | 'medium' | 'high'

interface PriorityBadgeProps {
  priority: Priority | string
  className?: string
}

const priorityConfig: Record<string, { label: string; className: string }> = {
  low: { label: 'منخفض', className: 'bg-green-100 text-green-800' },
  medium: { label: 'متوسط', className: 'bg-yellow-100 text-yellow-800' },
  high: { label: 'عالي', className: 'bg-red-100 text-red-800' },
}

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority, className }) => {
  const config = priorityConfig[priority] || { label: priority, className: 'bg-gray-100 text-gray-800' }

  return (
    <span className={cn('px-2 py-1 text-xs rounded-full font-medium', config.className, className)}>
      {config.label}
    </span>
  )
}

export default PriorityBadge

