import React, { useState } from 'react'
import { useLanguage } from '../../context/LanguageContext'
import { cn } from '../../lib/utils'
import { Card, CardContent, CardHeader } from '../ui/Card'
import Button from '../ui/Button'
import Input from '../ui/Input'
import Badge from '../ui/Badge'
import { Table } from '../ui/Table'
import { SearchBar, FilterDropdown, FilterBar } from '../ui/Filter'
import GridView, { ProjectCard } from '../ui/GridView'
import ViewToggle from '../ui/ViewToggle'
import {
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  MoreVertical,
  BookOpen,
  Calendar,
  User,
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react'
import ProposalFormModal from '../forms/ProposalFormModal'
import ConfirmDialog from '../ui/ConfirmDialog'

interface Project {
  id: string
  title: string
  description: string
  status: 'draft' | 'submitted' | 'under_review' | 'approved' | 'rejected' | 'in_progress' | 'completed'
  priority: 'low' | 'medium' | 'high'
  student: string
  supervisor?: string
  createdAt: string
  updatedAt: string
  progress: number
  tags: string[]
}

interface ProjectsTableProps {
  className?: string
}

const ProjectsTable: React.FC<ProjectsTableProps> = ({ className }) => {
  const { t } = useLanguage()
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [sortBy, setSortBy] = useState('updatedAt')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table')
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false)
  const [projectIdToDelete, setProjectIdToDelete] = useState<string | null>(null)

  // Mock data
  const [projects, setProjects] = useState<Project[]>([
    {
      id: '1',
      title: 'تطبيق إدارة المكتبة الذكية',
      description: 'تطبيق ويب متطور لإدارة المكتبات باستخدام تقنيات الذكاء الاصطناعي',
      status: 'in_progress',
      priority: 'high',
      student: 'أحمد محمد علي',
      supervisor: 'د. سارة أحمد حسن',
      createdAt: '2024-01-15',
      updatedAt: '2024-01-22',
      progress: 75,
      tags: ['تطوير ويب', 'ذكاء اصطناعي', 'قواعد البيانات']
    },
    {
      id: '2',
      title: 'نظام إدارة المستشفى',
      description: 'نظام شامل لإدارة العمليات الطبية والمواعيد في المستشفيات',
      status: 'approved',
      priority: 'medium',
      student: 'فاطمة علي محمد',
      supervisor: 'د. خالد محمود الحسن',
      createdAt: '2024-01-10',
      updatedAt: '2024-01-20',
      progress: 45,
      tags: ['إدارة المستشفى', 'قواعد البيانات', 'واجهة مستخدم']
    },
    {
      id: '3',
      title: 'مشروع الذكاء الاصطناعي',
      description: 'تطوير نموذج ذكي لتحليل البيانات الطبية',
      status: 'under_review',
      priority: 'high',
      student: 'محمد خالد محمود',
      supervisor: 'د. أحمد محمد علي',
      createdAt: '2024-01-18',
      updatedAt: '2024-01-21',
      progress: 20,
      tags: ['ذكاء اصطناعي', 'تحليل البيانات', 'تعلم الآلة']
    },
    {
      id: '4',
      title: 'تطبيق التجارة الإلكترونية',
      description: 'منصة تجارة إلكترونية متكاملة مع نظام دفع آمن',
      status: 'completed',
      priority: 'medium',
      student: 'سارة أحمد حسن',
      supervisor: 'د. فاطمة علي محمد',
      createdAt: '2023-12-01',
      updatedAt: '2024-01-15',
      progress: 100,
      tags: ['تطوير ويب', 'التجارة الإلكترونية', 'الدفع الإلكتروني']
    },
    {
      id: '5',
      title: 'نظام إدارة المخزون',
      description: 'نظام ذكي لإدارة المخزون والمخازن',
      status: 'rejected',
      priority: 'low',
      student: 'خالد محمود الحسن',
      createdAt: '2024-01-12',
      updatedAt: '2024-01-19',
      progress: 0,
      tags: ['إدارة المخزون', 'قواعد البيانات']
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'default'
      case 'submitted': return 'info'
      case 'under_review': return 'warning'
      case 'approved': return 'success'
      case 'rejected': return 'error'
      case 'in_progress': return 'info'
      case 'completed': return 'success'
      default: return 'default'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'draft': return 'مسودة'
      case 'submitted': return 'مُرسل'
      case 'under_review': return 'قيد المراجعة'
      case 'approved': return 'موافق عليه'
      case 'rejected': return 'مرفوض'
      case 'in_progress': return 'قيد التنفيذ'
      case 'completed': return 'مكتمل'
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

  const getPriorityLabel = (priority: string) => {
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
        project.student.toLowerCase().includes(searchQuery.toLowerCase()) ||
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
        case 'student':
          comparison = a.student.localeCompare(b.student, 'ar')
          break
        case 'createdAt':
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          break
        case 'updatedAt':
          comparison = new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime()
          break
        case 'progress':
          comparison = a.progress - b.progress
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
    setProjectIdToDelete(projectId)
    setConfirmDeleteOpen(true)
  }

  const confirmDelete = () => {
    if (projectIdToDelete) {
      setProjects(prev => prev.filter(p => p.id !== projectIdToDelete))
    }
    setConfirmDeleteOpen(false)
    setProjectIdToDelete(null)
  }

  const cancelDelete = () => {
    setConfirmDeleteOpen(false)
    setProjectIdToDelete(null)
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
        progress: 0
      }
      setProjects(prev => [newProject, ...prev])
    }
    setIsModalOpen(false)
    setEditingProject(null)
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
        <Badge variant={getStatusColor(project.status)}>
          {getStatusLabel(project.status)}
        </Badge>
      )
    },
    {
      key: 'priority',
      label: 'الأولوية',
      render: (project: Project) => (
        <span className={cn('px-2 py-1 rounded-full text-xs font-medium', getPriorityColor(project.priority))}>
          {getPriorityLabel(project.priority)}
        </span>
      )
    },
    {
      key: 'student',
      label: 'الطالب',
      sortable: true,
      render: (project: Project) => (
        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          <div className="w-8 h-8 bg-gpms-light rounded-full flex items-center justify-center text-white text-sm font-medium">
            {project.student.charAt(0)}
          </div>
          <span className="text-sm text-gray-900">{project.student}</span>
        </div>
      )
    },
    {
      key: 'supervisor',
      label: 'المشرف',
      render: (project: Project) => (
        <span className="text-sm text-gray-600">
          {project.supervisor || 'غير محدد'}
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
    <div className={cn('space-y-6', className)}>
      {/* Header */}
      <Card className="hover-lift">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 rtl:space-x-reverse">
              <BookOpen className="w-6 h-6 text-gpms-dark" />
              <h2 className="text-xl font-bold text-gray-900">إدارة المشاريع</h2>
            </div>

            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              {/* View Mode Toggle */}
              <ViewToggle
                viewMode={viewMode}
                onViewModeChange={setViewMode}
              />

              <Button
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
          {/* Search and Filters */}
          <div className="space-y-4">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="البحث في المشاريع..."
              className="w-full"
            />

            <FilterBar>
              <FilterDropdown
                label="الحالة"
                value={statusFilter}
                onChange={setStatusFilter}
                options={statusOptions}
              />

              <FilterDropdown
                label="الأولوية"
                value={priorityFilter}
                onChange={setPriorityFilter}
                options={priorityOptions}
              />

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-gpms-light focus:border-transparent"
              >
                <option value="updatedAt">آخر تحديث</option>
                <option value="title">العنوان</option>
                <option value="student">الطالب</option>
                <option value="progress">التقدم</option>
                <option value="createdAt">تاريخ الإنشاء</option>
              </select>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
              >
                {sortOrder === 'asc' ? '↑' : '↓'}
              </Button>
            </FilterBar>
          </div>
        </CardContent>
      </Card>

      {/* Projects Table/Grid */}
      <Card className="hover-lift">
        <CardContent className="p-0">
          {viewMode === 'table' ? (
            <Table
              data={filteredProjects}
              columns={columns}
              emptyMessage="لا توجد مشاريع"
              className="min-h-[400px]"
            />
          ) : (
            <div className="p-4">
              <GridView
                data={filteredProjects}
                renderItem={(project) => (
                  <ProjectCard
                    project={project}
                    onView={handleViewProject}
                    onEdit={handleEditProject}
                    onDelete={handleDeleteProject}
                  />
                )}
                emptyMessage="لا توجد مشاريع"
                className="min-h-[400px]"
              />
            </div>
          )}
        </CardContent>
      </Card>

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
      <ConfirmDialog
        isOpen={confirmDeleteOpen}
        title="تأكيد الحذف"
        description="هل أنت متأكد من حذف هذا المشروع؟ لا يمكن التراجع عن هذه العملية."
        variant="destructive"
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </div>
  )
}

export default ProjectsTable
