import React from 'react'
import { cn } from '../../lib/utils'
import { CheckCircle, AlertCircle, Info, XCircle, X } from 'lucide-react'

interface AlertProps {
  children: React.ReactNode
  variant?: 'success' | 'error' | 'warning' | 'info'
  title?: string
  dismissible?: boolean
  onDismiss?: () => void
  className?: string
}

const Alert: React.FC<AlertProps> = ({
  children,
  variant = 'info',
  title,
  dismissible = false,
  onDismiss,
  className
}) => {
  const variants = {
    success: {
      container: 'bg-green-50 border-green-200',
      icon: CheckCircle,
      iconColor: 'text-green-400',
      titleColor: 'text-green-800',
      textColor: 'text-green-700'
    },
    error: {
      container: 'bg-red-50 border-red-200',
      icon: XCircle,
      iconColor: 'text-red-400',
      titleColor: 'text-red-800',
      textColor: 'text-red-700'
    },
    warning: {
      container: 'bg-yellow-50 border-yellow-200',
      icon: AlertCircle,
      iconColor: 'text-yellow-400',
      titleColor: 'text-yellow-800',
      textColor: 'text-yellow-700'
    },
    info: {
      container: 'bg-blue-50 border-blue-200',
      icon: Info,
      iconColor: 'text-blue-400',
      titleColor: 'text-blue-800',
      textColor: 'text-blue-700'
    }
  }

  const config = variants[variant]
  const Icon = config.icon

  return (
    <div className={cn(
      'rounded-lg border p-4',
      config.container,
      className
    )}>
      <div className="flex">
        <div className="flex-shrink-0">
          <Icon className={cn('h-5 w-5', config.iconColor)} />
        </div>
        <div className="ml-3 rtl:ml-0 rtl:mr-3 flex-1">
          {title && (
            <h3 className={cn('text-sm font-medium', config.titleColor)}>
              {title}
            </h3>
          )}
          <div className={cn('text-sm', config.textColor)}>
            {children}
          </div>
        </div>
        {dismissible && (
          <div className="ml-auto rtl:ml-0 rtl:mr-auto pl-3 rtl:pl-0 rtl:pr-3">
            <div className="-mx-1.5 -my-1.5">
              <button
                type="button"
                onClick={onDismiss}
                className={cn(
                  'inline-flex rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2',
                  config.iconColor,
                  'hover:bg-opacity-20'
                )}
              >
                <span className="sr-only">إغلاق</span>
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Alert