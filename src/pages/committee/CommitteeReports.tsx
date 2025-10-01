import React, { useState } from 'react'
import { useLanguage } from '../../context/LanguageContext'
import { cn } from '../../lib/utils'
import { Card, CardContent, CardHeader } from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Divider from '../../components/ui/Divider'
import { 
  FileText, 
  Download,
  BarChart3,
  PieChart,
  TrendingUp,
  Users,
  Calendar,
  Filter,
  RefreshCw
} from 'lucide-react'

interface ReportType {
  id: string
  name: string
  description: string
  category: 'statistics' | 'performance' | 'compliance' | 'summary'
  icon: React.ComponentType<any>
  lastGenerated?: string
  status: 'available' | 'generating' | 'error'
}

const CommitteeReports: React.FC = () => {
  const { t } = useLanguage()
  const [selectedReports, setSelectedReports] = useState<string[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [dateRange, setDateRange] = useState({
    startDate: '2024-01-01',
    endDate: '2024-12-31'
  })

  const reportTypes: ReportType[] = [
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
      description: 'تحليل شامل لأداء الطلاب في مشاريع التخرج مع مقارنات وتقييمات',
      category: 'performance',
      icon: TrendingUp,
      lastGenerated: '2024-01-18',
      status: 'available'
    },
    {
      id: '3',
      name: 'تقرير حالة المشاريع',
      description: 'تقرير مفصل عن حالة جميع المشاريع الجارية والمكتملة والمعلقة',
      category: 'summary',
      icon: PieChart,
      lastGenerated: '2024-01-22',
      status: 'available'
    },
    {
      id: '4',
      name: 'تقرير أداء المشرفين',
      description: 'تقييم أداء المشرفين وعدد المشاريع المشرفة عليها ومعدل النجاح',
      category: 'performance',
      icon: Users,
      lastGenerated: '2024-01-15',
      status: 'available'
    },
    {
      id: '5',
      name: 'تقرير الامتثال للمعايير',
      description: 'تقرير عن مدى امتثال المشاريع للمعايير الأكاديمية والمتطلبات',
      category: 'compliance',
      icon: FileText,
      lastGenerated: '2024-01-19',
      status: 'available'
    },
    {
      id: '6',
      name: 'تقرير الجدولة الزمنية',
      description: 'تقرير عن الجداول الزمنية للمشاريع والالتزام بالمواعيد المحددة',
      category: 'summary',
      icon: Calendar,
      lastGenerated: '2024-01-21',
      status: 'available'
    }
  ]

  const handleReportSelection = (reportId: string) => {
    setSelectedReports(prev => 
      prev.includes(reportId) 
        ? prev.filter(id => id !== reportId)
        : [...prev, reportId]
    )
  }

  const handleGenerateReports = async () => {
    if (selectedReports.length === 0) {
      alert('يرجى اختيار تقرير واحد على الأقل')
      return
    }

    setIsGenerating(true)
    
    try {
      // Simulate report generation
      await new Promise(resolve => setTimeout(resolve, 3000))
      
      // Simulate download
      const selectedReportNames = reportTypes
        .filter(report => selectedReports.includes(report.id))
        .map(report => report.name)
        .join(', ')
      
      alert(`تم إنشاء التقارير التالية بنجاح:\n${selectedReportNames}`)
      
      setSelectedReports([])
    } catch (error) {
      alert('حدث خطأ أثناء إنشاء التقارير')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleDownloadReport = async (reportId: string) => {
    const report = reportTypes.find(r => r.id === reportId)
    if (!report) return

    // Simulate download
    alert(`جاري تحميل التقرير: ${report.name}`)
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'statistics': return 'bg-blue-100 text-blue-800'
      case 'performance': return 'bg-green-100 text-green-800'
      case 'compliance': return 'bg-purple-100 text-purple-800'
      case 'summary': return 'bg-orange-100 text-orange-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getCategoryText = (category: string) => {
    switch (category) {
      case 'statistics': return 'إحصائيات'
      case 'performance': return 'أداء'
      case 'compliance': return 'امتثال'
      case 'summary': return 'ملخص'
      default: return category
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800'
      case 'generating': return 'bg-yellow-100 text-yellow-800'
      case 'error': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'available': return 'متاح'
      case 'generating': return 'جاري الإنشاء'
      case 'error': return 'خطأ'
      default: return status
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="hover-lift">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 rtl:space-x-reverse">
              <FileText className="w-6 h-6 text-gpms-dark" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">إصدار التقارير</h1>
                <p className="text-gray-600 mt-1">إنشاء وتحميل التقارير الإحصائية والتحليلية</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 rtl:space-x-reverse">
              <Button
                onClick={handleGenerateReports}
                disabled={selectedReports.length === 0 || isGenerating}
                loading={isGenerating}
                className="bg-gpms-dark text-white hover:bg-gpms-light"
              >
                <FileText className="w-4 h-4 mr-1 rtl:mr-0 rtl:ml-1" />
                {isGenerating ? 'جاري الإنشاء...' : 'إنشاء التقارير'}
              </Button>
            </div>
          </div>
        </CardHeader>
        <Divider />

        <CardContent>
          {/* Date Range Selection */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">نطاق التاريخ</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">من تاريخ</label>
                <input
                  type="date"
                  value={dateRange.startDate}
                  onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gpms-light focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">إلى تاريخ</label>
                <input
                  type="date"
                  value={dateRange.endDate}
                  onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gpms-light focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Selected Reports Summary */}
          {selectedReports.length > 0 && (
            <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-2">
                التقارير المحددة ({selectedReports.length})
              </h4>
              <div className="flex flex-wrap gap-2">
                {selectedReports.map(reportId => {
                  const report = reportTypes.find(r => r.id === reportId)
                  return report ? (
                    <span key={reportId} className="px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                      {report.name}
                    </span>
                  ) : null
                })}
              </div>
            </div>
          )}

          {/* Reports Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {reportTypes.map((report) => {
              const IconComponent = report.icon
              const isSelected = selectedReports.includes(report.id)
              
              return (
                <Card 
                  key={report.id} 
                  className={cn(
                    'hover-lift cursor-pointer transition-all duration-200',
                    isSelected ? 'ring-2 ring-gpms-light bg-gpms-light/5' : ''
                  )}
                  onClick={() => handleReportSelection(report.id)}
                >
                  <CardContent className="p-6">
                    {/* Report Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3 rtl:space-x-reverse">
                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                          <IconComponent size={24} className="text-gray-600" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">{report.name}</h3>
                          <p className="text-sm text-gray-600 line-clamp-2">{report.description}</p>
                        </div>
                      </div>
                      
                      <div className="flex flex-col items-end space-y-1">
                        <span className={cn('px-2 py-1 text-xs rounded-full', getCategoryColor(report.category))}>
                          {getCategoryText(report.category)}
                        </span>
                        <span className={cn('px-2 py-1 text-xs rounded-full', getStatusColor(report.status))}>
                          {getStatusText(report.status)}
                        </span>
                      </div>
                    </div>

                    {/* Report Info */}
                    <div className="space-y-2 mb-4">
                      {report.lastGenerated && (
                        <div className="flex items-center text-sm text-gray-600">
                          <Calendar size={16} className="ml-2 rtl:ml-0 rtl:mr-2" />
                          <span>آخر إنشاء: {new Date(report.lastGenerated).toLocaleDateString('ar')}</span>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                      <div className="flex items-center space-x-2 rtl:space-x-reverse">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleReportSelection(report.id)}
                          className="rounded border-gray-300 text-gpms-dark focus:ring-gpms-light"
                        />
                        <span className="text-sm text-gray-600">تضمين في التقرير</span>
                      </div>
                      
                      {report.status === 'available' && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDownloadReport(report.id)
                          }}
                          className="text-gpms-dark hover:text-gpms-light transition-colors"
                          title="تحميل التقرير"
                        >
                          <Download size={16} />
                        </button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Empty State */}
          {reportTypes.length === 0 && (
            <Card className="hover-lift">
              <CardContent className="text-center py-12">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText size={32} className="text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد تقارير</h3>
                <p className="text-gray-600">لم يتم العثور على تقارير متاحة</p>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default CommitteeReports
