import React, { useState } from 'react'
import { useLanguage } from '../../context/LanguageContext'
import { cn } from '../../lib/utils'
import { Card, CardContent, CardHeader } from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Divider from '../../components/ui/Divider'
import { SearchBar } from '../../components/ui/Filter'
import DataTable from '../../components/ui/DataTable'
import SimplePopover from '../../components/ui/SimplePopover'
import AdvancedFilter from '../../components/ui/AdvancedFilter'
import { 
  Eye, 
  Edit, 
  Award,
  TrendingUp,
  FileText,
  Grid3X3,
  List,
  SlidersHorizontal,
  Star,
  CheckCircle,
  Clock,
  User
} from 'lucide-react'

interface Evaluation {
  id: string
  projectTitle: string
  studentName: string
  studentId: string
  evaluationType: 'proposal' | 'progress' | 'final' | 'presentation' | 'code_review'
  status: 'pending' | 'in_progress' | 'completed' | 'overdue'
  dueDate: string
  submittedDate?: string
  score?: number
  maxScore: number
  comments?: string
  criteria: {
    technical: number
    methodology: number
    presentation: number
    documentation: number
  }
  grade?: 'A+' | 'A' | 'B+' | 'B' | 'C+' | 'C' | 'D' | 'F'
  priority: 'low' | 'medium' | 'high'
  tags: string[]
}

const SupervisorEvaluations: React.FC = () => {
  const { t } = useLanguage()
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [sortBy, setSortBy] = useState('dueDate')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('grid')

  // Mock data - تقييمات المشرف
  const [evaluations] = useState<Evaluation[]>([
    {
      id: '1',
      projectTitle: 'تطبيق إدارة المكتبة الذكية',
      studentName: 'أحمد محمد علي',
      studentId: '2021001234',
      evaluationType: 'proposal',
      status: 'completed',
      dueDate: '2024-01-15',
      submittedDate: '2024-01-14',
      score: 85,
      maxScore: 100,
      comments: 'مقترح ممتاز مع منهجية واضحة، يحتاج تحسين في الجدول الزمني',
      criteria: {
        technical: 8,
        methodology: 9,
        presentation: 8,
        documentation: 7
      },
      grade: 'A',
      priority: 'high',
      tags: ['مقترح', 'ذكاء اصطناعي', 'قواعد بيانات']
    },
    {
      id: '2',
      projectTitle: 'نظام إدارة المستودعات',
      studentName: 'فاطمة حسن محمد',
      studentId: '2021001235',
      evaluationType: 'progress',
      status: 'in_progress',
      dueDate: '2024-01-20',
      score: 0,
      maxScore: 100,
      criteria: {
        technical: 0,
        methodology: 0,
        presentation: 0,
        documentation: 0
      },
      priority: 'medium',
      tags: ['تقرير تقدم', 'IoT', 'إدارة المخزون']
    },
    {
      id: '3',
      projectTitle: 'منصة التعليم الإلكتروني',
      studentName: 'محمد خالد أحمد',
      studentId: '2021001236',
      evaluationType: 'final',
      status: 'overdue',
      dueDate: '2024-01-18',
      score: 0,
      maxScore: 100,
      criteria: {
        technical: 0,
        methodology: 0,
        presentation: 0,
        documentation: 0
      },
      priority: 'high',
      tags: ['تقييم نهائي', 'تعليم إلكتروني', 'واجهة مستخدم']
    },
    {
      id: '4',
      projectTitle: 'تطبيق توصيل الطلبات',
      studentName: 'سارة أحمد محمود',
      studentId: '2021001237',
      evaluationType: 'code_review',
      status: 'pending',
      dueDate: '2024-01-25',
      score: 0,
      maxScore: 100,
      criteria: {
        technical: 0,
        methodology: 0,
        presentation: 0,
        documentation: 0
      },
      priority: 'medium',
      tags: ['مراجعة كود', 'تطبيق جوال', 'API']
    },
    {
      id: '5',
      projectTitle: 'نظام حجز المواعيد',
      studentName: 'خالد محمود حسن',
      studentId: '2021001238',
      evaluationType: 'presentation',
      status: 'completed',
      dueDate: '2024-01-12',
      submittedDate: '2024-01-12',
      score: 78,
      maxScore: 100,
      comments: 'عرض تقديمي جيد مع شرح واضح، يحتاج تحسين في الإجابة على الأسئلة',
      criteria: {
        technical: 7,
        methodology: 8,
        presentation: 8,
        documentation: 7
      },
      grade: 'B+',
      priority: 'low',
      tags: ['عرض تقديمي', 'حجز مواعيد', 'نظام إدارة']
    }
  ])

  const statusOptions = [
    { value: 'all', label: 'جميع الحالات' },
    { value: 'pending', label: 'في الانتظار' },
    { value: 'in_progress', label: 'قيد التقييم' },
    { value: 'completed', label: 'مكتمل' },
    { value: 'overdue', label: 'متأخر' }
  ]

  const typeOptions = [
    { value: 'all', label: 'جميع الأنواع' },
    { value: 'proposal', label: 'مقترح المشروع' },
    { value: 'progress', label: 'تقرير التقدم' },
    { value: 'final', label: 'التقييم النهائي' },
    { value: 'presentation', label: 'العرض التقديمي' },
    { value: 'code_review', label: 'مراجعة الكود' }
  ]

  const priorityOptions = [
    { value: 'all', label: 'جميع الأولويات' },
    { value: 'low', label: 'منخفض' },
    { value: 'medium', label: 'متوسط' },
    { value: 'high', label: 'عالي' }
  ]

  const sortOptions = [
    { value: 'dueDate', label: 'تاريخ الاستحقاق' },
    { value: 'projectTitle', label: 'عنوان المشروع' },
    { value: 'studentName', label: 'اسم الطالب' },
    { value: 'status', label: 'الحالة' },
    { value: 'score', label: 'الدرجة' },
    { value: 'priority', label: 'الأولوية' }
  ]

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'في الانتظار'
      case 'in_progress': return 'قيد التقييم'
      case 'completed': return 'مكتمل'
      case 'overdue': return 'متأخر'
      default: return status
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'in_progress': return 'bg-blue-100 text-blue-800'
      case 'completed': return 'bg-green-100 text-green-800'
      case 'overdue': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeText = (type: string) => {
    switch (type) {
      case 'proposal': return 'مقترح المشروع'
      case 'progress': return 'تقرير التقدم'
      case 'final': return 'التقييم النهائي'
      case 'presentation': return 'العرض التقديمي'
      case 'code_review': return 'مراجعة الكود'
      default: return type
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

  const getGradeColor = (grade?: string) => {
    if (!grade) return 'text-gray-500'
    switch (grade) {
      case 'A+':
      case 'A': return 'text-green-600'
      case 'B+':
      case 'B': return 'text-blue-600'
      case 'C+':
      case 'C': return 'text-yellow-600'
      case 'D': return 'text-orange-600'
      case 'F': return 'text-red-600'
      default: return 'text-gray-500'
    }
  }

  const filteredEvaluations = evaluations.filter(evaluation => {
    const matchesSearch = !searchQuery ||
      evaluation.projectTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      evaluation.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      evaluation.studentId.includes(searchQuery) ||
      evaluation.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesStatus = statusFilter === 'all' || evaluation.status === statusFilter
    const matchesType = typeFilter === 'all' || evaluation.evaluationType === typeFilter
    const matchesPriority = priorityFilter === 'all' || evaluation.priority === priorityFilter

    return matchesSearch && matchesStatus && matchesType && matchesPriority
  }).sort((a, b) => {
    let comparison = 0

    switch (sortBy) {
      case 'projectTitle':
        comparison = a.projectTitle.localeCompare(b.projectTitle, 'ar')
        break
      case 'studentName':
        comparison = a.studentName.localeCompare(b.studentName, 'ar')
        break
      case 'dueDate':
        comparison = new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
        break
      case 'score':
        comparison = (a.score || 0) - (b.score || 0)
        break
      default:
        comparison = 0
    }

    return sortOrder === 'asc' ? comparison : -comparison
  })

  const handleViewEvaluation = (evaluation: Evaluation) => {
    console.log('View evaluation:', evaluation)
    // Implement view functionality
  }

  const handleEditEvaluation = (evaluation: Evaluation) => {
    console.log('Edit evaluation:', evaluation)
    // Implement edit functionality
  }

  const handleStartEvaluation = (evaluation: Evaluation) => {
    console.log('Start evaluation:', evaluation)
    // Implement start evaluation functionality
  }

  const handleFilterClear = () => {
    setStatusFilter('all')
    setTypeFilter('all')
    setPriorityFilter('all')
    setSortBy('dueDate')
    setSortOrder('asc')
  }

  const getActiveFiltersCount = () => {
    let count = 0
    if (statusFilter !== 'all') count++
    if (typeFilter !== 'all') count++
    if (priorityFilter !== 'all') count++
    if (sortBy !== 'dueDate') count++
    if (sortOrder !== 'asc') count++
    return count
  }

  // Calculate statistics
  const totalEvaluations = evaluations.length
  const completedEvaluations = evaluations.filter(e => e.status === 'completed').length
  const pendingEvaluations = evaluations.filter(e => e.status === 'pending').length
  const overdueEvaluations = evaluations.filter(e => e.status === 'overdue').length
  const averageScore = evaluations
    .filter(e => e.score && e.score > 0)
    .reduce((sum, e) => sum + (e.score || 0), 0) / 
    evaluations.filter(e => e.score && e.score > 0).length || 0

  const columns = [
    {
      key: 'projectTitle',
      label: 'المشروع',
      sortable: true,
      render: (evaluation: Evaluation) => (
        <div>
          <h3 className="font-medium text-gray-900">{evaluation.projectTitle}</h3>
          <p className="text-sm text-gray-600">{evaluation.studentName} ({evaluation.studentId})</p>
        </div>
      )
    },
    {
      key: 'evaluationType',
      label: 'نوع التقييم',
      render: (evaluation: Evaluation) => (
        <span className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-full">
          {getTypeText(evaluation.evaluationType)}
        </span>
      )
    },
    {
      key: 'status',
      label: 'الحالة',
      render: (evaluation: Evaluation) => (
        <span className={cn('px-2 py-1 text-xs rounded-full', getStatusColor(evaluation.status))}>
          {getStatusText(evaluation.status)}
        </span>
      )
    },
    {
      key: 'score',
      label: 'الدرجة',
      sortable: true,
      render: (evaluation: Evaluation) => (
        <div className="text-center">
          {evaluation.score && evaluation.score > 0 ? (
            <>
              <div className={cn('text-lg font-bold', getGradeColor(evaluation.grade))}>
                {evaluation.score}/{evaluation.maxScore}
              </div>
              {evaluation.grade && (
                <div className={cn('text-sm', getGradeColor(evaluation.grade))}>
                  {evaluation.grade}
                </div>
              )}
            </>
          ) : (
            <span className="text-gray-400">لم يتم التقييم</span>
          )}
        </div>
      )
    },
    {
      key: 'dueDate',
      label: 'تاريخ الاستحقاق',
      sortable: true,
      render: (evaluation: Evaluation) => (
        <div>
          <span className="text-sm text-gray-600">
            {new Date(evaluation.dueDate).toLocaleDateString('ar')}
          </span>
          {evaluation.status === 'overdue' && (
            <div className="text-xs text-red-600 mt-1">متأخر</div>
          )}
        </div>
      )
    },
    {
      key: 'priority',
      label: 'الأولوية',
      render: (evaluation: Evaluation) => (
        <span className={cn('px-2 py-1 text-xs rounded-full', getPriorityColor(evaluation.priority))}>
          {evaluation.priority === 'high' ? 'عالي' : 
           evaluation.priority === 'medium' ? 'متوسط' : 'منخفض'}
        </span>
      )
    },
    {
      key: 'actions',
      label: 'الإجراءات',
      render: (evaluation: Evaluation) => (
        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          <button
            onClick={() => handleViewEvaluation(evaluation)}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            title="عرض"
          >
            <Eye size={16} />
          </button>
          {evaluation.status === 'pending' && (
            <button
              onClick={() => handleStartEvaluation(evaluation)}
              className="text-blue-600 hover:text-blue-700 transition-colors"
              title="بدء التقييم"
            >
              <TrendingUp size={16} />
            </button>
          )}
          {evaluation.status === 'in_progress' && (
            <button
              onClick={() => handleEditEvaluation(evaluation)}
              className="text-green-600 hover:text-green-700 transition-colors"
              title="متابعة التقييم"
            >
              <Edit size={16} />
            </button>
          )}
        </div>
      )
    }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="hover-lift">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 rtl:space-x-reverse">
              <Award className="w-6 h-6 text-gpms-dark" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">تقييمات المشاريع</h1>
                <p className="text-gray-600 mt-1">إدارة وتقييم مشاريع الطلاب</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 rtl:space-x-reverse">
              {/* View Mode Toggle */}
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  title="جدول"
                  onClick={() => setViewMode('table')}
                  className={cn(
                    'px-2 py-1 rounded-md text-sm font-medium transition-colors',
                    viewMode === 'table'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  )}
                >
                  <List size={20} className="mr-1 rtl:mr-0 rtl:ml-1" />
                </button>
                <button
                  title="شبكة"
                  onClick={() => setViewMode('grid')}
                  className={cn(
                    'px-2 py-1 rounded-md text-sm font-medium transition-colors',
                    viewMode === 'grid'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  )}
                >
                  <Grid3X3 size={20} className="mr-1 rtl:mr-0 rtl:ml-1" />
                </button>
              </div>

              <SimplePopover
                content={
                  <AdvancedFilter
                    statusOptions={statusOptions}
                    priorityOptions={priorityOptions}
                    typeOptions={typeOptions}
                    sortOptions={sortOptions}
                    statusFilter={statusFilter}
                    priorityFilter={priorityFilter}
                    typeFilter={typeFilter}
                    sortBy={sortBy}
                    sortOrder={sortOrder}
                    onStatusChange={setStatusFilter}
                    onPriorityChange={setPriorityFilter}
                    onTypeChange={setTypeFilter}
                    onSortChange={setSortBy}
                    onSortOrderChange={setSortOrder}
                    onApply={() => {}}
                    onClear={handleFilterClear}
                  />
                }
              >
                <Button
                  variant="outline"
                  size="sm"
                  className={cn(
                    'relative',
                    getActiveFiltersCount() > 0 && 'bg-gpms-light/10 border-gpms-light text-gpms-dark'
                  )}
                >
                  <SlidersHorizontal size={16} className="mr-1 rtl:mr-0 rtl:ml-1" />
                  {t('common.filter')} 
                  {getActiveFiltersCount() > 0 && (
                    <span className="absolute -top-1 -right-1 rtl:right-auto rtl:-left-1 bg-gpms-dark text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {getActiveFiltersCount()}
                    </span>
                  )}
                </Button>
              </SimplePopover>
            </div>
          </div>
        </CardHeader>
        <Divider />
        <CardContent>
          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600">إجمالي التقييمات</p>
                  <p className="text-2xl font-bold text-blue-900">{totalEvaluations}</p>
                </div>
                <FileText className="w-8 h-8 text-blue-600" />
              </div>
            </div>
            <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600">مكتملة</p>
                  <p className="text-2xl font-bold text-green-900">{completedEvaluations}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </div>
            <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-yellow-600">في الانتظار</p>
                  <p className="text-2xl font-bold text-yellow-900">{pendingEvaluations}</p>
                </div>
                <Clock className="w-8 h-8 text-yellow-600" />
              </div>
            </div>
            <div className="bg-gradient-to-r from-red-50 to-red-100 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-red-600">متأخرة</p>
                  <p className="text-2xl font-bold text-red-900">{overdueEvaluations}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-red-600" />
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="mb-4">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="البحث في التقييمات..."
              className="w-full"
            />
          </div>

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
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-gpms-light rounded-lg flex items-center justify-center ml-3 rtl:ml-0 rtl:mr-3">
                          <Award size={24} className="text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">{evaluation.projectTitle}</h3>
                          <p className="text-sm text-gray-600">{evaluation.studentName}</p>
                        </div>
                      </div>
                      <span className={cn('px-2 py-1 text-xs rounded-full', getStatusColor(evaluation.status))}>
                        {getStatusText(evaluation.status)}
                      </span>
                    </div>

                    {/* Evaluation Info */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <span>نوع التقييم:</span>
                        <span className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-full">
                          {getTypeText(evaluation.evaluationType)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <span>تاريخ الاستحقاق:</span>
                        <span>{new Date(evaluation.dueDate).toLocaleDateString('ar')}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <span>الأولوية:</span>
                        <span className={cn('px-2 py-1 text-xs rounded-full', getPriorityColor(evaluation.priority))}>
                          {evaluation.priority === 'high' ? 'عالي' : 
                           evaluation.priority === 'medium' ? 'متوسط' : 'منخفض'}
                        </span>
                      </div>
                    </div>

                    {/* Score Display */}
                    {evaluation.score && evaluation.score > 0 ? (
                      <div className="text-center mb-4">
                        <div className={cn('text-3xl font-bold mb-1', getGradeColor(evaluation.grade))}>
                          {evaluation.score}/{evaluation.maxScore}
                        </div>
                        {evaluation.grade && (
                          <div className={cn('text-lg font-semibold', getGradeColor(evaluation.grade))}>
                            {evaluation.grade}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-center mb-4">
                        <div className="text-gray-400 text-lg">لم يتم التقييم</div>
                      </div>
                    )}

                    {/* Comments */}
                    {evaluation.comments && (
                      <div className="bg-gray-50 rounded-lg p-3 mb-4">
                        <h4 className="text-sm font-medium text-gray-700 mb-1">التعليقات:</h4>
                        <p className="text-sm text-gray-600 line-clamp-3">{evaluation.comments}</p>
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
                            <TrendingUp size={16} />
                          </button>
                        )}
                        {evaluation.status === 'in_progress' && (
                          <button
                            onClick={() => handleEditEvaluation(evaluation)}
                            className="p-2 text-gray-400 hover:text-green-600 transition-colors"
                            title="متابعة التقييم"
                          >
                            <Edit size={16} />
                          </button>
                        )}
                      </div>
                      <button className="text-gpms-dark hover:text-gpms-light text-sm font-medium transition-colors">
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
                  <Award size={32} className="text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد تقييمات</h3>
                <p className="text-gray-600">لم يتم العثور على تقييمات تطابق معايير البحث</p>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default SupervisorEvaluations
