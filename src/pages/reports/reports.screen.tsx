import React, { useState } from 'react'
import { useLanguage } from '@/context/LanguageContext'
import { useAuth } from '@/context/AuthContext'
import { useNotifications } from '@/context/NotificationContext'
import { Card, CardContent, CardHeader } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Divider from '@/components/ui/Divider'
import { FileText, Download, BarChart3, PieChart, TrendingUp, RefreshCw } from 'lucide-react'
import { Report } from './schema'
import { 
  generateProjectReport, 
  generateStudentReport, 
  generateEvaluationReport, 
  generateStatisticsReport,
  exportReportAsPDF,
  exportReportAsExcel,
  ReportCriteria
} from '@/services/reports.service'
import ReportGenerator from '@/components/forms/ReportGenerator'

const ReportsScreen: React.FC = () => {
  const { t } = useLanguage()
  const { user } = useAuth()
  const { addNotification } = useNotifications()
  const [isGenerating, setIsGenerating] = useState(false)
  const [selectedReportType, setSelectedReportType] = useState<string | null>(null)
  const [reportCriteria, setReportCriteria] = useState<ReportCriteria>({})
  const [generatedReport, setGeneratedReport] = useState<any>(null)

  const reportTypes: (Report & { icon: React.ComponentType<{ className?: string; size?: number }> })[] = [
    {
      id: '1',
      name: 'إحصاءات شاملة عن المشاريع',
      description: 'تقرير شامل عن جميع المشاريع المقدمة والمعتمدة والمرفوضة مع إحصائيات مفصلة',
      category: 'statistics',
      icon: BarChart3,
      lastGenerated: '2024-01-20',
      status: 'available'
    },
    {
      id: '2',
      name: 'تحليل نتائج أداء الطلاب',
      description: 'تقرير تحليلي عن أداء الطلاب في المشاريع والتقييمات',
      category: 'performance',
      icon: TrendingUp,
      lastGenerated: '2024-01-18',
      status: 'available'
    },
    {
      id: '3',
      name: 'تقرير الامتثال والجودة',
      description: 'تقرير عن امتثال المشاريع لمعايير الجودة والمتطلبات',
      category: 'compliance',
      icon: PieChart,
      status: 'available'
    },
    {
      id: '4',
      name: 'ملخص الفصل الدراسي',
      description: 'ملخص شامل عن نشاطات الفصل الدراسي الحالي',
      category: 'summary',
      icon: FileText,
      lastGenerated: '2024-01-15',
      status: 'available'
    }
  ]

  const handleGenerateReport = async (reportType: string, criteria?: ReportCriteria) => {
    setIsGenerating(true)
    setReportCriteria(criteria || {})
    
    try {
      let report: any
      
      switch (reportType) {
        case 'projects':
          report = await generateProjectReport(criteria)
          break
        case 'students':
          report = await generateStudentReport(criteria)
          break
        case 'evaluations':
          report = await generateEvaluationReport(criteria)
          break
        case 'statistics':
          report = await generateStatisticsReport()
          break
        default:
          throw new Error('نوع التقرير غير معروف')
      }
      
      setGeneratedReport(report)
      setSelectedReportType(reportType)
      addNotification({
        title: 'تم توليد التقرير',
        message: 'تم توليد التقرير بنجاح',
        type: 'success',
        category: 'system'
      })
    } catch (error) {
      addNotification({
        title: 'خطأ',
        message: error instanceof Error ? error.message : 'فشل في توليد التقرير',
        type: 'error'
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const handleDownloadReport = async (reportType: string, format: 'pdf' | 'excel') => {
    try {
      let blob: Blob
      
      if (format === 'pdf') {
        blob = await exportReportAsPDF(reportType as any, reportCriteria)
      } else {
        blob = await exportReportAsExcel(reportType as any, reportCriteria)
      }
      
      // Create download link
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `report-${reportType}-${new Date().toISOString()}.${format === 'pdf' ? 'pdf' : 'xlsx'}`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
      
      addNotification({
        title: 'تم التحميل',
        message: 'تم تحميل التقرير بنجاح',
        type: 'success'
      })
    } catch (error) {
      addNotification({
        title: 'خطأ',
        message: error instanceof Error ? error.message : 'فشل في تحميل التقرير',
        type: 'error'
      })
    }
  }

  const getCategoryText = (category: string) => {
    switch (category) {
      case 'statistics': return 'إحصاءات'
      case 'performance': return 'أداء'
      case 'compliance': return 'امتثال'
      case 'summary': return 'ملخص'
      default: return category
    }
  }


  return (
    <div className="space-y-6">
      <Card className="hover-lift">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-900">{t('navigation.reports')}</h1>
              <p className="text-gray-600 mt-1">إنشاء وتحميل التقارير المختلفة</p>
            </div>
          </div>
        </CardHeader>
        <Divider />
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reportTypes.map((report) => {
              const Icon = report.icon
              return (
                <Card key={report.id} className="hover-lift">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-12 h-12 bg-gpms-light/10 rounded-lg flex items-center justify-center">
                        <Icon className="w-6 h-6 text-gpms-dark" />
                      </div>
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                        {getCategoryText(report.category)}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{report.name}</h3>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">{report.description}</p>
                    {report.lastGenerated && (
                      <p className="text-xs text-gray-500 mb-4">
                        آخر توليد: {new Date(report.lastGenerated).toLocaleDateString('ar')}
                      </p>
                    )}
                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                      <Button
                        onClick={() => setSelectedReportType(report.id)}
                        variant="outline"
                        size="sm"
                        disabled={isGenerating || report.status === 'generating'}
                        className="flex-1"
                      >
                        {isGenerating || report.status === 'generating' ? (
                          <>
                            <RefreshCw className="w-4 h-4 mr-1 rtl:mr-0 rtl:ml-1 animate-spin" />
                            جاري التوليد...
                          </>
                        ) : (
                          <>
                            <RefreshCw className="w-4 h-4 mr-1 rtl:mr-0 rtl:ml-1" />
                            توليد
                          </>
                        )}
                      </Button>
                      {generatedReport && selectedReportType === report.id && (
                        <>
                          <Button
                            onClick={() => handleDownloadReport(report.id, 'pdf')}
                            variant="outline"
                            size="sm"
                            title="تحميل PDF"
                          >
                            <FileText className="w-4 h-4" />
                          </Button>
                          <Button
                            onClick={() => handleDownloadReport(report.id, 'excel')}
                            variant="outline"
                            size="sm"
                            title="تحميل Excel"
                          >
                            <Download className="w-4 h-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Report Generator Modal */}
      {selectedReportType && (
        <ReportGenerator
          onGenerate={(data) => {
            const reportTypeMap: Record<string, string> = {
              '1': 'projects',
              '2': 'students',
              '3': 'evaluations',
              '4': 'statistics'
            }
            handleGenerateReport(reportTypeMap[selectedReportType] || selectedReportType, data.criteria)
          }}
        />
      )}

      {/* Generated Report Display */}
      {generatedReport && selectedReportType && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">التقرير المولد</h2>
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <Button
                  onClick={() => handleDownloadReport(selectedReportType, 'pdf')}
                  variant="outline"
                  size="sm"
                >
                  <FileText className="w-4 h-4 mr-1 rtl:mr-0 rtl:ml-1" />
                  PDF
                </Button>
                <Button
                  onClick={() => handleDownloadReport(selectedReportType, 'excel')}
                  variant="outline"
                  size="sm"
                >
                  <Download className="w-4 h-4 mr-1 rtl:mr-0 rtl:ml-1" />
                  Excel
                </Button>
              </div>
            </div>
          </CardHeader>
          <Divider />
          <CardContent>
            <div className="space-y-4">
              {/* Display report data based on type */}
              {selectedReportType === '1' && generatedReport && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600">إجمالي المشاريع</p>
                      <p className="text-2xl font-bold text-gray-900">{generatedReport.totalProjects}</p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600">مكتملة</p>
                      <p className="text-2xl font-bold text-gray-900">{generatedReport.completedProjects}</p>
                    </div>
                    <div className="bg-yellow-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600">قيد التنفيذ</p>
                      <p className="text-2xl font-bold text-gray-900">{generatedReport.inProgressProjects}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600">متوسطة التقدم</p>
                      <p className="text-2xl font-bold text-gray-900">{generatedReport.averageProgress.toFixed(1)}%</p>
                    </div>
                  </div>
                </div>
              )}
              {selectedReportType === '2' && generatedReport && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600">إجمالي الطلاب</p>
                      <p className="text-2xl font-bold text-gray-900">{generatedReport.totalStudents}</p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600">مسجلين</p>
                      <p className="text-2xl font-bold text-gray-900">{generatedReport.registeredStudents}</p>
                    </div>
                    <div className="bg-yellow-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600">نسبة التسجيل</p>
                      <p className="text-2xl font-bold text-gray-900">{generatedReport.registrationRate}%</p>
                    </div>
                  </div>
                </div>
              )}
              {selectedReportType === '4' && generatedReport && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600">المشاريع</p>
                      <p className="text-2xl font-bold text-gray-900">{generatedReport.totalProjects}</p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600">الطلاب</p>
                      <p className="text-2xl font-bold text-gray-900">{generatedReport.totalStudents}</p>
                    </div>
                    <div className="bg-yellow-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600">المشرفين</p>
                      <p className="text-2xl font-bold text-gray-900">{generatedReport.totalSupervisors}</p>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600">نسبة النجاح</p>
                      <p className="text-2xl font-bold text-gray-900">{generatedReport.successRate}%</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default ReportsScreen
