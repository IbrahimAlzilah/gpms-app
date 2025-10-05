import React, { useEffect } from 'react'
import { cn } from '../../lib/utils'
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react'

export interface ToastProps {
    id: string
    message: string
    type?: 'success' | 'error' | 'warning' | 'info'
    duration?: number
    onClose: (id: string) => void
}

const Toast: React.FC<ToastProps> = ({
    id,
    message,
    type = 'info',
    duration = 3000,
    onClose
}) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose(id)
        }, duration)

        return () => clearTimeout(timer)
    }, [id, duration, onClose])

    const getIcon = () => {
        switch (type) {
            case 'success':
                return <CheckCircle size={20} />
            case 'error':
                return <XCircle size={20} />
            case 'warning':
                return <AlertCircle size={20} />
            case 'info':
                return <Info size={20} />
            default:
                return <Info size={20} />
        }
    }

    const getColors = () => {
        switch (type) {
            case 'success':
                return 'bg-green-50 border-green-200 text-green-800'
            case 'error':
                return 'bg-red-50 border-red-200 text-red-800'
            case 'warning':
                return 'bg-yellow-50 border-yellow-200 text-yellow-800'
            case 'info':
                return 'bg-blue-50 border-blue-200 text-blue-800'
            default:
                return 'bg-gray-50 border-gray-200 text-gray-800'
        }
    }

    return (
        <div
            className={cn(
                'flex items-center gap-3 p-4 rounded-lg border shadow-lg mb-2 animate-slideIn',
                getColors()
            )}
        >
            <div className="flex-shrink-0">{getIcon()}</div>
            <p className="flex-1 text-sm font-medium">{message}</p>
            <button
                onClick={() => onClose(id)}
                className="flex-shrink-0 hover:opacity-70 transition-opacity"
            >
                <X size={16} />
            </button>
        </div>
    )
}

export default Toast
