import React, { useState } from 'react'
import { useLanguage } from '../../context/LanguageContext'
import { cn } from '../../lib/utils'
import Button from '../ui/Button'
import Input from '../ui/Input'
import { Form, FormGroup, FormLabel, FormError } from '../ui/Form'
import { Card, CardContent, CardHeader } from '../ui/Card'
import Badge from '../ui/Badge'
import { Chart, BarChart } from '../ui/Charts'
import { 
  BarChart3, 
  FileText, 
  Download,
  Filter,
  Calendar,
  Users,
  TrendingUp,
  PieChart
} from 'lucide-react'

interface ReportGeneratorProps {
  onGenerate?: (data: any) => void
  className?: string
}

const ReportGenerator: React.FC<ReportGeneratorProps> = ({
  onGenerate,
  className
}) => {
  const { t } = useLanguage()
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [generatedReport, setGeneratedReport] = useState<any>(null)
  
  const [formData, setFormData] = useState({
    reportType: 'projects',
    period: 'current_semester',
    dateFrom: '',
    dateTo: '',
    includeCharts: true,
    includeDetails: true,
    format: 'pdf',
    filters: {
      department: 'all',
      status: 'all',
      supervisor: 'all'
    }
  })

  // Mock data for report preview
  const mockReportData = {
    projects: {
      total: 89,
      completed: 34,
      inProgress: 42,
      pending: 13,
      byDepartment: [
        { label: 'هندسة الحاسوب', value: 45 },
        { label: 'هندسة البرمجيات', value: 32 },
        { label: 'أمن المعلومات', value: 12 }
      ],
      byStatus: [
        { label: 'مكتمل', value: 34, color: 'bg-green-500' },
        { label: 'قيد التنفيذ', value: 42, color: 'bg-blue-500' },
        { label: 'معلق', value: 13, color: 'bg-yellow-500' }
      ]
    },
    students: {
      total: 156,
      active: 143,
      graduated: 89,
      byYear: [
        { label: '2021', value: 45 },
        { label: '2022', value: 52 },
        { label: '2023', value: 59 }
      ]
    },
    supervisors: {
      total: 24,
      active: 22,
      avgProjectsPerSupervisor: 3.7,
      workload: [
        { label: 'د. أحمد محمد', value: 8 },
        { label: 'د. سارة أحمد', value: 7 },
        { label: 'د. خالد محمود', value: 6 },
        { label: 'د. فاطمة علي', value: 5 }
      ]
    }
  }

  const reportTypes = [
    { value: 'projects', label: 'تقرير المشاريع' },
    { value: 'students', label: 'تقرير الطلاب' },
    { value: 'supervisors', label: 'تقرير المشرفين' },
    { value: 'departments', label: 'تقرير الأقسام' },
    { value: 'grades', label: 'تقرير الدرجات' },
    { value: 'timeline', label: 'تقرير المواعيد' }
  ]

  const periods = [
    { value: 'current_semester', label: 'الفصل الحالي' },
    { value: 'last_semester', label: 'الفصل الماضي' },
    { value: 'current_year', label: 'السنة الحالية' },
    { value: 'last_year', label: 'السنة الماضية' },
    { value: 'custom', label: 'فترة مخصصة' }
  ]

  const formats = [
    { value: 'pdf', label: 'PDF' },
    { value: 'excel', label: 'Excel' },
    { value: 'word', label: 'Word' },
    { value: 'csv', label: 'CSV' }
  ]

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setErrors({})

    // Validation
    const newErrors: Record<string, string> = {}
    
    if (formData.period === 'custom') {
      if (!formData.dateFrom) {
        newErrors.dateFrom = 'تاريخ البداية مطلوب'
      }
      if (!formData.dateTo) {
        newErrors.dateTo = 'تاريخ النهاية مطلوب'
      }
      if (formData.dateFrom && formData.dateTo && formData.dateFrom > formData.dateTo) {
        newErrors.dateTo = 'تاريخ النهاية يجب أن يكون بعد تاريخ البداية'
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      setIsLoading(false)
      return
    }

    try {
      // Simulate report generation
      await new Promise(resolve => setTimeout(resolve, 3000))
      
      const reportData = {
        ...formData,
        data: mockReportData,
        generatedAt: new Date().toISOString(),
        id: Math.random().toString(36).substring(7)
      }
      
      setGeneratedReport(reportData)
      
      if (onGenerate) {
        onGenerate(reportData)
      }
      
    } catch (error) {
      setErrors({ general: 'حدث خطأ أثناء إنشاء التقرير' })
    } finally {
      setIsLoading(false)
    }
  }

  const downloadReport = (format: string) => {
    // Simulate download
    alert(`جاري تحميل التقرير بصيغة ${format}...`)
  }

  return (
    <div className={cn('max-w-6xl mx-auto', className)}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Report Configuration */}
        <div className="lg:col-span-1">
          <Card className="animate-fade-in">
            <CardHeader>
              <div className="flex items-center space-x-3 rtl:space-x-reverse">
                <div className="w-10 h-10 bg-gpms-light rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">إنشاء تقرير</h2>
                  <p className="text-sm text-gray-600">اختر إعدادات التقرير</p>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <Form onSubmit={handleGenerate}>
                <div className="space-y-4">
                  <FormGroup>
                    <FormLabel htmlFor="reportType">نوع التقرير</FormLabel>
                    <select
                      id="reportType"
                      value={formData.reportType}
                      onChange={(e) => setFormData(prev => ({ ...prev, reportType: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gpms-light focus:border-transparent"
                    >
                      {reportTypes.map(type => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </FormGroup>

                  <FormGroup>
                    <FormLabel htmlFor="period">الفترة الزمنية</FormLabel>
                    <select
                      id="period"
                      value={formData.period}
                      onChange={(e) => setFormData(prev => ({ ...prev, period: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gpms-light focus:border-transparent"
                    >
                      {periods.map(period => (
                        <option key={period.value} value={period.value}>
                          {period.label}
                        </option>
                      ))}
                    </select>
                  </FormGroup>

                  {formData.period === 'custom' && (
                    <div className="grid grid-cols-2 gap-4">
                      <FormGroup>
                        <FormLabel htmlFor="dateFrom">من تاريخ</FormLabel>
                        <Input
                          id="dateFrom"
                          type="date"
                          value={formData.dateFrom}
                          onChange={(e) => setFormData(prev => ({ ...prev, dateFrom: e.target.value }))}
                          error={errors.dateFrom}
                        />
                      </FormGroup>
                      <FormGroup>
                        <FormLabel htmlFor="dateTo">إلى تاريخ</FormLabel>
                        <Input
                          id="dateTo"
                          type="date"
                          value={formData.dateTo}
                          onChange={(e) => setFormData(prev => ({ ...prev, dateTo: e.target.value }))}
                          error={errors.dateTo}
                        />
                      </FormGroup>
                    </div>
                  )}

                  <FormGroup>
                    <FormLabel htmlFor="format">صيغة التقرير</FormLabel>
                    <select
                      id="format"
                      value={formData.format}
                      onChange={(e) => setFormData(prev => ({ ...prev, format: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gpms-light focus:border-transparent"
                    >
                      {formats.map(format => (
                        <option key={format.value} value={format.value}>
                          {format.label}
                        </option>
                      ))}
                    </select>
                  </FormGroup>

                  <div className="space-y-3">
                    <FormLabel>خيارات التقرير</FormLabel>
                    <label className="flex items-center space-x-2 rtl:space-x-reverse">
                      <input
                        type="checkbox"
                        checked={formData.includeCharts}
                        onChange={(e) => setFormData(prev => ({ ...prev, includeCharts: e.target.checked }))}
                        className="rounded border-gray-300 text-gpms-dark focus:ring-gpms-light"
                      />
                      <span className="text-sm text-gray-700">تضمين الرسوم البيانية</span>
                    </label>
                    <label className="flex items-center space-x-2 rtl:space-x-reverse">
                      <input
                        type="checkbox"
                        checked={formData.includeDetails}
                        onChange={(e) => setFormData(prev => ({ ...prev, includeDetails: e.target.checked }))}
                        className="rounded border-gray-300 text-gpms-dark focus:ring-gpms-light"
                      />
                      <span className="text-sm text-gray-700">تضمين التفاصيل</span>
                    </label>
                  </div>

                  {/* Filters */}
                  <div className="border-t pt-4">
                    <FormLabel>التصفية</FormLabel>
                    <div className="space-y-3 mt-2">
                      <select
                        value={formData.filters.department}
                        onChange={(e) => setFormData(prev => ({ 
                          ...prev, 
                          filters: { ...prev.filters, department: e.target.value }
                        }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      >
                        <option value="all">جميع الأقسام</option>
                        <option value="cs">هندسة الحاسوب</option>
                        <option value="se">هندسة البرمجيات</option>
                        <option value="is">أمن المعلومات</option>
                      </select>

                      <select
                        value={formData.filters.status}
                        onChange={(e) => setFormData(prev => ({ 
                          ...prev, 
                          filters: { ...prev.filters, status: e.target.value }
                        }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      >
                        <option value="all">جميع الحالات</option>
                        <option value="completed">مكتمل</option>
                        <option value="in_progress">قيد التنفيذ</option>
                        <option value="pending">معلق</option>
                      </select>
                    </div>
                  </div>

                  {errors.general && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                      {errors.general}
                    </div>
                  )}

                  <Button 
                    type="submit" 
                    loading={isLoading}
                    className="w-full"
                  >
                    {isLoading ? 'جاري إنشاء التقرير...' : 'إنشاء التقرير'}
                  </Button>
                </div>
              </Form>
            </CardContent>
          </Card>
        </div>

        {/* Report Preview */}
        <div className="lg:col-span-2">
          <Card className="animate-slide-in-right">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3 rtl:space-x-reverse">
                  <div className="w-10 h-10 bg-gpms-dark rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">معاينة التقرير</h2>
                    <p className="text-sm text-gray-600">
                      {reportTypes.find(t => t.value === formData.reportType)?.label}
                    </p>
                  </div>
                </div>

                {generatedReport && (
                  <div className="flex space-x-2 rtl:space-x-reverse">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => downloadReport('pdf')}
                    >
                      <Download size={16} className="mr-1 rtl:mr-0 rtl:ml-1" />
                      PDF
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => downloadReport('excel')}
                    >
                      <Download size={16} className="mr-1 rtl:mr-0 rtl:ml-1" />
                      Excel
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>

            <CardContent>
              {!generatedReport ? (
                <div className="text-center py-12">
                  <BarChart3 className="w-24 h-24 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">لا يوجد تقرير</h3>
                  <p className="text-gray-600">
                    اختر إعدادات التقرير واضغط على "إنشاء التقرير" لمعاينة النتائج
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Summary Statistics */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-blue-50 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {mockReportData.projects.total}
                      </div>
                      <div className="text-sm text-blue-600">إجمالي المشاريع</div>
                    </div>
                    <div className="bg-green-50 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {mockReportData.projects.completed}
                      </div>
                      <div className="text-sm text-green-600">مكتملة</div>
                    </div>
                    <div className="bg-yellow-50 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-yellow-600">
                        {mockReportData.projects.inProgress}
                      </div>
                      <div className="text-sm text-yellow-600">قيد التنفيذ</div>
                    </div>
                    <div className="bg-red-50 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-red-600">
                        {mockReportData.projects.pending}
                      </div>
                      <div className="text-sm text-red-600">معلقة</div>
                    </div>
                  </div>

                  {/* Charts */}
                  {formData.includeCharts && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Chart title="المشاريع حسب الحالة">
                        <BarChart data={mockReportData.projects.byStatus} />
                      </Chart>
                      
                      <Chart title="المشاريع حسب القسم">
                        <BarChart 
                          data={mockReportData.projects.byDepartment.map(item => ({
                            ...item,
                            color: 'bg-gpms-light'
                          }))} 
                        />
                      </Chart>
                    </div>
                  )}

                  {/* Detailed Data */}
                  {formData.includeDetails && (
                    <div className="bg-gray-50 rounded-lg p-6">
                      <h3 className="font-semibold text-gray-900 mb-4">البيانات التفصيلية</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <strong>نوع التقرير:</strong> {reportTypes.find(t => t.value === formData.reportType)?.label}
                        </div>
                        <div>
                          <strong>الفترة:</strong> {periods.find(p => p.value === formData.period)?.label}
                        </div>
                        <div>
                          <strong>تاريخ الإنشاء:</strong> {new Date().toLocaleDateString('ar')}
                        </div>
                        <div>
                          <strong>الصيغة:</strong> {formats.find(f => f.value === formData.format)?.label}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Generate Time */}
                  <div className="text-center text-sm text-gray-500">
                    تم إنشاء التقرير في: {new Date(generatedReport.generatedAt).toLocaleString('ar')}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default ReportGenerator
