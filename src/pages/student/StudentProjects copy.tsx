import React, { useState } from 'react'
import { useLanguage } from '../../context/LanguageContext'
import { cn } from '../../lib/utils'
import { Card, CardContent, CardHeader } from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import { SearchBar } from '../../components/ui/Filter'
import DataTable from '../../components/ui/DataTable'
import SimplePopover from '../../components/ui/SimplePopover'
import AdvancedFilter from '../../components/ui/AdvancedFilter'
import ProposalFormModal from '../../components/forms/ProposalFormModal'
import { 
  Plus, 
  Eye, 
  Edit, 
  Trash2,
  Calendar,
  User,
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
  supervisor: string
  startDate: string
  endDate: string
  progress: number
  teamMembers: string[]
  tags: string[]
  createdAt: string
  updatedAt: string
}

const StudentProjects: React.FC = () => {
  const { t } = useLanguage()
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [sortBy, setSortBy] = useState('updatedAt')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('grid')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | null>(null)

  // Mock data
  const [projects, setProjects] = useState<Project[]>([
    {
      id: '1',
      title: 'تطبيق إدارة المكتبة الذكية',
      description: 'تطبيق ويب لإدارة المكتبات باستخدام تقنيات حديثة',
      status: 'in_progress',
      priority: 'high',
      supervisor: 'د. أحمد محمد',
      startDate: '2024-01-01',
      endDate: '2024-06-01',
      progress: 65,
      teamMembers: ['أحمد علي', 'فاطمة حسن', 'محمد خالد'],
      tags: ['تطوير ويب', 'ذكاء اصطناعي', 'قواعد البيانات'],
      createdAt: '2024-01-01',
      updatedAt: '2024-01-22'
    },
    {
      id: '2',
      title: 'نظام إدارة المستودعات',
      description: 'نظام لإدارة المخزون والمستودعات',
      status: 'completed',
      priority: 'medium',
      supervisor: 'د. سارة أحمد',
      startDate: '2023-09-01',
      endDate: '2023-12-15',
      progress: 100,
      teamMembers: ['علي محمود', 'نور الدين'],
      tags: ['إدارة المخزون', 'قواعد البيانات'],
      createdAt: '2023-09-01',
      updatedAt: '2023-12-15'
    },
    {
      id: '3',
      title: 'منصة التعليم الإلكتروني',
      description: 'منصة تفاعلية للتعليم عن بعد',
      status: 'pending',
      priority: 'low',
      supervisor: 'د. خالد محمود',
      startDate: '2024-02-01',
      endDate: '2024-07-01',
      progress: 0,
      teamMembers: ['سارة محمد', 'يوسف أحمد'],
      tags: ['تعليم إلكتروني', 'تفاعل', 'واجهة مستخدم'],
      createdAt: '2024-01-15',
      updatedAt: '2024-01-20'
    },
    {
      id: '4',
      title: 'نظام إدارة المستشفى',
      description: 'نظام شامل لإدارة العمليات الطبية والمواعيد',
      status: 'approved',
      priority: 'high',
      supervisor: 'د. فاطمة علي',
      startDate: '2024-01-10',
      endDate: '2024-05-10',
      progress: 30,
      teamMembers: ['محمد أحمد', 'نورا حسن'],
      tags: ['إدارة المستشفى', 'قواعد البيانات', 'واجهة مستخدم'],
      createdAt: '2024-01-10',
      updatedAt: '2024-01-25'
    },
    {
      id: '5',
      title: 'تطبيق التجارة الإلكترونية',
      description: 'منصة تجارة إلكترونية متكاملة مع نظام دفع آمن',
      status: 'rejected',
      priority: 'medium',
      supervisor: 'د. سعد محمود',
      startDate: '2023-12-01',
      endDate: '2024-03-01',
      progress: 0,
      teamMembers: ['أحمد سعد', 'مريم علي'],
      tags: ['التجارة الإلكترونية', 'الدفع الإلكتروني', 'تطوير ويب'],
      createdAt: '2023-12-01',
      updatedAt: '2024-01-18'
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
    { value: 'completed', label: 'مكتمل' }
  ]

  const priorityOptions = [
    { value: 'all', label: 'جميع الأولويات' },
    { value: 'low', label: 'منخفض' },
    { value: 'medium', label: 'متوسط' },
    { value: 'high', label: 'عالي' }
  ]

  const sortOptions = [
    { value: 'updatedAt', label: 'آخر تحديث' },
    { value: 'title', label: 'العنوان' },
    { value: 'progress', label: 'التقدم' },
    { value: 'startDate', label: 'تاريخ البداية' },
    { value: 'createdAt', label: 'تاريخ الإنشاء' }
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

  const filteredProjects = projects
    .filter(project => {
      const matchesSearch = !searchQuery ||
        project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
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
        case 'updatedAt':
          comparison = new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime()
          break
        default:
          comparison = 0
      }

      return sortOrder === 'asc' ? comparison : -comparison
    })

  const handleAddProject = () => {
    setEditingProject(null)
    setIsModalOpen(true)
  }

  const handleEditProject = (project: Project) => {
    setEditingProject(project)
    setIsModalOpen(true)
  }

  const handleDeleteProject = (projectId: string) => {
    if (window.confirm('هل أنت متأكد من حذف هذا المشروع؟')) {
      setProjects(prev => prev.filter(p => p.id !== projectId))
    }
  }

  const handleViewProject = (project: Project) => {
    console.log('View project:', project)
    // Implement view functionality
  }

  const handleModalSubmit = (data: any) => {
    if (editingProject) {
      // Update existing project
      setProjects(prev => prev.map(p =>
        p.id === editingProject.id
          ? { ...p, ...data, updatedAt: new Date().toISOString().split('T')[0] }
          : p
      ))
    } else {
      // Add new project
      const newProject: Project = {
        id: Math.random().toString(36).substring(7),
        ...data,
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0],
        status: 'draft'
      }
      setProjects(prev => [newProject, ...prev])
    }
    setIsModalOpen(false)
    setEditingProject(null)
  }

  const handleFilterClear = () => {
    setStatusFilter('all')
    setPriorityFilter('all')
    setSortBy('updatedAt')
    setSortOrder('desc')
  }

  const getActiveFiltersCount = () => {
    let count = 0
    if (statusFilter !== 'all') count++
    if (priorityFilter !== 'all') count++
    if (sortBy !== 'updatedAt') count++
    if (sortOrder !== 'desc') count++
    return count
  }

  // Debug logging
  console.log('Filter values:', { statusFilter, priorityFilter, sortBy, sortOrder })
  console.log('Filtered projects count:', filteredProjects.length)

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
      key: 'status',
      label: 'الحالة',
      render: (project: Project) => (
        <span className={cn(
          'px-2 py-1 text-xs rounded-full',
          project.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
          project.status === 'completed' ? 'bg-green-100 text-green-800' :
          project.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
          project.status === 'approved' ? 'bg-green-100 text-green-800' :
          project.status === 'rejected' ? 'bg-red-100 text-red-800' :
          project.status === 'under_review' ? 'bg-blue-100 text-blue-800' :
          'bg-gray-100 text-gray-800'
        )}>
          {getStatusText(project.status)}
        </span>
      )
    },
    {
      key: 'priority',
      label: 'الأولوية',
      render: (project: Project) => (
        <span className={cn('px-2 py-1 rounded-full text-xs font-medium', getPriorityColor(project.priority))}>
          {getPriorityText(project.priority)}
        </span>
      )
    },
    {
      key: 'supervisor',
      label: 'المشرف',
      render: (project: Project) => (
        <span className="text-sm text-gray-600">{project.supervisor}</span>
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
      key: 'updatedAt',
      label: 'آخر تحديث',
      sortable: true,
      render: (project: Project) => (
        <span className="text-sm text-gray-600">
          {new Date(project.updatedAt).toLocaleDateString('ar')}
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
            onClick={() => handleDeleteProject(project.id)}
            className="text-red-600 hover:text-red-700 transition-colors"
            title="حذف"
          >
            <Trash2 size={16} />
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
              <FolderOpen className="w-6 h-6 text-gpms-dark" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">{t('navigation.projects')}</h1>
                <p className="text-gray-600 mt-1">إدارة ومتابعة مشاريعك</p>
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
                  تصفية
                  {getActiveFiltersCount() > 0 && (
                    <span className="absolute -top-1 -right-1 rtl:right-auto rtl:-left-1 bg-gpms-dark text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {getActiveFiltersCount()}
                    </span>
                  )}
                </Button>
              </SimplePopover>

              <Button
                title="إضافة جديد"
                onClick={handleAddProject}
                className="bg-gpms-dark text-white hover:bg-gpms-light"
              >
                <Plus className="w-4 h-4 mr-1 rtl:mr-0 rtl:ml-1" />
                مشروع جديد
              </Button>
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
                  <span className={cn(
                    'px-2 py-1 text-xs rounded-full',
                    project.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                    project.status === 'completed' ? 'bg-green-100 text-green-800' :
                    project.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    project.status === 'approved' ? 'bg-green-100 text-green-800' :
                    project.status === 'rejected' ? 'bg-red-100 text-red-800' :
                    project.status === 'under_review' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  )}>
                    {getStatusText(project.status)}
                  </span>
                </div>

                {/* Project Info */}
                <div className="space-y-3 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <User size={16} className="ml-2 rtl:ml-0 rtl:mr-2" />
                    <span>{project.supervisor}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar size={16} className="ml-2 rtl:ml-0 rtl:mr-2" />
                    <span>{new Date(project.startDate).toLocaleDateString('ar')} - {new Date(project.endDate).toLocaleDateString('ar')}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>الأولوية:</span>
                    <span className={cn('px-2 py-1 text-xs rounded-full', getPriorityColor(project.priority))}>
                      {getPriorityText(project.priority)}
                    </span>
                  </div>
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

                {/* Team Members */}
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">أعضاء الفريق:</p>
                  <div className="flex flex-wrap gap-1">
                    {project.teamMembers.map((member, index) => (
                      <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                        {member}
                      </span>
                    ))}
                  </div>
                </div>

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
                      onClick={() => handleDeleteProject(project.id)}
                      className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                      title="حذف"
                    >
                      <Trash2 size={16} />
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
            <p className="text-gray-600 mb-4">لم يتم العثور على مشاريع تطابق معايير البحث</p>
            <Button
              onClick={handleAddProject}
              className="bg-gpms-dark text-white hover:bg-gpms-light"
            >
              إضافة مشروع جديد
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Modal */}
      <ProposalFormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setEditingProject(null)
        }}
        onSubmit={handleModalSubmit}
        editData={editingProject}
      />
    </div>
  )
}

export default StudentProjects
