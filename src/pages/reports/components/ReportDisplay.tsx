import React from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { BarChart, PieChart } from '@/components/ui/Charts'
import { FileText, Download, TrendingUp, Users, Award, Calendar, ChevronRight } from 'lucide-react'
import { ProjectReport, StudentReport, EvaluationReport, StatisticsReport } from '@/services/reports.service'
import { cn } from '@/lib/utils'

interface ReportDisplayProps {
  reportType: string
  report: ProjectReport | StudentReport | EvaluationReport | StatisticsReport
  onDownload: (format: 'pdf' | 'excel') => void
}

const StatBox: React.FC<{ label: string; value: string | number; icon: React.ReactNode; color: string }> = ({
  label,
  value,
  icon,
  color
}) => (
  <div className={cn(
    'relative overflow-hidden p-6 rounded-2xl border transition-all duration-300 hover:shadow-md group',
    'bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800'
  )}>
    <div className={cn(
      "absolute top-0 right-0 w-32 h-32 -mr-8 -mt-8 rounded-full opacity-10 transition-transform group-hover:scale-110",
      color.replace('text-', 'bg-')
    )} />

    <div className="relative z-10">
      <div className="flex items-center justify-between mb-4">
        <div className={cn("p-2.5 rounded-xl bg-gray-50 dark:bg-gray-800", color)}>
          {icon}
        </div>
        <span className={cn("text-xs font-medium px-2 py-1 rounded-full bg-gray-50 dark:bg-gray-800 text-gray-500", color)}>
          +2.5%
        </span>
      </div>

      <div>
        <div className="text-3xl font-bold text-gray-900 dark:text-gray-100 tracking-tight mb-1">
          {value}
        </div>
        <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
          {label}
        </div>
      </div>
    </div>
  </div>
)

const ChartCard: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <Card className="border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow duration-300">
    <CardHeader className="border-b border-gray-100 dark:border-gray-800 pb-4">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
        <div className="w-1 h-5 bg-gpms-primary rounded-full" />
        {title}
      </h3>
    </CardHeader>
    <CardContent className="pt-6">
      {children}
    </CardContent>
  </Card>
)

const ReportDisplay: React.FC<ReportDisplayProps> = ({ reportType, report, onDownload }) => {
  const renderProjectReport = (data: ProjectReport) => (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatBox
          label="إجمالي المشاريع"
          value={data.totalProjects}
          icon={<FileText className="w-6 h-6" />}
          color="text-blue-600"
        />
        <StatBox
          label="مكتملة"
          value={data.completedProjects}
          icon={<Award className="w-6 h-6" />}
          color="text-emerald-600"
        />
        <StatBox
          label="قيد التنفيذ"
          value={data.inProgressProjects}
          icon={<TrendingUp className="w-6 h-6" />}
          color="text-amber-600"
        />
        <StatBox
          label="متوسط التقدم"
          value={`${data.averageProgress.toFixed(1)}%`}
          icon={<TrendingUp className="w-6 h-6" />}
          color="text-violet-600"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="التوزيع حسب الحالة">
          <BarChart
            data={Object.entries(data.byStatus).map(([label, value]) => ({
              label: label === 'approved' ? 'معتمد' : label === 'in_progress' ? 'قيد التنفيذ' : label === 'completed' ? 'مكتمل' : 'معلق',
              value,
              color: label === 'completed' ? '#10b981' : label === 'in_progress' ? '#3b82f6' : label === 'approved' ? '#8b5cf6' : '#f59e0b'
            }))}
          />
        </ChartCard>

        <ChartCard title="التوزيع حسب القسم">
          <PieChart
            data={Object.entries(data.byDepartment).map(([label, value], index) => ({
              label,
              value,
              color: ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'][index % 4]
            }))}
          />
        </ChartCard>
      </div>

      {/* Detailed Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="حسب المشرف">
          <div className="space-y-3">
            {Object.entries(data.bySupervisor).map(([name, count], index) => (
              <div key={name} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </div>
                  <span className="font-medium text-gray-700 dark:text-gray-200">{name}</span>
                </div>
                <span className="px-3 py-1 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-lg text-sm font-bold shadow-sm border border-gray-100 dark:border-gray-700">
                  {count}
                </span>
              </div>
            ))}
          </div>
        </ChartCard>

        <ChartCard title="حسب الأولوية">
          <div className="space-y-3">
            {Object.entries(data.byPriority).map(([priority, count]) => (
              <div key={priority} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                <span className="font-medium text-gray-700 dark:text-gray-200 flex items-center gap-2">
                  <div className={cn(
                    "w-2 h-2 rounded-full",
                    priority === 'high' ? 'bg-red-500' : priority === 'medium' ? 'bg-amber-500' : 'bg-blue-500'
                  )} />
                  {priority === 'high' ? 'عالية' : priority === 'medium' ? 'متوسطة' : 'منخفضة'}
                </span>
                <span className={cn(
                  'px-3 py-1 rounded-lg text-sm font-bold shadow-sm border',
                  priority === 'high' ? 'bg-red-50 text-red-700 border-red-100' :
                    priority === 'medium' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                      'bg-blue-50 text-blue-700 border-blue-100'
                )}>
                  {count}
                </span>
              </div>
            ))}
          </div>
        </ChartCard>
      </div>
    </div>
  )

  const renderStudentReport = (data: StudentReport) => (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatBox
          label="إجمالي الطلاب"
          value={data.totalStudents}
          icon={<Users className="w-6 h-6" />}
          color="text-blue-600"
        />
        <StatBox
          label="مسجلين"
          value={data.registeredStudents}
          icon={<Award className="w-6 h-6" />}
          color="text-emerald-600"
        />
        <StatBox
          label="نسبة التسجيل"
          value={`${data.registrationRate}%`}
          icon={<TrendingUp className="w-6 h-6" />}
          color="text-violet-600"
        />
      </div>

      <ChartCard title="التوزيع حسب القسم">
        <BarChart
          data={Object.entries(data.byDepartment).map(([label, value], index) => ({
            label,
            value,
            color: ['#3b82f6', '#10b981', '#f59e0b'][index % 3]
          }))}
        />
      </ChartCard>
    </div>
  )

  const renderEvaluationReport = (data: EvaluationReport) => (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatBox
          label="إجمالي التقييمات"
          value={data.totalEvaluations}
          icon={<FileText className="w-6 h-6" />}
          color="text-blue-600"
        />
        <StatBox
          label="متوسط الدرجة"
          value={data.averageScore.toFixed(1)}
          icon={<Award className="w-6 h-6" />}
          color="text-emerald-600"
        />
        <StatBox
          label="مكتملة"
          value={data.completedEvaluations}
          icon={<Award className="w-6 h-6" />}
          color="text-violet-600"
        />
        <StatBox
          label="معلقة"
          value={data.pendingEvaluations}
          icon={<Calendar className="w-6 h-6" />}
          color="text-amber-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="توزيع الدرجات">
          <BarChart
            data={Object.entries(data.gradeDistribution).map(([grade, count]) => ({
              label: grade,
              value: count,
              color: grade === 'A+' ? '#10b981' : grade === 'A' ? '#3b82f6' : '#f59e0b'
            }))}
          />
        </ChartCard>

        <ChartCard title="حسب المقيّم">
          <div className="space-y-3">
            {Object.entries(data.byEvaluator).map(([name, count], index) => (
              <div key={name} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-violet-100 dark:bg-violet-900/30 text-violet-600 flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </div>
                  <span className="font-medium text-gray-700 dark:text-gray-200">{name}</span>
                </div>
                <span className="px-3 py-1 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-lg text-sm font-bold shadow-sm border border-gray-100 dark:border-gray-700">
                  {count}
                </span>
              </div>
            ))}
          </div>
        </ChartCard>
      </div>
    </div>
  )

  const renderStatisticsReport = (data: StatisticsReport) => (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatBox
          label="المشاريع"
          value={data.totalProjects}
          icon={<FileText className="w-6 h-6" />}
          color="text-blue-600"
        />
        <StatBox
          label="الطلاب"
          value={data.totalStudents}
          icon={<Users className="w-6 h-6" />}
          color="text-emerald-600"
        />
        <StatBox
          label="المشرفين"
          value={data.totalSupervisors}
          icon={<Users className="w-6 h-6" />}
          color="text-violet-600"
        />
        <StatBox
          label="نسبة النجاح"
          value={`${data.successRate}%`}
          icon={<TrendingUp className="w-6 h-6" />}
          color="text-amber-600"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatBox
          label="المشاريع النشطة"
          value={data.activeProjects}
          icon={<TrendingUp className="w-6 h-6" />}
          color="text-blue-600"
        />
        <StatBox
          label="المشاريع المكتملة"
          value={data.completedProjects}
          icon={<Award className="w-6 h-6" />}
          color="text-emerald-600"
        />
        <StatBox
          label="متوسط المدة (يوم)"
          value={data.averageProjectDuration}
          icon={<Calendar className="w-6 h-6" />}
          color="text-violet-600"
        />
      </div>
    </div>
  )

  const renderReport = () => {
    switch (reportType) {
      case 'projects':
        return renderProjectReport(report as ProjectReport)
      case 'students':
        return renderStudentReport(report as StudentReport)
      case 'evaluations':
        return renderEvaluationReport(report as EvaluationReport)
      case 'statistics':
        return renderStatisticsReport(report as StatisticsReport)
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gpms-primary/10 rounded-lg">
            <FileText className="w-5 h-5 text-gpms-primary" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">التقرير المولد</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">تم إنشاء التقرير بنجاح</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={() => onDownload('pdf')}
            variant="outline"
            size="sm"
            className="hover:bg-red-50 hover:text-red-600 hover:border-red-200 dark:hover:bg-red-900/20"
          >
            <FileText className="w-4 h-4 ml-2" />
            PDF
          </Button>
          <Button
            onClick={() => onDownload('excel')}
            variant="outline"
            size="sm"
            className="hover:bg-green-50 hover:text-green-600 hover:border-green-200 dark:hover:bg-green-900/20"
          >
            <Download className="w-4 h-4 ml-2" />
            Excel
          </Button>
        </div>
      </div>

      {renderReport()}
    </div>
  )
}

export default ReportDisplay
