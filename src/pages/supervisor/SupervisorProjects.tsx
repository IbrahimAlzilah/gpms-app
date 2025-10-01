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
  MessageSquare,
  Calendar,
  Grid3X3,
  List,
  FolderOpen,
  SlidersHorizontal
} from 'lucide-react'

interface Project {
  id: string
  title: string
  description: string
  status: 'draft' | 'submitted' | 'under_review' | 'approved' | 'rejected' | 'in_progress' | 'completed' | 'pending'
  priority: 'low' | 'medium' | 'high'
  students: string[]
  startDate: string
  endDate: string
  progress: number
  lastUpdate: string
  grade?: number
  notes: string
  tags: string[]
}

const SupervisorProjects: React.FC = () => {
  const { t } = useLanguage()
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [sortBy, setSortBy] = useState('lastUpdate')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('grid')

  // Mock data - مشاريع يشرف عليها المشرف
  const [projects] = useState<Project[]>([
    {
      id: '1',
      title: 'نظام إدارة المكتبة الذكية',
      description: 'تطبيق ويب متكامل لإدارة المكتبات الجامعية',
      status: 'in_progress',
      priority: 'high',
      students: ['أحمد محمد علي', 'فاطمة حسن محمود', 'محمد خالد أحمد'],
      startDate: '2024-01-15',
      endDate: '2024-06-15',
      progress: 75,
      lastUpdate: '2024-01-25',
      grade: 85,
      notes: 'المشروع يسير بشكل ممتاز، الطلاب ملتزمون بالمواعيد المحددة',
      tags: ['تطوير ويب', 'إدارة', 'قواعد البيانات']
    },
    {
      id: '2',
      title: 'تطبيق التجارة الإلكترونية',
      description: 'منصة تجارة إلكترونية شاملة مع نظام دفع متقدم',
      status: 'under_review',
      priority: 'medium',
      students: ['سارة أحمد محمد', 'يوسف محمود'],
      startDate: '2024-01-01',
      endDate: '2024-05-01',
      progress: 90,
      lastUpdate: '2024-01-23',
      notes: 'المشروع مكتمل تقريباً، يحتاج مراجعة أخيرة',
      tags: ['تجارة إلكترونية', 'دفع إلكتروني', 'موبايل']
    },
    {
      id: '3',
      title: 'نظام إدارة المستشفيات',
      description: 'نظام شامل لإدارة العمليات الطبية والمواعيد',
      status: 'approved',
      priority: 'high',
      students: ['علي حسن محمد', 'نورا سعد'],
      startDate: '2023-09-01',
      endDate: '2024-01-01',
      progress: 100,
      lastUpdate: '2024-01-20',
      grade: 92,
      notes: 'مشروع ممتاز، تم تطبيقه بنجاح في المستشفى الجامعي',
      tags: ['إدارة طبية', 'قواعد البيانات', 'أمان']
    },
    {
      id: '4',
      title: 'منصة التعليم التفاعلي',
      description: 'منصة تعليمية تفاعلية مع الواقع الافتراضي',
      status: 'pending',
      priority: 'low',
      students: ['خالد محمد أحمد'],
      startDate: '2024-02-01',
      endDate: '2024-06-01',
      progress: 20,
      lastUpdate: '2024-01-18',
      notes: 'بداية بطيئة، يحتاج الطالب لمزيد من المتابعة',
      tags: ['تعليم', 'واقع افتراضي', 'تفاعل']
    }
  ])

  const statusOptions = [
    { value: 'all', label: 'جميع الحالات' },
    { value: 'draft', label: 'مسودة' },
    { value: 'submitted', label: 'مُرسل' },
    { value: 'under_review', label: 'قيد المراجعة' },
    { value: 'approved', label: 'موافق عليه' },
    { value: 'rejected', label: 'مرفوض' },
    { value: 'in_progress', label: 'قيد التنفيذ' },
    { value: 'completed', label: 'مكتمل' },
    { value: 'pending', label: 'معلق' }
  ]

  const priorityOptions = [
    { value: 'all', label: 'جميع الأولويات' },
    { value: 'low', label: 'منخفض' },
    { value: 'medium', label: 'متوسط' },
    { value: 'high', label: 'عالي' }
  ]

  const sortOptions = [
    { value: 'lastUpdate', label: 'آخر تحديث' },
    { value: 'title', label: 'العنوان' },
    { value: 'progress', label: 'التقدم' },
    { value: 'startDate', label: 'تاريخ البداية' },
    { value: 'grade', label: 'الدرجة' }
  ]

  const getStatusText = (status: string) => {
    switch (status) {
      case 'in_progress': return 'قيد التنفيذ'
      case 'completed': return 'مكتمل'
      case 'pending': return 'معلق'
      case 'approved': return 'موافق عليه'
      case 'rejected': return 'مرفوض'
      case 'under_review': return 'قيد المراجعة'
      case 'draft': return 'مسودة'
      default: return status
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800'
      case 'in_progress': return 'bg-blue-100 text-blue-800'
      case 'completed': return 'bg-green-100 text-green-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'rejected': return 'bg-red-100 text-red-800'
      case 'under_review': return 'bg-blue-100 text-blue-800'
      case 'draft': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const filteredProjects = projects
    .filter(project => {
      const matchesSearch = !searchQuery ||
        project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.students.some(student => student.toLowerCase().includes(searchQuery.toLowerCase())) ||
        project.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))

      const matchesStatus = statusFilter === 'all' || project.status === statusFilter
      const matchesPriority = priorityFilter === 'all' || project.priority === priorityFilter

      return matchesSearch && matchesStatus && matchesPriority
    })
    .sort((a, b) => {
      let comparison = 0

      switch (sortBy) {
        case 'title':
          comparison = a.title.localeCompare(b.title, 'ar')
          break
        case 'progress':
          comparison = a.progress - b.progress
          break
        case 'startDate':
          comparison = new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
          break
        case 'lastUpdate':
          comparison = new Date(a.lastUpdate).getTime() - new Date(b.lastUpdate).getTime()
          break
        case 'grade':
          comparison = (a.grade || 0) - (b.grade || 0)
          break
        default:
          comparison = 0
      }

      return sortOrder === 'asc' ? comparison : -comparison
    })

  const handleViewProject = (project: Project) => {
    console.log('View project:', project)
    // Implement view functionality
  }

  const handleEditProject = (project: Project) => {
    console.log('Edit project:', project)
    // Implement edit functionality
  }

  const handleAddNote = (project: Project) => {
    console.log('Add note to project:', project)
    // Implement add note functionality
  }

  const handleFilterClear = () => {
    setStatusFilter('all')
    setPriorityFilter('all')
    setSortBy('lastUpdate')
    setSortOrder('desc')
  }

  const getActiveFiltersCount = () => {
    let count = 0
    if (statusFilter !== 'all') count++
    if (priorityFilter !== 'all') count++
    if (sortBy !== 'lastUpdate') count++
    if (sortOrder !== 'desc') count++
    return count
  }

  const columns = [
    {
      key: 'title',
      label: 'عنوان المشروع',
      sortable: true,
      render: (project: Project) => (
        <div>
          <h3 className="font-medium text-gray-900">{project.title}</h3>
          <p className="text-sm text-gray-600 line-clamp-1">{project.description}</p>
        </div>
      )
    },
    {
      key: 'students',
      label: 'الطلاب',
      render: (project: Project) => (
        <div className="flex flex-wrap gap-1">
          {project.students.map((student, index) => (
            <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
              {student}
            </span>
          ))}
        </div>
      )
    },
    {
      key: 'status',
      label: 'الحالة',
      sortable: true,
      render: (project: Project) => (
        <span className={cn('px-2 py-1 text-xs rounded-full', getStatusColor(project.status))}>
          {getStatusText(project.status)}
        </span>
      )
    },
    {
      key: 'priority',
      label: 'الأولوية',
      sortable: true,
      render: (project: Project) => (
        <span className={cn('px-2 py-1 rounded-full text-xs font-medium', getPriorityColor(project.priority))}>
          {getPriorityText(project.priority)}
        </span>
      )
    },
    {
      key: 'progress',
      label: 'التقدم',
      sortable: true,
      render: (project: Project) => (
        <div className="w-20">
          <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
            <span>{project.progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gpms-light h-2 rounded-full transition-all duration-300"
              style={{ width: `${project.progress}%` }}
            />
          </div>
        </div>
      )
    },
    {
      key: 'grade',
      label: 'الدرجة',
      sortable: true,
      render: (project: Project) => (
        <span className="text-sm font-medium text-gray-900">
          {project.grade ? `${project.grade}/100` : 'غير محددة'}
        </span>
      )
    },
    {
      key: 'lastUpdate',
      label: 'آخر تحديث',
      sortable: true,
      render: (project: Project) => (
        <span className="text-sm text-gray-600">
          {new Date(project.lastUpdate).toLocaleDateString('ar')}
        </span>
      )
    },
    {
      key: 'actions',
      label: 'الإجراءات',
      render: (project: Project) => (
        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          <button
            onClick={() => handleViewProject(project)}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            title="عرض"
          >
            <Eye size={16} />
          </button>
          <button
            onClick={() => handleEditProject(project)}
            className="text-blue-600 hover:text-blue-700 transition-colors"
            title="تعديل"
          >
            <Edit size={16} />
          </button>
          <button
            onClick={() => handleAddNote(project)}
            className="text-green-600 hover:text-green-700 transition-colors"
            title="إضافة ملاحظة"
          >
            <MessageSquare size={16} />
          </button>
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
              {/* <FolderOpen className="w-6 h-6 text-gpms-dark" /> */}
              <div>
                <h1 className="text-xl font-bold text-gray-900">المشاريع المشرفة عليها</h1>
                {/* <p className="text-gray-600 mt-1">إدارة ومتابعة المشاريع المشرفة عليها</p> */}
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
          {/* Search Bar */}
          {/* <div className="mb-4">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="البحث في المشاريع..."
              className="w-full"
            />
          </div> */}

          {/* Projects Display */}
          {viewMode === 'table' ? (
            <Card className="hover-lift">
              <CardContent className="p-0">
                <DataTable
                  data={filteredProjects}
                  columns={columns}
                  emptyMessage="لا توجد مشاريع"
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
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <span>الأولوية:</span>
                        <span className={cn('px-2 py-1 text-xs rounded-full', getPriorityColor(project.priority))}>
                          {getPriorityText(project.priority)}
                        </span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar size={16} className="ml-2 rtl:ml-0 rtl:mr-2" />
                        <span>{new Date(project.startDate).toLocaleDateString('ar')} - {new Date(project.endDate).toLocaleDateString('ar')}</span>
                      </div>
                      {project.grade && (
                        <div className="flex items-center justify-between text-sm text-gray-600">
                          <span>الدرجة:</span>
                          <span className="font-medium text-gray-900">{project.grade}/100</span>
                        </div>
                      )}
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex justify-between text-sm text-gray-600 mb-1">
                        <span>التقدم</span>
                        <span>{project.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-gpms-light h-2 rounded-full transition-all duration-300"
                          style={{ width: `${project.progress}%` }}
                        />
                      </div>
                    </div>

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

                    {/* Notes */}
                    {project.notes && (
                      <div className="mb-4">
                        <p className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
                          {project.notes}
                        </p>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                      <div className="flex space-x-2 rtl:space-x-reverse">
                        <button
                          onClick={() => handleViewProject(project)}
                          className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                          title="عرض"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => handleEditProject(project)}
                          className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                          title="تعديل"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleAddNote(project)}
                          className="p-2 text-gray-400 hover:text-green-600 transition-colors"
                          title="إضافة ملاحظة"
                        >
                          <MessageSquare size={16} />
                        </button>
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
        </CardContent>
      </Card>
    </div>
  )
}

export default SupervisorProjects
