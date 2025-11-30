import React from 'react'
import { Card, CardContent } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { cn } from '@/lib/utils'
import {
  FileText,
  Download,
  RefreshCw,
  Calendar,
  ArrowRight
} from 'lucide-react'

interface ReportCardProps {
  id: string
  name: string
  description: string
  category: string
  icon: React.ComponentType<{ className?: string }>
  lastGenerated?: string
  status?: 'available' | 'generating' | 'error'
  onGenerate: () => void
  onDownload?: (format: 'pdf' | 'excel') => void
  isGenerating?: boolean
  isGenerated?: boolean
  className?: string
}

const categoryStyles: Record<string, { bg: string; text: string; border: string; iconBg: string }> = {
  statistics: {
    bg: 'bg-blue-50/50',
    text: 'text-blue-700',
    border: 'border-blue-100',
    iconBg: 'from-blue-500 to-blue-600'
  },
  performance: {
    bg: 'bg-emerald-50/50',
    text: 'text-emerald-700',
    border: 'border-emerald-100',
    iconBg: 'from-emerald-500 to-emerald-600'
  },
  compliance: {
    bg: 'bg-violet-50/50',
    text: 'text-violet-700',
    border: 'border-violet-100',
    iconBg: 'from-violet-500 to-violet-600'
  },
  summary: {
    bg: 'bg-amber-50/50',
    text: 'text-amber-700',
    border: 'border-amber-100',
    iconBg: 'from-amber-500 to-amber-600'
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

const ReportCard: React.FC<ReportCardProps> = ({
  id,
  name,
  description,
  category,
  icon: Icon,
  lastGenerated,
  status = 'available',
  onGenerate,
  onDownload,
  isGenerating = false,
  isGenerated = false,
  className
}) => {
  const styles = categoryStyles[category] || categoryStyles.statistics
  const isLoading = isGenerating || status === 'generating'

  return (
    <Card className={cn(
      'group relative overflow-hidden transition-all duration-300',
      'border border-gray-200 hover:border-gray-300 hover:shadow-lg',
      'bg-white dark:bg-gray-900 dark:border-gray-800',
      className
    )}>
      <CardContent className="p-6 flex flex-col h-full">
        {/* Header */}
        <div className="flex items-start justify-between mb-5">
          <div className={cn(
            'w-12 h-12 rounded-xl flex items-center justify-center shadow-sm transition-transform duration-300 group-hover:scale-110',
            'bg-gradient-to-br text-white',
            styles.iconBg
          )}>
            <Icon className="w-6 h-6" />
          </div>
          <div className={cn(
            'px-3 py-1 rounded-full text-xs font-medium border',
            styles.bg,
            styles.text,
            styles.border
          )}>
            {getCategoryText(category)}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 mb-6">
          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2 group-hover:text-gpms-primary transition-colors">
            {name}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">
            {description}
          </p>
        </div>

        {/* Footer Info */}
        <div className="mt-auto space-y-4">
          {lastGenerated && (
            <div className="flex items-center gap-2 text-xs text-gray-400 dark:text-gray-500">
              <Calendar className="w-3.5 h-3.5" />
              <span>آخر تحديث: {new Date(lastGenerated).toLocaleDateString('ar')}</span>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-2 pt-4 border-t border-gray-100 dark:border-gray-800">
            <Button
              onClick={onGenerate}
              variant={isGenerated ? "outline" : "default"}
              size="sm"
              disabled={isLoading}
              className={cn(
                "flex-1 transition-all",
                !isGenerated && "bg-gray-900 hover:bg-gray-800 text-white dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100"
              )}
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 ml-2 animate-spin" />
                  جاري التوليد...
                </>
              ) : (
                <>
                  {isGenerated ? (
                    <>
                      <RefreshCw className="w-4 h-4 ml-2" />
                      تحديث
                    </>
                  ) : (
                    <>
                      توليد التقرير
                      <ArrowRight className="w-4 h-4 mr-2 rtl:rotate-180" />
                    </>
                  )}
                </>
              )}
            </Button>

            {isGenerated && onDownload && (
              <div className="flex gap-1 animate-in fade-in slide-in-from-right-2 duration-300">
                <Button
                  onClick={() => onDownload('pdf')}
                  variant="outline"
                  size="sm"
                  className="px-3 hover:bg-red-50 hover:text-red-600 hover:border-red-200 dark:hover:bg-red-900/20"
                  title="تحميل PDF"
                >
                  <FileText className="w-4 h-4" />
                </Button>
                <Button
                  onClick={() => onDownload('excel')}
                  variant="outline"
                  size="sm"
                  className="px-3 hover:bg-green-50 hover:text-green-600 hover:border-green-200 dark:hover:bg-green-900/20"
                  title="تحميل Excel"
                >
                  <Download className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default ReportCard
