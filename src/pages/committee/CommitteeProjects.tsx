import React, { useState } from 'react'
import { useLanguage } from '../../context/LanguageContext'
import { cn, getActiveFiltersCount } from '../../lib/utils'
import { Card, CardContent, CardHeader } from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Divider from '../../components/ui/Divider'
// import { SearchBar } from '../../components/ui/Filter'
import DataTable from '../../components/ui/DataTable'
import SimplePopover from '../../components/ui/SimplePopover'
import AdvancedFilter from '../../components/ui/AdvancedFilter'
import Modal from '../../components/ui/Modal'
import ConfirmDialog from '../../components/ui/ConfirmDialog'
import {
  Eye,
  Edit,
  CheckCircle,
  XCircle,
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
  status: 'submitted' | 'under_review' | 'approved' | 'rejected' | 'in_progress' | 'completed'
  priority: 'low' | 'medium' | 'high'
  students: string[]
  supervisor: string
  submittedDate: string
  progress: number
  lastUpdate: string
  score?: number
  tags: string[]
  department: string
}

const CommitteeProjects: React.FC = () => {
  const { t } = useLanguage()
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [sortBy, setSortBy] = useState('submittedDate')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('grid')
  const [confirmApproveOpen, setConfirmApproveOpen] = useState(false)
  const [projectIdToApprove, setProjectIdToApprove] = useState<string | null>(null)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [editForm, setEditForm] = useState({ title: '', description: '', status: 'submitted' as Project['status'], priority: 'medium' as Project['priority'] })

  // Mock data
  const [projects] = useState<Project[]>([
    {
      id: '1',
      title: 'نظام إدارة المكتبة الذكية',
      description: 'تطبيق ويب متكامل لإدارة المكتبات الجامعية',
      status: 'under_review',
      priority: 'high',
      students: ['أحمد محمد علي', 'فاطمة حسن محمود'],
      supervisor: 'د. أحمد محمد',
      submittedDate: '2024-01-20',
      progress: 85,
      lastUpdate: '2024-01-25',
      score: 88,
      tags: ['تطوير ويب', 'ذكاء اصطناعي'],
      department: 'علوم الحاسوب'
    },
    {
      id: '2',
      title: 'تطبيق التجارة الإلكترونية',
      description: 'منصة تجارة إلكترونية شاملة مع نظام دفع آمن',
      status: 'approved',
      priority: 'medium',
      students: ['سارة أحمد محمد', 'يوسف محمود'],
      supervisor: 'د. سارة أحمد',
      submittedDate: '2024-01-18',
      progress: 95,
      lastUpdate: '2024-01-24',
      score: 92,
      tags: ['تجارة إلكترونية', 'أمان'],
      department: 'علوم الحاسوب'
    }
  ])

  const statusOptions = [
    { value: 'all', label: 'جميع الحالات' },
    { value: 'submitted', label: 'مُقدم' },
    { value: 'under_review', label: 'قيد المراجعة' },
    { value: 'approved', label: 'موافق عليه' },
    { value: 'rejected', label: 'مرفوض' },
    { value: 'in_progress', label: 'قيد التطوير' },
    { value: 'completed', label: 'مكتمل' }
  ]

  const priorityOptions = [
    { value: 'all', label: 'جميع الأولويات' },
    { value: 'low', label: 'منخفض' },
    { value: 'medium', label: 'متوسط' },
    { value: 'high', label: 'عالي' }
  ]

  const sortOptions = [
    { value: 'submittedDate', label: 'تاريخ التقديم' },
    { value: 'title', label: 'العنوان' },
    { value: 'status', label: 'الحالة' },
    { value: 'progress', label: 'التقدم' },
    { value: 'score', label: 'الدرجة' }
  ]

  const filteredProjects = projects.filter(project => {
    const matchesSearch = !searchQuery ||
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.students.some(student => student.toLowerCase().includes(searchQuery.toLowerCase())) ||
      project.supervisor.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === 'all' || project.status === statusFilter
    const matchesPriority = priorityFilter === 'all' || project.priority === priorityFilter

    return matchesSearch && matchesStatus && matchesPriority
  })

  const getStatusLabel = (status: Project['status']) => {
    switch (status) {
      case 'submitted': return 'مُقدم'
      case 'under_review': return 'قيد المراجعة'
      case 'approved': return 'موافق عليه'
      case 'rejected': return 'مرفوض'
      case 'in_progress': return 'قيد التنفيذ'
      case 'completed': return 'مكتمل'
      default: return status
    }
  }

  const getPriorityLabel = (p: Project['priority']) => (
    p === 'low' ? 'منخفض' : p === 'medium' ? 'متوسط' : 'عالي'
  )

  const handleFilterClear = () => {
    setStatusFilter('all')
    setPriorityFilter('all')
    setSortBy('submittedDate')
    setSortOrder('desc')
  }

  const [viewProject, setViewProject] = useState<Project | null>(null)
  const handleViewProject = (project: Project) => {
    setViewProject(project)
  }

  const handleEditProject = (project: Project) => {
    setEditForm({ title: project.title, description: project.description, status: project.status, priority: project.priority })
    setIsEditOpen(true)
  }

  const handleApproveProject = (projectId: string) => {
    setProjectIdToApprove(projectId)
    setConfirmApproveOpen(true)
  }

  const confirmApprove = () => {
    if (projectIdToApprove) {
      console.log('Approving project:', projectIdToApprove)
    }
    setConfirmApproveOpen(false)
    setProjectIdToApprove(null)
  }

  const cancelApprove = () => {
    setConfirmApproveOpen(false)
    setProjectIdToApprove(null)
  }

  const [rejectOpen, setRejectOpen] = useState(false)
  const [rejectProjectId, setRejectProjectId] = useState<string | null>(null)
  const [rejectReason, setRejectReason] = useState('')

  const handleRejectProject = (projectId: string) => {
    setRejectProjectId(projectId)
    setRejectReason('')
    setRejectOpen(true)
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
        <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
          {project.status === 'under_review' ? 'قيد المراجعة' : project.status === 'approved' ? 'موافق عليه' : project.status}
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
      key: 'submittedDate',
      label: 'تاريخ التقديم',
      sortable: true,
      render: (project: Project) => (
        <span className="text-sm text-gray-600">{new Date(project.submittedDate).toLocaleDateString('ar')}</span>
      )
    },
    {
      key: 'score',
      label: 'الدرجة',
      sortable: true,
      render: (project: Project) => (
        <span className="text-sm text-gray-600">{project.score ? `${project.score}/100` : '-'}</span>
      )
    },
    {
      key: 'actions',
      label: 'الإجراءات',
      render: (project: Project) => (
        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          <button onClick={() => handleViewProject(project)} className="p-2 text-gray-400 hover:text-gray-600" title="عرض">
            <Eye size={16} />
          </button>
          <button onClick={() => handleEditProject(project)} className="p-2 text-gray-400 hover:text-gray-600" title="تعديل">
            <Edit size={16} />
          </button>
          <button onClick={() => handleApproveProject(project.id)} className="p-2 text-gray-400 hover:text-green-600" title="موافقة">
            <CheckCircle size={16} />
          </button>
          <button onClick={() => handleRejectProject(project.id)} className="p-2 text-gray-400 hover:text-red-600" title="رفض">
            <XCircle size={16} />
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
                <h1 className="text-xl font-bold text-gray-900">إدارة المشاريع</h1>
                {/* <p className="text-gray-600 mt-1">إدارة ومتابعة جميع المشاريع المقدمة</p> */}
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
                  <SlidersHorizontal size={16} className="mr-1 rtl:mr-0 rtl:ml-1" />
                  {t('common.filter')}
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
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-md font-semibold text-gray-900 mb-2">{project.title}</h3>
                        <p className="text-sm text-gray-600 line-clamp-2">{project.description}</p>
                      </div>
                      <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                        {project.status === 'under_review' ? 'قيد المراجعة' : 'موافق عليه'}
                      </span>
                    </div>

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

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <User size={16} className="ml-2 rtl:ml-0 rtl:mr-2" />
                        <span>{project.supervisor}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar size={16} className="ml-2 rtl:ml-0 rtl:mr-2" />
                        <span>{new Date(project.submittedDate).toLocaleDateString('ar')}</span>
                      </div>
                    </div>

                    {project.score && (
                      <div className="mb-4">
                        <div className="flex justify-between text-sm text-gray-600 mb-1">
                          <span>الدرجة</span>
                          <span>{project.score}/100</span>
                        </div>
                      </div>
                    )}

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
                          onClick={() => handleApproveProject(project.id)}
                          className="p-2 text-gray-400 hover:text-green-600 transition-colors"
                          title="موافقة"
                        >
                          <CheckCircle size={16} />
                        </button>
                        <button
                          onClick={() => handleRejectProject(project.id)}
                          className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                          title="رفض"
                        >
                          <XCircle size={16} />
                        </button>
                      </div>
                      <button
                        onClick={() => handleViewProject(project)}
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
      <Modal
        isOpen={!!viewProject}
        onClose={() => setViewProject(null)}
        title={viewProject ? viewProject.title : ''}
        size="lg"
      >
        {viewProject && (
          <div className="space-y-4 text-sm text-gray-700">
            <div className="grid grid-cols-2 gap-4">
              <div><span className="font-medium">الحالة:</span> {getStatusLabel(viewProject.status)}</div>
              <div><span className="font-medium">الأولوية:</span> {getPriorityLabel(viewProject.priority)}</div>
              <div><span className="font-medium">التقدم:</span> {viewProject.progress}%</div>
              <div><span className="font-medium">المشرف:</span> {viewProject.supervisor || 'غير محدد'}</div>
              <div><span className="font-medium">تاريخ التقديم:</span> {new Date(viewProject.submittedDate).toLocaleDateString('ar')}</div>
              <div><span className="font-medium">الدرجة:</span> {viewProject.score ?? '—'}</div>
            </div>
            <div>
              <span className="font-medium">الوصف:</span>
              <p className="mt-1 text-gray-600">{viewProject.description}</p>
            </div>
            {viewProject.students?.length ? (
              <div className="flex flex-wrap gap-2">
                {viewProject.students.map((s, i) => (
                  <span key={i} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">{s}</span>
                ))}
              </div>
            ) : null}
            {viewProject.tags?.length ? (
              <div className="flex flex-wrap gap-2">
                {viewProject.tags.map((tag, i) => (
                  <span key={i} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">{tag}</span>
                ))}
              </div>
            ) : null}
          </div>
        )}
      </Modal>
      <Modal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        title="تعديل المشروع"
        onSubmit={(e) => {
          e?.preventDefault()
          console.log('Update project:', editForm)
          setIsEditOpen(false)
        }}
        size="lg"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">عنوان المشروع</label>
            <input
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gpms-light focus:border-transparent"
              value={editForm.title}
              onChange={(e) => setEditForm(prev => ({ ...prev, title: e.target.value }))}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">الوصف</label>
            <textarea
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gpms-light focus:border-transparent"
              value={editForm.description}
              onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
              required
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">الحالة</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gpms-light focus:border-transparent"
                value={editForm.status}
                onChange={(e) => setEditForm(prev => ({ ...prev, status: e.target.value as Project['status'] }))}
              >
                <option value="submitted">مُقدم</option>
                <option value="under_review">قيد المراجعة</option>
                <option value="approved">موافق عليه</option>
                <option value="rejected">مرفوض</option>
                <option value="in_progress">قيد التنفيذ</option>
                <option value="completed">مكتمل</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">الأولوية</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gpms-light focus:border-transparent"
                value={editForm.priority}
                onChange={(e) => setEditForm(prev => ({ ...prev, priority: e.target.value as Project['priority'] }))}
              >
                <option value="low">منخفض</option>
                <option value="medium">متوسط</option>
                <option value="high">عالي</option>
              </select>
            </div>
          </div>
        </div>
      </Modal>
      <ConfirmDialog
        isOpen={confirmApproveOpen}
        title="تأكيد الموافقة"
        description="هل أنت متأكد من الموافقة على هذا المشروع؟"
        variant="primary"
        onConfirm={confirmApprove}
        onCancel={cancelApprove}
      />
      <Modal
        isOpen={rejectOpen}
        onClose={() => { setRejectOpen(false); setRejectProjectId(null) }}
        title="سبب الرفض"
        size="md"
        onSubmit={(e) => {
          e?.preventDefault()
          if (rejectProjectId && rejectReason.trim()) {
            console.log('Rejecting project:', rejectProjectId, rejectReason)
          }
          setRejectOpen(false)
          setRejectProjectId(null)
          setRejectReason('')
        }}
      >
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">اكتب سبب الرفض</label>
          <textarea
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gpms-light focus:border-transparent"
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            required
          />
        </div>
      </Modal>
    </div>
  )
}

export default CommitteeProjects