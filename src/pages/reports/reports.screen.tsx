import React, { useState } from 'react'
import { useLanguage } from '@/context/LanguageContext'
import { Card, CardContent, CardHeader } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Divider from '@/components/ui/Divider'
import { FileText, Download, BarChart3, PieChart, TrendingUp, RefreshCw } from 'lucide-react'
import { Report } from './schema'

const ReportsScreen: React.FC = () => {
  const { t } = useLanguage()
  const [isGenerating, setIsGenerating] = useState(false)

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

  const handleGenerateReport = (reportId: string) => {
    setIsGenerating(true)
    // Simulate report generation
    setTimeout(() => {
      setIsGenerating(false)
      console.log('Report generated:', reportId)
    }, 2000)
  }

  const handleDownloadReport = (reportId: string) => {
    console.log('Downloading report:', reportId)
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
                        onClick={() => handleGenerateReport(report.id)}
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
                      {report.status === 'available' && report.lastGenerated && (
                        <Button
                          onClick={() => handleDownloadReport(report.id)}
                          variant="outline"
                          size="sm"
                          className="flex-1"
                        >
                          <Download className="w-4 h-4 mr-1 rtl:mr-0 rtl:ml-1" />
                          تحميل
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default ReportsScreen
