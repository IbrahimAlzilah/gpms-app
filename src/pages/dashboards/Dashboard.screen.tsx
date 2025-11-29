import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useLanguage } from '@/context/LanguageContext'
import { useAuth } from '@/context/AuthContext'
import { Card, CardContent, CardHeader } from '@/components/ui/Card'
import {
  FolderOpen,
  FileText,
  Send,
  Upload,
  Users,
  Calendar,
  Shield,
  UserCheck,
  Clock,
  CheckCircle,
  AlertCircle,
  Star,
  AlertTriangle
} from 'lucide-react'

const DashboardScreen: React.FC = () => {
  const { t } = useLanguage()
  const { user } = useAuth()
  const navigate = useNavigate()

  // Role-based stats configuration
  const getStats = () => {
    switch (user?.role) {
      case 'student':
        return [
          {
            title: t('navigation.projects'),
            value: '3',
            icon: FolderOpen,
            bgColor: 'bg-blue-100',
            color: 'text-blue-600',
            change: '+1 هذا الأسبوع',
            onClick: () => navigate('/projects')
          },
          {
            title: t('navigation.proposals'),
            value: '2',
            icon: FileText,
            bgColor: 'bg-green-100',
            color: 'text-green-600',
            change: 'معلق',
            onClick: () => navigate('/proposals')
          },
          {
            title: t('navigation.requests'),
            value: '5',
            icon: Send,
            bgColor: 'bg-yellow-100',
            color: 'text-yellow-600',
            change: '2 جديد',
            onClick: () => navigate('/requests')
          },
          {
            title: t('navigation.documents'),
            value: '12',
            icon: Upload,
            bgColor: 'bg-purple-100',
            color: 'text-purple-600',
            change: '+3 هذا الشهر',
            onClick: () => navigate('/documents')
          }
        ]
      case 'supervisor':
        return [
          {
            title: 'المشاريع المشرفة عليها',
            value: '8',
            icon: Users,
            bgColor: 'bg-blue-100',
            color: 'text-blue-600',
            change: '+2 هذا الشهر',
            onClick: () => navigate('/projects')
          },
          {
            title: 'طلبات الإشراف',
            value: '5',
            icon: Send,
            bgColor: 'bg-yellow-100',
            color: 'text-yellow-600',
            change: '3 جديدة',
            onClick: () => navigate('/requests')
          },
          {
            title: 'التقارير المعلقة',
            value: '12',
            icon: FileText,
            bgColor: 'bg-orange-100',
            color: 'text-orange-600',
            change: '2 عاجلة',
            onClick: () => navigate('/documents')
          },
          {
            title: 'الاجتماعات المجدولة',
            value: '4',
            icon: Calendar,
            bgColor: 'bg-green-100',
            color: 'text-green-600',
            change: 'هذا الأسبوع',
            onClick: () => navigate('/schedules')
          }
        ]
      case 'committee':
        return [
          {
            title: 'المقترحات المعلقة',
            value: '15',
            icon: FileText,
            bgColor: 'bg-yellow-100',
            color: 'text-yellow-600',
            change: '5 جديدة هذا الأسبوع',
            onClick: () => navigate('/proposals')
          },
          {
            title: 'المشاريع النشطة',
            value: '42',
            icon: Users,
            bgColor: 'bg-blue-100',
            color: 'text-blue-600',
            change: '+3 هذا الشهر',
            onClick: () => navigate('/projects')
          },
          {
            title: 'المشرفين المتاحين',
            value: '8',
            icon: UserCheck,
            bgColor: 'bg-green-100',
            color: 'text-green-600',
            change: '2 متاحون الآن',
            onClick: () => navigate('/users')
          },
          {
            title: 'الطلبات المعلقة',
            value: '23',
            icon: Clock,
            bgColor: 'bg-orange-100',
            color: 'text-orange-600',
            change: '7 عاجلة',
            onClick: () => navigate('/requests')
          }
        ]
      case 'discussion':
        return [
          {
            title: 'المناقشات المجدولة',
            value: '8',
            icon: Calendar,
            bgColor: 'bg-blue-100',
            color: 'text-blue-600',
            change: '3 هذا الأسبوع',
            onClick: () => navigate('/schedules')
          },
          {
            title: 'المناقشات المكتملة',
            value: '15',
            icon: CheckCircle,
            bgColor: 'bg-green-100',
            color: 'text-green-600',
            change: '+5 هذا الشهر',
            onClick: () => navigate('/evaluations')
          },
          {
            title: 'المشاريع المعلقة',
            value: '12',
            icon: Clock,
            bgColor: 'bg-yellow-100',
            color: 'text-yellow-600',
            change: '2 عاجلة',
            onClick: () => navigate('/projects')
          },
          {
            title: 'متوسط الدرجات',
            value: '85.2',
            icon: Star,
            bgColor: 'bg-purple-100',
            color: 'text-purple-600',
            change: '+2.1 من الشهر الماضي',
            onClick: () => navigate('/evaluations')
          }
        ]
      case 'admin':
        return [
          {
            title: 'إجمالي المستخدمين',
            value: '156',
            icon: Users,
            bgColor: 'bg-blue-100',
            color: 'text-blue-600',
            change: '+12 هذا الشهر',
            onClick: () => navigate('/users')
          },
          {
            title: 'المشاريع النشطة',
            value: '89',
            icon: FileText,
            bgColor: 'bg-green-100',
            color: 'text-green-600',
            change: '+8 هذا الشهر',
            onClick: () => navigate('/projects')
          },
          {
            title: 'المشرفين النشطين',
            value: '24',
            icon: Shield,
            bgColor: 'bg-purple-100',
            color: 'text-purple-600',
            change: '+2 هذا الشهر',
            onClick: () => navigate('/users')
          },
          {
            title: 'الطلبات المعلقة',
            value: '34',
            icon: Clock,
            bgColor: 'bg-orange-100',
            color: 'text-orange-600',
            change: '5 عاجلة',
            onClick: () => navigate('/requests')
          }
        ]
      default:
        return []
    }
  }

  const stats = getStats()

  const renderRecentActivities = () => {
    switch (user?.role) {
      case 'student':
        return [
          {
            id: 1,
            title: 'تم قبول مقترح المشروع',
            description: 'مشروع تطبيق إدارة المكتبة',
            time: 'منذ ساعتين',
            status: 'success',
            icon: CheckCircle
          },
          {
            id: 2,
            title: 'طلب إشراف جديد',
            description: 'د. أحمد محمد - مشرف مقترح',
            time: 'منذ يوم',
            status: 'pending',
            icon: Clock
          },
          {
            id: 3,
            title: 'تنبيه: موعد تسليم المستندات',
            description: 'تقرير التقدم الأول - غداً',
            time: 'منذ يومين',
            status: 'warning',
            icon: AlertCircle
          }
        ]
      case 'supervisor':
        return [
          {
            id: 1,
            title: 'طلب إشراف جديد',
            description: 'يوسف أحمد - تطبيق إدارة المطاعم',
            time: 'منذ ساعة',
            status: 'pending',
            icon: Clock
          },
          {
            id: 2,
            title: 'تم قبول تقرير التقدم',
            description: 'تطبيق إدارة المكتبة الذكية',
            time: 'منذ 3 ساعات',
            status: 'success',
            icon: CheckCircle
          },
          {
            id: 3,
            title: 'اجتماع مجدول',
            description: 'اجتماع متابعة - غداً 10:00',
            time: 'منذ يوم',
            status: 'info',
            icon: Calendar
          }
        ]
      case 'committee':
        return [
          {
            id: 1,
            title: 'مقترح جديد مقدم',
            description: 'تطبيق إدارة المكتبة الذكية - أحمد محمد',
            time: 'منذ ساعتين',
            status: 'pending',
            icon: FileText
          },
          {
            id: 2,
            title: 'تم اعتماد مقترح',
            description: 'نظام إدارة المستودعات',
            time: 'منذ يوم',
            status: 'success',
            icon: CheckCircle
          },
          {
            id: 3,
            title: 'موعد تسليم المقترحات',
            description: '2024-02-01 - قريب',
            time: 'منذ يومين',
            status: 'warning',
            icon: AlertCircle
          }
        ]
      case 'discussion':
        return [
          {
            id: 1,
            title: 'مناقشة مجدولة',
            description: 'تطبيق إدارة المكتبة الذكية - 2024-01-25',
            time: 'منذ ساعة',
            status: 'info',
            icon: Calendar
          },
          {
            id: 2,
            title: 'تم إكمال التقييم',
            description: 'نظام إدارة المستودعات - الدرجة: 88',
            time: 'منذ يوم',
            status: 'success',
            icon: CheckCircle
          },
          {
            id: 3,
            title: 'تقييم معلق',
            description: 'منصة التعليم الإلكتروني',
            time: 'منذ يومين',
            status: 'pending',
            icon: Clock
          }
        ]
      case 'admin':
        return [
          {
            id: 1,
            title: 'تم إنشاء مستخدم جديد',
            description: 'أحمد محمد - طالب',
            time: 'منذ 5 دقائق',
            status: 'success',
            icon: CheckCircle
          },
          {
            id: 2,
            title: 'تم تحديث صلاحيات المشرف',
            description: 'د. سارة أحمد',
            time: 'منذ ساعة',
            status: 'success',
            icon: Shield
          },
          {
            id: 3,
            title: 'تنبيه: استخدام التخزين مرتفع',
            description: '82% - يحتاج مراجعة',
            time: 'منذ 3 ساعات',
            status: 'warning',
            icon: AlertTriangle
          }
        ]
      default:
        return []
    }
  }

  const activities = renderRecentActivities()

  const getStatusColor = (status: string) => {
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

  if (!user) {
    return <div>جاري التحميل...</div>
  }

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <div key={index} onClick={stat.onClick} className="cursor-pointer">
              <Card className="hover-lift">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                      <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                      <p className="text-xs text-gray-500 mt-1">{stat.change}</p>
                    </div>
                    <div className={`${stat.bgColor} p-3 rounded-lg`}>
                      <Icon className={`w-6 h-6 ${stat.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )
        })}
      </div>

      {/* Recent Activities */}
      <Card className="hover-lift">
        <CardHeader>
          <h2 className="text-lg font-semibold text-gray-900">النشاطات الأخيرة</h2>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {activities.map((activity) => {
              const Icon = activity.icon
              return (
                <div
                  key={activity.id}
                  className="flex items-start space-x-4 rtl:space-x-reverse p-4 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className={`p-2 rounded-lg ${getStatusColor(activity.status)}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{activity.title}</h3>
                    <p className="text-sm text-gray-600">{activity.description}</p>
                    <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Role-specific additional sections can be added here */}
    </div>
  )
}

export default DashboardScreen
