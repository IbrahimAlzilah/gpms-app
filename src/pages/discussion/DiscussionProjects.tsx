import React, { useState } from 'react'
import { useLanguage } from '../../context/LanguageContext'
import { cn } from '../../lib/utils'
import { Card, CardContent, CardHeader } from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import { SearchBar } from '../../components/ui/Filter'
import SimplePopover from '../../components/ui/SimplePopover'
import AdvancedFilter from '../../components/ui/AdvancedFilter'
import {
  Eye,
  Edit,
  Star,
  FileText,
  Calendar,
  User,
  Grid3X3,
  List,
  FolderOpen,
  SlidersHorizontal,
  Award,
  MessageSquare
} from 'lucide-react'

interface Project {
  id: string
  title: string
  description: string
  status: 'ready_for_defense' | 'defense_scheduled' | 'defended' | 'evaluated' | 'graduated'
  priority: 'low' | 'medium' | 'high'
  students: string[]
  supervisor: string
  defenseDate?: string
  defenseTime?: string
  defenseLocation?: string
  finalGrade?: number
  discussionGrade?: number
  presentationGrade?: number
  reportGrade?: number
  lastUpdate: string
  tags: string[]
  department: string
  evaluators: string[]
}

const DiscussionProjects: React.FC = () => {
  const { } = useLanguage()
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [sortBy, setSortBy] = useState('defenseDate')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('grid')

  // Mock data - مشاريع جاهزة للمناقشة أو تم مناقشتها
  const [projects] = useState<Project[]>([
    {
      id: '1',
      title: 'نظام إدارة المكتبة الذكية',
      description: 'تطبيق ويب متكامل لإدارة المكتبات الجامعية باستخدام الذكاء الاصطناعي',
      status: 'defense_scheduled',
      priority: 'high',
      students: ['أحمد محمد علي', 'فاطمة حسن محمود'],
      supervisor: 'د. أحمد محمد',
      defenseDate: '2024-02-15',
      defenseTime: '10:00',
      defenseLocation: 'قاعة المؤتمرات الرئيسية',
      lastUpdate: '2024-01-25',
      tags: ['تطوير ويب', 'ذكاء اصطناعي', 'قواعد البيانات'],
      department: 'علوم الحاسوب',
      evaluators: ['د. سارة أحمد', 'د. خالد محمود', 'د. فاطمة علي']
    },
    {
      id: '2',
      title: 'تطبيق التجارة الإلكترونية',
      description: 'منصة تجارة إلكترونية شاملة مع نظام دفع آمن ومتطور',
      status: 'evaluated',
      priority: 'medium',
      students: ['سارة أحمد محمد', 'يوسف محمود حسن'],
      supervisor: 'د. سارة أحمد',
      defenseDate: '2024-01-20',
      defenseTime: '14:00',
      defenseLocation: 'قاعة المناقشات الفرعية',
      finalGrade: 92,
      discussionGrade: 90,
      presentationGrade: 95,
      reportGrade: 90,
      lastUpdate: '2024-01-24',
      tags: ['تجارة إلكترونية', 'دفع إلكتروني', 'أمان'],
      department: 'علوم الحاسوب',
      evaluators: ['د. أحمد محمد', 'د. خالد محمود']
    },
    {
      id: '3',
      title: 'نظام إدارة المستشفيات',
      description: 'نظام شامل لإدارة العمليات الطبية والمواعيد والسجلات الطبية',
      status: 'defended',
      priority: 'high',
      students: ['علي حسن محمد', 'نورا سعد أحمد'],
      supervisor: 'د. فاطمة علي',
      defenseDate: '2024-01-18',
      defenseTime: '11:00',
      defenseLocation: 'قاعة المؤتمرات الرئيسية',
      finalGrade: 88,
      discussionGrade: 85,
      presentationGrade: 92,
      reportGrade: 87,
      lastUpdate: '2024-01-23',
      tags: ['إدارة طبية', 'قواعد البيانات', 'أمان المعلومات'],
      department: 'هندسة البرمجيات',
      evaluators: ['د. سعد محمود', 'د. مريم علي']
    },
    {
      id: '4',
      title: 'منصة التعليم التفاعلي',
      description: 'منصة تعليمية تفاعلية باستخدام الواقع الافتراضي والواقع المعزز',
      status: 'ready_for_defense',
      priority: 'medium',
      students: ['خالد محمد أحمد'],
      supervisor: 'د. خالد محمود',
      lastUpdate: '2024-01-22',
      tags: ['تعليم إلكتروني', 'واقع افتراضي', 'تفاعل'],
      department: 'تقنية المعلومات',
      evaluators: ['د. نورا حسن', 'د. علي سعد']
    },
    {
      id: '5',
      title: 'نظام إدارة الموارد البشرية',
      description: 'نظام متكامل لإدارة الموارد البشرية والرواتب والحضور والانصراف',
      status: 'graduated',
      priority: 'low',
      students: ['مريم علي سعد', 'أسامة محمد علي'],
      supervisor: 'د. سعد محمود',
      defenseDate: '2024-01-10',
      defenseTime: '09:00',
      defenseLocation: 'قاعة المناقشات الفرعية',
      finalGrade: 95,
      discussionGrade: 93,
      presentationGrade: 98,
      reportGrade: 94,
      lastUpdate: '2024-01-15',
      tags: ['إدارة موارد بشرية', 'رواتب', 'حضور'],
      department: 'نظم المعلومات',
      evaluators: ['د. أحمد محمد', 'د. فاطمة علي']
    }
  ])

  const statusOptions = [
    { value: 'all', label: 'جميع الحالات' },
    { value: 'ready_for_defense', label: 'جاهز للمناقشة' },
    { value: 'defense_scheduled', label: 'مُجدولة المناقشة' },
    { value: 'defended', label: 'تمت المناقشة' },
    { value: 'evaluated', label: 'تم التقييم' },
    { value: 'graduated', label: 'مُتخرج' }
  ]

  const priorityOptions = [
    { value: 'all', label: 'جميع الأولويات' },
    { value: 'low', label: 'منخفض' },
    { value: 'medium', label: 'متوسط' },
    { value: 'high', label: 'عالي' }
  ]

  const sortOptions = [
    { value: 'defenseDate', label: 'تاريخ المناقشة' },
    { value: 'title', label: 'العنوان' },
    { value: 'status', label: 'الحالة' },
    { value: 'finalGrade', label: 'الدرجة النهائية' },
    { value: 'lastUpdate', label: 'آخر تحديث' }
  ]

  const getStatusText = (status: string) => {
    switch (status) {
      case 'ready_for_defense': return 'جاهز للمناقشة'
      case 'defense_scheduled': return 'مُجدولة المناقشة'
      case 'defended': return 'تمت المناقشة'
      case 'evaluated': return 'تم التقييم'
      case 'graduated': return 'مُتخرج'
      default: return status
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ready_for_defense': return 'bg-blue-100 text-blue-800'
      case 'defense_scheduled': return 'bg-yellow-100 text-yellow-800'
      case 'defended': return 'bg-purple-100 text-purple-800'
      case 'evaluated': return 'bg-green-100 text-green-800'
      case 'graduated': return 'bg-emerald-100 text-emerald-800'
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

  const filteredProjects = projects.filter(project => {
    const matchesSearch = !searchQuery ||
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.students.some(student => student.toLowerCase().includes(searchQuery.toLowerCase())) ||
      project.supervisor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesStatus = statusFilter === 'all' || project.status === statusFilter
    const matchesPriority = priorityFilter === 'all' || project.priority === priorityFilter

    return matchesSearch && matchesStatus && matchesPriority
  })

  const handleFilterClear = () => {
    setStatusFilter('all')
    setPriorityFilter('all')
    setSortBy('defenseDate')
    setSortOrder('asc')
  }

  const getActiveFiltersCount = () => {
    let count = 0
    if (statusFilter !== 'all') count++
    if (priorityFilter !== 'all') count++
    if (sortBy !== 'defenseDate') count++
    if (sortOrder !== 'asc') count++
    return count
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="hover-lift">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 rtl:space-x-reverse">
              <FolderOpen className="w-6 h-6 text-gpms-dark" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">عرض المشاريع</h1>
                <p className="text-gray-600 mt-1">عرض وتقييم المشاريع للمناقشة النهائية</p>
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
                  <List size={20} className="mr-1 rtl:mr-0 rtl:ml-1" />
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
                  <Grid3X3 size={20} className="mr-1 rtl:mr-0 rtl:ml-1" />
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
                  تصفية المشاريع
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

        <CardContent>
          {/* Search Bar */}
          <div className="mb-4">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="البحث في المشاريع..."
              className="w-full"
            />
          </div>
        </CardContent>
      </Card>

      {/* Projects Display */}
      {viewMode === 'table' ? (
        <Card className="hover-lift">
          <CardContent className="text-center py-12">
            <p className="text-gray-600">عرض الجدول - قيد التطوير</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <Card key={project.id} className="hover-lift">
              <CardContent className="p-6">
                {/* Project Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-md font-semibold text-gray-900 mb-2">{project.title}</h3>
                    <p className="text-sm text-gray-600 line-clamp-2">{project.description}</p>
                  </div>
                  <span className={cn('px-2 py-1 text-xs rounded-full', getStatusColor(project.status))}>
                    {getStatusText(project.status)}
                  </span>
                </div>

                {/* Students */}
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">الطلاب:</p>
                  <div className="flex flex-wrap gap-1">
                    {project.students.map((student, index) => (
                      <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                        {student}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Project Info */}
                <div className="space-y-3 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <User size={16} className="ml-2 rtl:ml-0 rtl:mr-2" />
                    <span>{project.supervisor}</span>
                  </div>
                  
                  {project.defenseDate && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar size={16} className="ml-2 rtl:ml-0 rtl:mr-2" />
                      <span>
                        مناقشة: {new Date(project.defenseDate).toLocaleDateString('ar')}
                        {project.defenseTime && ` - ${project.defenseTime}`}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>الأولوية:</span>
                    <span className={cn('px-2 py-1 text-xs rounded-full', getPriorityColor(project.priority))}>
                      {getPriorityText(project.priority)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>القسم:</span>
                    <span className="font-medium">{project.department}</span>
                  </div>

                  {project.finalGrade && (
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span>الدرجة النهائية:</span>
                      <span className="font-medium text-gray-900 flex items-center">
                        <Award size={16} className="ml-1 rtl:ml-0 rtl:mr-1 text-yellow-500" />
                        {project.finalGrade}/100
                      </span>
                    </div>
                  )}
                </div>

                {/* Grades Breakdown if available */}
                {project.discussionGrade && (
                  <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">تفصيل الدرجات:</h4>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="flex justify-between">
                        <span>المناقشة:</span>
                        <span className="font-medium">{project.discussionGrade}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>العرض:</span>
                        <span className="font-medium">{project.presentationGrade}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>التقرير:</span>
                        <span className="font-medium">{project.reportGrade}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Defense Location if scheduled */}
                {project.defenseLocation && (
                  <div className="mb-4">
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">المكان:</span> {project.defenseLocation}
                    </p>
                  </div>
                )}

                {/* Evaluators */}
                {project.evaluators.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">لجنة المناقشة:</p>
                    <div className="flex flex-wrap gap-1">
                      {project.evaluators.map((evaluator, index) => (
                        <span key={index} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                          {evaluator}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tags */}
                {project.tags.length > 0 && (
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-1">
                      {project.tags.map((tag, index) => (
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
                    <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors" title="عرض">
                      <Eye size={16} />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors" title="تقرير">
                      <FileText size={16} />
                    </button>
                    {(project.status === 'defended' || project.status === 'ready_for_defense') && (
                      <>
                        <button className="p-2 text-gray-400 hover:text-yellow-600 transition-colors" title="تقييم">
                          <Star size={16} />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors" title="تعليق">
                          <MessageSquare size={16} />
                        </button>
                      </>
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
      {filteredProjects.length === 0 && (
        <Card className="hover-lift">
          <CardContent className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FolderOpen size={32} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد مشاريع</h3>
            <p className="text-gray-600">لم يتم العثور على مشاريع تطابق معايير البحث</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default DiscussionProjects