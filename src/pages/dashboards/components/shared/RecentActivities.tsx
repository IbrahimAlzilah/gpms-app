import React from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/Card'
import { Activity } from '../../types'
import {
  CheckCircle,
  Clock,
  AlertCircle,
  AlertTriangle,
  Calendar,
  FileText,
  Shield,
  Star
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface RecentActivitiesProps {
  activities: Activity[]
  className?: string
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  CheckCircle,
  Clock,
  AlertCircle,
  AlertTriangle,
  Calendar,
  FileText,
  Shield,
  Star
}

const getStatusColor = (status: Activity['status']) => {
  switch (status) {
    case 'success':
      return 'text-green-600 bg-green-50'
    case 'pending':
      return 'text-yellow-600 bg-yellow-50'
    case 'warning':
      return 'text-orange-600 bg-orange-50'
    case 'info':
      return 'text-blue-600 bg-blue-50'
    default:
      return 'text-gray-600 bg-gray-50'
  }
}

const RecentActivities: React.FC<RecentActivitiesProps> = ({ activities, className }) => {
  if (activities.length === 0) {
    return (
      <Card className={cn('hover-lift', className)}>
        <CardHeader>
          <h2 className="text-lg font-semibold text-gray-900">النشاطات الأخيرة</h2>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500 text-center py-4">لا توجد نشاطات حديثة</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={cn('border-0 shadow-md', className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Clock className="w-5 h-5 text-gray-600" />
            النشاطات الأخيرة
          </h2>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {activities.map((activity, index) => {
            const Icon = iconMap[activity.icon] || FileText
            return (
              <div
                key={activity.id}
                className="group relative flex items-start gap-4 p-4 rounded-xl border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all duration-200 bg-white"
              >
                <div className={cn(
                  'p-3 rounded-xl flex-shrink-0 shadow-sm transition-transform duration-200 group-hover:scale-110',
                  getStatusColor(activity.status)
                )}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 mb-1">{activity.title}</h3>
                  <p className="text-sm text-gray-600 mb-2">{activity.description}</p>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Clock className="w-3 h-3" />
                      <span>{activity.time}</span>
                    </div>
                    <div className={cn(
                      'px-2 py-0.5 rounded-full text-xs font-medium',
                      activity.status === 'success' && 'bg-green-100 text-green-700',
                      activity.status === 'pending' && 'bg-yellow-100 text-yellow-700',
                      activity.status === 'warning' && 'bg-orange-100 text-orange-700',
                      activity.status === 'info' && 'bg-blue-100 text-blue-700'
                    )}>
                      {activity.status === 'success' && 'مكتمل'}
                      {activity.status === 'pending' && 'قيد الانتظار'}
                      {activity.status === 'warning' && 'تحذير'}
                      {activity.status === 'info' && 'معلومة'}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

export default RecentActivities

