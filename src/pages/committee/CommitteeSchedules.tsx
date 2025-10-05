import React, { useState } from 'react'
import { useLanguage } from '../../context/LanguageContext'
import { cn, getActiveFiltersCount } from '../../lib/utils'
import { Card, CardContent, CardHeader } from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Divider from '../../components/ui/Divider'
import { SearchBar } from '../../components/ui/Filter'
import SimplePopover from '../../components/ui/SimplePopover'
import AdvancedFilter from '../../components/ui/AdvancedFilter'
import DataTable from '../../components/ui/DataTable'
import {
  Eye,
  Edit,
  Trash2,
  Plus,
  Calendar,
  Clock,
  MapPin,
  Users,
  Grid3X3,
  List,
  CalendarDays,
  SlidersHorizontal
} from 'lucide-react'

interface Schedule {
  id: string
  title: string
  description: string
  type: 'presentation' | 'defense' | 'meeting' | 'workshop' | 'exam'
  status: 'scheduled' | 'completed' | 'cancelled' | 'postponed'
  date: string
  startTime: string
  endTime: string
  location: string
  participants: string[]
  projects?: string[]
  organizer: string
  priority: 'low' | 'medium' | 'high'
  tags: string[]
}

const CommitteeSchedules: React.FC = () => {
  const { t } = useLanguage()
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [sortBy, setSortBy] = useState('date')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('grid')

  // Mock data
  const [schedules] = useState<Schedule[]>([
    {
      id: '1',
      title: 'مناقشة مشاريع التخرج - الفصل الأول',
      description: 'مناقشة مشاريع تخرج طلاب علوم الحاسوب للفصل الأول',
      type: 'defense',
      status: 'scheduled',
      date: '2024-02-15',
      startTime: '09:00',
      endTime: '12:00',
      location: 'قاعة المؤتمرات الرئيسية',
      participants: ['د. أحمد محمد', 'د. سارة أحمد', 'د. خالد محمود'],
      projects: ['نظام إدارة المكتبة', 'تطبيق التجارة الإلكترونية'],
      organizer: 'لجنة المشاريع',
      priority: 'high',
      tags: ['مناقشة', 'مشاريع تخرج', 'علوم الحاسوب']
    },
    {
      id: '2',
      title: 'ورشة عمل: أساسيات البحث العلمي',
      description: 'ورشة عمل لتدريب الطلاب على أساسيات البحث العلمي وكتابة المقترحات',
      type: 'workshop',
      status: 'scheduled',
      date: '2024-02-10',
      startTime: '10:00',
      endTime: '14:00',
      location: 'مختبر الحاسوب الأول',
      participants: ['جميع طلاب المستوى الرابع'],
      organizer: 'د. فاطمة علي',
      priority: 'medium',
      tags: ['ورشة عمل', 'بحث علمي', 'تدريب']
    },
    {
      id: '3',
      title: 'اجتماع لجنة المشاريع الشهري',
      description: 'الاجتماع الشهري للجنة المشاريع لمراجعة التقدم ومناقشة القضايا المعلقة',
      type: 'meeting',
      status: 'completed',
      date: '2024-01-30',
      startTime: '14:00',
      endTime: '16:00',
      location: 'قاعة الاجتماعات - الدور الثاني',
      participants: ['د. أحمد محمد', 'د. سارة أحمد', 'د. خالد محمود', 'د. مريم سعد'],
      organizer: 'رئيس اللجنة',
      priority: 'high',
      tags: ['اجتماع', 'لجنة', 'مراجعة شهرية']
    },
    {
      id: '4',
      title: 'عرض المقترحات الجديدة',
      description: 'عرض وتقييم مقترحات المشاريع الجديدة المقدمة من الطلاب',
      type: 'presentation',
      status: 'postponed',
      date: '2024-02-08',
      startTime: '11:00',
      endTime: '13:00',
      location: 'قاعة العروض التقديمية',
      participants: ['د. سعد محمود', 'د. نورا حسن'],
      organizer: 'لجنة التقييم',
      priority: 'medium',
      tags: ['عرض', 'مقترحات', 'تقييم']
    },
    {
      id: '5',
      title: 'امتحان شفوي - هندسة البرمجيات',
      description: 'امتحان شفوي لمقرر هندسة البرمجيات للطلاب المتأخرين',
      type: 'exam',
      status: 'scheduled',
      date: '2024-02-12',
      startTime: '15:00',
      endTime: '17:00',
      location: 'مكتب أعضاء هيئة التدريس',
      participants: ['الطلاب المتأخرين في المقرر'],
      organizer: 'د. علي حسن',
      priority: 'low',
      tags: ['امتحان', 'شفوي', 'هندسة البرمجيات']
    }
  ])

  const statusOptions = [
    { value: 'all', label: 'جميع الحالات' },
    { value: 'scheduled', label: 'مُجدول' },
    { value: 'completed', label: 'مكتمل' },
    { value: 'cancelled', label: 'ملغي' },
    { value: 'postponed', label: 'مؤجل' }
  ]

  const typeOptions = [
    { value: 'all', label: 'جميع الأنواع' },
    { value: 'presentation', label: 'عرض تقديمي' },
    { value: 'defense', label: 'مناقشة' },
    { value: 'meeting', label: 'اجتماع' },
    { value: 'workshop', label: 'ورشة عمل' },
    { value: 'exam', label: 'امتحان' }
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
    { value: 'type', label: 'النوع' },
    { value: 'status', label: 'الحالة' },
    { value: 'priority', label: 'الأولوية' }
  ]

  const getStatusText = (status: string) => {
    switch (status) {
      case 'scheduled': return 'مُجدول'
      case 'completed': return 'مكتمل'
      case 'cancelled': return 'ملغي'
      case 'postponed': return 'مؤجل'
      default: return status
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800'
      case 'completed': return 'bg-green-100 text-green-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      case 'postponed': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeText = (type: string) => {
    switch (type) {
      case 'presentation': return 'عرض تقديمي'
      case 'defense': return 'مناقشة'
      case 'meeting': return 'اجتماع'
      case 'workshop': return 'ورشة عمل'
      case 'exam': return 'امتحان'
      default: return type
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'presentation': return 'bg-purple-100 text-purple-800'
      case 'defense': return 'bg-red-100 text-red-800'
      case 'meeting': return 'bg-blue-100 text-blue-800'
      case 'workshop': return 'bg-green-100 text-green-800'
      case 'exam': return 'bg-orange-100 text-orange-800'
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

  const filteredSchedules = schedules.filter(schedule => {
    const matchesSearch = !searchQuery ||
      schedule.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      schedule.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      schedule.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      schedule.organizer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      schedule.participants.some(participant => participant.toLowerCase().includes(searchQuery.toLowerCase())) ||
      schedule.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesStatus = statusFilter === 'all' || schedule.status === statusFilter
    const matchesType = typeFilter === 'all' || schedule.type === typeFilter
    const matchesPriority = priorityFilter === 'all' || schedule.priority === priorityFilter

    return matchesSearch && matchesStatus && matchesType && matchesPriority
  })

  const handleFilterClear = () => {
    setStatusFilter('all')
    setTypeFilter('all')
    setPriorityFilter('all')
    setSortBy('date')
    setSortOrder('asc')
  }

  const handleAddSchedule = () => {
    // Open add schedule modal
    const modal = document.createElement('div')
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'
    modal.innerHTML = `
      <div class="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
        <h3 class="text-lg font-semibold mb-4">إضافة موعد جديد</h3>
        <form id="addScheduleForm" class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">عنوان الموعد</label>
              <input type="text" name="title" required 
                     class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">نوع الموعد</label>
              <select name="type" required 
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">اختر النوع</option>
                <option value="presentation">عرض تقديمي</option>
                <option value="defense">مناقشة</option>
                <option value="meeting">اجتماع</option>
                <option value="workshop">ورشة عمل</option>
                <option value="exam">امتحان</option>
              </select>
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">الوصف</label>
            <textarea name="description" rows="3" 
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">التاريخ</label>
              <input type="date" name="date" required 
                     class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">الوقت</label>
              <input type="time" name="time" required 
                     class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">المكان</label>
            <input type="text" name="location" required 
                   class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">الأولوية</label>
            <select name="priority" required 
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">اختر الأولوية</option>
              <option value="low">منخفض</option>
              <option value="medium">متوسط</option>
              <option value="high">عالي</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">ملاحظات</label>
            <textarea name="notes" rows="2" 
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
          </div>
        </form>
        <div class="mt-6 flex justify-end space-x-3 rtl:space-x-reverse">
          <button onclick="this.closest('.fixed').remove()" 
                  class="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600">
            إلغاء
          </button>
          <button onclick="window.submitSchedule(); this.closest('.fixed').remove()" 
                  class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            إضافة الموعد
          </button>
        </div>
      </div>
    `
    document.body.appendChild(modal)

    // Add submit function to window
    window.submitSchedule = () => {
      const form = document.getElementById('addScheduleForm') as HTMLFormElement
      const formData = new FormData(form)
      const scheduleData = {
        title: formData.get('title'),
        type: formData.get('type'),
        description: formData.get('description'),
        date: formData.get('date'),
        time: formData.get('time'),
        location: formData.get('location'),
        priority: formData.get('priority'),
        notes: formData.get('notes')
      }

      // Simulate adding schedule
      console.log('Adding new schedule:', scheduleData)
      alert('تم إضافة الموعد بنجاح!')
    }
  }

  const handleViewSchedule = (schedule: Schedule) => {
    // Open schedule details modal
    const modal = document.createElement('div')
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'
    modal.innerHTML = `
      <div class="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
        <h3 class="text-lg font-semibold mb-4">تفاصيل الموعد</h3>
        <div class="space-y-4">
          <div class="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span class="font-medium">عنوان الموعد:</span>
              <p class="text-gray-600">${schedule.title}</p>
            </div>
            <div>
              <span class="font-medium">النوع:</span>
              <p class="text-gray-600">${getTypeText(schedule.type)}</p>
            </div>
            <div>
              <span class="font-medium">التاريخ:</span>
              <p class="text-gray-600">${new Date(schedule.date).toLocaleDateString('ar')}</p>
            </div>
            <div>
              <span class="font-medium">الوقت:</span>
              <p class="text-gray-600">${schedule.startTime} - ${schedule.endTime}</p>
            </div>
            <div>
              <span class="font-medium">المكان:</span>
              <p class="text-gray-600">${schedule.location}</p>
            </div>
            <div>
              <span class="font-medium">الحالة:</span>
              <p class="text-gray-600">${getStatusText(schedule.status)}</p>
            </div>
            <div>
              <span class="font-medium">الأولوية:</span>
              <p class="text-gray-600">${getPriorityText(schedule.priority)}</p>
            </div>
            <div>
              <span class="font-medium">المشاركون:</span>
              <p class="text-gray-600">${schedule.participants.length} مشارك</p>
            </div>
          </div>
          <div>
            <span class="font-medium">الوصف:</span>
            <p class="text-gray-600 mt-1">${schedule.description}</p>
          </div>
          ${schedule.notes ? `
            <div>
              <span class="font-medium">ملاحظات:</span>
              <p class="text-gray-600 mt-1">${schedule.notes}</p>
            </div>
          ` : ''}
        </div>
        <div class="mt-6 flex justify-end">
          <button onclick="this.closest('.fixed').remove()" 
                  class="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600">
            إغلاق
          </button>
        </div>
      </div>
    `
    document.body.appendChild(modal)
  }

  const handleEditSchedule = (schedule: Schedule) => {
    // Open edit schedule modal (similar to add but with pre-filled data)
    console.log('Edit schedule:', schedule)
    alert('وظيفة التعديل قيد التطوير')
  }

  const handleDeleteSchedule = (scheduleId: string) => {
    if (window.confirm('هل أنت متأكد من حذف هذا الموعد؟')) {
      console.log('Delete schedule:', scheduleId)
      alert('تم حذف الموعد بنجاح!')
    }
  }

  const columns = [
    {
      key: 'title',
      label: 'عنوان الموعد',
      sortable: true,
      render: (schedule: Schedule) => (
        <div>
          <h3 className="font-medium text-gray-900">{schedule.title}</h3>
          <p className="text-sm text-gray-600 line-clamp-1">{schedule.description}</p>
        </div>
      )
    },
    {
      key: 'type',
      label: 'النوع',
      render: (schedule: Schedule) => (
        <span className={cn('px-2 py-1 text-xs rounded-full', getTypeColor(schedule.type))}>
          {getTypeText(schedule.type)}
        </span>
      )
    },
    {
      key: 'status',
      label: 'الحالة',
      render: (schedule: Schedule) => (
        <span className={cn('px-2 py-1 text-xs rounded-full', getStatusColor(schedule.status))}>
          {getStatusText(schedule.status)}
        </span>
      )
    },
    {
      key: 'date',
      label: 'التاريخ',
      sortable: true,
      render: (schedule: Schedule) => (
        <div>
          <span className="text-sm text-gray-600">
            {new Date(schedule.date).toLocaleDateString('ar')}
          </span>
          <div className="text-xs text-gray-500">
            {schedule.startTime} - {schedule.endTime}
          </div>
        </div>
      )
    },
    {
      key: 'location',
      label: 'المكان',
      render: (schedule: Schedule) => (
        <span className="text-sm text-gray-600 line-clamp-1">{schedule.location}</span>
      )
    },
    {
      key: 'priority',
      label: 'الأولوية',
      sortable: true,
      render: (schedule: Schedule) => (
        <span className={cn('px-2 py-1 text-xs rounded-full', getPriorityColor(schedule.priority))}>
          {getPriorityText(schedule.priority)}
        </span>
      )
    },
    {
      key: 'participants',
      label: 'المشاركون',
      render: (schedule: Schedule) => (
        <span className="text-sm text-gray-600">{schedule.participants.length} مشارك</span>
      )
    },
    {
      key: 'actions',
      label: 'الإجراءات',
      render: (schedule: Schedule) => (
        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          <button
            onClick={() => handleViewSchedule(schedule)}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            title="عرض"
          >
            <Eye size={16} />
          </button>
          <button
            onClick={() => handleEditSchedule(schedule)}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            title="تعديل"
          >
            <Edit size={16} />
          </button>
          <button
            onClick={() => handleDeleteSchedule(schedule.id)}
            className="p-2 text-gray-400 hover:text-red-600 transition-colors"
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
              {/* <CalendarDays className="w-6 h-6 text-gpms-dark" /> */}
              <div>
                <h1 className="text-xl font-bold text-gray-900">إدارة الجداول</h1>
                {/* <p className="text-gray-600 mt-1">إدارة وإعلان الجداول الزمنية والمواعيد</p> */}
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
                    typeOptions={typeOptions}
                    sortOptions={sortOptions}
                    statusFilter={statusFilter}
                    priorityFilter={priorityFilter}
                    typeFilter={typeFilter}
                    sortBy={sortBy}
                    sortOrder={sortOrder}
                    onStatusChange={setStatusFilter}
                    onPriorityChange={setPriorityFilter}
                    onTypeChange={setTypeFilter}
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

              <Button
                onClick={handleAddSchedule}
                className="bg-gpms-dark text-white hover:bg-gpms-light"
              >
                <Plus className="w-4 h-4 mr-1 rtl:mr-0 rtl:ml-1" />
                إضافة موعد
              </Button>
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
              placeholder="البحث في الجداول..."
              className="w-full"
            />
          </div> */}

          {/* Schedules Display */}
          {viewMode === 'table' ? (
            <Card className="hover-lift">
              <CardContent className="p-0">
                <DataTable
                  data={filteredSchedules}
                  columns={columns}
                  emptyMessage="لا توجد مواعيد"
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
              {filteredSchedules.map((schedule) => (
                <Card key={schedule.id} className="hover-lift">
                  <CardContent className="p-6">
                    {/* Schedule Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-md font-semibold text-gray-900 mb-2">{schedule.title}</h3>
                        <p className="text-sm text-gray-600 line-clamp-2">{schedule.description}</p>
                      </div>
                      <div className="flex flex-col space-y-1">
                        <span className={cn('px-2 py-1 text-xs rounded-full', getStatusColor(schedule.status))}>
                          {getStatusText(schedule.status)}
                        </span>
                        <span className={cn('px-2 py-1 text-xs rounded-full', getTypeColor(schedule.type))}>
                          {getTypeText(schedule.type)}
                        </span>
                      </div>
                    </div>

                    {/* Schedule Info */}
                    <div className="space-y-3 mb-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar size={16} className="ml-2 rtl:ml-0 rtl:mr-2" />
                        <span>{new Date(schedule.date).toLocaleDateString('ar')}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Clock size={16} className="ml-2 rtl:ml-0 rtl:mr-2" />
                        <span>{schedule.startTime} - {schedule.endTime}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin size={16} className="ml-2 rtl:ml-0 rtl:mr-2" />
                        <span>{schedule.location}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Users size={16} className="ml-2 rtl:ml-0 rtl:mr-2" />
                        <span>{schedule.organizer}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <span>الأولوية:</span>
                        <span className={cn('px-2 py-1 text-xs rounded-full', getPriorityColor(schedule.priority))}>
                          {getPriorityText(schedule.priority)}
                        </span>
                      </div>
                    </div>

                    {/* Participants */}
                    <div className="mb-4">
                      <p className="text-sm font-medium text-gray-700 mb-2">المشاركون:</p>
                      <div className="flex flex-wrap gap-1">
                        {schedule.participants.slice(0, 3).map((participant, index) => (
                          <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                            {participant}
                          </span>
                        ))}
                        {schedule.participants.length > 3 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                            +{schedule.participants.length - 3} أخرى
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Projects if any */}
                    {schedule.projects && schedule.projects.length > 0 && (
                      <div className="mb-4">
                        <p className="text-sm font-medium text-gray-700 mb-2">المشاريع:</p>
                        <div className="flex flex-wrap gap-1">
                          {schedule.projects.map((project, index) => (
                            <span key={index} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                              {project}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Tags */}
                    {schedule.tags.length > 0 && (
                      <div className="mb-4">
                        <div className="flex flex-wrap gap-1">
                          {schedule.tags.map((tag, index) => (
                            <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                      <div className="flex space-x-2 rtl:space-x-reverse">
                        <button
                          onClick={() => handleViewSchedule(schedule)}
                          className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                          title="عرض"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => handleEditSchedule(schedule)}
                          className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                          title="تعديل"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteSchedule(schedule.id)}
                          className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                          title="حذف"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <button
                        onClick={() => handleViewSchedule(schedule)}
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
          {filteredSchedules.length === 0 && (
            <Card className="hover-lift">
              <CardContent className="text-center py-12">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CalendarDays size={32} className="text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد مواعيد</h3>
                <p className="text-gray-600">لم يتم العثور على مواعيد تطابق معايير البحث</p>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default CommitteeSchedules