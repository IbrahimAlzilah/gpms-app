import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { Card, CardContent, CardHeader } from '@/components/ui/Card'
import StatCard from './shared/StatCard'
import RecentActivities from './shared/RecentActivities'
import { useDashboardData } from '../hooks/useDashboardData'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import Button from '@/components/ui/Button'
import {
  FileText,
  Users,
  UserCheck,
  Clock,
  CheckCircle,
  TrendingUp,
  BarChart3
} from 'lucide-react'

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  FileText,
  Users,
  UserCheck,
  Clock
}

const CommitteeDashboard: React.FC = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { data, isLoading, error } = useDashboardData()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner />
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">حدث خطأ في تحميل البيانات</p>
      </div>
    )
  }

  const committeeData = data as import('../types').CommitteeDashboardData

  const statsWithNavigation = committeeData.stats.map(stat => ({
    ...stat,
    onClick: () => {
      if (stat.title === 'المقترحات المعلقة') navigate('/proposals')
      else if (stat.title === 'المشاريع النشطة') navigate('/projects')
      else if (stat.title === 'المشرفين المتاحين') navigate('/users')
      else if (stat.title === 'الطلبات المعلقة') navigate('/requests')
    }
  }))

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <Card className="bg-gradient-to-r from-purple-600 to-purple-700 text-white border-0 shadow-lg">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold mb-2">
                مرحباً، {user?.fullName || 'عضو اللجنة'}
              </h1>
              <p className="text-purple-100">
                لوحة تحكم اللجنة - إدارة المقترحات والمشاريع
              </p>
            </div>
            <div className="hidden md:flex items-center gap-3">
              <Button
                variant="outline"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                onClick={() => navigate('/proposals')}
              >
                <FileText className="w-4 h-4 ml-2" />
                المقترحات
              </Button>
              <Button
                variant="outline"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                onClick={() => navigate('/reports')}
              >
                <BarChart3 className="w-4 h-4 ml-2" />
                التقارير
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsWithNavigation.map((stat, index) => {
          const Icon = iconMap[stat.icon] || FileText
          return (
            <StatCard
              key={index}
              title={stat.title}
              value={stat.value}
              change={stat.change}
              changeType={stat.changeType}
              icon={Icon}
              bgColor={stat.bgColor}
              color={stat.color}
              onClick={stat.onClick}
            />
          )
        })}
      </div>

      {/* Quick Actions & Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <Card className="lg:col-span-1 border-0 shadow-md">
          <CardHeader className="pb-3">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-purple-600" />
              إجراءات سريعة
            </h2>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button
              variant="outline"
              className="w-full justify-start h-auto py-3 hover:bg-yellow-50 hover:border-yellow-200"
              onClick={() => navigate('/proposals')}
            >
              <FileText className="w-5 h-5 ml-3 text-yellow-600" />
              <div className="text-right">
                <div className="font-medium">مراجعة المقترحات</div>
                <div className="text-xs text-gray-500">عرض المقترحات المعلقة</div>
              </div>
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start h-auto py-3 hover:bg-blue-50 hover:border-blue-200"
              onClick={() => navigate('/projects')}
            >
              <Users className="w-5 h-5 ml-3 text-blue-600" />
              <div className="text-right">
                <div className="font-medium">المشاريع النشطة</div>
                <div className="text-xs text-gray-500">عرض جميع المشاريع</div>
              </div>
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start h-auto py-3 hover:bg-green-50 hover:border-green-200"
              onClick={() => navigate('/distribution')}
            >
              <UserCheck className="w-5 h-5 ml-3 text-green-600" />
              <div className="text-right">
                <div className="font-medium">توزيع اللجان</div>
                <div className="text-xs text-gray-500">إدارة توزيع اللجان</div>
              </div>
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start h-auto py-3 hover:bg-purple-50 hover:border-purple-200"
              onClick={() => navigate('/reports')}
            >
              <BarChart3 className="w-5 h-5 ml-3 text-purple-600" />
              <div className="text-right">
                <div className="font-medium">إصدار التقارير</div>
                <div className="text-xs text-gray-500">إنشاء تقرير جديد</div>
              </div>
            </Button>
          </CardContent>
        </Card>

        {/* Recent Activities */}
        <div className="lg:col-span-2">
          <RecentActivities activities={committeeData.activities} />
        </div>
      </div>
    </div>
  )
}

export default CommitteeDashboard
