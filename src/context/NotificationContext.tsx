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
  category?: 'system' | 'project' | 'request' | 'evaluation' | 'document' | 'meeting'
  priority?: 'low' | 'medium' | 'high'
  relatedId?: string // ID of related entity (project, request, etc.)
  role?: string[] // Roles that should see this notification
}

interface NotificationContextType {
  notifications: Notification[]
  unreadCount: number
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void
  markAsRead: (id: string) => void
  markAllAsRead: () => void
  removeNotification: (id: string) => void
  clearAllNotifications: () => void
  getNotificationsByCategory: (category: Notification['category']) => Notification[]
  getNotificationsByRole: (role: string) => Notification[]
  getUnreadByCategory: (category: Notification['category']) => number
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
      },
      {
        id: '6',
        title: 'طلب إشراف جديد',
        message: 'لديك طلب إشراف جديد من طالب على مشروع "نظام إدارة المستشفى"',
        type: 'info',
        read: false,
        timestamp: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
        link: '/requests'
      },
      {
        id: '7',
        title: 'تم تعيينك كمشرف',
        message: 'تم تعيينك كمشرف على مشروع "منصة التعليم الإلكتروني"',
        type: 'success',
        read: false,
        timestamp: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
        link: '/projects'
      },
      {
        id: '8',
        title: 'تم قبول طلب التسجيل',
        message: 'تم قبول طلبك للتسجيل في مشروع "نظام إدارة المستشفى"',
        type: 'success',
        read: false,
        timestamp: new Date(Date.now() - 1000 * 60 * 45), // 45 minutes ago
        link: '/projects'
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

  const getNotificationsByCategory = (category: Notification['category']): Notification[] => {
    if (!category) return notifications
    return notifications.filter((notification) => notification.category === category)
  }

  const getNotificationsByRole = (role: string): Notification[] => {
    return notifications.filter(
      (notification) =>
        !notification.role || notification.role.length === 0 || notification.role.includes(role)
    )
  }

  const getUnreadByCategory = (category: Notification['category']): number => {
    const categoryNotifications = getNotificationsByCategory(category)
    return categoryNotifications.filter((notification) => !notification.read).length
  }

  const value: NotificationContextType = {
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAllNotifications,
    getNotificationsByCategory,
    getNotificationsByRole,
    getUnreadByCategory,
  }

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  )
}
