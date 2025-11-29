import React, { useState, useMemo } from 'react'
import { useLanguage } from '@/context/LanguageContext'
import { useAuth } from '@/context/AuthContext'
import { cn, getActiveFiltersCount } from '@/lib/utils'
import { Card, CardContent, CardHeader } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import DataTable from '@/components/ui/DataTable'
import SimplePopover from '@/components/ui/SimplePopover'
import AdvancedFilter from '@/components/ui/AdvancedFilter'
import Modal from '@/components/ui/Modal'
import { ViewModeToggle } from '@/components/shared'
import { StatusBadge, PriorityBadge } from '@/components/shared'
import { Eye, Star, Award, SlidersHorizontal } from 'lucide-react'
import { Evaluation } from './schema'
import { useNavigate } from 'react-router-dom'
import { useEvaluations } from './evaluations.hook'

const EvaluationsScreen: React.FC = () => {
  const { t } = useLanguage()
  const { user } = useAuth()
  const navigate = useNavigate()
  const { evaluations, isLoading: evaluationsLoading } = useEvaluations()
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [sortBy, setSortBy] = useState('dueDate')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('grid')
  const [viewEvaluation, setViewEvaluation] = useState<Evaluation | null>(null)

  const statusOptions = [
    { value: 'all', label: 'جميع الحالات' },
    { value: 'pending', label: 'قيد الانتظار' },
    { value: 'in_progress', label: 'قيد التقييم' },
    { value: 'completed', label: 'مكتمل' },
    { value: 'overdue', label: 'متأخر' }
  ]

  const typeOptions = [
    { value: 'all', label: 'جميع الأنواع' },
    { value: 'proposal', label: 'مقترح' },
    { value: 'progress', label: 'تقدم' },
    { value: 'final', label: 'نهائي' },
    { value: 'presentation', label: 'عرض' },
    { value: 'defense', label: 'مناقشة' }
  ]

  const priorityOptions = [
    { value: 'all', label: 'جميع الأولويات' },
    { value: 'low', label: 'منخفض' },
    { value: 'medium', label: 'متوسط' },
    { value: 'high', label: 'عالي' }
  ]

  const sortOptions = [
    { value: 'dueDate', label: 'تاريخ الاستحقاق' },
    { value: 'projectTitle', label: 'اسم المشروع' },
    { value: 'status', label: 'الحالة' },
    { value: 'score', label: 'الدرجة' }
  ]

  const filteredEvaluations = useMemo(() => {
    return evaluations.filter(evaluation => {
      const matchesSearch = !searchQuery ||
        evaluation.projectTitle?.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesStatus = statusFilter === 'all' || evaluation.status === statusFilter
      const matchesType = typeFilter === 'all' || evaluation.evaluationType === typeFilter
      const matchesPriority = priorityFilter === 'all' || evaluation.priority === priorityFilter

      return matchesSearch && matchesStatus && matchesType && matchesPriority
    })
  }, [evaluations, searchQuery, statusFilter, typeFilter, priorityFilter])

  const handleFilterClear = () => {
    setStatusFilter('all')
    setTypeFilter('all')
    setPriorityFilter('all')
    setSortBy('dueDate')
    setSortOrder('asc')
  }

  const columns = useMemo(() => [
    {
      key: 'projectTitle',
      label: 'اسم المشروع',
      sortable: true,
      render: (evaluation: Evaluation) => (
        <div>
          <h3 className="font-medium text-gray-900">{evaluation.projectTitle}</h3>
          {evaluation.studentName && (
            <p className="text-sm text-gray-600">{evaluation.studentName}</p>
          )}
        </div>
      )
    },
    {
      key: 'evaluationType',
      label: 'نوع التقييم',
      render: (evaluation: Evaluation) => (
        <span className="text-sm text-gray-600">{evaluation.evaluationType}</span>
      )
    },
    {
      key: 'status',
      label: 'الحالة',
      render: (evaluation: Evaluation) => <StatusBadge status={evaluation.status} />
    },
    {
      key: 'score',
      label: 'الدرجة',
      sortable: true,
      render: (evaluation: Evaluation) => (
        <span className="text-sm font-medium text-gray-900">
          {evaluation.score ? `${evaluation.score}/${evaluation.maxScore}` : '-'}
        </span>
      )
    },
    {
      key: 'actions',
      label: 'الإجراءات',
      render: (evaluation: Evaluation) => (
        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          <button
            onClick={() => setViewEvaluation(evaluation)}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            title="عرض"
          >
            <Eye size={16} />
          </button>
          {(user?.role === 'supervisor' || user?.role === 'discussion') && evaluation.status === 'pending' && (
            <button
              onClick={() => navigate(`/evaluations/${evaluation.id}/edit`)}
              className="text-yellow-600 hover:text-yellow-700 transition-colors"
              title="تقييم"
            >
              <Star size={16} />
            </button>
          )}
        </div>
      )
    }
  ], [user?.role])

  return (
    <div className="space-y-6">
      <Card className="hover-lift">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-900">{t('navigation.evaluations')}</h1>
            </div>
            <div className="flex items-center space-x-3 rtl:space-x-reverse">
              <ViewModeToggle viewMode={viewMode} onViewModeChange={setViewMode} />
              <SimplePopover
                content={
                  <AdvancedFilter
                    statusOptions={statusOptions}
                    priorityOptions={priorityOptions}
                    sortOptions={sortOptions}
                    statusFilter={statusFilter}
                    priorityFilter={priorityFilter}
                    sortBy={sortBy}
                    sortOrder={sortOrder}
                    onStatusChange={setStatusFilter}
                    onPriorityChange={setPriorityFilter}
                    onSortChange={setSortBy}
                    onSortOrderChange={setSortOrder}
                    onApply={() => {}}
                    onClear={handleFilterClear}
                  />
                }
              >
                <Button variant="outline" size="md" className={cn(
                  'relative',
                  getActiveFiltersCount(statusFilter, priorityFilter, searchQuery, sortBy, sortOrder) > 0 && 'bg-gpms-light/10 border-gpms-light text-gpms-dark'
                )}>
                  <SlidersHorizontal size={16} className="mr-1 rtl:mr-0 rtl:ml-1" />
                  {t('common.filter')}
                </Button>
              </SimplePopover>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {evaluationsLoading ? (
            <div className="text-center py-12">جاري التحميل...</div>
          ) : viewMode === 'table' ? (
            <DataTable
              data={filteredEvaluations}
              columns={columns}
              emptyMessage="لا توجد تقييمات"
              className="min-h-[400px]"
              onSort={(key, direction) => {
                setSortBy(key)
                setSortOrder(direction)
              }}
              sortBy={sortBy}
              sortOrder={sortOrder}
            />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredEvaluations.map((evaluation) => (
                <Card key={evaluation.id} className="hover-lift">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-md font-semibold text-gray-900 mb-2">{evaluation.projectTitle}</h3>
                        <p className="text-sm text-gray-600">{evaluation.evaluationType}</p>
                      </div>
                      <StatusBadge status={evaluation.status} />
                    </div>
                    {evaluation.score && (
                      <div className="mb-4">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">الدرجة:</span>
                          <span className="font-medium text-gray-900 flex items-center">
                            <Award size={16} className="ml-1 rtl:ml-0 rtl:mr-1 text-yellow-500" />
                            {evaluation.score}/{evaluation.maxScore}
                          </span>
                        </div>
                      </div>
                    )}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                      <button
                        onClick={() => setViewEvaluation(evaluation)}
                        className="text-gpms-dark hover:text-gpms-light text-sm font-medium transition-colors"
                      >
                        عرض التفاصيل
                      </button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Modal
        isOpen={!!viewEvaluation}
        onClose={() => setViewEvaluation(null)}
        title={viewEvaluation ? `تفاصيل التقييم - ${viewEvaluation.projectTitle}` : 'تفاصيل التقييم'}
        size="lg"
      >
        {viewEvaluation && (
          <div className="space-y-4 text-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="font-medium">الحالة:</span>
                <p className="text-gray-700 mt-1"><StatusBadge status={viewEvaluation.status} /></p>
              </div>
              {viewEvaluation.score && (
                <div>
                  <span className="font-medium">الدرجة:</span>
                  <p className="text-gray-700 mt-1">{viewEvaluation.score}/{viewEvaluation.maxScore}</p>
                </div>
              )}
            </div>
            {viewEvaluation.comments && (
              <div>
                <span className="font-medium">التعليقات:</span>
                <p className="text-gray-700 mt-1">{viewEvaluation.comments}</p>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  )
}

export default EvaluationsScreen
