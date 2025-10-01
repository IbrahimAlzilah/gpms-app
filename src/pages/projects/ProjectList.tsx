import React, { useState } from 'react'
import { useLanguage } from '../../context/LanguageContext'
import { cn } from '../../lib/utils'
import { Card, CardContent, CardHeader } from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import { SearchBar } from '../../components/ui/Filter'
import { Table } from '../../components/ui/Table'
import GridView, { ProjectCard } from '../../components/ui/GridView'
import ViewToggle from '../../components/ui/ViewToggle'
import AdvancedFilter from '../../components/ui/AdvancedFilter'
import ProposalFormModal from '../../components/forms/ProposalFormModal'
import { 
  Plus, 
  Eye, 
  Edit, 
  Trash2,
  Calendar,
  User,
  FolderOpen
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

const ProjectList: React.FC = () => {
  const { t } = useLanguage()
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [sortBy, setSortBy] = useState('updatedAt')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('grid')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [isFilterOpen, setIsFilterOpen] = useState(false)

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
      description: 'نظام شامل لإدارة العمليات الطبية والمواعيد في المستشفيات',
      status: 'approved',
      priority: 'high',
      supervisor: 'د. فاطمة علي',
      startDate: '2024-01-10',
      endDate: '2024-08-01',
      progress: 45,
      teamMembers: ['محمد خالد', 'نورا أحمد', 'علي محمود'],
      tags: ['إدارة المستشفى', 'قواعد البيانات', 'واجهة مستخدم'],
      createdAt: '2024-01-10',
      updatedAt: '2024-01-20'
    },
    {
      id: '5',
      title: 'مشروع الذكاء الاصطناعي',
      description: 'تطوير نموذج ذكي لتحليل البيانات الطبية',
      status: 'under_review',
      priority: 'high',
      supervisor: 'د. أحمد محمد علي',
      startDate: '2024-01-18',
      endDate: '2024-09-01',
      progress: 20,
      teamMembers: ['خالد محمود', 'سارة أحمد'],
      tags: ['ذكاء اصطناعي', 'تحليل البيانات', 'تعلم الآلة'],
      createdAt: '2024-01-18',
      updatedAt: '2024-01-21'
    }
  ])

  const getStatusText = (status: string) => {
    switch (status) {
      case 'in_progress': return 'قيد التنفيذ'
      case 'completed': return 'مكتمل'
      case 'pending': return 'معلق'
      case 'approved': return 'موافق عليه'
      case 'rejected': return 'مرفوض'
      case 'under_review': return 'قيد المراجعة'
      case 'draft': return 'مسودة'
      case 'submitted': return 'مُرسل'
      default: return status
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in_progress': return 'bg-blue-100 text-blue-800'
      case 'completed': return 'bg-green-100 text-green-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'approved': return 'bg-green-100 text-green-800'
      case 'rejected': return 'bg-red-100 text-red-800'
      case 'under_review': return 'bg-blue-100 text-blue-800'
      case 'draft': return 'bg-gray-100 text-gray-800'
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
        case 'createdAt':
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
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

  const handleApplyFilters = () => {
    // Filters are already applied through state updates
    console.log('Filters applied')
  }

  const handleClearFilters = () => {
    setStatusFilter('all')
    setPriorityFilter('all')
    setSortBy('updatedAt')
    setSortOrder('desc')
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
      key: 'status',
      label: 'الحالة',
      render: (project: Project) => (
        <span className={cn(
          'px-2 py-1 text-xs rounded-full',
          getStatusColor(project.status)
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
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
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
              <FolderOpen className="w-6 h-6 text-blue-600" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">قائمة المشاريع</h1>
                <p className="text-gray-600 mt-1">إدارة ومتابعة جميع المشاريع</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 rtl:space-x-reverse">
              {/* View Mode Toggle */}
              <ViewToggle
                viewMode={viewMode}
                onViewModeChange={setViewMode}
              />
              
              {/* Advanced Filter */}
              <AdvancedFilter
                statusFilter={statusFilter}
                onStatusChange={setStatusFilter}
                priorityFilter={priorityFilter}
                onPriorityChange={setPriorityFilter}
                sortBy={sortBy}
                onSortByChange={setSortBy}
                sortOrder={sortOrder}
                onSortOrderChange={setSortOrder}
                onApplyFilters={handleApplyFilters}
                onClearFilters={handleClearFilters}
                isOpen={isFilterOpen}
                onToggle={() => setIsFilterOpen(!isFilterOpen)}
              />

              <Button
                onClick={handleAddProject}
                className="bg-blue-600 text-white hover:bg-blue-700"
              >
                <Plus className="w-4 h-4 mr-1 rtl:mr-0 rtl:ml-1" />
                مشروع جديد
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {/* Search Bar */}
          <div className="space-y-4">
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
            <Table
              data={filteredProjects}
              columns={columns}
              emptyMessage="لا توجد مشاريع"
              className="min-h-[400px]"
            />
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
          {filteredProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onView={handleViewProject}
              onEdit={handleEditProject}
              onDelete={handleDeleteProject}
            />
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
              className="bg-blue-600 text-white hover:bg-blue-700"
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

export default ProjectList
