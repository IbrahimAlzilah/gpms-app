import React, { useState, useMemo } from 'react'
import { useLanguage } from '@/context/LanguageContext'
import { useAuth } from '@/context/AuthContext'
import { cn, getActiveFiltersCount } from '@/lib/utils'
import { Card, CardContent, CardHeader } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Divider from '@/components/ui/Divider'
import DataTable from '@/components/ui/DataTable'
import SimplePopover from '@/components/ui/SimplePopover'
import AdvancedFilter from '@/components/ui/AdvancedFilter'
import Modal from '@/components/ui/Modal'
import { ViewModeToggle } from '@/components/shared'
import { StatusBadge, PriorityBadge } from '@/components/shared'
import { useProjects } from './projects.hook'
import { Project } from './schema'
import { Eye, Edit, Trash2, CheckCircle, XCircle, Star, MessageSquare, Calendar, User, FolderOpen, SlidersHorizontal, Users } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import GroupManagementModal from '@/components/forms/GroupManagementModal'
import { approveProject, rejectProject, deleteProject } from '@/services/projects.service'

const ProjectsScreen: React.FC = () => {
  const { t } = useLanguage()
  const { user } = useAuth()
  const navigate = useNavigate()
  const { projects, isLoading, canCreate, canEdit, canDelete, canApprove, canEvaluate } = useProjects()
  
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [sortBy, setSortBy] = useState('updatedAt')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('grid')
  const [viewProject, setViewProject] = useState<Project | null>(null)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false)

  const statusOptions = useMemo(() => {
    const base = [
      { value: 'all', label: 'جميع الحالات' },
      { value: 'draft', label: 'مسودة' },
      { value: 'submitted', label: 'مُرسل' },
      { value: 'under_review', label: 'قيد المراجعة' },
      { value: 'approved', label: 'موافق عليه' },
      { value: 'rejected', label: 'مرفوض' },
      { value: 'in_progress', label: 'قيد التنفيذ' },
      { value: 'completed', label: 'مكتمل' }
    ]
    
    if (user?.role === 'discussion') {
      return [
        { value: 'all', label: 'جميع الحالات' },
        { value: 'ready_for_defense', label: 'جاهز للمناقشة' },
        { value: 'defense_scheduled', label: 'مُجدولة المناقشة' },
        { value: 'defended', label: 'تمت المناقشة' },
        { value: 'evaluated', label: 'تم التقييم' },
        { value: 'graduated', label: 'مُتخرج' }
      ]
    }
    return base
  }, [user?.role])

  const priorityOptions = [
    { value: 'all', label: 'جميع الأولويات' },
    { value: 'low', label: 'منخفض' },
    { value: 'medium', label: 'متوسط' },
    { value: 'high', label: 'عالي' }
  ]

  const sortOptions = useMemo(() => {
    if (user?.role === 'discussion') {
      return [
        { value: 'defenseDate', label: 'تاريخ المناقشة' },
        { value: 'title', label: 'العنوان' },
        { value: 'status', label: 'الحالة' },
        { value: 'finalGrade', label: 'الدرجة النهائية' },
        { value: 'lastUpdate', label: 'آخر تحديث' }
      ]
    }
    return [
      { value: 'updatedAt', label: 'آخر تحديث' },
      { value: 'title', label: 'العنوان' },
      { value: 'progress', label: 'التقدم' },
      { value: 'startDate', label: 'تاريخ البداية' },
      { value: 'createdAt', label: 'تاريخ الإنشاء' }
    ]
  }, [user?.role])

  const filteredProjects = useMemo(() => {
    return projects
      .filter(project => {
        const matchesSearch = !searchQuery ||
          project.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          project.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          project.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))

        const matchesStatus = statusFilter === 'all' || project.status === statusFilter
        const matchesPriority = priorityFilter === 'all' || project.priority === priorityFilter

        return matchesSearch && matchesStatus && matchesPriority
      })
      .sort((a, b) => {
        let comparison = 0
        const aVal = a[sortBy as keyof Project]
        const bVal = b[sortBy as keyof Project]

        if (typeof aVal === 'string' && typeof bVal === 'string') {
          comparison = aVal.localeCompare(bVal, 'ar')
        } else if (typeof aVal === 'number' && typeof bVal === 'number') {
          comparison = aVal - bVal
        }

        return sortOrder === 'asc' ? comparison : -comparison
      })
  }, [projects, searchQuery, statusFilter, priorityFilter, sortBy, sortOrder])

  const currentProject = useMemo(() => {
    if (user?.role === 'student') {
      return projects.find(p => ['in_progress', 'pending', 'approved'].includes(p.status)) || null
    }
    return null
  }, [projects, user?.role])

  const handleFilterClear = () => {
    setStatusFilter('all')
    setPriorityFilter('all')
    setSortBy('updatedAt')
    setSortOrder('desc')
  }

  const columns = useMemo(() => [
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
      render: (project: Project) => <StatusBadge status={project.status} />
    },
    {
      key: 'priority',
      label: 'الأولوية',
      render: (project: Project) => <PriorityBadge priority={project.priority} />
    },
    ...(user?.role === 'supervisor' || user?.role === 'committee' ? [{
      key: 'students',
      label: 'الطلاب',
      render: (project: Project) => (
        <div className="flex flex-wrap gap-1">
          {(project.students || project.teamMembers || []).slice(0, 2).map((student, index) => (
            <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
              {student}
            </span>
          ))}
        </div>
      )
    }] : []),
    ...(user?.role === 'student' ? [{
      key: 'supervisor',
      label: 'المشرف',
      render: (project: Project) => (
        <span className="text-sm text-gray-600">{project.supervisor || '-'}</span>
      )
    }] : []),
    {
      key: 'progress',
      label: 'التقدم',
      sortable: true,
      render: (project: Project) => (
        <div className="w-20">
          <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
            <span>{project.progress || 0}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gpms-light h-2 rounded-full transition-all duration-300"
              style={{ width: `${project.progress || 0}%` }}
            />
          </div>
        </div>
      )
    },
    {
      key: 'actions',
      label: 'الإجراءات',
      render: (project: Project) => (
        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          <button
            onClick={() => setViewProject(project)}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            title="عرض"
          >
            <Eye size={16} />
          </button>
          {canEdit && (
            <button
              onClick={() => setEditingProject(project)}
              className="text-blue-600 hover:text-blue-700 transition-colors"
              title="تعديل"
            >
              <Edit size={16} />
            </button>
          )}
          {canDelete && (
            <button
              onClick={() => setConfirmDeleteId(project.id)}
              className="text-red-600 hover:text-red-700 transition-colors"
              title="حذف"
            >
              <Trash2 size={16} />
            </button>
          )}
          {canApprove && (
            <>
              <button
                onClick={async () => {
                  try {
                    await approveProject(project.id)
                    navigate('/projects')
                  } catch (err) {
                    console.error('Error approving project:', err)
                  }
                }}
                className="text-green-600 hover:text-green-700 transition-colors"
                title="موافقة"
              >
                <CheckCircle size={16} />
              </button>
              <button
                onClick={async () => {
                  const reason = prompt('يرجى إدخال سبب الرفض:')
                  if (reason) {
                    try {
                      await rejectProject(project.id, reason)
                      navigate('/projects')
                    } catch (err) {
                      console.error('Error rejecting project:', err)
                    }
                  }
                }}
                className="text-red-600 hover:text-red-700 transition-colors"
                title="رفض"
              >
                <XCircle size={16} />
              </button>
            </>
          )}
          {canEvaluate && (
            <button
              onClick={() => navigate(`/evaluations/new?projectId=${project.id}`)}
              className="text-yellow-600 hover:text-yellow-700 transition-colors"
              title="تقييم"
            >
              <Star size={16} />
            </button>
          )}
        </div>
      )
    }
  ], [user?.role, canEdit, canDelete, canApprove, canEvaluate])

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen"><div>جاري التحميل...</div></div>
  }

  return (
    <div className="space-y-6">
      <Card className="hover-lift">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 rtl:space-x-reverse">
              <div>
                <h1 className="text-xl font-bold text-gray-900">{t('navigation.projects')}</h1>
              </div>
            </div>

            <div className="flex items-center space-x-2 lg:space-x-3 rtl:space-x-reverse">
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
                    onApply={() => {}}
                    onClear={handleFilterClear}
                  />
                }
              >
                <Button
                  variant="outline"
                  size="md"
                  className={cn(
                    'relative',
                    getActiveFiltersCount(statusFilter, priorityFilter, searchQuery, sortBy, sortOrder) > 0 && 'bg-gpms-light/10 border-gpms-light text-gpms-dark'
                  )}
                >
                  <SlidersHorizontal size={16} className="mr-1 rtl:mr-0 rtl:ml-1" />
                  <span className="hidden md:block">{t('common.filter')}</span>
                  {getActiveFiltersCount(statusFilter, priorityFilter, searchQuery, sortBy, sortOrder) > 0 && (
                    <span className="absolute -top-1 -right-1 rtl:right-auto rtl:-left-1 bg-gpms-dark text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {getActiveFiltersCount(statusFilter, priorityFilter, searchQuery, sortBy, sortOrder)}
                    </span>
                  )}
                </Button>
              </SimplePopover>

              {user?.role === 'student' && (
                <Button
                  onClick={() => setIsGroupModalOpen(true)}
                  className="bg-blue-600 text-white hover:bg-blue-700"
                >
                  <Users className="w-4 h-4 mr-1 rtl:mr-0 rtl:ml-1" />
                  <span className="hidden md:block">إدارة المجموعة</span>
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <Divider />

        <CardContent>
          {currentProject && user?.role === 'student' && (
            <div className="mb-6 border border-gray-200 rounded-lg p-4 bg-gray-50">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">متابعة مشروعي</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">اسم المشروع:</span>
                  <p className="text-gray-900 font-medium">{currentProject.title}</p>
                </div>
                <div>
                  <span className="text-gray-600">الحالة:</span>
                  <p className="text-gray-900 font-medium"><StatusBadge status={currentProject.status} /></p>
                </div>
              </div>
              <div className="flex flex-wrap gap-3 mt-4">
                <Button onClick={() => setIsGroupModalOpen(true)} className="bg-blue-600 text-white hover:bg-blue-700">
                  إدارة المجموعة
                </Button>
                <Button onClick={() => navigate('/documents')} variant="outline">
                  تسليم/رفع المستندات
                </Button>
              </div>
            </div>
          )}

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
                      <StatusBadge status={project.status} />
                    </div>

                    <div className="space-y-3 mb-4">
                      {project.supervisor && (
                        <div className="flex items-center text-sm text-gray-600">
                          <User size={16} className="ml-2 rtl:ml-0 rtl:mr-2" />
                          <span>{project.supervisor}</span>
                        </div>
                      )}
                      {project.startDate && project.endDate && (
                        <div className="flex items-center text-sm text-gray-600">
                          <Calendar size={16} className="ml-2 rtl:ml-0 rtl:mr-2" />
                          <span>{new Date(project.startDate).toLocaleDateString('ar')} - {new Date(project.endDate).toLocaleDateString('ar')}</span>
                        </div>
                      )}
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <span>الأولوية:</span>
                        <PriorityBadge priority={project.priority} />
                      </div>
                    </div>

                    {project.progress !== undefined && (
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
                    )}

                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                      <div className="flex space-x-2 rtl:space-x-reverse">
                        <button
                          onClick={() => setViewProject(project)}
                          className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                          title="عرض"
                        >
                          <Eye size={16} />
                        </button>
                        {canEdit && (
                          <button
                            onClick={() => setEditingProject(project)}
                            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                            title="تعديل"
                          >
                            <Edit size={16} />
                          </button>
                        )}
                        {canDelete && (
                          <button
                            onClick={() => setConfirmDeleteId(project.id)}
                            className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                            title="حذف"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                      <button
                        onClick={() => setViewProject(project)}
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

      {/* View Project Modal */}
      <Modal
        isOpen={!!viewProject}
        onClose={() => setViewProject(null)}
        title={viewProject ? `تفاصيل المشروع - ${viewProject.title}` : 'تفاصيل المشروع'}
        size="lg"
      >
        {viewProject && (
          <div className="space-y-4 text-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="font-medium">اسم المشروع:</span>
                <p className="text-gray-700 mt-1">{viewProject.title}</p>
              </div>
              <div>
                <span className="font-medium">الحالة:</span>
                <p className="text-gray-700 mt-1"><StatusBadge status={viewProject.status} /></p>
              </div>
              <div>
                <span className="font-medium">الأولوية:</span>
                <p className="text-gray-700 mt-1"><PriorityBadge priority={viewProject.priority} /></p>
              </div>
              {viewProject.supervisor && (
                <div>
                  <span className="font-medium">المشرف:</span>
                  <p className="text-gray-700 mt-1">{viewProject.supervisor}</p>
                </div>
              )}
            </div>
            <div>
              <span className="font-medium">الوصف:</span>
              <p className="text-gray-700 mt-1">{viewProject.description}</p>
            </div>
          </div>
        )}
      </Modal>

      {/* Confirm Delete Modal */}
      <Modal
        isOpen={!!confirmDeleteId}
        onClose={() => setConfirmDeleteId(null)}
        title="تأكيد الحذف"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-gray-700 text-sm">هل أنت متأكد من حذف هذا المشروع؟ لا يمكن التراجع عن هذا الإجراء.</p>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setConfirmDeleteId(null)}>إلغاء</Button>
            <Button onClick={async () => {
              try {
                await deleteProject(confirmDeleteId || '')
                navigate('/projects')
              } catch (err) {
                console.error('Error deleting project:', err)
              }
              setConfirmDeleteId(null)
            }} className="bg-red-600 text-white hover:bg-red-700">حذف</Button>
          </div>
        </div>
      </Modal>

      {user?.role === 'student' && (
        <GroupManagementModal
          isOpen={isGroupModalOpen}
          onClose={() => setIsGroupModalOpen(false)}
          onSubmit={() => {}}
          currentGroup={{
            id: '1',
            name: 'مجموعة التطوير الذكي',
            members: ['أحمد علي', 'فاطمة حسن', 'محمد خالد']
          }}
        />
      )}
    </div>
  )
}

export default ProjectsScreen

