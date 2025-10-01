import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export interface Notification {
  id: string
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
  read: boolean
  timestamp: Date
  action?: {
    label: string
    onClick: () => void
  }
  avatar?: string
  link?: string
}

interface NotificationContextType {
  notifications: Notification[]
  unreadCount: number
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void
  markAsRead: (id: string) => void
  markAllAsRead: () => void
  removeNotification: (id: string) => void
  clearAllNotifications: () => void
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export const useNotifications = () => {
  const context = useContext(NotificationContext)
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider')
  }
  return context
}

interface NotificationProviderProps {
  children: ReactNode
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([])

  // Initialize with mock notifications
  useEffect(() => {
    const mockNotifications: Notification[] = [
      {
        id: '1',
        title: 'تم قبول مقترح المشروع',
        message: 'تم قبول مقترح مشروع "تطبيق إدارة المكتبة الذكية" من قبل لجنة المشاريع',
        type: 'success',
        read: false,
        timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
        action: {
          label: 'عرض التفاصيل',
          onClick: () => console.log('View project details')
        }
      },
      {
        id: '2',
        title: 'طلب اجتماع جديد',
        message: 'د. أحمد محمد يطلب اجتماعاً لمناقشة تقدم المشروع',
        type: 'info',
        read: false,
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
        action: {
          label: 'جدولة الاجتماع',
          onClick: () => console.log('Schedule meeting')
        }
      },
      {
        id: '3',
        title: 'موعد تسليم قريب',
        message: 'موعد تسليم التقرير الأول خلال 3 أيام',
        type: 'warning',
        read: false,
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4), // 4 hours ago
      },
      {
        id: '4',
        title: 'تم رفض الطلب',
        message: 'تم رفض طلب تغيير المشرف. يرجى مراجعة الملاحظات',
        type: 'error',
        read: true,
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
      },
      {
        id: '5',
        title: 'تحديث النظام',
        message: 'تم تحديث النظام بميزات جديدة. تعرف على المميزات الجديدة',
        type: 'info',
        read: true,
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
      }
    ]
    
    setNotifications(mockNotifications)
  }, [])

  const unreadCount = notifications.filter(notification => !notification.read).length

  const addNotification = (notificationData: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      ...notificationData,
      id: Math.random().toString(36).substring(7),
      timestamp: new Date(),
      read: false
    }
    
    setNotifications(prev => [newNotification, ...prev])
  }

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, read: true }
          : notification
      )
    )
  }

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    )
  }

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id))
  }

  const clearAllNotifications = () => {
    setNotifications([])
  }

  const value: NotificationContextType = {
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAllNotifications
  }

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  )
}
