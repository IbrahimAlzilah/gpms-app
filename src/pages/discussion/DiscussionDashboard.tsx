import React from 'react'
import { useLanguage } from '../../context/LanguageContext'
import { useAuth } from '../../context/AuthContext'
import { 
  Award, 
  Users, 
  Calendar, 
  FileText,
  CheckCircle,
  Clock,
  Star,
  TrendingUp,
  BarChart3,
  ClipboardList
} from 'lucide-react'

const DiscussionDashboard: React.FC = () => {
  const { t } = useLanguage()
  const { user } = useAuth()

  // Mock data
  const stats = [
    {
      title: 'المناقشات المجدولة',
      value: '8',
      icon: Calendar,
      bgColor: 'bg-blue-100',
      color: 'text-blue-600',
      change: '3 هذا الأسبوع'
    },
    {
      title: 'المناقشات المكتملة',
      value: '15',
      icon: CheckCircle,
      bgColor: 'bg-green-100',
      color: 'text-green-600',
      change: '+5 هذا الشهر'
    },
    {
      title: 'المشاريع المعلقة',
      value: '12',
      icon: Clock,
      bgColor: 'bg-yellow-100',
      color: 'text-yellow-600',
      change: '2 عاجلة'
    },
    {
      title: 'متوسط الدرجات',
      value: '85.2',
      icon: Star,
      bgColor: 'bg-purple-100',
      color: 'text-purple-600',
      change: '+2.1 من الشهر الماضي'
    }
  ]

  const upcomingDiscussions = [
    {
      id: 1,
      project: 'تطبيق إدارة المكتبة الذكية',
      students: ['أحمد محمد علي', 'فاطمة حسن محمد'],
      supervisor: 'د. أحمد محمد',
      date: '2024-01-25',
      time: '10:00 AM',
      venue: 'قاعة المناقشات - مبنى الهندسة',
      status: 'scheduled'
    },
    {
      id: 2,
      project: 'نظام إدارة المستودعات',
      students: ['محمد خالد أحمد', 'سارة أحمد محمود'],
      supervisor: 'د. سارة أحمد',
      date: '2024-01-26',
      time: '2:00 PM',
      venue: 'قاعة المناقشات - مبنى الهندسة',
      status: 'scheduled'
    },
    {
      id: 3,
      project: 'منصة التعليم الإلكتروني',
      students: ['علي محمود حسن', 'نور الدين أحمد'],
      supervisor: 'د. خالد محمود',
      date: '2024-01-28',
      time: '11:00 AM',
      venue: 'قاعة المناقشات - مبنى الهندسة',
      status: 'pending'
    }
  ]

  const recentEvaluations = [
    {
      id: 1,
      project: 'تطبيق توصيل الطلبات',
      students: ['يوسف أحمد محمد', 'مريم حسن علي'],
      supervisor: 'د. فاطمة علي',
      date: '2024-01-20',
      grade: 88,
      status: 'completed'
    },
    {
      id: 2,
      project: 'نظام إدارة الموارد البشرية',
      students: ['خالد محمود أحمد', 'سارة محمد حسن'],
      supervisor: 'د. أحمد محمد',
      date: '2024-01-18',
      grade: 92,
      status: 'completed'
    },
    {
      id: 3,
      project: 'تطبيق إدارة المطاعم',
      students: ['عبدالله حسن محمد', 'فاطمة أحمد علي'],
      supervisor: 'د. سارة أحمد',
      date: '2024-01-15',
      grade: 85,
      status: 'completed'
    }
  ]

  const evaluationCriteria = [
    { criterion: 'الابتكار والأصالة', weight: 25, average: 88 },
    { criterion: 'التنفيذ التقني', weight: 30, average: 85 },
    { criterion: 'العرض التقديمي', weight: 20, average: 90 },
    { criterion: 'الوثائق والتقارير', weight: 25, average: 87 }
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
        {/* Upcoming Discussions */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">المناقشات القادمة</h2>
          <div className="space-y-4">
            {upcomingDiscussions.map((discussion) => (
              <div key={discussion.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-gray-900 mb-1">{discussion.project}</h3>
                    <p className="text-xs text-gray-600 mb-1">
                      الطلاب: {discussion.students.join(', ')}
                    </p>
                    <p className="text-xs text-gray-600 mb-1">
                      المشرف: {discussion.supervisor}
                    </p>
                    <p className="text-xs text-gray-500">
                      {discussion.date} - {discussion.time}
                    </p>
                    <p className="text-xs text-gray-500">
                      المكان: {discussion.venue}
                    </p>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    discussion.status === 'scheduled' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {discussion.status === 'scheduled' ? 'مجدولة' : 'معلقة'}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <button className="text-xs text-gpms-dark hover:text-gpms-light font-medium">
                    عرض التفاصيل
                  </button>
                  <div className="flex space-x-1 rtl:space-x-reverse">
                    <button className="px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700">
                      تقييم
                    </button>
                    <button className="px-2 py-1 bg-gray-600 text-white text-xs rounded hover:bg-gray-700">
                      تعديل
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Evaluations */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">التقييمات الأخيرة</h2>
          <div className="space-y-4">
            {recentEvaluations.map((evaluation) => (
              <div key={evaluation.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-gray-900 mb-1">{evaluation.project}</h3>
                    <p className="text-xs text-gray-600 mb-1">
                      الطلاب: {evaluation.students.join(', ')}
                    </p>
                    <p className="text-xs text-gray-600 mb-1">
                      المشرف: {evaluation.supervisor}
                    </p>
                    <p className="text-xs text-gray-500">
                      تاريخ المناقشة: {evaluation.date}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-gray-900">{evaluation.grade}</p>
                    <p className="text-xs text-gray-500">من 100</p>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                    مكتمل
                  </span>
                  <button className="text-xs text-gpms-dark hover:text-gpms-light font-medium">
                    عرض التقييم
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Evaluation Criteria */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">معايير التقييم</h2>
        <div className="space-y-4">
          {evaluationCriteria.map((criteria, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">{criteria.criterion}</h3>
                  <p className="text-xs text-gray-600">الوزن: {criteria.weight}%</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-gray-900">{criteria.average}</p>
                  <p className="text-xs text-gray-500">متوسط</p>
                </div>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gpms-light h-2 rounded-full transition-all duration-300"
                  style={{ width: `${criteria.average}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">الإجراءات السريعة</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <button className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-gpms-light hover:bg-gpms-light/5 transition-colors">
            <Award size={24} className="text-gray-400 mr-3 rtl:ml-3 rtl:mr-0" />
            <span className="text-gray-600">تقييم المشاريع</span>
          </button>
          <button className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-gpms-light hover:bg-gpms-light/5 transition-colors">
            <Calendar size={24} className="text-gray-400 mr-3 rtl:ml-3 rtl:mr-0" />
            <span className="text-gray-600">جدولة المناقشات</span>
          </button>
          <button className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-gpms-light hover:bg-gpms-light/5 transition-colors">
            <ClipboardList size={24} className="text-gray-400 mr-3 rtl:ml-3 rtl:mr-0" />
            <span className="text-gray-600">نماذج التقييم</span>
          </button>
          <button className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-gpms-light hover:bg-gpms-light/5 transition-colors">
            <BarChart3 size={24} className="text-gray-400 mr-3 rtl:ml-3 rtl:mr-0" />
            <span className="text-gray-600">تقارير الدرجات</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default DiscussionDashboard
