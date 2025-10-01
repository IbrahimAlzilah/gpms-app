import React from 'react'
import { useLanguage } from '../../context/LanguageContext'
import { useAuth } from '../../context/AuthContext'
import { 
  FolderOpen, 
  FileText, 
  Send, 
  Upload, 
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react'

const StudentDashboard: React.FC = () => {
  const { t } = useLanguage()
  const { user } = useAuth()

  // Mock data
  const stats = [
    {
      title: t('navigation.projects'),
      value: '3',
      icon: FolderOpen,
      bgColor: 'bg-blue-100',
      color: 'text-blue-600',
      change: '+1 هذا الأسبوع'
    },
    {
      title: t('navigation.proposals'),
      value: '2',
      icon: FileText,
      bgColor: 'bg-green-100',
      color: 'text-green-600',
      change: 'معلق'
    },
    {
      title: t('navigation.requests'),
      value: '5',
      icon: Send,
      bgColor: 'bg-yellow-100',
      color: 'text-yellow-600',
      change: '2 جديد'
    },
    {
      title: t('navigation.documents'),
      value: '12',
      icon: Upload,
      bgColor: 'bg-purple-100',
      color: 'text-purple-600',
      change: '+3 هذا الشهر'
    }
  ]

  const recentActivities = [
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

  const upcomingDeadlines = [
    {
      title: 'تقرير التقدم الأول',
      date: '2024-01-15',
      status: 'urgent'
    },
    {
      title: 'تسليم الكود المصدري',
      date: '2024-01-20',
      status: 'normal'
    },
    {
      title: 'العرض التقديمي',
      date: '2024-01-25',
      status: 'normal'
    }
  ]

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      {/* <div className="bg-gradient-to-r from-gpms-dark to-gpms-light rounded-xl p-6 text-white hidden">
        <h1 className="text-2xl font-bold mb-2">
          مرحباً، {user?.fullName} 👋
        </h1>
      </div> */}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                  <p className="text-xs text-gray-500 mt-1">{stat.change}</p>
                </div>
                <div className={`${stat.bgColor} p-3 rounded-lg`}>
                  <Icon size={24} className={`${stat.color} w-6 h-6`} />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">الأنشطة الأخيرة</h2>
          <div className="space-y-4">
            {recentActivities.map((activity) => {
              const Icon = activity.icon
              const statusColors = {
                success: 'text-green-500',
                pending: 'text-yellow-500',
                warning: 'text-orange-500'
              }
              
              return (
                <div key={activity.id} className="flex items-start space-x-3 rtl:space-x-reverse">
                  <Icon size={20} className={`mt-1 ${statusColors[activity.status as keyof typeof statusColors]}`} />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                    <p className="text-sm text-gray-600">{activity.description}</p>
                    <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Upcoming Deadlines */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">المواعيد القادمة</h2>
          <div className="space-y-4">
            {upcomingDeadlines.map((deadline, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-900">{deadline.title}</p>
                  <p className="text-xs text-gray-500">{deadline.date}</p>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  deadline.status === 'urgent' 
                    ? 'bg-red-100 text-red-800' 
                    : 'bg-blue-100 text-blue-800'
                }`}>
                  {deadline.status === 'urgent' ? 'عاجل' : 'عادي'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">الإجراءات السريعة</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-gpms-light hover:bg-gpms-light/5 transition-colors">
            <FileText size={24} className="text-gray-400 mr-3 rtl:ml-3 rtl:mr-0" />
            <span className="text-gray-600">{t('student.submitProposal')}</span>
          </button>
          <button className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-gpms-light hover:bg-gpms-light/5 transition-colors">
            <Upload size={24} className="text-gray-400 mr-3 rtl:ml-3 rtl:mr-0" />
            <span className="text-gray-600">{t('student.uploadDocuments')}</span>
          </button>
          <button className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-gpms-light hover:bg-gpms-light/5 transition-colors">
            <TrendingUp size={24} className="text-gray-400 mr-3 rtl:ml-3 rtl:mr-0" />
            <span className="text-gray-600">{t('student.trackProgress')}</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default StudentDashboard
