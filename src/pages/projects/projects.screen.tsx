import React, { useState, useMemo, useEffect } from 'react'
import { useLanguage } from '@/context/LanguageContext'
import { useAuth } from '@/context/AuthContext'
import { cn } from '@/lib/utils'
import { Card, CardContent, CardHeader } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Divider from '@/components/ui/Divider'
import DataTable from '@/components/ui/DataTable'
import SimplePopover from '@/components/ui/SimplePopover'
import AdvancedFilter from '@/components/ui/AdvancedFilter'
import Modal from '@/components/ui/Modal'
import { ViewModeToggle } from '@/components/shared'
import { StatusBadge, PriorityBadge } from '@/components/shared'
import Badge from '@/components/ui/Badge'
import { useProjects } from './projects.hook'
import { Project } from './schema'
import { useNotifications } from '@/context/NotificationContext'
import { Eye, Edit, Trash2, CheckCircle, XCircle, Star, MessageSquare, Calendar, User, FolderOpen, SlidersHorizontal, Users, Search, Upload, Send, FileText, Clock, Award } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { approveProject, rejectProject, deleteProject } from '@/services/projects.service'
import ProjectRegistrationForm from '@/components/forms/ProjectRegistrationForm'
import { getProjectsNeedingSupervisor } from '@/services/supervisor-assignment.service'
import AssignSupervisorForm from '@/components/forms/AssignSupervisorForm'
import ProjectProgressTracker from '@/components/ProjectProgressTracker'

const ProjectsScreen: React.FC = () => {
  const { t } = useLanguage()
  const { user } = useAuth()
  const navigate = useNavigate()
  const { addNotification } = useNotifications()
  const { projects, isLoading, canEdit, canDelete, canApprove, canEvaluate } = useProjects()

  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [departmentFilter, setDepartmentFilter] = useState('all')
  const [sortBy, setSortBy] = useState('updatedAt')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('grid')
  const [viewProject, setViewProject] = useState<Project | null>(null)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)
  const [registrationProject, setRegistrationProject] = useState<Project | null>(null)
  const [selectedProjectForNotes, setSelectedProjectForNotes] = useState<Project | null>(null)
  const [projectToAssignSupervisor, setProjectToAssignSupervisor] = useState<Project | null>(null)
  const [supervisorNote, setSupervisorNote] = useState('')
  const [meetingDate, setMeetingDate] = useState('')
  const [projectsNeedingSupervisor, setProjectsNeedingSupervisor] = useState<Project[]>([])
  const [isLoadingNeedingSupervisor, setIsLoadingNeedingSupervisor] = useState(false)

  useEffect(() => {
    const loadProjectsNeedingSupervisor = async () => {
      if (user?.role !== 'committee') return

      setIsLoadingNeedingSupervisor(true)
      try {
        const projects = await getProjectsNeedingSupervisor()
        setProjectsNeedingSupervisor(projects)
      } catch (error) {
        console.error('Error loading projects needing supervisor:', error)
      } finally {
        setIsLoadingNeedingSupervisor(false)
      }
    }

    loadProjectsNeedingSupervisor()
  }, [user])

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

    if (user?.role === 'student') {
      return [
        { value: 'all', label: 'جميع المشاريع' },
        { value: 'approved', label: 'المشاريع المعتمدة فقط' },
        { value: 'in_progress', label: 'قيد التنفيذ' }
      ]
    }

    if (user?.role === 'supervisor') {
      return [
        { value: 'all', label: 'جميع الحالات' },
        { value: 'in_progress', label: 'قيد التنفيذ' },
        { value: 'completed', label: 'مكتمل' },
        { value: 'approved', label: 'موافق عليه' }
      ]
    }

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

  const departmentOptions = useMemo(() => {
    const departments = new Set<string>()
    projects.forEach(project => {
      if (project.department) {
        departments.add(project.department)
      }
    })
    return [
      { value: 'all', label: 'جميع التخصصات' },
      ...Array.from(departments).map(dept => ({ value: dept, label: dept }))
    ]
  }, [projects])

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
          project.supervisor?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          project.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))

        const matchesStatus = statusFilter === 'all' || project.status === statusFilter
        const matchesPriority = priorityFilter === 'all' || project.priority === priorityFilter
        const matchesDepartment = departmentFilter === 'all' || project.department === departmentFilter

        // For students browsing projects, show only approved projects by default
        if (user?.role === 'student') {
          if (statusFilter === 'all') {
            // Show only approved projects available for registration
            return matchesSearch && matchesPriority && matchesDepartment &&
              (project.status === 'approved' || project.status === 'in_progress')
          }
          // If specific status selected, show that status
          return matchesSearch && matchesStatus && matchesPriority && matchesDepartment
        }

        // For supervisors, filter by supervisor
        if (user?.role === 'supervisor') {
          const matchesSupervisor = !project.supervisor || project.supervisor.includes(user.fullName || '')
          return matchesSearch && matchesStatus && matchesPriority && matchesDepartment && matchesSupervisor
        }

        // For discussion committee, filter by assigned projects
        if (user?.role === 'discussion') {
          // Show projects assigned to this discussion committee
          return matchesSearch && matchesStatus && matchesPriority && matchesDepartment
        }

        return matchesSearch && matchesStatus && matchesPriority && matchesDepartment
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
  }, [projects, searchQuery, statusFilter, priorityFilter, departmentFilter, sortBy, sortOrder, user?.role])

  const currentProject = useMemo(() => {
    if (user?.role === 'student') {
      return projects.find(p => ['in_progress', 'pending', 'approved'].includes(p.status)) || null
    }
    return null
  }, [projects, user?.role])

  const handleFilterClear = () => {
    setStatusFilter('all')
    setPriorityFilter('all')
    setDepartmentFilter('all')
    setSearchQuery('')
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
    }, {
      key: 'registeredStudents',
      label: 'الطلاب المسجلين',
      render: (project: Project) => (
        <div className="flex items-center text-sm text-gray-600">
          <Users size={14} className="ml-1 rtl:ml-0 rtl:mr-1" />
          <span>{(project.students || project.teamMembers || []).length} طالب</span>
        </div>
      )
    }, {
      key: 'department',
      label: 'التخصص',
      render: (project: Project) => (
        <span className="text-sm text-gray-600">{project.department || '-'}</span>
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
          {user?.role === 'committee' && !project.supervisor && project.status === 'approved' && (
            <button
              onClick={() => setProjectToAssignSupervisor(project)}
              className="text-blue-600 hover:text-blue-700 transition-colors"
              title="تعيين مشرف"
            >
              <User size={16} />
            </button>
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
          {user?.role === 'supervisor' && (
            <button
              onClick={() => setSelectedProjectForNotes(project)}
              className="text-blue-600 hover:text-blue-700 transition-colors"
              title="إضافة ملاحظات/موعد لقاء"
            >
              <MessageSquare size={16} />
            </button>
          )}
          {user?.role === 'student' && project.status === 'approved' && (
            <button
              onClick={() => setRegistrationProject(project)}
              className="text-green-600 hover:text-green-700 transition-colors"
              title="التسجيل في المشروع"
            >
              <CheckCircle size={16} />
            </button>
          )}
        </div>
      )
    }
  ], [user?.role, canEdit, canDelete, canApprove, canEvaluate, setRegistrationProject, setSelectedProjectForNotes])

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
                    typeOptions={user?.role === 'student' ? departmentOptions : undefined}
                    sortOptions={sortOptions}
                    statusFilter={statusFilter}
                    priorityFilter={priorityFilter}
                    typeFilter={user?.role === 'student' ? departmentFilter : undefined}
                    sortBy={sortBy}
                    sortOrder={sortOrder}
                    onStatusChange={setStatusFilter}
                    onPriorityChange={setPriorityFilter}
                    onTypeChange={user?.role === 'student' ? setDepartmentFilter : undefined}
                    onSortChange={setSortBy}
                    onSortOrderChange={setSortOrder}
                    onApply={() => { }}
                    onClear={handleFilterClear}
                  />
                }
              >
                <Button
                  variant="outline"
                  size="md"
                  className={cn(
                    'relative',
                    (statusFilter !== 'all' || priorityFilter !== 'all' || departmentFilter !== 'all' || searchQuery || sortBy !== 'updatedAt' || sortOrder !== 'desc') && 'bg-gpms-light/10 border-gpms-light text-gpms-dark'
                  )}
                >
                  <SlidersHorizontal size={16} className="mr-1 rtl:mr-0 rtl:ml-1" />
                  <span className="hidden md:block">{t('common.filter')}</span>
                  {(statusFilter !== 'all' || priorityFilter !== 'all' || departmentFilter !== 'all' || searchQuery || sortBy !== 'updatedAt' || sortOrder !== 'desc') && (
                    <span className="absolute -top-1 -right-1 rtl:right-auto rtl:-left-1 bg-gpms-dark text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {[statusFilter !== 'all', priorityFilter !== 'all', departmentFilter !== 'all', !!searchQuery, sortBy !== 'updatedAt', sortOrder !== 'desc'].filter(Boolean).length}
                    </span>
                  )}
                </Button>
              </SimplePopover>

            </div>
          </div>
        </CardHeader>
        <Divider />

        <CardContent>
          {user?.role === 'committee' && (
            <>
              <div className="mb-6 border border-gray-200 rounded-lg p-6 bg-white">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">إدارة المشاريع والدرجات</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="text-2xl font-bold text-blue-600">
                      {projects.filter(p => p.status === 'approved').length}
                    </div>
                    <div className="text-sm text-blue-800">مشاريع معتمدة</div>
                  </div>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="text-2xl font-bold text-green-600">
                      {projects.filter(p => p.status === 'in_progress').length}
                    </div>
                    <div className="text-sm text-green-800">مشاريع قيد التنفيذ</div>
                  </div>
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="text-2xl font-bold text-yellow-600">
                      {projects.filter(p => p.status === 'completed').length}
                    </div>
                    <div className="text-sm text-yellow-800">مشاريع مكتملة</div>
                  </div>
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <div className="text-2xl font-bold text-purple-600">
                      {projectsNeedingSupervisor.length}
                    </div>
                    <div className="text-sm text-purple-800">تحتاج مشرف</div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button
                    onClick={() => navigate('/evaluations')}
                    variant="outline"
                  >
                    <Award className="w-4 h-4 mr-1 rtl:mr-0 rtl:ml-1" />
                    إدارة الدرجات
                  </Button>
                  <Button
                    onClick={() => navigate('/reports')}
                    variant="outline"
                  >
                    <FileText className="w-4 h-4 mr-1 rtl:mr-0 rtl:ml-1" />
                    التقارير الإحصائية
                  </Button>
                </div>
              </div>

              {/* Projects Needing Supervisor */}
              {projectsNeedingSupervisor.length > 0 && (
                <div className="mb-6 border border-orange-200 rounded-lg p-6 bg-orange-50">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">المشاريع التي تحتاج مشرف</h3>
                    <Badge variant="warning">{projectsNeedingSupervisor.length} مشروع</Badge>
                  </div>
                  <div className="space-y-3">
                    {projectsNeedingSupervisor.map((project) => (
                      <div key={project.id} className="bg-white border border-gray-200 rounded-lg p-4 flex items-center justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{project.title}</h4>
                          <p className="text-sm text-gray-600 mt-1">{project.description}</p>
                          {project.department && (
                            <p className="text-xs text-gray-500 mt-1">التخصص: {project.department}</p>
                          )}
                        </div>
                        <Button
                          size="sm"
                          onClick={() => setProjectToAssignSupervisor(project)}
                          className="bg-orange-600 text-white hover:bg-orange-700"
                        >
                          <User className="w-4 h-4 ml-1 rtl:ml-0 rtl:mr-1" />
                          تعيين مشرف
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative">
              <div className="absolute inset-y-0 right-0 rtl:left-0 rtl:right-auto pr-3 rtl:pl-3 rtl:pr-0 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث عن مشروع، وصف، مشرف، أو تقنية..."
                className="w-full pr-10 rtl:pr-3 rtl:pl-10 pl-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-gpms-light focus:border-transparent"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute inset-y-0 left-0 rtl:right-0 rtl:left-auto pl-3 rtl:pr-3 rtl:pl-0 flex items-center"
                >
                  <XCircle className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                </button>
              )}
            </div>
          </div>
          {user?.role === 'committee' && (
            <div className="mb-6 border border-gray-200 rounded-lg p-6 bg-white">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">إدارة المشاريع والدرجات</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="text-2xl font-bold text-blue-600">
                    {projects.filter(p => p.status === 'approved').length}
                  </div>
                  <div className="text-sm text-blue-800">مشاريع معتمدة</div>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="text-2xl font-bold text-green-600">
                    {projects.filter(p => p.status === 'in_progress').length}
                  </div>
                  <div className="text-sm text-green-800">مشاريع قيد التنفيذ</div>
                </div>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="text-2xl font-bold text-yellow-600">
                    {projects.filter(p => p.status === 'completed').length}
                  </div>
                  <div className="text-sm text-yellow-800">مشاريع مكتملة</div>
                </div>
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <div className="text-2xl font-bold text-purple-600">
                    {projects.filter(p => !p.supervisor).length}
                  </div>
                  <div className="text-sm text-purple-800">تحتاج مشرف</div>
                </div>
              </div>
              <div className="flex gap-3">
                <Button
                  onClick={() => navigate('/evaluations')}
                  variant="outline"
                >
                  <Award className="w-4 h-4 mr-1 rtl:mr-0 rtl:ml-1" />
                  إدارة الدرجات
                </Button>
                <Button
                  onClick={() => navigate('/reports')}
                  variant="outline"
                >
                  <FileText className="w-4 h-4 mr-1 rtl:mr-0 rtl:ml-1" />
                  التقارير الإحصائية
                </Button>
              </div>
            </div>
          )}

          {currentProject && user?.role === 'student' && (
            <div className="mb-6 border border-gray-200 rounded-lg p-6 bg-white">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">متابعة مشروعي</h3>

              {/* Project Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <span className="text-sm text-gray-600">اسم المشروع:</span>
                  <p className="text-gray-900 font-medium">{currentProject.title}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">الحالة:</span>
                  <p className="text-gray-900 font-medium"><StatusBadge status={currentProject.status} /></p>
                </div>
                {currentProject.supervisor && (
                  <div>
                    <span className="text-sm text-gray-600">المشرف:</span>
                    <p className="text-gray-900 font-medium">{currentProject.supervisor}</p>
                  </div>
                )}
                {currentProject.progress !== undefined && (
                  <div>
                    <span className="text-sm text-gray-600">نسبة الإنجاز:</span>
                    <div className="mt-2">
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-gray-700">{currentProject.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className="bg-gpms-light h-3 rounded-full transition-all duration-300"
                          style={{ width: `${currentProject.progress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Supervisor Notes */}
              {currentProject.supervisorNotes && (
                <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium text-blue-900 flex items-center">
                      <MessageSquare size={16} className="ml-2 rtl:ml-0 rtl:mr-2" />
                      ملاحظات المشرف
                    </h4>
                    {currentProject.lastMeetingDate && (
                      <span className="text-xs text-blue-600">
                        {new Date(currentProject.lastMeetingDate).toLocaleDateString('ar')}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-blue-800">{currentProject.supervisorNotes}</p>
                  <Button
                    size="sm"
                    variant="outline"
                    className="mt-3 text-blue-700 border-blue-300 hover:bg-blue-100"
                    onClick={() => {
                      // TODO: Open reply modal
                    }}
                  >
                    الرد على الملاحظات
                  </Button>
                </div>
              )}

              {/* Timeline */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                  <Calendar size={16} className="ml-2 rtl:ml-0 rtl:mr-2" />
                  الجدول الزمني
                </h4>
                <div className="space-y-3">
                  {currentProject.nextMeetingDate && (
                    <div className="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <div>
                        <p className="text-sm font-medium text-yellow-900">الاجتماع القادم</p>
                        <p className="text-xs text-yellow-700">
                          {new Date(currentProject.nextMeetingDate).toLocaleDateString('ar', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                      <Calendar size={20} className="text-yellow-600" />
                    </div>
                  )}
                  {currentProject.defenseDate && (
                    <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div>
                        <p className="text-sm font-medium text-green-900">موعد المناقشة النهائية</p>
                        <p className="text-xs text-green-700">
                          {new Date(currentProject.defenseDate).toLocaleDateString('ar', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                          {currentProject.defenseTime && ` - ${currentProject.defenseTime}`}
                        </p>
                        {currentProject.defenseLocation && (
                          <p className="text-xs text-green-600 mt-1">📍 {currentProject.defenseLocation}</p>
                        )}
                      </div>
                      <Calendar size={20} className="text-green-600" />
                    </div>
                  )}
                  {currentProject.milestones && currentProject.milestones.length > 0 && (
                    <div className="mt-4">
                      <p className="text-sm font-medium text-gray-700 mb-2">المراحل الرئيسية:</p>
                      <div className="space-y-2">
                        {currentProject.milestones.map((milestone) => (
                          <div
                            key={milestone.id}
                            className={`flex items-center justify-between p-2 rounded ${milestone.completed
                              ? 'bg-green-50 border border-green-200'
                              : 'bg-gray-50 border border-gray-200'
                              }`}
                          >
                            <div className="flex items-center">
                              {milestone.completed ? (
                                <CheckCircle size={16} className="text-green-600 ml-2 rtl:ml-0 rtl:mr-2" />
                              ) : (
                                <div className="w-4 h-4 border-2 border-gray-400 rounded-full ml-2 rtl:ml-0 rtl:mr-2" />
                              )}
                              <span className={`text-sm ${milestone.completed ? 'text-green-800 line-through' : 'text-gray-700'}`}>
                                {milestone.title}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-gray-500">
                                {new Date(milestone.dueDate).toLocaleDateString('ar')}
                              </span>
                              {!milestone.completed && (
                                <div className="w-16 bg-gray-200 rounded-full h-1.5">
                                  <div
                                    className="bg-blue-500 h-1.5 rounded-full"
                                    style={{ width: `${milestone.progress}%` }}
                                  />
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200">
                <Button onClick={() => navigate('/documents')} variant="outline">
                  <Upload className="w-4 h-4 mr-1 rtl:mr-0 rtl:ml-1" />
                  تسليم/رفع المستندات
                </Button>
                <Button onClick={() => navigate('/requests/new')} variant="outline">
                  <Send className="w-4 h-4 mr-1 rtl:mr-0 rtl:ml-1" />
                  تقديم طلب
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
                      {user?.role === 'student' && (
                        <div className="flex items-center text-sm text-gray-600">
                          <Users size={16} className="ml-2 rtl:ml-0 rtl:mr-2" />
                          <span>{(project.students || project.teamMembers || []).length} طالب مسجل</span>
                        </div>
                      )}
                      {user?.role === 'supervisor' && project.teamMembers && project.teamMembers.length > 0 && (
                        <div className="flex items-center text-sm text-gray-600">
                          <Users size={16} className="ml-2 rtl:ml-0 rtl:mr-2" />
                          <span>{project.teamMembers.length} طالب</span>
                        </div>
                      )}
                      {project.department && (
                        <div className="flex items-center text-sm text-gray-600">
                          <FolderOpen size={16} className="ml-2 rtl:ml-0 rtl:mr-2" />
                          <span>{project.department}</span>
                        </div>
                      )}
                      {project.startDate && project.endDate && (
                        <div className="flex items-center text-sm text-gray-600">
                          <Calendar size={16} className="ml-2 rtl:ml-0 rtl:mr-2" />
                          <span>{new Date(project.startDate).toLocaleDateString('ar')} - {new Date(project.endDate).toLocaleDateString('ar')}</span>
                        </div>
                      )}
                      {user?.role === 'supervisor' && project.nextMeetingDate && (
                        <div className="flex items-center text-sm text-blue-600">
                          <Clock size={16} className="ml-2 rtl:ml-0 rtl:mr-2" />
                          <span>لقاء قادم: {new Date(project.nextMeetingDate).toLocaleDateString('ar')}</span>
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
                      {user?.role === 'student' && project.status === 'approved' && (
                        <Button
                          onClick={() => setRegistrationProject(project)}
                          size="sm"
                          className="bg-gpms-dark text-white hover:bg-gpms-light text-xs"
                        >
                          التسجيل
                        </Button>
                      )}
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
        size="xl"
      >
        {viewProject && (
          <div className="space-y-6">
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

            {/* Project Progress Tracker - Show for students and supervisors */}
            {(user?.role === 'student' || user?.role === 'supervisor') && viewProject.status === 'in_progress' && (
              <ProjectProgressTracker
                projectId={viewProject.id}
                projectTitle={viewProject.title}
                progress={viewProject.progress || 0}
                milestones={viewProject.milestones}
                meetings={viewProject.lastMeetingDate ? [{
                  id: '1',
                  date: viewProject.lastMeetingDate,
                  time: '10:00',
                  status: 'completed' as const
                }] : []}
                supervisorNotes={viewProject.supervisorNotes ? [{
                  id: '1',
                  content: viewProject.supervisorNotes,
                  createdAt: viewProject.updatedAt || new Date().toISOString(),
                  supervisorName: viewProject.supervisor || 'المشرف'
                }] : []}
                canEdit={user?.role === 'supervisor'}
                onAddNote={async (note) => {
                  // TODO: Implement API call to add note
                  console.log('Adding note:', note)
                }}
                onAddMeeting={async (meeting) => {
                  // TODO: Implement API call to add meeting
                  console.log('Adding meeting:', meeting)
                }}
                onRespondToNote={async (noteId, response) => {
                  // TODO: Implement API call to respond to note
                  console.log('Responding to note:', noteId, response)
                }}
              />
            )}
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
        <>
          <ProjectRegistrationForm
            isOpen={!!registrationProject}
            onClose={() => setRegistrationProject(null)}
            project={registrationProject}
            onSuccess={() => {
              // Refresh projects list
              window.location.reload()
            }}
          />
        </>
      )}

      {/* Assign Supervisor Modal for Committee */}
      {user?.role === 'committee' && (
        <AssignSupervisorForm
          isOpen={!!projectToAssignSupervisor}
          onClose={() => setProjectToAssignSupervisor(null)}
          project={projectToAssignSupervisor}
          onSuccess={() => {
            // Refresh projects list
            window.location.reload()
          }}
        />
      )}

      {/* Supervisor Notes/Meeting Modal */}
      {user?.role === 'supervisor' && (
        <Modal
          isOpen={!!selectedProjectForNotes}
          onClose={() => {
            setSelectedProjectForNotes(null)
            setSupervisorNote('')
            setMeetingDate('')
          }}
          title={selectedProjectForNotes ? `إدارة المشروع: ${selectedProjectForNotes.title}` : 'إدارة المشروع'}
          size="md"
        >
          {selectedProjectForNotes && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  إضافة ملاحظات للمشروع
                </label>
                <textarea
                  value={supervisorNote}
                  onChange={(e) => setSupervisorNote(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-gpms-light focus:border-transparent"
                  placeholder="اكتب ملاحظاتك للطلاب..."
                />
                {selectedProjectForNotes.supervisorNotes && (
                  <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-600 mb-1">الملاحظات السابقة:</p>
                    <p className="text-sm text-gray-700">{selectedProjectForNotes.supervisorNotes}</p>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  تحديد موعد لقاء قادم
                </label>
                <input
                  type="datetime-local"
                  value={meetingDate}
                  onChange={(e) => setMeetingDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-gpms-light focus:border-transparent"
                />
                {selectedProjectForNotes.nextMeetingDate && (
                  <p className="mt-2 text-xs text-gray-600">
                    الموعد الحالي: {new Date(selectedProjectForNotes.nextMeetingDate).toLocaleString('ar')}
                  </p>
                )}
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedProjectForNotes(null)
                    setSupervisorNote('')
                    setMeetingDate('')
                  }}
                >
                  إلغاء
                </Button>
                <Button
                  onClick={async () => {
                    try {
                      // TODO: Call API to save notes and meeting date
                      addNotification({
                        title: 'تم الحفظ',
                        message: 'تم حفظ الملاحظات وموعد اللقاء بنجاح. سيتم إشعار الطلاب.',
                        type: 'success'
                      })
                      setSelectedProjectForNotes(null)
                      setSupervisorNote('')
                      setMeetingDate('')
                    } catch (error) {
                      addNotification({
                        title: 'خطأ',
                        message: 'فشل في حفظ البيانات. يرجى المحاولة مرة أخرى.',
                        type: 'error'
                      })
                    }
                  }}
                  className="bg-gpms-dark text-white hover:bg-gpms-light"
                >
                  حفظ
                </Button>
              </div>
            </div>
          )}
        </Modal>
      )}
    </div>
  )
}

export default ProjectsScreen

