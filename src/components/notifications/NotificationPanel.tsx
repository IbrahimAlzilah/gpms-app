import React, { useState, useRef, useEffect } from 'react'
import { useNotifications } from '../../context/NotificationContext'
import { cn } from '../../lib/utils'
import {
  Bell,
  X,
  Check,
  CheckCheck,
  Trash2,
  AlertCircle,
  CheckCircle,
  Info,
  XCircle
} from 'lucide-react'

const NotificationPanel: React.FC = () => {
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAllNotifications
  } = useNotifications()

  const [isOpen, setIsOpen] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500" />
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-amber-500" />
      default:
        return <Info className="w-5 h-5 text-blue-500" />
    }
  }

  const formatTimeAgo = (timestamp: Date) => {
    const now = new Date()
    const diff = now.getTime() - new Date(timestamp).getTime()

    const minutes = Math.floor(diff / (1000 * 60))
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (days > 0) {
      return `منذ ${days} ${days === 1 ? 'يوم' : 'أيام'}`
    } else if (hours > 0) {
      return `منذ ${hours} ${hours === 1 ? 'ساعة' : 'ساعات'}`
    } else if (minutes > 0) {
      return `منذ ${minutes} ${minutes === 1 ? 'دقيقة' : 'دقائق'}`
    } else {
      return 'الآن'
    }
  }

  const handleNotificationClick = (notification: any) => {
    if (!notification.read) {
      markAsRead(notification.id)
    }

    if (notification.action) {
      notification.action.onClick()
    }
  }

  return (
    <div className="relative" ref={panelRef}>
      {/* Notification Bell */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "relative p-2 rounded-full transition-all duration-200",
          isOpen ? "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100" : "text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800"
        )}
        aria-label="Notifications"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full ring-2 ring-white dark:ring-gray-950 animate-pulse" />
        )}
      </button>

      {/* Notification Dropdown */}
      {isOpen && (
        <div className="absolute right-0 rtl:left-0 rtl:right-auto mt-2 w-80 sm:w-96 bg-white dark:bg-gray-900 rounded-xl shadow-xl ring-1 ring-black ring-opacity-5 z-50 animate-in fade-in zoom-in-95 duration-200 origin-top-right">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-800">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">الإشعارات</h3>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-xs text-gpms-primary hover:text-gpms-dark transition-colors flex items-center gap-1 font-medium"
                  title="تمييز الكل كمقروء"
                >
                  <CheckCheck size={14} />
                  تمييز الكل
                </button>
              )}
            </div>
          </div>

          {/* Notifications List */}
          <div className="max-h-[24rem] overflow-y-auto custom-scrollbar">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-3">
                  <Bell className="w-6 h-6 text-gray-400" />
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">لا توجد إشعارات جديدة</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100 dark:divide-gray-800">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={cn(
                      'group relative p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer',
                      !notification.read && 'bg-blue-50/50 dark:bg-blue-900/10'
                    )}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-1">
                        {getNotificationIcon(notification.type)}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <p className={cn(
                            'text-sm text-gray-900 dark:text-gray-100',
                            !notification.read ? 'font-semibold' : 'font-medium'
                          )}>
                            {notification.title}
                          </p>
                          <span className="text-[10px] text-gray-400 whitespace-nowrap ml-2 rtl:mr-2 rtl:ml-0">
                            {formatTimeAgo(notification.timestamp)}
                          </span>
                        </div>

                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2 leading-relaxed">
                          {notification.message}
                        </p>

                        {notification.action && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              notification.action!.onClick()
                            }}
                            className="mt-2 text-xs text-gpms-primary hover:text-gpms-dark font-medium transition-colors"
                          >
                            {notification.action.label}
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Hover Actions */}
                    <div className="absolute top-2 left-2 rtl:right-auto rtl:left-2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-md shadow-sm p-0.5">
                      {!notification.read && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            markAsRead(notification.id)
                          }}
                          className="p-1 text-gray-400 hover:text-green-600 transition-colors rounded hover:bg-green-50"
                          title="تمييز كمقروء"
                        >
                          <Check size={14} />
                        </button>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          removeNotification(notification.id)
                        }}
                        className="p-1 text-gray-400 hover:text-red-600 transition-colors rounded hover:bg-red-50"
                        title="حذف"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="p-3 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50 rounded-b-xl">
              <button
                onClick={clearAllNotifications}
                className="w-full flex items-center justify-center gap-2 text-xs text-gray-500 hover:text-red-600 transition-colors py-1"
              >
                <Trash2 size={14} />
                حذف جميع الإشعارات
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default NotificationPanel
