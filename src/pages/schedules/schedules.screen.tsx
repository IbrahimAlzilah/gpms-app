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
import { StatusBadge } from '@/components/shared'
import { Plus, Eye, Edit, Calendar, Clock, MapPin, Users, SlidersHorizontal } from 'lucide-react'
import { Schedule } from './schema'
import { useNavigate } from 'react-router-dom'
import { useSchedules } from './schedules.hook'

const SchedulesScreen: React.FC = () => {
  const { t } = useLanguage()
  const { user } = useAuth()
  const navigate = useNavigate()
  const { schedules, isLoading: schedulesLoading } = useSchedules()
  const [searchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [sortBy, setSortBy] = useState('date')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('grid')
  const [viewSchedule, setViewSchedule] = useState<Schedule | null>(null)

  const statusOptions = [
    { value: 'all', label: 'جميع الحالات' },
    { value: 'scheduled', label: 'مجدول' },
    { value: 'completed', label: 'مكتمل' },
    { value: 'cancelled', label: 'ملغي' },
    { value: 'postponed', label: 'مؤجل' }
  ]


  const priorityOptions = [
    { value: 'all', label: 'جميع الأولويات' },
    { value: 'low', label: 'منخفض' },
    { value: 'medium', label: 'متوسط' },
    { value: 'high', label: 'عالي' }
  ]

  const sortOptions = [
    { value: 'date', label: 'التاريخ' },
    { value: 'title', label: 'العنوان' },
    { value: 'status', label: 'الحالة' },
    { value: 'type', label: 'النوع' }
  ]

  const filteredSchedules = useMemo(() => {
    return schedules.filter(schedule => {
      const matchesSearch = !searchQuery ||
        schedule.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        schedule.description?.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesStatus = statusFilter === 'all' || schedule.status === statusFilter
      const matchesType = typeFilter === 'all' || schedule.type === typeFilter
      const matchesPriority = priorityFilter === 'all' || schedule.priority === priorityFilter

      return matchesSearch && matchesStatus && matchesType && matchesPriority
    })
  }, [schedules, searchQuery, statusFilter, typeFilter, priorityFilter])

  const canCreate = user?.role === 'committee' || user?.role === 'supervisor'
  const canEdit = user?.role === 'committee'

  const handleFilterClear = () => {
    setStatusFilter('all')
    setTypeFilter('all')
    setPriorityFilter('all')
    setSortBy('date')
    setSortOrder('asc')
  }

  const columns = useMemo(() => [
    {
      key: 'title',
      label: 'العنوان',
      sortable: true,
      render: (schedule: Schedule) => (
        <div>
          <h3 className="font-medium text-gray-900">{schedule.title}</h3>
          {schedule.description && (
            <p className="text-sm text-gray-600 line-clamp-1">{schedule.description}</p>
          )}
        </div>
      )
    },
    {
      key: 'type',
      label: 'النوع',
      render: (schedule: Schedule) => (
        <span className="text-sm text-gray-600">{schedule.type}</span>
      )
    },
    {
      key: 'date',
      label: 'التاريخ والوقت',
      sortable: true,
      render: (schedule: Schedule) => (
        <div className="text-sm">
          <div className="flex items-center text-gray-900">
            <Calendar size={14} className="ml-1 rtl:ml-0 rtl:mr-1" />
            {schedule.date}
          </div>
          <div className="flex items-center text-gray-600 mt-1">
            <Clock size={14} className="ml-1 rtl:ml-0 rtl:mr-1" />
            {schedule.startTime} - {schedule.endTime}
          </div>
        </div>
      )
    },
    {
      key: 'location',
      label: 'الموقع',
      render: (schedule: Schedule) => (
        <div className="flex items-center text-sm text-gray-600">
          <MapPin size={14} className="ml-1 rtl:ml-0 rtl:mr-1" />
          {schedule.location}
        </div>
      )
    },
    {
      key: 'status',
      label: 'الحالة',
      render: (schedule: Schedule) => <StatusBadge status={schedule.status} />
    },
    {
      key: 'actions',
      label: 'الإجراءات',
      render: (schedule: Schedule) => (
        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          <button
            onClick={() => setViewSchedule(schedule)}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            title="عرض"
          >
            <Eye size={16} />
          </button>
          {canEdit && (
            <button
              onClick={() => navigate(`/schedules/${schedule.id}/edit`)}
              className="text-blue-600 hover:text-blue-700 transition-colors"
              title="تعديل"
            >
              <Edit size={16} />
            </button>
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
              <h1 className="text-xl font-bold text-gray-900">{t('navigation.schedules')}</h1>
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
                <Button variant="outline" size="md" className={cn(
                  'relative',
                  getActiveFiltersCount(statusFilter, priorityFilter, searchQuery, sortBy, sortOrder) > 0 && 'bg-gpms-light/10 border-gpms-light text-gpms-dark'
                )}>
                  <SlidersHorizontal size={16} className="mr-1 rtl:mr-0 rtl:ml-1" />
                  {t('common.filter')}
                </Button>
              </SimplePopover>
              {canCreate && (
                <Button
                  onClick={() => navigate('/schedules/new')}
                  className="bg-gpms-dark text-white hover:bg-gpms-light"
                >
                  <Plus className="w-4 h-4 mr-1 rtl:mr-0 rtl:ml-1" />
                  جدول جديد
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <Divider />
        <CardContent>
          {schedulesLoading ? (
            <div className="text-center py-12">جاري التحميل...</div>
          ) : viewMode === 'table' ? (
            <DataTable
              data={filteredSchedules}
              columns={columns}
              emptyMessage="لا توجد جداول"
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
              {filteredSchedules.map((schedule) => (
                <Card key={schedule.id} className="hover-lift">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-md font-semibold text-gray-900 mb-2">{schedule.title}</h3>
                        <p className="text-sm text-gray-600">{schedule.type}</p>
                      </div>
                      <StatusBadge status={schedule.status} />
                    </div>
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar size={16} className="ml-2 rtl:ml-0 rtl:mr-2" />
                        {schedule.date}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Clock size={16} className="ml-2 rtl:ml-0 rtl:mr-2" />
                        {schedule.startTime} - {schedule.endTime}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin size={16} className="ml-2 rtl:ml-0 rtl:mr-2" />
                        {schedule.location}
                      </div>
                      {schedule.participants && schedule.participants.length > 0 && (
                        <div className="flex items-center text-sm text-gray-600">
                          <Users size={16} className="ml-2 rtl:ml-0 rtl:mr-2" />
                          {schedule.participants.length} مشارك
                        </div>
                      )}
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                      <button
                        onClick={() => setViewSchedule(schedule)}
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
        isOpen={!!viewSchedule}
        onClose={() => setViewSchedule(null)}
        title={viewSchedule ? `تفاصيل الجدول - ${viewSchedule.title}` : 'تفاصيل الجدول'}
        size="lg"
      >
        {viewSchedule && (
          <div className="space-y-4 text-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="font-medium">التاريخ:</span>
                <p className="text-gray-700 mt-1">{viewSchedule.date}</p>
              </div>
              <div>
                <span className="font-medium">الوقت:</span>
                <p className="text-gray-700 mt-1">{viewSchedule.startTime} - {viewSchedule.endTime}</p>
              </div>
              <div>
                <span className="font-medium">الموقع:</span>
                <p className="text-gray-700 mt-1">{viewSchedule.location}</p>
              </div>
              <div>
                <span className="font-medium">الحالة:</span>
                <p className="text-gray-700 mt-1"><StatusBadge status={viewSchedule.status} /></p>
              </div>
            </div>
            {viewSchedule.description && (
              <div>
                <span className="font-medium">الوصف:</span>
                <p className="text-gray-700 mt-1">{viewSchedule.description}</p>
              </div>
            )}
            {viewSchedule.participants && viewSchedule.participants.length > 0 && (
              <div>
                <span className="font-medium">المشاركون:</span>
                <ul className="list-disc list-inside text-gray-700 mt-1">
                  {viewSchedule.participants.map((participant, idx) => (
                    <li key={idx}>{participant}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  )
}

export default SchedulesScreen
