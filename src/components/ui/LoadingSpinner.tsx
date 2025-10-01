import React from 'react'
import { cn } from '../../lib/utils'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  className 
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div 
        className={cn(
          'animate-spin rounded-full border-2 border-gray-300 border-t-gpms-dark',
          sizeClasses[size],
          className
        )}
      />
    </div>
  )
}

export default LoadingSpinner
