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
  Download,
  Award,
  FileText,
  Grid3X3,
  List,
  SlidersHorizontal,
  TrendingUp,
  Calendar,
  User
} from 'lucide-react'

interface Grade {
  id: string
  component: string
  description: string
  maxScore: number
  obtainedScore: number
  percentage: number
  evaluator: string
  evaluationDate: string
  status: 'final' | 'draft' | 'pending'
  comments?: string
  category: 'proposal' | 'progress' | 'final_presentation' | 'final_report' | 'source_code' | 'other'
  semester: string
  academicYear: string
}

const StudentGrades: React.FC = () => {
  const { t } = useLanguage()
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [sortBy, setSortBy] = useState('evaluationDate')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('grid')

  // Mock data - UC-11: Student grades view
  const [grades] = useState<Grade[]>([
    {
      id: '1',
      component: 'مقترح المشروع',
      description: 'تقييم مقترح المشروع النهائي',
      maxScore: 100,
      obtainedScore: 85,
      percentage: 85,
      evaluator: 'د. أحمد محمد علي',
      evaluationDate: '2024-01-15',
      status: 'final',
      comments: 'مقترح ممتاز مع بعض التحسينات المطلوبة في المنهجية',
      category: 'proposal',
      semester: 'الأول',
      academicYear: '2023-2024'
    },
    {
      id: '2',
      component: 'تقرير التقدم الأول',
      description: 'تقييم تقرير التقدم في المرحلة الأولى',
      maxScore: 100,
      obtainedScore: 78,
      percentage: 78,
      evaluator: 'د. سارة أحمد محمد',
      evaluationDate: '2024-01-20',
      status: 'final',
      comments: 'تقدم جيد مع الحاجة لمزيد من التفصيل في التحليل',
      category: 'progress',
      semester: 'الأول',
      academicYear: '2023-2024'
    },
    {
      id: '3',
      component: 'الكود المصدري',
      description: 'تقييم جودة الكود المصدري والتنفيذ',
      maxScore: 100,
      obtainedScore: 92,
      percentage: 92,
      evaluator: 'د. خالد محمود حسن',
      evaluationDate: '2024-01-25',
      status: 'final',
      comments: 'كود ممتاز مع تطبيق جيد لمبادئ البرمجة',
      category: 'source_code',
      semester: 'الأول',
      academicYear: '2023-2024'
    },
    {
      id: '4',
      component: 'العرض التقديمي',
      description: 'تقييم العرض التقديمي للمراجعة الأولى',
      maxScore: 100,
      obtainedScore: 88,
      percentage: 88,
      evaluator: 'د. فاطمة حسن محمود',
      evaluationDate: '2024-01-28',
      status: 'final',
      comments: 'عرض تقديمي ممتاز مع شرح واضح للمشروع',
      category: 'final_presentation',
      semester: 'الأول',
      academicYear: '2023-2024'
    },
    {
      id: '5',
      component: 'التقرير النهائي',
      description: 'تقييم التقرير النهائي للمشروع',
      maxScore: 100,
      obtainedScore: 0,
      percentage: 0,
      evaluator: 'د. نورا سعد أحمد',
      evaluationDate: '2024-02-15',
      status: 'pending',
      comments: 'لم يتم التقييم بعد',
      category: 'final_report',
      semester: 'الأول',
      academicYear: '2023-2024'
    },
    {
      id: '6',
      component: 'المناقشة النهائية',
      description: 'تقييم المناقشة النهائية للمشروع',
      maxScore: 100,
      obtainedScore: 0,
      percentage: 0,
      evaluator: 'لجنة المناقشة',
      evaluationDate: '2024-02-20',
      status: 'pending',
      comments: 'لم يتم التقييم بعد',
      category: 'final_presentation',
      semester: 'الأول',
      academicYear: '2023-2024'
    }
  ])

  const categoryOptions = [
    { value: 'all', label: 'جميع الفئات' },
    { value: 'proposal', label: 'مقترح المشروع' },
    { value: 'progress', label: 'تقرير التقدم' },
    { value: 'source_code', label: 'الكود المصدري' },
    { value: 'final_presentation', label: 'العرض التقديمي' },
    { value: 'final_report', label: 'التقرير النهائي' },
    { value: 'other', label: 'أخرى' }
  ]

  const statusOptions = [
    { value: 'all', label: 'جميع الحالات' },
    { value: 'final', label: 'نهائي' },
    { value: 'draft', label: 'مسودة' },
    { value: 'pending', label: 'في الانتظار' }
  ]

  const sortOptions = [
    { value: 'evaluationDate', label: 'تاريخ التقييم' },
    { value: 'component', label: 'المكون' },
    { value: 'percentage', label: 'النسبة المئوية' },
    { value: 'category', label: 'الفئة' },
    { value: 'evaluator', label: 'المقيم' }
  ]

  const getCategoryText = (category: string) => {
    switch (category) {
      case 'proposal': return 'مقترح المشروع'
      case 'progress': return 'تقرير التقدم'
      case 'source_code': return 'الكود المصدري'
      case 'final_presentation': return 'العرض التقديمي'
      case 'final_report': return 'التقرير النهائي'
      case 'other': return 'أخرى'
      default: return category
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'final': return 'نهائي'
      case 'draft': return 'مسودة'
      case 'pending': return 'في الانتظار'
      default: return status
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'final': return 'bg-green-100 text-green-800'
      case 'draft': return 'bg-yellow-100 text-yellow-800'
      case 'pending': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getGradeColor = (percentage: number) => {
    if (percentage >= 90) return 'text-green-600'
    if (percentage >= 80) return 'text-blue-600'
    if (percentage >= 70) return 'text-yellow-600'
    if (percentage >= 60) return 'text-orange-600'
    return 'text-red-600'
  }

  const filteredGrades = grades.filter(grade => {
    const matchesSearch = !searchQuery ||
      grade.component.toLowerCase().includes(searchQuery.toLowerCase()) ||
      grade.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      grade.evaluator.toLowerCase().includes(searchQuery.toLowerCase()) ||
      grade.comments?.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesCategory = categoryFilter === 'all' || grade.category === categoryFilter
    const matchesStatus = statusFilter === 'all' || grade.status === statusFilter

    return matchesSearch && matchesCategory && matchesStatus
  }).sort((a, b) => {
    let comparison = 0

    switch (sortBy) {
      case 'component':
        comparison = a.component.localeCompare(b.component, 'ar')
        break
      case 'evaluationDate':
        comparison = new Date(a.evaluationDate).getTime() - new Date(b.evaluationDate).getTime()
        break
      case 'percentage':
        comparison = a.percentage - b.percentage
        break
      case 'evaluator':
        comparison = a.evaluator.localeCompare(b.evaluator, 'ar')
        break
      default:
        comparison = 0
    }

    return sortOrder === 'asc' ? comparison : -comparison
  })

  const handleViewGrade = (grade: Grade) => {
    console.log('View grade:', grade)
    // Implement view functionality
  }

  const handleDownloadGrade = (grade: Grade) => {
    console.log('Download grade:', grade)
    // Implement download functionality
  }

  const handleFilterClear = () => {
    setCategoryFilter('all')
    setStatusFilter('all')
    setSortBy('evaluationDate')
    setSortOrder('desc')
  }

  const getActiveFiltersCount = () => {
    let count = 0
    if (categoryFilter !== 'all') count++
    if (statusFilter !== 'all') count++
    if (sortBy !== 'evaluationDate') count++
    if (sortOrder !== 'desc') count++
    return count
  }

  // Calculate overall statistics
  const finalGrades = grades.filter(g => g.status === 'final')
  const totalMaxScore = finalGrades.reduce((sum, g) => sum + g.maxScore, 0)
  const totalObtainedScore = finalGrades.reduce((sum, g) => sum + g.obtainedScore, 0)
  const overallPercentage = totalMaxScore > 0 ? Math.round((totalObtainedScore / totalMaxScore) * 100) : 0

  const columns = [
    {
      key: 'component',
      label: 'المكون',
      sortable: true,
      render: (grade: Grade) => (
        <div>
          <h3 className="font-medium text-gray-900">{grade.component}</h3>
          <p className="text-sm text-gray-600 line-clamp-1">{grade.description}</p>
        </div>
      )
    },
    {
      key: 'category',
      label: 'الفئة',
      render: (grade: Grade) => (
        <span className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-full">
          {getCategoryText(grade.category)}
        </span>
      )
    },
    {
      key: 'score',
      label: 'الدرجة',
      sortable: true,
      render: (grade: Grade) => (
        <div className="text-center">
          <div className={cn('text-lg font-bold', getGradeColor(grade.percentage))}>
            {grade.obtainedScore}/{grade.maxScore}
          </div>
          <div className={cn('text-sm', getGradeColor(grade.percentage))}>
            {grade.percentage}%
          </div>
        </div>
      )
    },
    {
      key: 'status',
      label: 'الحالة',
      render: (grade: Grade) => (
        <span className={cn('px-2 py-1 text-xs rounded-full', getStatusColor(grade.status))}>
          {getStatusText(grade.status)}
        </span>
      )
    },
    {
      key: 'evaluator',
      label: 'المقيم',
      sortable: true,
      render: (grade: Grade) => (
        <span className="text-sm text-gray-600">{grade.evaluator}</span>
      )
    },
    {
      key: 'evaluationDate',
      label: 'تاريخ التقييم',
      sortable: true,
      render: (grade: Grade) => (
        <span className="text-sm text-gray-600">
          {new Date(grade.evaluationDate).toLocaleDateString('ar')}
        </span>
      )
    },
    {
      key: 'actions',
      label: 'الإجراءات',
      render: (grade: Grade) => (
        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          <button
            onClick={() => handleViewGrade(grade)}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            title="عرض"
          >
            <Eye size={16} />
          </button>
          {grade.status === 'final' && (
            <button
              onClick={() => handleDownloadGrade(grade)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              title="تحميل"
            >
              <Download size={16} />
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
              {/* <Award className="w-6 h-6 text-gpms-dark" /> */}
              <div>
                <h1 className="text-xl font-bold text-gray-900">الدرجات النهائية</h1>
                {/* <p className="text-gray-600 mt-1">عرض وتتبع درجات المشروع</p> */}
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
                    priorityOptions={categoryOptions}
                    typeOptions={categoryOptions}
                    sortOptions={sortOptions}
                    statusFilter={statusFilter}
                    priorityFilter={categoryFilter}
                    typeFilter={categoryFilter}
                    sortBy={sortBy}
                    sortOrder={sortOrder}
                    onStatusChange={setStatusFilter}
                    onPriorityChange={setCategoryFilter}
                    onTypeChange={setCategoryFilter}
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
          {/* Overall Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600">المجموع الكلي</p>
                  <p className="text-2xl font-bold text-blue-900">{totalObtainedScore}/{totalMaxScore}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-blue-600" />
              </div>
            </div>
            <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600">النسبة المئوية</p>
                  <p className={cn('text-2xl font-bold', getGradeColor(overallPercentage))}>
                    {overallPercentage}%
                  </p>
                </div>
                <Award className="w-8 h-8 text-green-600" />
              </div>
            </div>
            <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-600">المكونات المقيّمة</p>
                  <p className="text-2xl font-bold text-purple-900">{finalGrades.length}/{grades.length}</p>
                </div>
                <FileText className="w-8 h-8 text-purple-600" />
              </div>
            </div>
          </div>

          {/* Search Bar */}
          {/* <div className="mb-4">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="البحث في الدرجات..."
              className="w-full"
            />
          </div> */}

          {/* Grades Display */}
          {viewMode === 'table' ? (
            <Card className="hover-lift">
              <CardContent className="p-0">
                <DataTable
                  data={filteredGrades}
                  columns={columns}
                  emptyMessage="لا توجد درجات"
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
              {filteredGrades.map((grade) => (
                <Card key={grade.id} className="hover-lift">
                  <CardContent className="p-6">
                    {/* Grade Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gpms-light rounded-lg flex items-center justify-center mr-3 rtl:ml-3 rtl:mr-0">
                          <Award size={24} className="text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-md font-semibold text-gray-900 mb-1">{grade.component}</h3>
                          <p className="text-sm text-gray-600 line-clamp-2">{grade.description}</p>
                        </div>
                      </div>
                      <span className={cn('px-2 py-1 text-xs rounded-full', getStatusColor(grade.status))}>
                        {getStatusText(grade.status)}
                      </span>
                    </div>

                    {/* Grade Score */}
                    <div className="text-center mb-4">
                      <div className={cn('text-3xl font-bold mb-1', getGradeColor(grade.percentage))}>
                        {grade.obtainedScore}/{grade.maxScore}
                      </div>
                      <div className={cn('text-lg font-semibold', getGradeColor(grade.percentage))}>
                        {grade.percentage}%
                      </div>
                    </div>

                    {/* Grade Info */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <span>الفئة:</span>
                        <span className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-full">
                          {getCategoryText(grade.category)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <span>المقيم:</span>
                        <span>{grade.evaluator}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <span>تاريخ التقييم:</span>
                        <span>{new Date(grade.evaluationDate).toLocaleDateString('ar')}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <span>الفصل الدراسي:</span>
                        <span>{grade.semester}</span>
                      </div>
                    </div>

                    {/* Comments */}
                    {grade.comments && grade.status === 'final' && (
                      <div className="bg-gray-50 rounded-lg p-3 mb-4">
                        <h4 className="text-sm font-medium text-gray-700 mb-1">تعليقات المقيم:</h4>
                        <p className="text-sm text-gray-600 line-clamp-3">{grade.comments}</p>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                      <div className="flex space-x-2 rtl:space-x-reverse">
                        <button
                          onClick={() => handleViewGrade(grade)}
                          className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                          title="عرض"
                        >
                          <Eye size={16} />
                        </button>
                        {grade.status === 'final' && (
                          <button
                            onClick={() => handleDownloadGrade(grade)}
                            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                            title="تحميل"
                          >
                            <Download size={16} />
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
          {filteredGrades.length === 0 && (
            <Card className="hover-lift">
              <CardContent className="text-center py-12">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award size={32} className="text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد درجات</h3>
                <p className="text-gray-600">لم يتم العثور على درجات تطابق معايير البحث</p>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default StudentGrades
