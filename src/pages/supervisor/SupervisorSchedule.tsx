import React, { useState } from 'react'
import { useLanguage } from '../../context/LanguageContext'
import { useAuth } from '../../context/AuthContext'
import { cn, getActiveFiltersCount } from '../../lib/utils'
import { Card, CardContent, CardHeader } from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Divider from '../../components/ui/Divider'
import { SearchBar } from '../../components/ui/Filter'
import SimplePopover from '../../components/ui/SimplePopover'
import AdvancedFilter from '../../components/ui/AdvancedFilter'
import ConfirmDialog from '../../components/ui/ConfirmDialog'
import DataTable from '../../components/ui/DataTable'
import {
    Calendar,
    Clock,
    MapPin,
    Users,
    Plus,
    Edit,
    Trash2,
    Eye,
    Grid3X3,
    List,
    SlidersHorizontal
} from 'lucide-react'

interface Schedule {
    id: string
    title: string
    description: string
    type: 'meeting' | 'presentation' | 'review' | 'other'
    status: 'scheduled' | 'completed' | 'cancelled' | 'postponed'
    date: string
    startTime: string
    endTime: string
    location: string
    participants: string[]
    projectId?: string
    projectTitle?: string
    priority: 'low' | 'medium' | 'high'
    notes?: string
    createdAt: string
}

const SupervisorSchedule: React.FC = () => {
    const { t } = useLanguage()
    const { user } = useAuth()
    const [searchQuery, setSearchQuery] = useState('')
    const [statusFilter, setStatusFilter] = useState('all')
    const [typeFilter, setTypeFilter] = useState('all')
    const [priorityFilter, setPriorityFilter] = useState('all')
    const [sortBy, setSortBy] = useState('date')
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
    const [viewMode, setViewMode] = useState<'table' | 'grid'>('grid')
    const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false)
    const [scheduleIdToDelete, setScheduleIdToDelete] = useState<string | null>(null)

    // Mock data
    const [schedules] = useState<Schedule[]>([
        {
            id: '1',
            title: 'اجتماع متابعة مشروع المكتبة الذكية',
            description: 'اجتماع أسبوعي لمتابعة تقدم مشروع المكتبة الذكية مع فريق الطلاب',
            type: 'meeting',
            status: 'scheduled',
            date: '2024-02-15',
            startTime: '10:00',
            endTime: '11:30',
            location: 'قاعة الاجتماعات - مبنى الهندسة',
            participants: ['أحمد محمد علي', 'فاطمة حسن محمد', 'محمد خالد أحمد'],
            projectId: '1',
            projectTitle: 'تطبيق إدارة المكتبة الذكية',
            priority: 'high',
            notes: 'مراجعة التقدم والخطوات التالية',
            createdAt: '2024-02-01'
        },
        {
            id: '2',
            title: 'عرض تقديمي لمشروع التجارة الإلكترونية',
            description: 'عرض تقديمي للمرحلة الثانية من مشروع التجارة الإلكترونية',
            type: 'presentation',
            status: 'scheduled',
            date: '2024-02-20',
            startTime: '14:00',
            endTime: '15:30',
            location: 'قاعة العروض التقديمية',
            participants: ['سارة أحمد محمد', 'يوسف محمود حسن'],
            projectId: '2',
            projectTitle: 'تطبيق التجارة الإلكترونية',
            priority: 'medium',
            notes: 'تحضير العرض التقديمي والوثائق',
            createdAt: '2024-02-05'
        },
        {
            id: '3',
            title: 'مراجعة تقرير مشروع الذكاء الاصطناعي',
            description: 'مراجعة التقرير النهائي لمشروع الذكاء الاصطناعي',
            type: 'review',
            status: 'completed',
            date: '2024-02-10',
            startTime: '09:00',
            endTime: '10:00',
            location: 'مكتب المشرف',
            participants: ['علي حسن محمد', 'نورا سعد أحمد'],
            projectId: '3',
            projectTitle: 'نظام الذكاء الاصطناعي',
            priority: 'high',
            notes: 'تمت المراجعة بنجاح',
            createdAt: '2024-01-25'
        },
        {
            id: '4',
            title: 'اجتماع طارئ - مشكلة تقنية',
            description: 'اجتماع طارئ لحل مشكلة تقنية في مشروع إدارة المستشفيات',
            type: 'meeting',
            status: 'cancelled',
            date: '2024-02-12',
            startTime: '16:00',
            endTime: '17:00',
            location: 'مختبر الحاسوب الأول',
            participants: ['خالد محمد أحمد', 'مريم علي سعد'],
            projectId: '4',
            projectTitle: 'نظام إدارة المستشفيات',
            priority: 'high',
            notes: 'تم إلغاء الاجتماع - تم حل المشكلة',
            createdAt: '2024-02-08'
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
        { value: 'meeting', label: 'اجتماع' },
        { value: 'presentation', label: 'عرض تقديمي' },
        { value: 'review', label: 'مراجعة' },
        { value: 'other', label: 'أخرى' }
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
            case 'meeting': return 'اجتماع'
            case 'presentation': return 'عرض تقديمي'
            case 'review': return 'مراجعة'
            case 'other': return 'أخرى'
            default: return type
        }
    }

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'meeting': return 'bg-blue-100 text-blue-800'
            case 'presentation': return 'bg-purple-100 text-purple-800'
            case 'review': return 'bg-green-100 text-green-800'
            case 'other': return 'bg-gray-100 text-gray-800'
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
            schedule.participants.some(participant => participant.toLowerCase().includes(searchQuery.toLowerCase())) ||
            schedule.projectTitle?.toLowerCase().includes(searchQuery.toLowerCase())

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


    const handleViewSchedule = (schedule: Schedule) => {
        // Navigate to schedule details page
        console.log('View schedule:', schedule)
    }

    const handleEditSchedule = (schedule: Schedule) => {
        // Open edit schedule modal
        console.log('Edit schedule:', schedule)
    }

    const handleDeleteSchedule = (scheduleId: string) => {
        setScheduleIdToDelete(scheduleId)
        setConfirmDeleteOpen(true)
    }

    const confirmDelete = () => {
        if (scheduleIdToDelete) {
            console.log('Delete schedule:', scheduleIdToDelete)
        }
        setConfirmDeleteOpen(false)
        setScheduleIdToDelete(null)
    }

    const cancelDelete = () => {
        setConfirmDeleteOpen(false)
        setScheduleIdToDelete(null)
    }

    const handleAddSchedule = () => {
        // Open add schedule modal
        console.log('Add new schedule')
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
            key: 'projectTitle',
            label: 'المشروع',
            render: (schedule: Schedule) => (
                <span className="text-sm text-gray-600 line-clamp-1">{schedule.projectTitle || '-'}</span>
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
                            <Calendar className="w-6 h-6 text-gpms-dark" />
                            <div>
                                <h1 className="text-xl font-bold text-gray-900">جدولة الاجتماعات</h1>
                                <p className="text-gray-600 mt-1">إدارة جدولة الاجتماعات والعروض التقديمية</p>
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
                    <div className="mb-4">
                        <SearchBar
                            value={searchQuery}
                            onChange={setSearchQuery}
                            placeholder="البحث في المواعيد..."
                            className="w-full"
                        />
                    </div>
                </CardContent>
            </Card>

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
                                    <div className="flex items-center justify-between text-sm text-gray-600">
                                        <span>الأولوية:</span>
                                        <span className={cn('px-2 py-1 text-xs rounded-full', getPriorityColor(schedule.priority))}>
                                            {getPriorityText(schedule.priority)}
                                        </span>
                                    </div>
                                </div>

                                {/* Project Info */}
                                {schedule.projectTitle && (
                                    <div className="mb-4">
                                        <p className="text-sm font-medium text-gray-700 mb-2">المشروع:</p>
                                        <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                                            {schedule.projectTitle}
                                        </span>
                                    </div>
                                )}

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

                                {/* Notes */}
                                {schedule.notes && (
                                    <div className="mb-4">
                                        <p className="text-sm font-medium text-gray-700 mb-2">ملاحظات:</p>
                                        <p className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
                                            {schedule.notes}
                                        </p>
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
                            <Calendar size={32} className="text-gray-400" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد مواعيد</h3>
                        <p className="text-gray-600 mb-4">لم يتم العثور على مواعيد تطابق معايير البحث</p>
                        <Button
                            onClick={handleAddSchedule}
                            className="bg-gpms-dark text-white hover:bg-gpms-light"
                        >
                            <Plus className="w-4 h-4 mr-1 rtl:mr-0 rtl:ml-1" />
                            إضافة موعد جديد
                        </Button>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}

export default SupervisorSchedule
