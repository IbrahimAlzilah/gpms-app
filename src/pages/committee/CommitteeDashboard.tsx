import React from 'react'
import { useLanguage } from '../../context/LanguageContext'
import { useAuth } from '../../context/AuthContext'
import { 
  FileText, 
  Users, 
  Calendar, 
  BarChart3,
  CheckCircle,
  Clock,
  AlertCircle,
  TrendingUp,
  Settings,
  UserCheck
} from 'lucide-react'

const CommitteeDashboard: React.FC = () => {
  const { t } = useLanguage()
  const { user } = useAuth()

  // Mock data
  const stats = [
    {
      title: 'المقترحات المعلقة',
      value: '15',
      icon: FileText,
      bgColor: 'bg-yellow-100',
      color: 'text-yellow-600',
      change: '5 جديدة هذا الأسبوع'
    },
    {
      title: 'المشاريع النشطة',
      value: '42',
      icon: Users,
      bgColor: 'bg-blue-100',
      color: 'text-blue-600',
      change: '+3 هذا الشهر'
    },
    {
      title: 'المشرفين المتاحين',
      value: '8',
      icon: UserCheck,
      bgColor: 'bg-green-100',
      color: 'text-green-600',
      change: '2 متاحون الآن'
    },
    {
      title: 'الطلبات المعلقة',
      value: '23',
      icon: Clock,
      bgColor: 'bg-orange-100',
      color: 'text-orange-600',
      change: '7 عاجلة'
    }
  ]

  const recentProposals = [
    {
      id: 1,
      title: 'تطبيق إدارة المكتبة الذكية',
      student: 'أحمد محمد علي',
      department: 'هندسة الحاسوب',
      submittedDate: '2024-01-22',
      status: 'pending',
      priority: 'high',
      supervisor: null
    },
    {
      id: 2,
      title: 'نظام إدارة المستودعات',
      student: 'فاطمة حسن محمد',
      department: 'هندسة الحاسوب',
      submittedDate: '2024-01-21',
      status: 'approved',
      priority: 'normal',
      supervisor: 'د. أحمد محمد'
    },
    {
      id: 3,
      title: 'منصة التعليم الإلكتروني',
      student: 'محمد خالد أحمد',
      department: 'هندسة الحاسوب',
      submittedDate: '2024-01-20',
      status: 'pending',
      priority: 'normal',
      supervisor: null
    }
  ]

  const upcomingDeadlines = [
    {
      title: 'موعد تسليم المقترحات',
      date: '2024-02-01',
      type: 'proposal_deadline',
      status: 'urgent'
    },
    {
      title: 'موعد تسليم التقارير النهائية',
      date: '2024-02-15',
      type: 'final_report',
      status: 'normal'
    },
    {
      title: 'موعد المناقشات',
      date: '2024-03-01',
      type: 'discussion',
      status: 'normal'
    }
  ]

  const supervisorWorkload = [
    {
      name: 'د. أحمد محمد',
      currentProjects: 5,
      maxCapacity: 8,
      availability: 'متاح'
    },
    {
      name: 'د. سارة أحمد',
      currentProjects: 7,
      maxCapacity: 8,
      availability: 'مشغول'
    },
    {
      name: 'د. خالد محمود',
      currentProjects: 3,
      maxCapacity: 8,
      availability: 'متاح'
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
        {/* Recent Proposals */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">المقترحات الأخيرة</h2>
          <div className="space-y-4">
            {recentProposals.map((proposal) => (
              <div key={proposal.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-gray-900 mb-1">{proposal.title}</h3>
                    <p className="text-xs text-gray-600 mb-1">
                      الطالب: {proposal.student} - {proposal.department}
                    </p>
                    <p className="text-xs text-gray-500">
                      تاريخ الإرسال: {proposal.submittedDate}
                    </p>
                  </div>
                  <div className="flex flex-col items-end space-y-1">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      proposal.status === 'approved' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {proposal.status === 'approved' ? 'مقبول' : 'معلق'}
                    </span>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      proposal.priority === 'high' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {proposal.priority === 'high' ? 'عاجل' : 'عادي'}
                    </span>
                  </div>
                </div>
                
                {proposal.supervisor && (
                  <div className="text-xs text-gray-600 mb-2">
                    المشرف المعين: {proposal.supervisor}
                  </div>
                )}
                
                <div className="flex justify-between items-center">
                  <button className="text-xs text-gpms-dark hover:text-gpms-light font-medium">
                    عرض التفاصيل
                  </button>
                  {proposal.status === 'pending' && (
                    <div className="flex space-x-1 rtl:space-x-reverse">
                      <button className="px-2 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700">
                        قبول
                      </button>
                      <button className="px-2 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700">
                        رفض
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Deadlines */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">المواعيد القادمة</h2>
          <div className="space-y-4">
            {upcomingDeadlines.map((deadline, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-gray-900">{deadline.title}</h3>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    deadline.status === 'urgent' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {deadline.status === 'urgent' ? 'عاجل' : 'عادي'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs text-gray-600">
                  <span>{deadline.date}</span>
                  <span className="capitalize">{deadline.type.replace('_', ' ')}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Supervisor Workload */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">حمل العمل للمشرفين</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {supervisorWorkload.map((supervisor, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-gray-900">{supervisor.name}</h3>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  supervisor.availability === 'متاح' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {supervisor.availability}
                </span>
              </div>
              
              <div className="mb-3">
                <div className="flex justify-between text-xs text-gray-600 mb-1">
                  <span>المشاريع الحالية</span>
                  <span>{supervisor.currentProjects}/{supervisor.maxCapacity}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${
                      supervisor.currentProjects / supervisor.maxCapacity > 0.8 
                        ? 'bg-red-500' 
                        : supervisor.currentProjects / supervisor.maxCapacity > 0.6
                        ? 'bg-yellow-500'
                        : 'bg-green-500'
                    }`}
                    style={{ width: `${(supervisor.currentProjects / supervisor.maxCapacity) * 100}%` }}
                  />
                </div>
              </div>
              
              <div className="text-xs text-gray-500">
                السعة المتبقية: {supervisor.maxCapacity - supervisor.currentProjects} مشروع
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
            <FileText size={24} className="text-gray-400 mr-3 rtl:ml-3 rtl:mr-0" />
            <span className="text-gray-600">مراجعة المقترحات</span>
          </button>
          <button className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-gpms-light hover:bg-gpms-light/5 transition-colors">
            <UserCheck size={24} className="text-gray-400 mr-3 rtl:ml-3 rtl:mr-0" />
            <span className="text-gray-600">تعيين المشرفين</span>
          </button>
          <button className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-gpms-light hover:bg-gpms-light/5 transition-colors">
            <Calendar size={24} className="text-gray-400 mr-3 rtl:ml-3 rtl:mr-0" />
            <span className="text-gray-600">إعلان الجداول</span>
          </button>
          <button className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-gpms-light hover:bg-gpms-light/5 transition-colors">
            <BarChart3 size={24} className="text-gray-400 mr-3 rtl:ml-3 rtl:mr-0" />
            <span className="text-gray-600">إصدار التقارير</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default CommitteeDashboard
