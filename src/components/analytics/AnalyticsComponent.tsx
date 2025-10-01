import React, { useState } from 'react'
import { useLanguage } from '../../context/LanguageContext'
import { cn } from '../../lib/utils'
import { Card, CardContent, CardHeader } from '../ui/Card'
import Button from '../ui/Button'
import Badge from '../ui/Badge'
import StatCard from '../ui/StatCard'
import ProgressBar from '../ui/ProgressBar'
import { Chart, BarChart, PieChart } from '../ui/Charts'
import { 
  TrendingUp, 
  TrendingDown,
  Users, 
  BookOpen, 
  Award,
  Clock,
  Target,
  BarChart3,
  PieChart as PieChartIcon,
  Download,
  Filter,
  Calendar,
  RefreshCw
} from 'lucide-react'

interface AnalyticsProps {
  className?: string
}

const AnalyticsComponent: React.FC<AnalyticsProps> = ({ className }) => {
  const { t } = useLanguage()
  const [timeRange, setTimeRange] = useState('month')
  const [isLoading, setIsLoading] = useState(false)

  // Mock analytics data
  const overviewStats = {
    totalProjects: 89,
    activeProjects: 42,
    completedProjects: 34,
    totalStudents: 156,
    totalSupervisors: 24,
    avgCompletionTime: 4.2,
    successRate: 78.5,
    satisfactionRate: 92.3
  }

  const projectTrends = [
    { month: 'يناير', projects: 12, completed: 8 },
    { month: 'فبراير', projects: 15, completed: 10 },
    { month: 'مارس', projects: 18, completed: 14 },
    { month: 'أبريل', projects: 22, completed: 16 },
    { month: 'مايو', projects: 25, completed: 20 },
    { month: 'يونيو', projects: 28, completed: 24 }
  ]

  const departmentStats = [
    { name: 'هندسة الحاسوب', projects: 45, students: 78, completionRate: 82 },
    { name: 'هندسة البرمجيات', projects: 32, students: 56, completionRate: 75 },
    { name: 'أمن المعلومات', projects: 12, students: 22, completionRate: 88 }
  ]

  const supervisorPerformance = [
    { name: 'د. أحمد محمد', projects: 8, avgRating: 4.8, completionRate: 95 },
    { name: 'د. سارة أحمد', projects: 7, avgRating: 4.9, completionRate: 92 },
    { name: 'د. خالد محمود', projects: 6, avgRating: 4.7, completionRate: 88 },
    { name: 'د. فاطمة علي', projects: 5, avgRating: 4.6, completionRate: 85 }
  ]

  const projectStatusData = [
    { label: 'مكتمل', value: 34, color: 'bg-green-500' },
    { label: 'قيد التنفيذ', value: 42, color: 'bg-blue-500' },
    { label: 'معلق', value: 13, color: 'bg-yellow-500' }
  ]

  const timeRangeOptions = [
    { value: 'week', label: 'هذا الأسبوع' },
    { value: 'month', label: 'هذا الشهر' },
    { value: 'quarter', label: 'هذا الربع' },
    { value: 'year', label: 'هذا العام' }
  ]

  const handleRefresh = async () => {
    setIsLoading(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIsLoading(false)
  }

  const handleExport = (format: string) => {
    console.log(`Exporting analytics as ${format}`)
    // Implement export functionality
  }

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header */}
      <Card className="hover-lift">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 rtl:space-x-reverse">
              <BarChart3 className="w-6 h-6 text-gpms-dark" />
              <h2 className="text-xl font-bold text-gray-900">التحليلات والإحصائيات</h2>
            </div>
            
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-gpms-light focus:border-transparent"
              >
                {timeRangeOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                loading={isLoading}
              >
                <RefreshCw className="w-4 h-4" />
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleExport('pdf')}
              >
                <Download className="w-4 h-4 mr-1 rtl:mr-0 rtl:ml-1" />
                تصدير
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="إجمالي المشاريع"
          value={overviewStats.totalProjects}
          change="+12% من الشهر الماضي"
          changeType="positive"
          icon={<BookOpen className="w-6 h-6 text-gpms-dark" />}
          className="hover-lift"
        />
        <StatCard
          title="المشاريع النشطة"
          value={overviewStats.activeProjects}
          change="+8% من الشهر الماضي"
          changeType="positive"
          icon={<Target className="w-6 h-6 text-gpms-light" />}
          className="hover-lift"
        />
        <StatCard
          title="معدل النجاح"
          value={`${overviewStats.successRate}%`}
          change="+5% من الشهر الماضي"
          changeType="positive"
          icon={<Award className="w-6 h-6 text-gpms-green" />}
          className="hover-lift"
        />
        <StatCard
          title="رضا الطلاب"
          value={`${overviewStats.satisfactionRate}%`}
          change="+3% من الشهر الماضي"
          changeType="positive"
          icon={<Users className="w-6 h-6 text-purple-600" />}
          className="hover-lift"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Project Trends */}
        <Card className="hover-lift">
          <CardHeader>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">اتجاه المشاريع</h3>
              <Badge variant="info">6 أشهر</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <Chart>
              <BarChart 
                data={projectTrends.map(item => ({
                  label: item.month,
                  value: item.projects,
                  color: 'bg-gpms-light'
                }))} 
              />
            </Chart>
          </CardContent>
        </Card>

        {/* Project Status Distribution */}
        <Card className="hover-lift">
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900">توزيع حالة المشاريع</h3>
          </CardHeader>
          <CardContent>
            <PieChart data={projectStatusData} />
          </CardContent>
        </Card>
      </div>

      {/* Department Performance */}
      <Card className="hover-lift">
        <CardHeader>
          <h3 className="text-lg font-semibold text-gray-900">أداء الأقسام</h3>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {departmentStats.map((dept, index) => (
              <div key={index} className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-gray-900">{dept.name}</h4>
                  <div className="flex items-center space-x-4 rtl:space-x-reverse text-sm text-gray-600">
                    <span>{dept.projects} مشروع</span>
                    <span>{dept.students} طالب</span>
                    <span>{dept.completionRate}% إكمال</span>
                  </div>
                </div>
                <ProgressBar
                  value={dept.completionRate}
                  color="blue"
                  label={`معدل الإكمال: ${dept.completionRate}%`}
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Supervisor Performance */}
      <Card className="hover-lift">
        <CardHeader>
          <h3 className="text-lg font-semibold text-gray-900">أداء المشرفين</h3>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-right py-3 px-4 font-medium text-gray-900">المشرف</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-900">المشاريع</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-900">التقييم</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-900">معدل الإكمال</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-900">الحالة</th>
                </tr>
              </thead>
              <tbody>
                {supervisorPerformance.map((supervisor, index) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium text-gray-900">{supervisor.name}</td>
                    <td className="py-3 px-4 text-gray-600">{supervisor.projects}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-1 rtl:space-x-reverse">
                        <span className="text-yellow-500">★</span>
                        <span className="text-gray-600">{supervisor.avgRating}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="w-20">
                        <ProgressBar
                          value={supervisor.completionRate}
                          color="green"
                          size="sm"
                        />
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <Badge 
                        variant={supervisor.completionRate >= 90 ? 'success' : 
                                supervisor.completionRate >= 80 ? 'info' : 'warning'}
                        size="sm"
                      >
                        {supervisor.completionRate >= 90 ? 'ممتاز' :
                         supervisor.completionRate >= 80 ? 'جيد' : 'متوسط'}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="hover-lift">
          <CardContent className="p-6">
            <div className="text-center">
              <Clock className="w-12 h-12 text-gpms-light mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {overviewStats.avgCompletionTime} أشهر
              </h3>
              <p className="text-gray-600">متوسط وقت الإكمال</p>
              <div className="mt-4">
                <Badge variant="info">تحسن 15%</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover-lift">
          <CardContent className="p-6">
            <div className="text-center">
              <TrendingUp className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">+24%</h3>
              <p className="text-gray-600">نمو المشاريع</p>
              <div className="mt-4">
                <Badge variant="success">أعلى من المتوقع</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover-lift">
          <CardContent className="p-6">
            <div className="text-center">
              <Users className="w-12 h-12 text-purple-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">92%</h3>
              <p className="text-gray-600">معدل الرضا</p>
              <div className="mt-4">
                <Badge variant="success">ممتاز</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="hover-lift">
        <CardHeader>
          <h3 className="text-lg font-semibold text-gray-900">الأنشطة الأخيرة</h3>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { action: 'تم إكمال مشروع', project: 'تطبيق إدارة المكتبة', time: 'منذ ساعتين', type: 'success' },
              { action: 'تم رفع تقرير', project: 'نظام إدارة المستشفى', time: 'منذ 4 ساعات', type: 'info' },
              { action: 'تم تعيين مشرف', project: 'مشروع الذكاء الاصطناعي', time: 'منذ 6 ساعات', type: 'warning' },
              { action: 'تم قبول مقترح', project: 'تطبيق التجارة الإلكترونية', time: 'منذ يوم', type: 'success' }
            ].map((activity, index) => (
              <div key={index} className="flex items-center space-x-3 rtl:space-x-reverse p-3 bg-gray-50 rounded-lg">
                <div className={cn(
                  'w-2 h-2 rounded-full',
                  activity.type === 'success' ? 'bg-green-500' :
                  activity.type === 'info' ? 'bg-blue-500' :
                  activity.type === 'warning' ? 'bg-yellow-500' : 'bg-gray-500'
                )} />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    {activity.action}: {activity.project}
                  </p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default AnalyticsComponent
