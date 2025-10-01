import React from 'react'
import { useLanguage } from '../../context/LanguageContext'
import { useAuth } from '../../context/AuthContext'
import { 
  Users, 
  FileText, 
  Send, 
  Clock,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Calendar,
  MessageSquare
} from 'lucide-react'

const SupervisorDashboard: React.FC = () => {
  const { t } = useLanguage()
  const { user } = useAuth()

  // Mock data
  const stats = [
    {
      title: 'المشاريع المشرفة عليها',
      value: '8',
      icon: Users,
      bgColor: 'bg-blue-100',
      color: 'text-blue-600',
      change: '+2 هذا الشهر'
    },
    {
      title: 'طلبات الإشراف',
      value: '5',
      icon: Send,
      bgColor: 'bg-yellow-100',
      color: 'text-yellow-600',
      change: '3 جديدة'
    },
    {
      title: 'التقارير المعلقة',
      value: '12',
      icon: FileText,
      bgColor: 'bg-orange-100',
      color: 'text-orange-600',
      change: '2 عاجلة'
    },
    {
      title: 'الاجتماعات المجدولة',
      value: '4',
      icon: Calendar,
      bgColor: 'bg-green-100',
      color: 'text-green-600',
      change: 'هذا الأسبوع'
    }
  ]

  const supervisedProjects = [
    {
      id: 1,
      title: 'تطبيق إدارة المكتبة الذكية',
      students: ['أحمد محمد', 'فاطمة حسن'],
      status: 'in_progress',
      progress: 75,
      lastMeeting: '2024-01-20',
      nextDeadline: '2024-02-01'
    },
    {
      id: 2,
      title: 'نظام إدارة المستودعات',
      students: ['محمد خالد', 'سارة أحمد'],
      status: 'in_progress',
      progress: 60,
      lastMeeting: '2024-01-18',
      nextDeadline: '2024-01-25'
    },
    {
      id: 3,
      title: 'منصة التعليم الإلكتروني',
      students: ['علي محمود', 'نور الدين'],
      status: 'pending',
      progress: 30,
      lastMeeting: '2024-01-15',
      nextDeadline: '2024-01-30'
    }
  ]

  const pendingRequests = [
    {
      id: 1,
      student: 'يوسف أحمد',
      project: 'تطبيق إدارة المطاعم',
      type: 'supervision_request',
      submittedDate: '2024-01-22',
      priority: 'high'
    },
    {
      id: 2,
      student: 'مريم حسن',
      project: 'نظام حجز المواعيد',
      type: 'supervision_request',
      submittedDate: '2024-01-21',
      priority: 'normal'
    },
    {
      id: 3,
      student: 'خالد محمود',
      project: 'تطبيق توصيل الطلبات',
      type: 'meeting_request',
      submittedDate: '2024-01-20',
      priority: 'normal'
    }
  ]

  const upcomingMeetings = [
    {
      id: 1,
      project: 'تطبيق إدارة المكتبة الذكية',
      students: ['أحمد محمد', 'فاطمة حسن'],
      date: '2024-01-25',
      time: '10:00 AM',
      type: 'progress_review'
    },
    {
      id: 2,
      project: 'نظام إدارة المستودعات',
      students: ['محمد خالد', 'سارة أحمد'],
      date: '2024-01-26',
      time: '2:00 PM',
      type: 'technical_discussion'
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
        {/* Supervised Projects */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">المشاريع المشرفة عليها</h2>
          <div className="space-y-4">
            {supervisedProjects.map((project) => (
              <div key={project.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-gray-900 mb-1">{project.title}</h3>
                    <p className="text-xs text-gray-600">
                      الطلاب: {project.students.join(', ')}
                    </p>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    project.status === 'in_progress' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {project.status === 'in_progress' ? 'قيد التنفيذ' : 'معلق'}
                  </span>
                </div>
                
                <div className="mb-3">
                  <div className="flex justify-between text-xs text-gray-600 mb-1">
                    <span>التقدم</span>
                    <span>{project.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gpms-light h-2 rounded-full transition-all duration-300"
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                </div>

                <div className="flex justify-between text-xs text-gray-500">
                  <span>آخر اجتماع: {project.lastMeeting}</span>
                  <span>الموعد القادم: {project.nextDeadline}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pending Requests */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">الطلبات المعلقة</h2>
          <div className="space-y-4">
            {pendingRequests.map((request) => (
              <div key={request.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-gray-900">{request.student}</h3>
                    <p className="text-xs text-gray-600">{request.project}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    request.priority === 'high' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {request.priority === 'high' ? 'عاجل' : 'عادي'}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mb-3">
                  {request.type === 'supervision_request' ? 'طلب إشراف' : 'طلب اجتماع'}
                </p>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>تاريخ الإرسال: {request.submittedDate}</span>
                  <button className="text-gpms-dark hover:text-gpms-light font-medium">
                    مراجعة
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Upcoming Meetings */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">الاجتماعات القادمة</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {upcomingMeetings.map((meeting) => (
            <div key={meeting.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-gray-900 mb-1">{meeting.project}</h3>
                  <p className="text-xs text-gray-600">
                    الطلاب: {meeting.students.join(', ')}
                  </p>
                </div>
                <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                  {meeting.type === 'progress_review' ? 'مراجعة تقدم' : 'مناقشة تقنية'}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>{meeting.date} - {meeting.time}</span>
                <button className="text-gpms-dark hover:text-gpms-light font-medium">
                  عرض التفاصيل
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">الإجراءات السريعة</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button 
            onClick={() => window.location.href = '/supervisor/notes'}
            className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-gpms-light hover:bg-gpms-light/5 transition-colors"
          >
            <MessageSquare size={24} className="text-gray-400 mr-3 rtl:ml-3 rtl:mr-0" />
            <span className="text-gray-600">إضافة ملاحظات</span>
          </button>
          <button 
            onClick={() => window.location.href = '/supervisor/evaluations'}
            className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-gpms-light hover:bg-gpms-light/5 transition-colors"
          >
            <TrendingUp size={24} className="text-gray-400 mr-3 rtl:ml-3 rtl:mr-0" />
            <span className="text-gray-600">تقييم المشاريع</span>
          </button>
          <button 
            onClick={() => window.location.href = '/supervisor/schedule'}
            className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-gpms-light hover:bg-gpms-light/5 transition-colors"
          >
            <Calendar size={24} className="text-gray-400 mr-3 rtl:ml-3 rtl:mr-0" />
            <span className="text-gray-600">جدولة اجتماع</span>
          </button>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">الأنشطة الأخيرة</h2>
        <div className="space-y-4">
          <div className="flex items-start space-x-3 rtl:space-x-reverse">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <CheckCircle size={16} className="text-blue-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-900">تم قبول طلب إشراف من أحمد محمد</p>
              <p className="text-xs text-gray-500">منذ ساعتين</p>
            </div>
          </div>
          <div className="flex items-start space-x-3 rtl:space-x-reverse">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <TrendingUp size={16} className="text-green-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-900">تم تقييم مشروع "تطبيق المكتبة الذكية"</p>
              <p className="text-xs text-gray-500">منذ 4 ساعات</p>
            </div>
          </div>
          <div className="flex items-start space-x-3 rtl:space-x-reverse">
            <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
              <AlertCircle size={16} className="text-yellow-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-900">تقرير تقدم معلق من فاطمة حسن</p>
              <p className="text-xs text-gray-500">منذ يوم واحد</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SupervisorDashboard
