import React, { useState, useEffect } from 'react'
import { useLanguage } from '../../context/LanguageContext'
import { useNotifications } from '../../context/NotificationContext'
import { cn } from '../../lib/utils'
import Button from '../ui/Button'
import { Card, CardContent, CardHeader } from '../ui/Card'
import { Badge } from '../ui/Badge'
import ProgressBar from '../ui/ProgressBar'
import StatCard from '../ui/StatCard'
import { Chart, BarChart, PieChart } from '../ui/Charts'
import { 
  TrendingUp, 
  Users, 
  BookOpen, 
  Award,
  Calendar,
  Clock,
  CheckCircle,
  AlertTriangle,
  FileText,
  BarChart3
} from 'lucide-react'

interface DashboardOverviewProps {
  className?: string
}

const DashboardOverview: React.FC<DashboardOverviewProps> = ({ className }) => {
  const { t } = useLanguage()
  const { addNotification } = useNotifications()
  const [isLoading, setIsLoading] = useState(true)

  // Mock data
  const stats = {
    totalProjects: 89,
    activeProjects: 42,
    completedProjects: 34,
    pendingProjects: 13,
    totalStudents: 156,
    activeStudents: 143,
    totalSupervisors: 24,
    avgCompletionTime: 4.2
  }

  const recentActivities = [
    {
      id: 1,
      type: 'project_approved',
      title: 'تم قبول مقترح مشروع جديد',
      description: 'مشروع "تطبيق إدارة المكتبة الذكية" - الطالب أحمد محمد',
      time: 'منذ 30 دقيقة',
      icon: CheckCircle,
      color: 'text-green-600'
    },
    {
      id: 2,
      type: 'deadline_approaching',
      title: 'موعد تسليم قريب',
      description: 'تقرير المرحلة الأولى - 3 أيام متبقية',
      time: 'منذ ساعة',
      icon: AlertTriangle,
      color: 'text-yellow-600'
    },
    {
      id: 3,
      type: 'new_supervisor',
      title: 'تم تعيين مشرف جديد',
      description: 'د. سارة أحمد - مشروع "نظام إدارة المستشفى"',
      time: 'منذ ساعتين',
      icon: Users,
      color: 'text-blue-600'
    },
    {
      id: 4,
      type: 'meeting_scheduled',
      title: 'اجتماع مجدول',
      description: 'اجتماع متابعة المشاريع - غداً 10:00 ص',
      time: 'منذ 3 ساعات',
      icon: Calendar,
      color: 'text-purple-600'
    }
  ]

  const projectStatusData = [
    { label: 'مكتمل', value: 34, color: 'bg-green-500' },
    { label: 'قيد التنفيذ', value: 42, color: 'bg-blue-500' },
    { label: 'معلق', value: 13, color: 'bg-yellow-500' }
  ]

  const departmentData = [
    { label: 'هندسة الحاسوب', value: 45 },
    { label: 'هندسة البرمجيات', value: 32 },
    { label: 'أمن المعلومات', value: 12 }
  ]

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  const handleQuickAction = (action: string) => {
    addNotification({
      title: 'تم تنفيذ الإجراء',
      message: `تم تنفيذ: ${action}`,
      type: 'success'
    })
  }

  if (isLoading) {
    return (
      <div className={cn('space-y-6', className)}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className={cn('space-y-6', className)}>
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="إجمالي المشاريع"
          value={stats.totalProjects}
          change="+12% من الشهر الماضي"
          changeType="positive"
          icon={<BookOpen className="w-6 h-6 text-gpms-dark" />}
          className="hover-lift"
        />
        <StatCard
          title="المشاريع النشطة"
          value={stats.activeProjects}
          change="+8% من الشهر الماضي"
          changeType="positive"
          icon={<TrendingUp className="w-6 h-6 text-gpms-light" />}
          className="hover-lift"
        />
        <StatCard
          title="المشاريع المكتملة"
          value={stats.completedProjects}
          change="+15% من الشهر الماضي"
          changeType="positive"
          icon={<Award className="w-6 h-6 text-gpms-green" />}
          className="hover-lift"
        />
        <StatCard
          title="الطلاب النشطون"
          value={stats.activeStudents}
          change="+5% من الشهر الماضي"
          changeType="positive"
          icon={<Users className="w-6 h-6 text-purple-600" />}
          className="hover-lift"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Project Status Chart */}
        <div className="lg:col-span-2">
          <Card className="hover-lift">
            <CardHeader>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">حالة المشاريع</h3>
                <Badge variant="info">هذا الشهر</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <BarChart data={projectStatusData} />
                <div className="grid grid-cols-3 gap-4 text-center">
                  {projectStatusData.map((item, index) => (
                    <div key={index} className="space-y-2">
                      <div className={cn('w-4 h-4 rounded-full mx-auto', item.color)}></div>
                      <div className="text-sm font-medium text-gray-900">{item.value}</div>
                      <div className="text-xs text-gray-500">{item.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Department Distribution */}
        <div>
          <Card className="hover-lift">
            <CardHeader>
              <h3 className="text-lg font-semibold text-gray-900">التوزيع حسب القسم</h3>
            </CardHeader>
            <CardContent>
              <PieChart data={departmentData.map((item, index) => ({
                ...item,
                color: ['#1A3B6A', '#5E8BC2', '#6CC04A'][index]
              }))} />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recent Activities & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <Card className="hover-lift">
          <CardHeader>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">الأنشطة الأخيرة</h3>
              <Button variant="outline" size="sm">
                عرض الكل
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => {
                const Icon = activity.icon
                return (
                  <div key={activity.id} className="flex items-start space-x-3 rtl:space-x-reverse">
                    <div className={cn('flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center', 
                      activity.color.replace('text-', 'bg-').replace('-600', '-100')
                    )}>
                      <Icon className={cn('w-4 h-4', activity.color)} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                      <p className="text-sm text-gray-600">{activity.description}</p>
                      <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="hover-lift">
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900">إجراءات سريعة</h3>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <Button
                variant="outline"
                className="h-20 flex-col space-y-2"
                onClick={() => handleQuickAction('إضافة مشروع جديد')}
              >
                <BookOpen className="w-6 h-6" />
                <span className="text-sm">مشروع جديد</span>
              </Button>
              
              <Button
                variant="outline"
                className="h-20 flex-col space-y-2"
                onClick={() => handleQuickAction('إنشاء تقرير')}
              >
                <BarChart3 className="w-6 h-6" />
                <span className="text-sm">إنشاء تقرير</span>
              </Button>
              
              <Button
                variant="outline"
                className="h-20 flex-col space-y-2"
                onClick={() => handleQuickAction('جدولة اجتماع')}
              >
                <Calendar className="w-6 h-6" />
                <span className="text-sm">جدولة اجتماع</span>
              </Button>
              
              <Button
                variant="outline"
                className="h-20 flex-col space-y-2"
                onClick={() => handleQuickAction('رفع مستند')}
              >
                <FileText className="w-6 h-6" />
                <span className="text-sm">رفع مستند</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progress Overview */}
      <Card className="hover-lift">
        <CardHeader>
          <h3 className="text-lg font-semibold text-gray-900">نظرة عامة على التقدم</h3>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-gpms-dark mb-2">78%</div>
                <div className="text-sm text-gray-600 mb-2">معدل إكمال المشاريع</div>
                <ProgressBar value={78} color="blue" />
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-gpms-green mb-2">92%</div>
                <div className="text-sm text-gray-600 mb-2">رضا الطلاب</div>
                <ProgressBar value={92} color="green" />
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600 mb-2">85%</div>
                <div className="text-sm text-gray-600 mb-2">فعالية المشرفين</div>
                <ProgressBar value={85} color="purple" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default DashboardOverview
