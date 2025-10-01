import React, { useState, useEffect } from 'react'
import { cn } from '../../lib/utils'
import {
  CheckCircle,
  XCircle,
  AlertCircle,
  Info,
  X
} from 'lucide-react'

export interface ToastProps {
  id: string
  title?: string
  message: string
  type: 'success' | 'error' | 'warning' | 'info'
  duration?: number
  onClose: (id: string) => void
}

const Toast: React.FC<ToastProps> = ({
  id,
  title,
  message,
  type,
  duration = 5000,
  onClose
}) => {
  const [isVisible, setIsVisible] = useState(true)
  const [isExiting, setIsExiting] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      handleClose()
    }, duration)

    return () => clearTimeout(timer)
  }, [duration])

  const handleClose = () => {
    setIsExiting(true)
    setTimeout(() => {
      setIsVisible(false)
      onClose(id)
    }, 300)
  }

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500" />
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />
      default:
        return <Info className="w-5 h-5 text-blue-500" />
    }
  }

  const getStyles = () => {
    const baseStyles = 'border-l-4'
    switch (type) {
      case 'success':
        return `${baseStyles} bg-green-50 border-green-500`
      case 'error':
        return `${baseStyles} bg-red-50 border-red-500`
      case 'warning':
        return `${baseStyles} bg-yellow-50 border-yellow-500`
      default:
        return `${baseStyles} bg-blue-50 border-blue-500`
    }
  }

  if (!isVisible) return null

  return (
    <div
      className={cn(
        'max-w-sm w-full bg-white shadow-lg rounded-lg pointer-events-auto overflow-hidden',
        getStyles(),
        isExiting ? 'animate-slide-out-right' : 'animate-slide-in-right'
      )}
    >
      <div className="p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            {getIcon()}
          </div>
          
          <div className="mr-3 rtl:mr-0 rtl:ml-3 w-0 flex-1">
            {title && (
              <p className="text-sm font-medium text-gray-900 mb-1">
                {title}
              </p>
            )}
            <p className="text-sm text-gray-700">
              {message}
            </p>
          </div>
          
          <div className="mr-4 rtl:mr-0 rtl:ml-4 flex-shrink-0 flex">
            <button
              onClick={handleClose}
              className="inline-flex text-gray-400 hover:text-gray-500 focus:outline-none transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
      
      {/* Progress bar */}
      <div className="h-1 bg-gray-200">
        <div
          className={cn(
            'h-full transition-all ease-linear',
            type === 'success' && 'bg-green-500',
            type === 'error' && 'bg-red-500',
            type === 'warning' && 'bg-yellow-500',
            type === 'info' && 'bg-blue-500'
          )}
          style={{
            animation: `shrink ${duration}ms linear`,
            width: '100%'
          }}
        />
      </div>
    </div>
  )
}

interface ToastContainerProps {
  toasts: ToastProps[]
  onClose: (id: string) => void
}

const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onClose }) => {
  return (
    <div className="fixed top-4 left-4 rtl:left-auto rtl:right-4 z-50 space-y-4">
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} onClose={onClose} />
      ))}
    </div>
  )
}

// Toast Hook
export const useToast = () => {
  const [toasts, setToasts] = useState<ToastProps[]>([])

  const addToast = (toast: Omit<ToastProps, 'id' | 'onClose'>) => {
    const id = Math.random().toString(36).substring(7)
    const newToast: ToastProps = {
      ...toast,
      id,
      onClose: removeToast
    }
    
    setToasts(prev => [...prev, newToast])
  }

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }

  const success = (message: string, title?: string) => {
    addToast({ message, title, type: 'success' })
  }

  const error = (message: string, title?: string) => {
    addToast({ message, title, type: 'error' })
  }

  const warning = (message: string, title?: string) => {
    addToast({ message, title, type: 'warning' })
  }

  const info = (message: string, title?: string) => {
    addToast({ message, title, type: 'info' })
  }

  return {
    toasts,
    addToast,
    removeToast,
    success,
    error,
    warning,
    info,
    ToastContainer: () => <ToastContainer toasts={toasts} onClose={removeToast} />
  }
}

export { Toast, ToastContainer }
