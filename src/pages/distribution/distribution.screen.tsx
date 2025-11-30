import React, { useState, useMemo, useEffect } from 'react'
import { useLanguage } from '@/context/LanguageContext'
import { cn, getActiveFiltersCount } from '@/lib/utils'
import { Card, CardContent, CardHeader } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Divider from '@/components/ui/Divider'
import DataTable from '@/components/ui/DataTable'
import SimplePopover from '@/components/ui/SimplePopover'
import AdvancedFilter from '@/components/ui/AdvancedFilter'
import Modal from '@/components/ui/Modal'
import ConfirmDialog from '@/components/ui/ConfirmDialog'
import { ViewModeToggle } from '@/components/shared'
import { StatusBadge } from '@/components/shared'
import { Plus, Eye, Edit, Trash2, Users, Calendar, Clock, MapPin, SlidersHorizontal, CheckCircle } from 'lucide-react'
import { DiscussionCommittee } from './schema'
import { useNavigate } from 'react-router-dom'
import { deleteCommittee, getProjectsReadyForDefense, assignCommitteeToProject, ProjectReadyForDefense } from '@/services/distribution.service'
import { useDistribution } from './distribution.hook'
import { useNotifications } from '@/context/NotificationContext'
import { useAuth } from '@/context/AuthContext'

const DistributionScreen: React.FC = () => {
  const { t } = useLanguage()
  const { user } = useAuth()
  const navigate = useNavigate()
  const { addNotification } = useNotifications()
  const { committees, isLoading: committeesLoading, refetch } = useDistribution()
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [sortBy, setSortBy] = useState('scheduledDate')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('grid')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingCommittee, setEditingCommittee] = useState<DiscussionCommittee | null>(null)
  const [viewCommittee, setViewCommittee] = useState<DiscussionCommittee | null>(null)
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)
  const [projectsReadyForDefense, setProjectsReadyForDefense] = useState<ProjectReadyForDefense[]>([])
  const [isLoadingProjects, setIsLoadingProjects] = useState(false)
  const [assignModalOpen, setAssignModalOpen] = useState(false)
  const [selectedProject, setSelectedProject] = useState<ProjectReadyForDefense | null>(null)
  const [selectedCommitteeId, setSelectedCommitteeId] = useState('')

  const statusOptions = [
    { value: 'all', label: 'جميع الحالات' },
    { value: 'assigned', label: 'معين' },
    { value: 'pending', label: 'قيد الانتظار' },
    { value: 'completed', label: 'مكتمل' }
  ]

  const priorityOptions = [
    { value: 'all', label: 'جميع الأولويات' }
  ]

  const sortOptions = [
    { value: 'scheduledDate', label: 'تاريخ الجدولة' },
    { value: 'projectTitle', label: 'اسم المشروع' },
    { value: 'status', label: 'الحالة' }
  ]

  const filteredCommittees = useMemo(() => {
    return committees.filter(committee => {
      const matchesSearch = !searchQuery ||
        committee.projectTitle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        committee.studentName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        committee.name?.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesStatus = statusFilter === 'all' || committee.status === statusFilter

      return matchesSearch && matchesStatus
    })
  }, [committees, searchQuery, statusFilter])

  useEffect(() => {
    const loadProjectsReadyForDefense = async () => {
      if (user?.role !== 'committee') return
      
      setIsLoadingProjects(true)
      try {
        const projects = await getProjectsReadyForDefense()
        setProjectsReadyForDefense(projects.filter(p => !p.hasCommittee))
      } catch (error) {
        console.error('Error loading projects:', error)
      } finally {
        setIsLoadingProjects(false)
      }
    }

    loadProjectsReadyForDefense()
  }, [user, committees])

  const handleFilterClear = () => {
    setStatusFilter('all')
    setSortBy('scheduledDate')
    setSortOrder('asc')
  }

  const handleAssignCommittee = async () => {
    if (!selectedProject || !selectedCommitteeId) {
      addNotification({
        title: 'خطأ',
        message: 'يرجى اختيار المشروع واللجنة',
        type: 'error'
      })
      return
    }

    try {
      await assignCommitteeToProject(selectedProject.id, selectedCommitteeId)
      addNotification({
        title: 'تم التعيين',
        message: `تم تعيين اللجنة للمشروع "${selectedProject.title}" بنجاح`,
        type: 'success'
      })
      setAssignModalOpen(false)
      setSelectedProject(null)
      setSelectedCommitteeId('')
      refetch()
      // Reload projects
      const projects = await getProjectsReadyForDefense()
      setProjectsReadyForDefense(projects.filter(p => !p.hasCommittee))
    } catch (error) {
      addNotification({
        title: 'خطأ',
        message: error instanceof Error ? error.message : 'حدث خطأ أثناء تعيين اللجنة',
        type: 'error'
      })
    }
  }

  const columns = useMemo(() => [
    {
      key: 'projectTitle',
      label: 'المشروع',
      sortable: true,
      render: (committee: DiscussionCommittee) => (
        <div>
          <h3 className="font-medium text-gray-900">{committee.projectTitle}</h3>
          <p className="text-sm text-gray-600">{committee.studentName}</p>
        </div>
      )
    },
    {
      key: 'name',
      label: 'اسم اللجنة',
      render: (committee: DiscussionCommittee) => (
        <span className="text-sm text-gray-600">{committee.name}</span>
      )
    },
    {
      key: 'members',
      label: 'الأعضاء',
      render: (committee: DiscussionCommittee) => (
        <div className="flex items-center text-sm text-gray-600">
          <Users size={14} className="ml-1 rtl:ml-0 rtl:mr-1" />
          {committee.members.length} عضو
        </div>
      )
    },
    {
      key: 'scheduledDate',
      label: 'التاريخ والوقت',
      sortable: true,
      render: (committee: DiscussionCommittee) => (
        <div className="text-sm">
          <div className="flex items-center text-gray-900">
            <Calendar size={14} className="ml-1 rtl:ml-0 rtl:mr-1" />
            {committee.scheduledDate}
          </div>
          <div className="flex items-center text-gray-600 mt-1">
            <Clock size={14} className="ml-1 rtl:ml-0 rtl:mr-1" />
            {committee.scheduledTime}
          </div>
        </div>
      )
    },
    {
      key: 'status',
      label: 'الحالة',
      render: (committee: DiscussionCommittee) => <StatusBadge status={committee.status} />
    },
    {
      key: 'actions',
      label: 'الإجراءات',
      render: (committee: DiscussionCommittee) => (
        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          <button
            onClick={() => setViewCommittee(committee)}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            title="عرض"
          >
            <Eye size={16} />
          </button>
          <button
            onClick={() => navigate(`/distribution/${committee.id}/edit`)}
            className="text-blue-600 hover:text-blue-700 transition-colors"
            title="تعديل"
          >
            <Edit size={16} />
          </button>
          <button
            onClick={() => setConfirmDeleteId(committee.id)}
            className="text-red-600 hover:text-red-700 transition-colors"
            title="حذف"
          >
            <Trash2 size={16} />
          </button>
        </div>
      )
    }
  ], [])

  return (
    <div className="space-y-6">
      {/* Projects Ready for Defense */}
      {user?.role === 'committee' && projectsReadyForDefense.length > 0 && (
        <Card className="hover-lift border-blue-200">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">المشاريع الجاهزة للمناقشة</h2>
                <p className="text-sm text-gray-600 mt-1">مشاريع تحتاج إلى تعيين لجنة مناقشة</p>
              </div>
            </div>
          </CardHeader>
          <Divider />
          <CardContent>
            <div className="space-y-3">
              {projectsReadyForDefense.map((project) => (
                <div key={project.id} className="border border-gray-200 rounded-lg p-4 flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{project.title}</h3>
                    <p className="text-sm text-gray-600">الطالب: {project.studentName} | المشرف: {project.supervisor}</p>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => {
                      setSelectedProject(project)
                      setAssignModalOpen(true)
                    }}
                    className="bg-blue-600 text-white hover:bg-blue-700"
                  >
                    <CheckCircle className="w-4 h-4 ml-1 rtl:ml-0 rtl:mr-1" />
                    تعيين لجنة
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="hover-lift">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-900">توزيع اللجان</h1>
            </div>
            <div className="flex items-center space-x-3 rtl:space-x-reverse">
              <ViewModeToggle viewMode={viewMode} onViewModeChange={setViewMode} />
              <SimplePopover
                content={
                  <AdvancedFilter
                    statusOptions={statusOptions}
                    priorityOptions={priorityOptions}
                    sortOptions={sortOptions}
                    statusFilter={statusFilter}
                    priorityFilter="all"
                    sortBy={sortBy}
                    sortOrder={sortOrder}
                    onStatusChange={setStatusFilter}
                    onPriorityChange={() => {}}
                    onSortChange={setSortBy}
                    onSortOrderChange={setSortOrder}
                    onApply={() => {}}
                    onClear={handleFilterClear}
                  />
                }
              >
                <Button variant="outline" size="md" className={cn(
                  'relative',
                  getActiveFiltersCount(statusFilter, 'all', searchQuery, sortBy, sortOrder) > 0 && 'bg-gpms-light/10 border-gpms-light text-gpms-dark'
                )}>
                  <SlidersHorizontal size={16} className="mr-1 rtl:mr-0 rtl:ml-1" />
                  {t('common.filter')}
                </Button>
              </SimplePopover>
              <Button
                onClick={() => navigate('/distribution/new')}
                className="bg-gpms-dark text-white hover:bg-gpms-light"
              >
                <Plus className="w-4 h-4 mr-1 rtl:mr-0 rtl:ml-1" />
                لجنة جديدة
              </Button>
            </div>
          </div>
        </CardHeader>
        <Divider />
        <CardContent>
          {committeesLoading ? (
            <div className="text-center py-12">جاري التحميل...</div>
          ) : viewMode === 'table' ? (
            <DataTable
              data={filteredCommittees}
              columns={columns}
              emptyMessage="لا توجد لجان"
              className="min-h-[400px]"
              onSort={(key, direction) => {
                setSortBy(key)
                setSortOrder(direction)
              }}
              sortBy={sortBy}
              sortOrder={sortOrder}
            />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredCommittees.map((committee) => (
                <Card key={committee.id} className="hover-lift">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-md font-semibold text-gray-900 mb-2">{committee.projectTitle}</h3>
                        <p className="text-sm text-gray-600">{committee.studentName}</p>
                      </div>
                      <StatusBadge status={committee.status} />
                    </div>
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <Users size={16} className="ml-2 rtl:ml-0 rtl:mr-2" />
                        {committee.members.length} عضو
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar size={16} className="ml-2 rtl:ml-0 rtl:mr-2" />
                        {committee.scheduledDate}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Clock size={16} className="ml-2 rtl:ml-0 rtl:mr-2" />
                        {committee.scheduledTime}
                      </div>
                      {committee.location && (
                        <div className="flex items-center text-sm text-gray-600">
                          <MapPin size={16} className="ml-2 rtl:ml-0 rtl:mr-2" />
                          {committee.location}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                      <button
                        onClick={() => setViewCommittee(committee)}
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
        </CardContent>
      </Card>

      <Modal
        isOpen={!!viewCommittee}
        onClose={() => setViewCommittee(null)}
        title={viewCommittee ? `تفاصيل اللجنة - ${viewCommittee.name}` : 'تفاصيل اللجنة'}
        size="lg"
      >
        {viewCommittee && (
          <div className="space-y-4 text-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="font-medium">المشروع:</span>
                <p className="text-gray-700 mt-1">{viewCommittee.projectTitle}</p>
              </div>
              <div>
                <span className="font-medium">الطالب:</span>
                <p className="text-gray-700 mt-1">{viewCommittee.studentName}</p>
              </div>
              <div>
                <span className="font-medium">التاريخ:</span>
                <p className="text-gray-700 mt-1">{viewCommittee.scheduledDate}</p>
              </div>
              <div>
                <span className="font-medium">الوقت:</span>
                <p className="text-gray-700 mt-1">{viewCommittee.scheduledTime}</p>
              </div>
              <div>
                <span className="font-medium">الموقع:</span>
                <p className="text-gray-700 mt-1">{viewCommittee.location}</p>
              </div>
              <div>
                <span className="font-medium">الحالة:</span>
                <p className="text-gray-700 mt-1"><StatusBadge status={viewCommittee.status} /></p>
              </div>
            </div>
            <div>
              <span className="font-medium">الأعضاء:</span>
              <ul className="list-disc list-inside text-gray-700 mt-1">
                {viewCommittee.members.map((member, idx) => (
                  <li key={idx}>{member.name} ({member.role})</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </Modal>

      <ConfirmDialog
        isOpen={!!confirmDeleteId}
        title="تأكيد الحذف"
        description="هل أنت متأكد من حذف هذه اللجنة؟"
        variant="destructive"
        onConfirm={async () => {
          try {
            await deleteCommittee(confirmDeleteId || '')
            refetch()
          } catch (err) {
            console.error('Error deleting committee:', err)
            addNotification({
              title: 'خطأ',
              message: 'فشل في حذف اللجنة. يرجى المحاولة مرة أخرى.',
              type: 'error'
            })
          }
          setConfirmDeleteId(null)
        }}
        onCancel={() => setConfirmDeleteId(null)}
      />

      {/* Assign Committee Modal */}
      <Modal
        isOpen={assignModalOpen}
        onClose={() => {
          setAssignModalOpen(false)
          setSelectedProject(null)
          setSelectedCommitteeId('')
        }}
        title="تعيين لجنة للمشروع"
        size="md"
      >
        {selectedProject && (
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="font-medium text-gray-900">المشروع: {selectedProject.title}</p>
              <p className="text-sm text-gray-600">الطالب: {selectedProject.studentName}</p>
              <p className="text-sm text-gray-600">المشرف: {selectedProject.supervisor}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                اختر اللجنة
              </label>
              <select
                value={selectedCommitteeId}
                onChange={(e) => setSelectedCommitteeId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-gpms-light focus:border-transparent"
              >
                <option value="">-- اختر اللجنة --</option>
                {committees.map((committee) => (
                  <option key={committee.id} value={committee.id}>
                    {committee.name} ({committee.members.length} عضو)
                  </option>
                ))}
              </select>
            </div>
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
              <Button
                variant="outline"
                onClick={() => {
                  setAssignModalOpen(false)
                  setSelectedProject(null)
                  setSelectedCommitteeId('')
                }}
              >
                إلغاء
              </Button>
              <Button
                onClick={handleAssignCommittee}
                className="bg-blue-600 text-white hover:bg-blue-700"
                disabled={!selectedCommitteeId}
              >
                تعيين
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}

export default DistributionScreen
