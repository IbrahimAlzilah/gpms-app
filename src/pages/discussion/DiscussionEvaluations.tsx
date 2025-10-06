import React, { useState } from 'react'
import { useLanguage } from '../../context/LanguageContext'
import { cn, getActiveFiltersCount } from '../../lib/utils'
import { Card, CardContent, CardHeader } from '../../components/ui/Card'
import DataTable from '../../components/ui/DataTable'
import Button from '../../components/ui/Button'
import { SearchBar } from '../../components/ui/Filter'
import SimplePopover from '../../components/ui/SimplePopover'
import AdvancedFilter from '../../components/ui/AdvancedFilter'
import Modal from '../../components/ui/Modal'
import {
  Eye,
  Edit,
  Star,
  Award,
  Calendar,
  User,
  Grid3X3,
  List,
  ClipboardCheck,
  SlidersHorizontal,
  CheckCircle
} from 'lucide-react'

interface Evaluation {
  id: string
  projectTitle: string
  students: string[]
  supervisor: string
  evaluator: string
  status: 'pending' | 'in_progress' | 'completed' | 'submitted'
  defenseDate: string
  submissionDate?: string
  presentationGrade?: number
  reportGrade?: number
  discussionGrade?: number
  finalGrade?: number
  comments: string
  recommendations: string[]
  priority: 'low' | 'medium' | 'high'
  department: string
  tags: string[]
}

const DiscussionEvaluations: React.FC = () => {
  const { } = useLanguage()
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [sortBy, setSortBy] = useState('defenseDate')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('grid')
  // const [confirmCompleteOpen, setConfirmCompleteOpen] = useState(false)
  // const [evaluationIdToComplete, setEvaluationIdToComplete] = useState<string | null>(null)

  // Mock data - تقييمات المشاريع
  const [evaluations] = useState<Evaluation[]>([
    {
      id: '1',
      projectTitle: 'نظام إدارة المكتبة الذكية',
      students: ['أحمد محمد علي', 'فاطمة حسن محمود'],
      supervisor: 'د. أحمد محمد',
      evaluator: 'د. سارة أحمد',
      status: 'completed',
      defenseDate: '2024-01-20',
      submissionDate: '2024-01-22',
      presentationGrade: 95,
      reportGrade: 90,
      discussionGrade: 88,
      finalGrade: 91,
      comments: 'مشروع ممتاز مع تطبيق عملي جيد، يحتاج تحسين في التوثيق',
      recommendations: ['تحسين التوثيق', 'إضافة المزيد من الاختبارات'],
      priority: 'high',
      department: 'علوم الحاسوب',
      tags: ['تطوير ويب', 'ذكاء اصطناعي']
    },
    {
      id: '2',
      projectTitle: 'تطبيق التجارة الإلكترونية',
      students: ['سارة أحمد محمد', 'يوسف محمود حسن'],
      supervisor: 'د. سارة أحمد',
      evaluator: 'د. خالد محمود',
      status: 'in_progress',
      defenseDate: '2024-01-18',
      presentationGrade: 85,
      reportGrade: 80,
      discussionGrade: 0,
      finalGrade: 0,
      comments: 'العرض ممتاز لكن التقرير يحتاج مراجعة',
      recommendations: ['مراجعة التقرير', 'إضافة المزيد من الأمثلة'],
      priority: 'medium',
      department: 'علوم الحاسوب',
      tags: ['تجارة إلكترونية', 'دفع إلكتروني']
    },
    {
      id: '3',
      projectTitle: 'نظام إدارة المستشفيات',
      students: ['علي حسن محمد', 'نورا سعد أحمد'],
      supervisor: 'د. فاطمة علي',
      evaluator: 'د. سعد محمود',
      status: 'pending',
      defenseDate: '2024-02-15',
      comments: '',
      recommendations: [],
      priority: 'high',
      department: 'هندسة البرمجيات',
      tags: ['إدارة طبية', 'قواعد البيانات']
    },
    {
      id: '4',
      projectTitle: 'منصة التعليم التفاعلي',
      students: ['خالد محمد أحمد'],
      supervisor: 'د. خالد محمود',
      evaluator: 'د. نورا حسن',
      status: 'submitted',
      defenseDate: '2024-01-15',
      submissionDate: '2024-01-17',
      presentationGrade: 92,
      reportGrade: 88,
      discussionGrade: 90,
      finalGrade: 90,
      comments: 'مشروع مبدع مع تطبيق ممتاز للواقع الافتراضي',
      recommendations: ['تطوير المزيد من الميزات'],
      priority: 'medium',
      department: 'تقنية المعلومات',
      tags: ['تعليم إلكتروني', 'واقع افتراضي']
    },
    {
      id: '5',
      projectTitle: 'نظام إدارة الموارد البشرية',
      students: ['مريم علي سعد', 'أسامة محمد علي'],
      supervisor: 'د. سعد محمود',
      evaluator: 'د. أحمد محمد',
      status: 'completed',
      defenseDate: '2024-01-10',
      submissionDate: '2024-01-12',
      presentationGrade: 98,
      reportGrade: 94,
      discussionGrade: 96,
      finalGrade: 96,
      comments: 'مشروع متكامل مع تطبيق عملي ممتاز في الشركة',
      recommendations: ['نشر البحث في مجلة علمية'],
      priority: 'low',
      department: 'نظم المعلومات',
      tags: ['إدارة موارد بشرية', 'تطبيق عملي']
    }
  ])

  const statusOptions = [
    { value: 'all', label: 'جميع الحالات' },
    { value: 'pending', label: 'في الانتظار' },
    { value: 'in_progress', label: 'قيد التقييم' },
    { value: 'completed', label: 'مكتمل' },
    { value: 'submitted', label: 'مُرسل' }
  ]

  const priorityOptions = [
    { value: 'all', label: 'جميع الأولويات' },
    { value: 'low', label: 'منخفض' },
    { value: 'medium', label: 'متوسط' },
    { value: 'high', label: 'عالي' }
  ]

  const sortOptions = [
    { value: 'defenseDate', label: 'تاريخ المناقشة' },
    { value: 'projectTitle', label: 'عنوان المشروع' },
    { value: 'status', label: 'الحالة' },
    { value: 'finalGrade', label: 'الدرجة النهائية' },
    { value: 'submissionDate', label: 'تاريخ الإرسال' }
  ]

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'في الانتظار'
      case 'in_progress': return 'قيد التقييم'
      case 'completed': return 'مكتمل'
      case 'submitted': return 'مُرسل'
      default: return status
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'in_progress': return 'bg-blue-100 text-blue-800'
      case 'completed': return 'bg-green-100 text-green-800'
      case 'submitted': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low': return 'bg-green-100 text-green-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'high': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'low': return 'منخفض'
      case 'medium': return 'متوسط'
      case 'high': return 'عالي'
      default: return priority
    }
  }

  const filteredEvaluations = evaluations.filter(evaluation => {
    const matchesSearch = !searchQuery ||
      evaluation.projectTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      evaluation.students.some(student => student.toLowerCase().includes(searchQuery.toLowerCase())) ||
      evaluation.supervisor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      evaluation.evaluator.toLowerCase().includes(searchQuery.toLowerCase()) ||
      evaluation.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      evaluation.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesStatus = statusFilter === 'all' || evaluation.status === statusFilter
    const matchesPriority = priorityFilter === 'all' || evaluation.priority === priorityFilter

    return matchesSearch && matchesStatus && matchesPriority
  })

  const handleFilterClear = () => {
    setStatusFilter('all')
    setPriorityFilter('all')
    setSortBy('defenseDate')
    setSortOrder('desc')
  }

  const [viewEvaluation, setViewEvaluation] = useState<Evaluation | null>(null)
  const handleViewEvaluation = (evaluation: Evaluation) => {
    setViewEvaluation(evaluation)
  }

  const [startEvalFor, setStartEvalFor] = useState<Evaluation | null>(null)
  const [startForm, setStartForm] = useState({ reportGrade: '', presentationGrade: '', comments: '', recommendations: '' })
  const handleStartEvaluation = (evaluation: Evaluation) => {
    setStartEvalFor(evaluation)
    setStartForm({ reportGrade: '', presentationGrade: '', comments: '', recommendations: '' })
  }

  const handleCompleteEvaluation = (evaluation: Evaluation) => {
    console.log('Completing evaluation:', evaluation.id)
  }

  // const confirmComplete = () => {
  //   if (evaluationIdToComplete) {
  //     console.log('Completing evaluation:', evaluationIdToComplete)
  //   }
  //   setConfirmCompleteOpen(false)
  //   setEvaluationIdToComplete(null)
  // }

  // const cancelComplete = () => {
  //   setConfirmCompleteOpen(false)
  //   setEvaluationIdToComplete(null)
  // }

  const columns = [
    {
      key: 'projectTitle',
      label: 'المشروع',
      sortable: true,
      render: (e: Evaluation) => (
        <div>
          <h3 className="font-medium text-gray-900">{e.projectTitle}</h3>
          <p className="text-xs text-gray-600">{e.students.join(', ')}</p>
        </div>
      )
    },
    {
      key: 'status',
      label: 'الحالة',
      render: (e: Evaluation) => (
        <span className={cn('px-2 py-1 text-xs rounded-full', getStatusColor(e.status))}>{getStatusText(e.status)}</span>
      )
    },
    {
      key: 'defenseDate',
      label: 'تاريخ المناقشة',
      sortable: true,
      render: (e: Evaluation) => (
        <span className="text-sm text-gray-600">{new Date(e.defenseDate).toLocaleDateString('ar')}</span>
      )
    },
    {
      key: 'evaluator',
      label: 'المقيم',
      render: (e: Evaluation) => <span className="text-sm text-gray-600">{e.evaluator}</span>
    },
    {
      key: 'finalGrade',
      label: 'النهائية',
      sortable: true,
      render: (e: Evaluation) => <span className="text-sm text-gray-600">{e.finalGrade ? `${e.finalGrade}/100` : '-'}</span>
    },
    {
      key: 'actions',
      label: 'الإجراءات',
      render: (e: Evaluation) => (
        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          <button onClick={() => handleViewEvaluation(e)} className="p-2 text-gray-400 hover:text-gray-600" title="عرض"><Eye size={16} /></button>
          {e.status === 'pending' && (
            <button onClick={() => handleStartEvaluation(e)} className="p-2 text-gray-400 hover:text-blue-600" title="بدء التقييم"><Edit size={16} /></button>
          )}
          {e.status === 'in_progress' && (
            <button onClick={() => handleCompleteEvaluation(e)} className="p-2 text-gray-400 hover:text-green-600" title="إكمال"><CheckCircle size={16} /></button>
          )}
        </div>
      )
    }
  ]

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <Card className="hover-lift">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3 rtl:space-x-reverse">
                <ClipboardCheck className="w-6 h-6 text-gpms-dark" />
                <div>
                  <h1 className="text-xl font-bold text-gray-900">التقييمات النهائية</h1>
                  <p className="text-gray-600 mt-1">تقييم المشاريع وإصدار الدرجات النهائية</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 rtl:space-x-reverse">
                {/* View Mode Toggle */}
                <div className="flex bg-gray-100 rounded-lg p-1">
                  <button
                    title="جدول"
                    onClick={() => setViewMode('table')}
                    className={cn(
                      'px-3 py-1 rounded-md text-sm font-medium transition-colors',
                      viewMode === 'table'
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    )}
                  >
                    <List size={20} className="ml-1 rtl:ml-0 rtl:mr-1" />
                  </button>
                  <button
                    title="شبكة"
                    onClick={() => setViewMode('grid')}
                    className={cn(
                      'px-3 py-1 rounded-md text-sm font-medium transition-colors',
                      viewMode === 'grid'
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    )}
                  >
                    <Grid3X3 size={20} className="ml-1 rtl:ml-0 rtl:mr-1" />
                  </button>
                </div>

                {/* Advanced Filter */}
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
                  <Button
                    variant="outline"
                    size="sm"
                    className={cn(
                      'relative',
                      getActiveFiltersCount(statusFilter, priorityFilter, searchQuery, sortBy, sortOrder) > 0 && 'bg-gpms-light/10 border-gpms-light text-gpms-dark'
                    )}
                  >
                    <SlidersHorizontal size={16} className="ml-1 rtl:ml-0 rtl:mr-1" />
                    تصفية التقييمات
                    {getActiveFiltersCount(statusFilter, priorityFilter, searchQuery, sortBy, sortOrder) > 0 && (
                      <span className="absolute -top-1 -right-1 rtl:right-auto rtl:-left-1 bg-gpms-dark text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {getActiveFiltersCount(statusFilter, priorityFilter, searchQuery, sortBy, sortOrder)}
                      </span>
                    )}
                  </Button>
                </SimplePopover>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            {/* Search Bar */}
            <div className="mb-4">
              <SearchBar
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="البحث في التقييمات..."
                className="w-full"
              />
            </div>
          </CardContent>
        </Card>

        {/* Evaluations Display */}
        {viewMode === 'table' ? (
          <Card className="hover-lift">
            <CardContent className="p-0">
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
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredEvaluations.map((evaluation) => (
              <Card key={evaluation.id} className="hover-lift">
                <CardContent className="p-6">
                  {/* Evaluation Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-md font-semibold text-gray-900 mb-2">{evaluation.projectTitle}</h3>
                      <div className="flex items-center text-sm text-gray-600">
                        <User size={16} className="ml-2 rtl:ml-0 rtl:mr-2" />
                        <span>المقيم: {evaluation.evaluator}</span>
                      </div>
                    </div>
                    <span className={cn('px-2 py-1 text-xs rounded-full', getStatusColor(evaluation.status))}>
                      {getStatusText(evaluation.status)}
                    </span>
                  </div>

                  {/* Students */}
                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">الطلاب:</p>
                    <div className="flex flex-wrap gap-1">
                      {evaluation.students.map((student, index) => (
                        <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                          {student}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Evaluation Info */}
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar size={16} className="ml-2 rtl:ml-0 rtl:mr-2" />
                      <span>تاريخ المناقشة: {new Date(evaluation.defenseDate).toLocaleDateString('ar')}</span>
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span>الأولوية:</span>
                      <span className={cn('px-2 py-1 text-xs rounded-full', getPriorityColor(evaluation.priority))}>
                        {getPriorityText(evaluation.priority)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span>القسم:</span>
                      <span className="font-medium">{evaluation.department}</span>
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span>المشرف:</span>
                      <span className="font-medium">{evaluation.supervisor}</span>
                    </div>
                  </div>

                  {/* Grades */}
                  {evaluation.finalGrade && (
                    <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                      <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                        <Award size={16} className="ml-1 rtl:ml-0 rtl:mr-1 text-yellow-500" />
                        الدرجات
                      </h4>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        {evaluation.presentationGrade && (
                          <div className="flex justify-between">
                            <span>العرض:</span>
                            <span className="font-medium">{evaluation.presentationGrade}</span>
                          </div>
                        )}
                        {evaluation.reportGrade && (
                          <div className="flex justify-between">
                            <span>التقرير:</span>
                            <span className="font-medium">{evaluation.reportGrade}</span>
                          </div>
                        )}
                        {evaluation.discussionGrade && (
                          <div className="flex justify-between">
                            <span>المناقشة:</span>
                            <span className="font-medium">{evaluation.discussionGrade}</span>
                          </div>
                        )}
                        <div className="flex justify-between col-span-2 pt-1 border-t border-gray-200">
                          <span className="font-medium">النهائية:</span>
                          <span className="font-bold text-gpms-dark">{evaluation.finalGrade}/100</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Comments */}
                  {evaluation.comments && (
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">التعليقات:</h4>
                      <p className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
                        {evaluation.comments}
                      </p>
                    </div>
                  )}

                  {/* Recommendations */}
                  {evaluation.recommendations.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">التوصيات:</h4>
                      <ul className="text-xs text-gray-600 space-y-1">
                        {evaluation.recommendations.map((rec, index) => (
                          <li key={index} className="flex items-start">
                            <span className="text-gpms-dark ml-1 rtl:ml-0 rtl:mr-1">•</span>
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Tags */}
                  {evaluation.tags.length > 0 && (
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-1">
                        {evaluation.tags.map((tag, index) => (
                          <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div className="flex space-x-2 rtl:space-x-reverse">
                      <button
                        onClick={() => handleViewEvaluation(evaluation)}
                        className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                        title="عرض"
                      >
                        <Eye size={16} />
                      </button>
                      {evaluation.status === 'pending' && (
                        <button
                          onClick={() => handleStartEvaluation(evaluation)}
                          className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                          title="بدء التقييم"
                        >
                          <Edit size={16} />
                        </button>
                      )}
                      {evaluation.status === 'in_progress' && (
                        <button
                          onClick={() => handleCompleteEvaluation(evaluation)}
                          className="p-2 text-gray-400 hover:text-green-600 transition-colors"
                          title="إكمال التقييم"
                        >
                          <CheckCircle size={16} />
                        </button>
                      )}
                      {evaluation.status === 'completed' && (
                        <button className="p-2 text-gray-400 hover:text-yellow-600 transition-colors" title="مراجعة">
                          <Star size={16} />
                        </button>
                      )}
                    </div>
                    <button
                      onClick={() => handleViewEvaluation(evaluation)}
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

        {/* Empty State */}
        {filteredEvaluations.length === 0 && (
          <Card className="hover-lift">
            <CardContent className="text-center py-12">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ClipboardCheck size={32} className="text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد تقييمات</h3>
              <p className="text-gray-600">لم يتم العثور على تقييمات تطابق معايير البحث</p>
            </CardContent>
          </Card>
        )}
      </div>
      <Modal
        isOpen={!!viewEvaluation}
        onClose={() => setViewEvaluation(null)}
        title={viewEvaluation ? `تفاصيل التقييم: ${viewEvaluation.projectTitle}` : ''}
        size="lg"
      >
        {viewEvaluation && (
          <div className="space-y-4 text-sm text-gray-700">
            <div className="grid grid-cols-2 gap-4">
              <div><span className="font-medium">الحالة:</span> {getStatusText(viewEvaluation.status)}</div>
              <div><span className="font-medium">الطلاب:</span> {viewEvaluation.students.join(', ')}</div>
              <div><span className="font-medium">المشرف:</span> {viewEvaluation.supervisor}</div>
              <div><span className="font-medium">المقيم:</span> {viewEvaluation.evaluator}</div>
              <div><span className="font-medium">القسم:</span> {viewEvaluation.department}</div>
              <div><span className="font-medium">تاريخ المناقشة:</span> {new Date(viewEvaluation.defenseDate).toLocaleDateString('ar')}</div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><span className="font-medium">درجة التقرير:</span> {viewEvaluation.reportGrade ?? '—'}</div>
              <div><span className="font-medium">درجة العرض:</span> {viewEvaluation.presentationGrade ?? '—'}</div>
              <div className="col-span-2"><span className="font-medium">النهائية:</span> {viewEvaluation.finalGrade ?? '—'}</div>
            </div>
            {viewEvaluation.comments && (
              <div>
                <span className="font-medium">التعليقات:</span>
                <p className="mt-1 text-gray-600">{viewEvaluation.comments}</p>
              </div>
            )}
            {viewEvaluation.recommendations?.length ? (
              <div>
                <span className="font-medium">التوصيات:</span>
                <ul className="list-disc list-inside mt-1 space-y-1 text-gray-600">
                  {viewEvaluation.recommendations.map((r, i) => (<li key={i}>{r}</li>))}
                </ul>
              </div>
            ) : null}
            {viewEvaluation.tags?.length ? (
              <div className="flex flex-wrap gap-2">
                {viewEvaluation.tags.map((tag, i) => (
                  <span key={i} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">{tag}</span>
                ))}
              </div>
            ) : null}
          </div>
        )}
      </Modal>

      <Modal
        isOpen={!!startEvalFor}
        onClose={() => setStartEvalFor(null)}
        title={startEvalFor ? `بدء التقييم: ${startEvalFor.projectTitle}` : ''}
        onSubmit={(e) => {
          e?.preventDefault()
          console.log('Submitting evaluation:', startEvalFor?.id, startForm)
          setStartEvalFor(null)
        }}
        size="lg"
      >
        {startEvalFor && (
          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg text-sm text-blue-900">
              <div>الطلاب: {startEvalFor.students.join(', ')}</div>
              <div>المشرف: {startEvalFor.supervisor}</div>
              <div>تاريخ المناقشة: {new Date(startEvalFor.defenseDate).toLocaleDateString('ar')}</div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">درجة التقرير (0-50)</label>
                <input type="number" min={0} max={50} value={startForm.reportGrade} onChange={(e) => setStartForm(prev => ({ ...prev, reportGrade: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gpms-light focus:border-transparent" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">درجة العرض (0-50)</label>
                <input type="number" min={0} max={50} value={startForm.presentationGrade} onChange={(e) => setStartForm(prev => ({ ...prev, presentationGrade: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gpms-light focus:border-transparent" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">التعليقات</label>
              <textarea rows={4} value={startForm.comments} onChange={(e) => setStartForm(prev => ({ ...prev, comments: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gpms-light focus:border-transparent" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">التوصيات</label>
              <textarea rows={3} value={startForm.recommendations} onChange={(e) => setStartForm(prev => ({ ...prev, recommendations: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gpms-light focus:border-transparent" />
            </div>
          </div>
        )}
      </Modal>
    </>
  )
}

export default DiscussionEvaluations