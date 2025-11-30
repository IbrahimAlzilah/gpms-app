import React, { useState, useMemo, useEffect, useCallback } from 'react'
import { useLanguage } from '@/context/LanguageContext'
import { useAuth } from '@/context/AuthContext'
import { useNavigate } from 'react-router-dom'
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
import { useProjects } from './projects.hook'
import { Project } from './schema'
import { useNotifications } from '@/context/NotificationContext'
import { SlidersHorizontal, Search, XCircle, FolderOpen, Users } from 'lucide-react'
import { deleteProject } from '@/services/projects.service'
import ProjectRegistrationForm from '@/components/forms/ProjectRegistrationForm'
import { getProjectsNeedingSupervisor } from '@/services/supervisor-assignment.service'
import AssignSupervisorForm from '@/components/forms/AssignSupervisorForm'
import ProjectProgressTracker from '@/components/ProjectProgressTracker'
import { useProjectFilters } from '@/hooks/useProjectFilters'
import {
  CommitteeDashboardSection,
  StudentProjectTracking,
  ProjectCard,
  ProjectActions
} from '@/components/projects'

const ProjectsScreen: React.FC = () => {
  const { t } = useLanguage()
  const { user } = useAuth()
  const navigate = useNavigate()
  const { addNotification } = useNotifications()
  const { projects, isLoading, canEdit, canDelete, canApprove, canEvaluate } = useProjects()

  // Modal states
  const [viewProject, setViewProject] = useState<Project | null>(null)
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)
  const [registrationProject, setRegistrationProject] = useState<Project | null>(null)
  const [selectedProjectForNotes, setSelectedProjectForNotes] = useState<Project | null>(null)
  const [projectToAssignSupervisor, setProjectToAssignSupervisor] = useState<Project | null>(null)
  const [supervisorNote, setSupervisorNote] = useState('')
  const [meetingDate, setMeetingDate] = useState('')
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('grid')

  // Projects needing supervisor
  const [projectsNeedingSupervisor, setProjectsNeedingSupervisor] = useState<Project[]>([])

  // Use the project filters hook
  const {
    filters,
    setStatusFilter,
    setPriorityFilter,
    setDepartmentFilter,
    setSearchQuery,
    setSortBy,
    setSortOrder,
    clearFilters,
    filteredProjects,
    statusOptions,
    priorityOptions,
    departmentOptions,
    sortOptions,
    activeFiltersCount
  } = useProjectFilters({ projects })

  // Load projects needing supervisor for committee
  useEffect(() => {
    const loadProjectsNeedingSupervisor = async () => {
      if (user?.role !== 'committee') return

      try {
        const projects = await getProjectsNeedingSupervisor()
        setProjectsNeedingSupervisor(projects)
      } catch (error) {
        console.error('Error loading projects needing supervisor:', error)
      }
    }

    loadProjectsNeedingSupervisor()
  }, [user?.role])

  // Find current project for students
  const currentProject = useMemo(() => {
    if (user?.role === 'student') {
      return projects.find((p) => ['in_progress', 'pending', 'approved'].includes(p.status)) || null
    }
    return null
  }, [projects, user?.role])

  // Handlers
  const handleViewProject = useCallback((project: Project) => {
    setViewProject(project)
  }, [])

  const handleEditProject = useCallback((project: Project) => {
    navigate(`/projects/edit/${project.id}`)
  }, [navigate])

  const handleDeleteProject = useCallback((projectId: string) => {
    setConfirmDeleteId(projectId)
  }, [])

  const handleConfirmDelete = useCallback(async () => {
    if (!confirmDeleteId) return

    try {
      await deleteProject(confirmDeleteId)
      addNotification({
        title: 'تم الحذف',
        message: 'تم حذف المشروع بنجاح',
        type: 'success'
      })
      navigate('/projects')
    } catch (err) {
      console.error('Error deleting project:', err)
      addNotification({
        title: 'خطأ',
        message: 'حدث خطأ أثناء حذف المشروع',
        type: 'error'
      })
    } finally {
      setConfirmDeleteId(null)
    }
  }, [confirmDeleteId, addNotification, navigate])

  const handleRegisterProject = useCallback((project: Project) => {
    setRegistrationProject(project)
  }, [])

  const handleAssignSupervisor = useCallback((project: Project) => {
    setProjectToAssignSupervisor(project)
  }, [])

  const handleAddNotes = useCallback((project: Project) => {
    setSelectedProjectForNotes(project)
  }, [])

  const handleCloseSupervisorNotes = useCallback(() => {
    setSelectedProjectForNotes(null)
    setSupervisorNote('')
    setMeetingDate('')
  }, [])

  const handleSaveSupervisorNotes = useCallback(async () => {
    if (!selectedProjectForNotes) return

    try {
      // TODO: Call API to save notes and meeting date
      addNotification({
        title: 'تم الحفظ',
        message: 'تم حفظ الملاحظات وموعد اللقاء بنجاح. سيتم إشعار الطلاب.',
        type: 'success'
      })
      handleCloseSupervisorNotes()
    } catch (error) {
      addNotification({
        title: 'خطأ',
        message: 'فشل في حفظ البيانات. يرجى المحاولة مرة أخرى.',
        type: 'error'
      })
    }
  }, [selectedProjectForNotes, addNotification, handleCloseSupervisorNotes])

  const handleSort = useCallback((key: string, direction: 'asc' | 'desc') => {
    setSortBy(key)
    setSortOrder(direction)
  }, [setSortBy, setSortOrder])

  // Table columns
  const columns = useMemo(
    () => [
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
      ...(user?.role === 'supervisor' || user?.role === 'committee'
        ? [
          {
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
          }
        ]
        : []),
      ...(user?.role === 'student'
        ? [
          {
            key: 'supervisor',
            label: 'المشرف',
            render: (project: Project) => (
              <span className="text-sm text-gray-600">{project.supervisor || '-'}</span>
            )
          },
          {
            key: 'registeredStudents',
            label: 'الطلاب المسجلين',
            render: (project: Project) => (
              <div className="flex items-center text-sm text-gray-600">
                <Users size={14} className="ml-1 rtl:ml-0 rtl:mr-1" />
                <span>{(project.students || project.teamMembers || []).length} طالب</span>
              </div>
            )
          },
          {
            key: 'department',
            label: 'التخصص',
            render: (project: Project) => (
              <span className="text-sm text-gray-600">{project.department || '-'}</span>
            )
          }
        ]
        : []),
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
          <ProjectActions
            project={project}
            userRole={user?.role}
            canEdit={canEdit}
            canDelete={canDelete}
            canApprove={canApprove}
            canEvaluate={canEvaluate}
            onView={handleViewProject}
            onEdit={handleEditProject}
            onDelete={handleDeleteProject}
            onAssignSupervisor={handleAssignSupervisor}
            onAddNotes={handleAddNotes}
            onRegister={handleRegisterProject}
          />
        )
      }
    ],
    [
      user?.role,
      canEdit,
      canDelete,
      canApprove,
      canEvaluate,
      handleViewProject,
      handleEditProject,
      handleDeleteProject,
      handleAssignSupervisor,
      handleAddNotes,
      handleRegisterProject
    ]
  )

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div>جاري التحميل...</div>
      </div>
    )
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
                    statusFilter={filters.status}
                    priorityFilter={filters.priority}
                    typeFilter={user?.role === 'student' ? filters.department : undefined}
                    sortBy={filters.sortBy}
                    sortOrder={filters.sortOrder}
                    onStatusChange={setStatusFilter}
                    onPriorityChange={setPriorityFilter}
                    onTypeChange={user?.role === 'student' ? setDepartmentFilter : undefined}
                    onSortChange={setSortBy}
                    onSortOrderChange={setSortOrder}
                    onApply={() => { }}
                    onClear={clearFilters}
                  />
                }
              >
                <Button
                  variant="outline"
                  size="md"
                  className={cn(
                    'relative',
                    activeFiltersCount > 0 && 'bg-gpms-light/10 border-gpms-light text-gpms-dark'
                  )}
                >
                  <SlidersHorizontal size={16} className="mr-1 rtl:mr-0 rtl:ml-1" />
                  <span className="hidden md:block">{t('common.filter')}</span>
                  {activeFiltersCount > 0 && (
                    <span className="absolute -top-1 -right-1 rtl:right-auto rtl:-left-1 bg-gpms-dark text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {activeFiltersCount}
                    </span>
                  )}
                </Button>
              </SimplePopover>
            </div>
          </div>
        </CardHeader>
        <Divider />

        <CardContent>
          {/* Committee Dashboard Section */}
          {user?.role === 'committee' && (
            <CommitteeDashboardSection
              projects={projects}
              projectsNeedingSupervisor={projectsNeedingSupervisor}
              onAssignSupervisor={handleAssignSupervisor}
            />
          )}

          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative">
              <div className="absolute inset-y-0 right-0 rtl:left-0 rtl:right-auto pr-3 rtl:pl-3 rtl:pr-0 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={filters.searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث عن مشروع، وصف، مشرف، أو تقنية..."
                className="w-full pr-10 rtl:pr-3 rtl:pl-10 pl-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-gpms-light focus:border-transparent"
              />
              {filters.searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute inset-y-0 left-0 rtl:right-0 rtl:left-auto pl-3 rtl:pr-3 rtl:pl-0 flex items-center"
                >
                  <XCircle className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                </button>
              )}
            </div>
          </div>

          {/* Student Project Tracking */}
          {currentProject && user?.role === 'student' && (
            <StudentProjectTracking project={currentProject} />
          )}

          {/* Projects List */}
          {viewMode === 'table' ? (
            <Card className="hover-lift">
              <CardContent className="p-0">
                <DataTable
                  data={filteredProjects}
                  columns={columns}
                  emptyMessage="لا توجد مشاريع"
                  className="min-h-[400px]"
                  onSort={handleSort}
                  sortBy={filters.sortBy}
                  sortOrder={filters.sortOrder}
                />
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredProjects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  userRole={user?.role}
                  canEdit={canEdit}
                  canDelete={canDelete}
                  onView={handleViewProject}
                  onEdit={handleEditProject}
                  onDelete={handleDeleteProject}
                  onRegister={handleRegisterProject}
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
                  <p className="text-gray-700 mt-1">
                    <StatusBadge status={viewProject.status} />
                  </p>
                </div>
                <div>
                  <span className="font-medium">الأولوية:</span>
                  <p className="text-gray-700 mt-1">
                    <PriorityBadge priority={viewProject.priority} />
                  </p>
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

            {/* Project Progress Tracker */}
            {(user?.role === 'student' || user?.role === 'supervisor') &&
              viewProject.status === 'in_progress' && (
                <ProjectProgressTracker
                  projectId={viewProject.id}
                  projectTitle={viewProject.title}
                  progress={viewProject.progress || 0}
                  milestones={viewProject.milestones}
                  meetings={
                    viewProject.lastMeetingDate
                      ? [
                        {
                          id: '1',
                          date: viewProject.lastMeetingDate,
                          time: '10:00',
                          status: 'completed' as const
                        }
                      ]
                      : []
                  }
                  supervisorNotes={
                    viewProject.supervisorNotes
                      ? [
                        {
                          id: '1',
                          content: viewProject.supervisorNotes,
                          createdAt: viewProject.updatedAt || new Date().toISOString(),
                          supervisorName: viewProject.supervisor || 'المشرف'
                        }
                      ]
                      : []
                  }
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
          <p className="text-gray-700 text-sm">
            هل أنت متأكد من حذف هذا المشروع؟ لا يمكن التراجع عن هذا الإجراء.
          </p>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setConfirmDeleteId(null)}>
              إلغاء
            </Button>
            <Button onClick={handleConfirmDelete} className="bg-red-600 text-white hover:bg-red-700">
              حذف
            </Button>
          </div>
        </div>
      </Modal>

      {/* Project Registration Form */}
      {user?.role === 'student' && (
        <ProjectRegistrationForm
          isOpen={!!registrationProject}
          onClose={() => setRegistrationProject(null)}
          project={registrationProject}
          onSuccess={() => {
            // Refresh projects list
            window.location.reload()
          }}
        />
      )}

      {/* Assign Supervisor Form */}
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
          onClose={handleCloseSupervisorNotes}
          title={
            selectedProjectForNotes
              ? `إدارة المشروع: ${selectedProjectForNotes.title}`
              : 'إدارة المشروع'
          }
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
                    الموعد الحالي:{' '}
                    {new Date(selectedProjectForNotes.nextMeetingDate).toLocaleString('ar')}
                  </p>
                )}
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <Button variant="outline" onClick={handleCloseSupervisorNotes}>
                  إلغاء
                </Button>
                <Button onClick={handleSaveSupervisorNotes} className="bg-gpms-dark text-white hover:bg-gpms-light">
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
