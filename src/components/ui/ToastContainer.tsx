import React, { createContext, useContext, useState, useCallback } from 'react'
import Toast, { ToastProps } from './Toast'

interface ToastContextType {
    showToast: (message: string, type?: ToastProps['type'], duration?: number) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export const useToast = () => {
    const context = useContext(ToastContext)
    if (!context) {
        throw new Error('useToast must be used within ToastProvider')
    }
    return context
}

interface ToastProviderProps {
    children: React.ReactNode
}

interface ToastItem {
    id: string
    message: string
    type: ToastProps['type']
    duration: number
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
    const [toasts, setToasts] = useState<ToastItem[]>([])

    const showToast = useCallback((
        message: string,
        type: ToastProps['type'] = 'info',
        duration = 3000
    ) => {
        const id = Date.now().toString() + Math.random().toString(36).substr(2, 9)
        setToasts(prev => [...prev, { id, message, type, duration }])
    }, [])

    const closeToast = useCallback((id: string) => {
        setToasts(prev => prev.filter(toast => toast.id !== id))
    }, [])

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <div className="fixed top-4 right-4 rtl:right-auto rtl:left-4 z-50 w-96 max-w-full">
                {toasts.map(toast => (
                    <Toast
                        key={toast.id}
                        id={toast.id}
                        message={toast.message}
                        type={toast.type}
                        duration={toast.duration}
                        onClose={closeToast}
                    />
                ))}
            </div>
        </ToastContext.Provider>
    )
}

export default ToastProvider
