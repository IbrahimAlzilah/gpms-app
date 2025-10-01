import React from 'react'
import { cn } from '../../lib/utils'

interface SkeletonProps {
  className?: string
  width?: string | number
  height?: string | number
}

const Skeleton: React.FC<SkeletonProps> = ({ 
  className, 
  width = '100%', 
  height = '1rem' 
}) => {
  return (
    <div
      className={cn(
        'animate-pulse bg-gray-200 rounded',
        className
      )}
      style={{ width, height }}
    />
  )
}

interface EmptyStateProps {
  icon?: React.ReactNode
  title: string
  description?: string
  action?: React.ReactNode
  className?: string
}

const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
  className
}) => {
  return (
    <div className={cn('text-center py-12', className)}>
      {icon && (
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
      {description && (
        <p className="text-gray-600 mb-4">{description}</p>
      )}
      {action && action}
    </div>
  )
}

interface LoadingStateProps {
  message?: string
  className?: string
}

const LoadingState: React.FC<LoadingStateProps> = ({ 
  message = 'جاري التحميل...', 
  className 
}) => {
  return (
    <div className={cn('flex items-center justify-center py-12', className)}>
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-gpms-dark border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-600">{message}</p>
      </div>
    </div>
  )
}

interface ErrorStateProps {
  title?: string
  message?: string
  action?: React.ReactNode
  className?: string
}

const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'حدث خطأ',
  message = 'حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.',
  action,
  className
}) => {
  return (
    <div className={cn('text-center py-12', className)}>
      <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg className="w-12 h-12 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 mb-4">{message}</p>
      {action && action}
    </div>
  )
}

export { Skeleton, EmptyState, LoadingState, ErrorState }