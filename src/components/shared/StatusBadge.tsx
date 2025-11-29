import React from 'react'
import { cn } from '@/lib/utils'

export type Status = 
  | 'draft' 
  | 'submitted' 
  | 'under_review' 
  | 'approved' 
  | 'rejected' 
  | 'in_progress' 
  | 'completed' 
  | 'pending'

interface StatusBadgeProps {
  status: Status | string
  className?: string
}

const statusConfig: Record<string, { label: string; className: string }> = {
  draft: { label: 'مسودة', className: 'bg-gray-100 text-gray-800' },
  submitted: { label: 'مُرسل', className: 'bg-blue-100 text-blue-800' },
  under_review: { label: 'قيد المراجعة', className: 'bg-blue-100 text-blue-800' },
  approved: { label: 'موافق عليه', className: 'bg-green-100 text-green-800' },
  rejected: { label: 'مرفوض', className: 'bg-red-100 text-red-800' },
  in_progress: { label: 'قيد التنفيذ', className: 'bg-blue-100 text-blue-800' },
  completed: { label: 'مكتمل', className: 'bg-green-100 text-green-800' },
  pending: { label: 'معلق', className: 'bg-yellow-100 text-yellow-800' },
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className }) => {
  const config = statusConfig[status] || { label: status, className: 'bg-gray-100 text-gray-800' }

  return (
    <span className={cn('px-2 py-1 text-xs rounded-full font-medium', config.className, className)}>
      {config.label}
    </span>
  )
}

export default StatusBadge

