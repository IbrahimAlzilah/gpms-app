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
import ConfirmDialog from '@/components/ui/ConfirmDialog'
import { ViewModeToggle } from '@/components/shared'
import { StatusBadge } from '@/components/shared'
import { Plus, Eye, Edit, Trash2, Megaphone, Calendar, SlidersHorizontal } from 'lucide-react'
import { Announcement } from './schema'
import { useNavigate } from 'react-router-dom'
import { deleteAnnouncement } from '@/services/announcements.service'
import { useAnnouncements } from './announcements.hook'
import { useNotifications } from '@/context/NotificationContext'

const AnnouncementsScreen: React.FC = () => {
  const { t } = useLanguage()
  const { user } = useAuth()
  const navigate = useNavigate()
  const { addNotification } = useNotifications()
  const { announcements, isLoading: announcementsLoading, refetch } = useAnnouncements()
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const [sortBy, setSortBy] = useState('createdAt')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('grid')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null)
  const [viewAnnouncement, setViewAnnouncement] = useState<Announcement | null>(null)
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)

  const statusOptions = [
    { value: 'all', label: 'جميع الحالات' },
    { value: 'active', label: 'نشط' },
    { value: 'inactive', label: 'غير نشط' },
    { value: 'upcoming', label: 'قادم' }
  ]

  const typeOptions = [
    { value: 'all', label: 'جميع الأنواع' },
    { value: 'proposal_submission', label: 'تقديم مقترحات' },
    { value: 'project_review', label: 'مراجعة مشاريع' },
    { value: 'defense_schedule', label: 'جدول مناقشات' },
    { value: 'general', label: 'عام' }
  ]

  const sortOptions = [
    { value: 'createdAt', label: 'تاريخ الإنشاء' },
    { value: 'title', label: 'العنوان' },
    { value: 'startDate', label: 'تاريخ البدء' }
  ]

  const filteredAnnouncements = useMemo(() => {
    return announcements.filter(announcement => {
      const matchesSearch = !searchQuery ||
        announcement.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        announcement.description?.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesStatus = statusFilter === 'all' || announcement.status === statusFilter
      const matchesType = typeFilter === 'all' || announcement.type === typeFilter

      return matchesSearch && matchesStatus && matchesType
    })
  }, [announcements, searchQuery, statusFilter, typeFilter])

  const canCreate = user?.role === 'committee'
  const canEdit = user?.role === 'committee'

  const handleFilterClear = () => {
    setStatusFilter('all')
    setTypeFilter('all')
    setSortBy('createdAt')
    setSortOrder('desc')
  }

  const columns = useMemo(() => [
    {
      key: 'title',
      label: 'العنوان',
      sortable: true,
      render: (announcement: Announcement) => (
        <div>
          <h3 className="font-medium text-gray-900">{announcement.title}</h3>
          <p className="text-sm text-gray-600 line-clamp-1">{announcement.description}</p>
        </div>
      )
    },
    {
      key: 'type',
      label: 'النوع',
      render: (announcement: Announcement) => (
        <span className="text-sm text-gray-600">{announcement.type}</span>
      )
    },
    {
      key: 'startDate',
      label: 'الفترة',
      sortable: true,
      render: (announcement: Announcement) => (
        <div className="text-sm text-gray-600">
          <div className="flex items-center">
            <Calendar size={14} className="ml-1 rtl:ml-0 rtl:mr-1" />
            {announcement.startDate} - {announcement.endDate}
          </div>
        </div>
      )
    },
    {
      key: 'status',
      label: 'الحالة',
      render: (announcement: Announcement) => <StatusBadge status={announcement.status} />
    },
    {
      key: 'actions',
      label: 'الإجراءات',
      render: (announcement: Announcement) => (
        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          <button
            onClick={() => setViewAnnouncement(announcement)}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            title="عرض"
          >
            <Eye size={16} />
          </button>
          {canEdit && (
            <>
              <button
                onClick={() => navigate(`/announcements/${announcement.id}/edit`)}
                className="text-blue-600 hover:text-blue-700 transition-colors"
                title="تعديل"
              >
                <Edit size={16} />
              </button>
              <button
                onClick={() => setConfirmDeleteId(announcement.id)}
                className="text-red-600 hover:text-red-700 transition-colors"
                title="حذف"
              >
                <Trash2 size={16} />
              </button>
            </>
          )}
        </div>
      )
    }
  ], [canEdit])

  return (
    <div className="space-y-6">
      <Card className="hover-lift">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-900">{t('navigation.announcements')}</h1>
            </div>
            <div className="flex items-center space-x-3 rtl:space-x-reverse">
              <ViewModeToggle viewMode={viewMode} onViewModeChange={setViewMode} />
              <SimplePopover
                content={
                  <AdvancedFilter
                    statusOptions={statusOptions}
                    priorityOptions={typeOptions}
                    sortOptions={sortOptions}
                    statusFilter={statusFilter}
                    priorityFilter={typeFilter}
                    sortBy={sortBy}
                    sortOrder={sortOrder}
                    onStatusChange={setStatusFilter}
                    onPriorityChange={setTypeFilter}
                    onSortChange={setSortBy}
                    onSortOrderChange={setSortOrder}
                    onApply={() => {}}
                    onClear={handleFilterClear}
                  />
                }
              >
                <Button variant="outline" size="md" className={cn(
                  'relative',
                  getActiveFiltersCount(statusFilter, typeFilter, searchQuery, sortBy, sortOrder) > 0 && 'bg-gpms-light/10 border-gpms-light text-gpms-dark'
                )}>
                  <SlidersHorizontal size={16} className="mr-1 rtl:mr-0 rtl:ml-1" />
                  {t('common.filter')}
                </Button>
              </SimplePopover>
              {canCreate && (
                <Button
                  onClick={() => navigate('/announcements/new')}
                  className="bg-gpms-dark text-white hover:bg-gpms-light"
                >
                  <Plus className="w-4 h-4 mr-1 rtl:mr-0 rtl:ml-1" />
                  إعلان جديد
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <Divider />
        <CardContent>
          {announcementsLoading ? (
            <div className="text-center py-12">جاري التحميل...</div>
          ) : viewMode === 'table' ? (
            <DataTable
              data={filteredAnnouncements}
              columns={columns}
              emptyMessage="لا توجد إعلانات"
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
              {filteredAnnouncements.map((announcement) => (
                <Card key={announcement.id} className="hover-lift">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-10 h-10 bg-gpms-light/10 rounded-lg flex items-center justify-center">
                        <Megaphone className="w-5 h-5 text-gpms-dark" />
                      </div>
                      <StatusBadge status={announcement.status} />
                    </div>
                    <h3 className="text-md font-semibold text-gray-900 mb-2">{announcement.title}</h3>
                    <p className="text-sm text-gray-600 line-clamp-2 mb-4">{announcement.description}</p>
                    <div className="flex items-center text-sm text-gray-500 mb-4">
                      <Calendar size={14} className="ml-1 rtl:ml-0 rtl:mr-1" />
                      {announcement.startDate} - {announcement.endDate}
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                      <button
                        onClick={() => setViewAnnouncement(announcement)}
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
        isOpen={!!viewAnnouncement}
        onClose={() => setViewAnnouncement(null)}
        title={viewAnnouncement ? `تفاصيل الإعلان - ${viewAnnouncement.title}` : 'تفاصيل الإعلان'}
        size="lg"
      >
        {viewAnnouncement && (
          <div className="space-y-4 text-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="font-medium">الحالة:</span>
                <p className="text-gray-700 mt-1"><StatusBadge status={viewAnnouncement.status} /></p>
              </div>
              <div>
                <span className="font-medium">النوع:</span>
                <p className="text-gray-700 mt-1">{viewAnnouncement.type}</p>
              </div>
            </div>
            <div>
              <span className="font-medium">الوصف:</span>
              <p className="text-gray-700 mt-1">{viewAnnouncement.description}</p>
            </div>
            <div>
              <span className="font-medium">الفترة:</span>
              <p className="text-gray-700 mt-1">{viewAnnouncement.startDate} - {viewAnnouncement.endDate}</p>
            </div>
          </div>
        )}
      </Modal>

      <ConfirmDialog
        isOpen={!!confirmDeleteId}
        title="تأكيد الحذف"
        description="هل أنت متأكد من حذف هذا الإعلان؟"
        variant="destructive"
        onConfirm={async () => {
          try {
            await deleteAnnouncement(confirmDeleteId || '')
            refetch()
          } catch (err) {
            console.error('Error deleting announcement:', err)
            addNotification({
              title: 'خطأ',
              message: 'فشل في حذف الإعلان. يرجى المحاولة مرة أخرى.',
              type: 'error'
            })
          }
          setConfirmDeleteId(null)
        }}
        onCancel={() => setConfirmDeleteId(null)}
      />
    </div>
  )
}

export default AnnouncementsScreen
