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
import { StatusBadge } from '@/components/shared'
import { Eye, Star, Award, SlidersHorizontal, Download, Printer, FileText } from 'lucide-react'
import { Evaluation } from './schema'
import { useNavigate } from 'react-router-dom'
import { useEvaluations } from './evaluations.hook'
import FinalEvaluationModal from '@/components/forms/FinalEvaluationModal'
import { useNotifications } from '@/context/NotificationContext'

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
  const [evaluationModalOpen, setEvaluationModalOpen] = useState(false)
  const [selectedEvaluation, setSelectedEvaluation] = useState<Evaluation | null>(null)
  const { addNotification } = useNotifications()

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
          {user?.role === 'supervisor' && evaluation.status === 'pending' && (
            <button
              onClick={() => navigate(`/evaluations/${evaluation.id}/edit`)}
              className="text-yellow-600 hover:text-yellow-700 transition-colors"
              title="تقييم"
            >
              <Star size={16} />
            </button>
          )}
          {user?.role === 'discussion' && (evaluation.status === 'pending' || evaluation.status === 'in_progress') && (
            <button
              onClick={() => {
                setSelectedEvaluation(evaluation)
                setEvaluationModalOpen(true)
              }}
              className="text-blue-600 hover:text-blue-700 transition-colors"
              title="تقييم المناقشة"
            >
              <Star size={16} />
            </button>
          )}
        </div>
      )
    }
  ], [user?.role, setSelectedEvaluation, setEvaluationModalOpen])

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
                    onApply={() => { }}
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
          ) : user?.role === 'student' ? (
            // Student Grades View
            <div className="space-y-6">
              {/* Final Grades Summary */}
              {filteredEvaluations.length > 0 && (
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Award className="w-5 h-5 ml-2 rtl:ml-0 rtl:mr-2 text-yellow-500" />
                    ملخص الدرجات النهائية
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {filteredEvaluations
                      .filter(e => e.evaluationType === 'final' || e.evaluationType === 'defense')
                      .map((evaluation) => {
                        const finalGrade = evaluation.finalGrade || evaluation.score || 0
                        const maxScore = evaluation.maxScore || 100
                        const percentage = (finalGrade / maxScore) * 100

                        return (
                          <div key={evaluation.id} className="bg-white rounded-lg p-4 border border-gray-200">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm text-gray-600">
                                {evaluation.evaluationType === 'final' ? 'التقييم النهائي' : 'مناقشة'}
                              </span>
                              <Award className="w-5 h-5 text-yellow-500" />
                            </div>
                            <div className="text-2xl font-bold text-gray-900 mb-1">
                              {finalGrade.toFixed(1)}/{maxScore}
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                              <div
                                className={`h-2 rounded-full ${percentage >= 90 ? 'bg-green-500' :
                                    percentage >= 75 ? 'bg-blue-500' :
                                      percentage >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                                  }`}
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              {percentage.toFixed(1)}%
                            </div>
                          </div>
                        )
                      })}
                  </div>

                  {/* Detailed Breakdown */}
                  <div className="mt-6">
                    <h4 className="font-medium text-gray-900 mb-3">تفاصيل التقييمات</h4>
                    <div className="space-y-3">
                      {filteredEvaluations.map((evaluation) => (
                        <div key={evaluation.id} className="bg-white rounded-lg p-4 border border-gray-200">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <h5 className="font-medium text-gray-900">{evaluation.projectTitle}</h5>
                              <p className="text-sm text-gray-600 mt-1">
                                {evaluation.evaluationType === 'proposal' ? 'مقترح' :
                                  evaluation.evaluationType === 'progress' ? 'تقدم' :
                                    evaluation.evaluationType === 'final' ? 'نهائي' :
                                      evaluation.evaluationType === 'defense' ? 'مناقشة' :
                                        evaluation.evaluationType === 'presentation' ? 'عرض' : evaluation.evaluationType}
                              </p>
                              {evaluation.evaluator && (
                                <p className="text-xs text-gray-500 mt-1">
                                  المقيّم: {evaluation.evaluator}
                                </p>
                              )}
                            </div>
                            <div className="text-right">
                              {evaluation.score !== undefined ? (
                                <>
                                  <div className="text-lg font-bold text-gray-900">
                                    {evaluation.score}/{evaluation.maxScore}
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    {((evaluation.score / evaluation.maxScore) * 100).toFixed(1)}%
                                  </div>
                                </>
                              ) : (
                                <span className="text-sm text-gray-400">لم يتم التقييم</span>
                              )}
                            </div>
                          </div>
                          {evaluation.comments && (
                            <div className="mt-3 pt-3 border-t border-gray-200">
                              <p className="text-sm text-gray-700">{evaluation.comments}</p>
                            </div>
                          )}
                          {evaluation.criteria && (
                            <div className="mt-3 pt-3 border-t border-gray-200">
                              <div className="grid grid-cols-2 gap-2 text-xs">
                                {evaluation.criteria.technical !== undefined && (
                                  <div>
                                    <span className="text-gray-600">تقني:</span>
                                    <span className="font-medium text-gray-900 mr-1">{evaluation.criteria.technical}</span>
                                  </div>
                                )}
                                {evaluation.criteria.methodology !== undefined && (
                                  <div>
                                    <span className="text-gray-600">منهجية:</span>
                                    <span className="font-medium text-gray-900 mr-1">{evaluation.criteria.methodology}</span>
                                  </div>
                                )}
                                {evaluation.criteria.presentation !== undefined && (
                                  <div>
                                    <span className="text-gray-600">عرض:</span>
                                    <span className="font-medium text-gray-900 mr-1">{evaluation.criteria.presentation}</span>
                                  </div>
                                )}
                                {evaluation.criteria.documentation !== undefined && (
                                  <div>
                                    <span className="text-gray-600">توثيق:</span>
                                    <span className="font-medium text-gray-900 mr-1">{evaluation.criteria.documentation}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Export/Print Buttons */}
                  <div className="mt-6 flex gap-3">
                    <Button
                      variant="outline"
                      onClick={() => {
                        window.print()
                      }}
                    >
                      <Printer className="w-4 h-4 mr-1 rtl:mr-0 rtl:ml-1" />
                      طباعة
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        // Export to CSV
                        const data = filteredEvaluations.map(e => ({
                          المشروع: e.projectTitle,
                          نوع_التقييم: e.evaluationType === 'proposal' ? 'مقترح' :
                            e.evaluationType === 'progress' ? 'تقدم' :
                              e.evaluationType === 'final' ? 'نهائي' :
                                e.evaluationType === 'defense' ? 'مناقشة' :
                                  e.evaluationType === 'presentation' ? 'عرض' : e.evaluationType,
                          الدرجة: e.score || 0,
                          الدرجة_النهائية: e.finalGrade || e.score || 0,
                          الدرجة_الكاملة: e.maxScore || 100,
                          النسبة_المئوية: e.score ? ((e.score / (e.maxScore || 100)) * 100).toFixed(1) + '%' : '0%',
                          المقيّم: e.evaluator || 'غير محدد',
                          التاريخ: e.submittedDate ? new Date(e.submittedDate).toLocaleDateString('ar-SA') : 'غير محدد',
                          الملاحظات: e.comments || ''
                        }))

                        const csvContent = [
                          Object.keys(data[0] || {}).join(','),
                          ...data.map(row => Object.values(row).map(val => `"${val}"`).join(','))
                        ].join('\n')

                        const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' })
                        const link = document.createElement('a')
                        const url = URL.createObjectURL(blob)
                        link.setAttribute('href', url)
                        link.setAttribute('download', `الدرجات_${new Date().toISOString().split('T')[0]}.csv`)
                        link.style.visibility = 'hidden'
                        document.body.appendChild(link)
                        link.click()
                        document.body.removeChild(link)

                        addNotification({
                          title: 'تم التصدير',
                          message: 'تم تصدير الدرجات بنجاح',
                          type: 'success'
                        })
                      }}
                    >
                      <Download className="w-4 h-4 mr-1 rtl:mr-0 rtl:ml-1" />
                      تصدير Excel
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        // Export to PDF (using browser print)
                        const printWindow = window.open('', '_blank')
                        if (printWindow) {
                          const content = `
                            <html>
                              <head>
                                <title>سجل الدرجات</title>
                                <style>
                                  body { font-family: Arial, sans-serif; direction: rtl; padding: 20px; }
                                  h1 { text-align: center; }
                                  table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                                  th, td { border: 1px solid #ddd; padding: 8px; text-align: right; }
                                  th { background-color: #f2f2f2; }
                                </style>
                              </head>
                              <body>
                                <h1>سجل الدرجات النهائية</h1>
                                <table>
                                  <thead>
                                    <tr>
                                      <th>المشروع</th>
                                      <th>نوع التقييم</th>
                                      <th>الدرجة</th>
                                      <th>الدرجة النهائية</th>
                                      <th>النسبة المئوية</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    ${filteredEvaluations.map(e => `
                                      <tr>
                                        <td>${e.projectTitle}</td>
                                        <td>${e.evaluationType === 'final' ? 'نهائي' : e.evaluationType === 'defense' ? 'مناقشة' : e.evaluationType}</td>
                                        <td>${e.score || 0}/${e.maxScore || 100}</td>
                                        <td>${e.finalGrade || e.score || 0}</td>
                                        <td>${e.score ? ((e.score / (e.maxScore || 100)) * 100).toFixed(1) + '%' : '0%'}</td>
                                      </tr>
                                    `).join('')}
                                  </tbody>
                                </table>
                              </body>
                            </html>
                          `
                          printWindow.document.write(content)
                          printWindow.document.close()
                          printWindow.print()
                        }
                      }}
                    >
                      <FileText className="w-4 h-4 mr-1 rtl:mr-0 rtl:ml-1" />
                      تصدير PDF
                    </Button>
                  </div>
                </div>
              )}

              {filteredEvaluations.length === 0 && (
                <div className="text-center py-12">
                  <Award className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد درجات متاحة</h3>
                  <p className="text-gray-600">لم يتم تقييم مشروعك بعد</p>
                </div>
              )}
            </div>
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

      {/* Final Evaluation Modal for Discussion Committee */}
      {user?.role === 'discussion' && (
        <FinalEvaluationModal
          isOpen={evaluationModalOpen}
          onClose={() => {
            setEvaluationModalOpen(false)
            setSelectedEvaluation(null)
          }}
          onSubmit={async (data) => {
            try {
              // TODO: Call API to save evaluation and send to committee for approval
              addNotification({
                title: 'تم حفظ التقييم',
                message: 'تم حفظ التقييم النهائي بنجاح. سيتم إرساله للجنة المشاريع للاعتماد.',
                type: 'success'
              })
              setEvaluationModalOpen(false)
              setSelectedEvaluation(null)
              // TODO: Update project status to 'completed'
            } catch (error) {
              addNotification({
                title: 'خطأ',
                message: 'فشل في حفظ التقييم. يرجى المحاولة مرة أخرى.',
                type: 'error'
              })
            }
          }}
          projectData={selectedEvaluation ? {
            id: selectedEvaluation.id,
            title: selectedEvaluation.projectTitle,
            student: selectedEvaluation.studentName || '',
            studentId: selectedEvaluation.studentId || '',
            supervisor: selectedEvaluation.supervisor || '',
            defenseDate: selectedEvaluation.defenseDate || new Date().toISOString()
          } : undefined}
        />
      )}
    </div>
  )
}

export default EvaluationsScreen
