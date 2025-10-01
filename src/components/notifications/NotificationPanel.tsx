import React, { useState } from 'react'
import { useNotifications } from '../../context/NotificationContext'
import { cn } from '../../lib/utils'
import Badge from '../ui/Badge'
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

  const getNotificationIcon = (type: string) => {
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

  const formatTimeAgo = (timestamp: Date) => {
    const now = new Date()
    const diff = now.getTime() - timestamp.getTime()
    
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
    <div className="relative">
      {/* Notification Bell */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-md bg-gray-100 hover:bg-gray-200 transition-colors"
      >
        <Bell size={20} className="text-gray-600" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Dropdown */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 lg:left-0 rtl:left-0 rtl:right-auto mt-2 w-96 bg-white rounded-lg shadow-lg border border-gray-200 z-20 max-h-100 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">الإشعارات</h3>
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-sm text-gpms-dark hover:text-gpms-light transition-colors flex items-center"
                    title="تمييز الكل كمقروء"
                  >
                    <CheckCheck size={16} className="mr-1 rtl:mr-0 rtl:ml-1" />
                    تمييز الكل
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Notifications List */}
            <div className="1max-h-80 max-h-[25rem] overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-8 text-center">
                  <Bell className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">لا توجد إشعارات</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={cn(
                        'p-4 hover:bg-gray-50 transition-colors cursor-pointer',
                        !notification.read && 'bg-blue-50 border-r-4 border-blue-500'
                      )}
                      onClick={() => handleNotificationClick(notification)}
                    >
                      <div className="flex items-start space-x-3 rtl:space-x-reverse">
                        <div className="flex-shrink-0">
                          {getNotificationIcon(notification.type)}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className={cn(
                                'text-sm font-medium text-gray-900',
                                !notification.read && 'font-semibold'
                              )}>
                                {notification.title}
                              </h4>
                              <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                                {notification.message}
                              </p>
                              <p className="text-xs text-gray-500 mt-2">
                                {formatTimeAgo(notification.timestamp)}
                              </p>
                            </div>
                            
                            <div className="flex items-center space-x-1 rtl:space-x-reverse ml-2 rtl:ml-0 rtl:mr-2">
                              {!notification.read && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    markAsRead(notification.id)
                                  }}
                                  className="text-gray-400 hover:text-green-600 transition-colors"
                                  title="تمييز كمقروء"
                                >
                                  <Check size={16} />
                                </button>
                              )}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  removeNotification(notification.id)
                                }}
                                className="text-gray-400 hover:text-red-600 transition-colors"
                                title="حذف الإشعار"
                              >
                                <X size={16} />
                              </button>
                            </div>
                          </div>
                          
                          {notification.action && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                notification.action!.onClick()
                              }}
                              className="mt-2 text-xs text-gpms-dark hover:text-gpms-light font-medium transition-colors"
                            >
                              {notification.action.label}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div className="p-4 border-t border-gray-200 bg-gray-50">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">
                    {notifications.length} إشعار • {unreadCount} غير مقروء
                  </span>
                  <button
                    onClick={clearAllNotifications}
                    className="text-red-600 hover:text-red-700 transition-colors flex items-center"
                  >
                    <Trash2 size={14} className="mr-1 rtl:mr-0 rtl:ml-1" />
                    حذف الكل
                  </button>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}

export default NotificationPanel
