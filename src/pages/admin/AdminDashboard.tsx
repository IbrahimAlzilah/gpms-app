import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useLanguage } from '../../context/LanguageContext'
import { useAuth } from '../../context/AuthContext'
import {
  Users,
  Shield,
  BarChart3,
  Settings,
  Database,
  Activity,
  FileText,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp
} from 'lucide-react'

const AdminDashboard: React.FC = () => {
  const { t } = useLanguage()
  const { user } = useAuth()
  const navigate = useNavigate()

  // Mock data
  const stats = [
    {
      title: 'إجمالي المستخدمين',
      value: '156',
      icon: Users,
      bgColor: 'bg-blue-100',
      color: 'text-blue-600',
      change: '+12 هذا الشهر'
    },
    {
      title: 'المشاريع النشطة',
      value: '89',
      icon: FileText,
      bgColor: 'bg-green-100',
      color: 'text-green-600',
      change: '+8 هذا الشهر'
    },
    {
      title: 'المشرفين النشطين',
      value: '24',
      icon: Shield,
      bgColor: 'bg-purple-100',
      color: 'text-purple-600',
      change: '+2 هذا الشهر'
    },
    {
      title: 'الطلبات المعلقة',
      value: '34',
      icon: Clock,
      bgColor: 'bg-orange-100',
      color: 'text-orange-600',
      change: '5 عاجلة'
    }
  ]

  const systemHealth = [
    {
      metric: 'استخدام الخادم',
      value: 68,
      status: 'good',
      color: 'bg-green-500'
    },
    {
      metric: 'استخدام قاعدة البيانات',
      value: 45,
      status: 'good',
      color: 'bg-green-500'
    },
    {
      metric: 'استخدام التخزين',
      value: 82,
      status: 'warning',
      color: 'bg-yellow-500'
    },
    {
      metric: 'الذاكرة المتاحة',
      value: 34,
      status: 'critical',
      color: 'bg-red-500'
    }
  ]

  const recentActivities = [
    {
      id: 1,
      action: 'تم إنشاء مستخدم جديد',
      user: 'أحمد محمد',
      role: 'طالب',
      timestamp: 'منذ 5 دقائق',
      status: 'success',
      icon: CheckCircle
    },
    {
      id: 2,
      action: 'تم تحديث صلاحيات المشرف',
      user: 'د. سارة أحمد',
      role: 'مشرف',
      timestamp: 'منذ 15 دقيقة',
      status: 'success',
      icon: CheckCircle
    },
    {
      id: 3,
      action: 'محاولة دخول غير مصرح بها',
      user: 'مجهول',
      role: 'غير محدد',
      timestamp: 'منذ 30 دقيقة',
      status: 'warning',
      icon: AlertTriangle
    },
    {
      id: 4,
      action: 'تم حذف مشروع',
      user: 'محمد خالد',
      role: 'طالب',
      timestamp: 'منذ ساعة',
      status: 'info',
      icon: FileText
    }
  ]

  const userStats = [
    {
      role: 'طلاب',
      count: 89,
      active: 78,
      percentage: 87.6
    },
    {
      role: 'مشرفين',
      count: 24,
      active: 22,
      percentage: 91.7
    },
    {
      role: 'لجنة المشاريع',
      count: 8,
      active: 8,
      percentage: 100
    },
    {
      role: 'لجنة المناقشة',
      count: 12,
      active: 10,
      percentage: 83.3
    }
  ]

  return (
    <div className="space-y-6">
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
        {/* System Health */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">صحة النظام</h2>
          <div className="space-y-4">
            {systemHealth.map((health, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-medium text-gray-900">{health.metric}</h3>
                  <div className="flex items-center">
                    <span className="text-lg font-bold text-gray-900 mr-2 rtl:mr-0 rtl:ml-2">{health.value}%</span>
                    <span className={`px-2 py-1 text-xs rounded-full ${health.status === 'good' ? 'bg-green-100 text-green-800' :
                        health.status === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                      }`}>
                      {health.status === 'good' ? 'جيد' :
                        health.status === 'warning' ? 'تحذير' : 'حرج'}
                    </span>
                  </div>
                </div>

                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${health.color}`}
                    style={{ width: `${health.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activities */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">الأنشطة الأخيرة</h2>
          <div className="space-y-4">
            {recentActivities.map((activity) => {
              const Icon = activity.icon
              const statusColors = {
                success: 'text-green-500',
                warning: 'text-yellow-500',
                info: 'text-blue-500'
              }

              return (
                <div key={activity.id} className="flex items-start space-x-3 rtl:space-x-reverse">
                  <Icon size={20} className={`mt-1 ${statusColors[activity.status as keyof typeof statusColors]}`} />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                    <p className="text-sm text-gray-600">{activity.user} - {activity.role}</p>
                    <p className="text-xs text-gray-500 mt-1">{activity.timestamp}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* User Statistics */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">إحصائيات المستخدمين</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {userStats.map((stat, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-gray-900">{stat.role}</h3>
                <span className="text-lg font-bold text-gray-900">{stat.count}</span>
              </div>

              <div className="mb-3">
                <div className="flex justify-between text-xs text-gray-600 mb-1">
                  <span>نشط</span>
                  <span>{stat.active}/{stat.count}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gpms-light h-2 rounded-full transition-all duration-300"
                    style={{ width: `${stat.percentage}%` }}
                  />
                </div>
              </div>

              <div className="text-xs text-gray-500">
                معدل النشاط: {stat.percentage}%
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">الإجراءات السريعة</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <button
            onClick={() => navigate('/admin/users')}
            className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-gpms-light hover:bg-gpms-light/5 transition-colors"
          >
            <Users size={24} className="text-gray-400 mr-3 rtl:ml-3 rtl:mr-0" />
            <span className="text-gray-600">إدارة المستخدمين</span>
          </button>
          <button
            onClick={() => navigate('/admin/users')}
            className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-gpms-light hover:bg-gpms-light/5 transition-colors"
          >
            <Shield size={24} className="text-gray-400 mr-3 rtl:ml-3 rtl:mr-0" />
            <span className="text-gray-600">إدارة الصلاحيات</span>
          </button>
          <button
            onClick={() => {
              console.log('Starting backup process...')
              alert('تم بدء عملية النسخ الاحتياطي!')
            }}
            className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-gpms-light hover:bg-gpms-light/5 transition-colors"
          >
            <Database size={24} className="text-gray-400 mr-3 rtl:ml-3 rtl:mr-0" />
            <span className="text-gray-600">النسخ الاحتياطي</span>
          </button>
          <button
            onClick={() => navigate('/admin/reports')}
            className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-gpms-light hover:bg-gpms-light/5 transition-colors"
          >
            <BarChart3 size={24} className="text-gray-400 mr-3 rtl:ml-3 rtl:mr-0" />
            <span className="text-gray-600">تقارير النظام</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
