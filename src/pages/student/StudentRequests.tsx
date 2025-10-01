import React, { useState } from 'react'
import { useLanguage } from '../../context/LanguageContext'
import { cn } from '../../lib/utils'
import { Card, CardContent, CardHeader } from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Divider from '../../components/ui/Divider'
import { SearchBar } from '../../components/ui/Filter'
import DataTable from '../../components/ui/DataTable'
import RequestFormModal from '../../components/forms/RequestFormModal'
import SimplePopover from '../../components/ui/SimplePopover'
import AdvancedFilter from '../../components/ui/AdvancedFilter'
import {
  Plus,
  Eye,
  Edit,
  Trash2,
  Send,
  Grid3X3,
  List,
  MessageSquare,
  SlidersHorizontal
} from 'lucide-react'

interface Request {
  id: string
  type: 'supervision' | 'meeting' | 'extension' | 'change_supervisor' | 'change_group' | 'change_project' | 'other'
  title: string
  description: string
  status: 'pending' | 'approved' | 'rejected' | 'in_progress'
  priority: 'low' | 'medium' | 'high'
  student: string
  supervisor?: string
  requestedDate: string
  createdAt: string
  updatedAt: string
  reason?: string
  response?: string
  reviewer?: string
}

const StudentRequests: React.FC = () => {
  const { t } = useLanguage()
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [sortBy, setSortBy] = useState('updatedAt')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingRequest, setEditingRequest] = useState<Request | null>(null)

  // Mock data
  const [requests, setRequests] = useState<Request[]>([
    {
      id: '1',
      type: 'supervision',
      title: 'طلب إشراف على مشروع',
      description: 'طلب إشراف من د. أحمد محمد على مشروع تطبيق المكتبة',
      status: 'approved',
      priority: 'high',
      student: 'أحمد محمد علي',
      supervisor: 'د. أحمد محمد',
      requestedDate: '2024-02-01',
      createdAt: '2024-01-10',
      updatedAt: '2024-01-12',
      reason: 'المشروع يتطلب خبرة في مجال الذكاء الاصطناعي',
      response: 'تم قبول طلب الإشراف. سنبدأ الاجتماعات الأسبوعية من الأسبوع القادم.',
      reviewer: 'د. أحمد محمد'
    },
    {
      id: '2',
      type: 'change_supervisor',
      title: 'طلب تغيير المشرف',
      description: 'طلب تغيير المشرف بسبب تضارب في الجدول الزمني',
      status: 'pending',
      priority: 'medium',
      student: 'فاطمة علي محمد',
      supervisor: 'د. سارة أحمد',
      requestedDate: '2024-01-25',
      createdAt: '2024-01-20',
      updatedAt: '2024-01-20',
      reason: 'تضارب في الجدول الزمني مع المشرف الحالي'
    },
    {
      id: '3',
      type: 'extension',
      title: 'طلب تمديد موعد التسليم',
      description: 'طلب تمديد موعد تسليم التقرير النهائي لمدة أسبوع',
      status: 'rejected',
      priority: 'low',
      student: 'محمد خالد محمود',
      supervisor: 'د. خالد محمود',
      requestedDate: '2024-01-30',
      createdAt: '2024-01-15',
      updatedAt: '2024-01-18',
      reason: 'حاجة لمزيد من الوقت لإكمال التحليل',
      response: 'لا يمكن تمديد الموعد بسبب قرب موعد المناقشة.',
      reviewer: 'د. خالد محمود'
    },
    {
      id: '4',
      type: 'meeting',
      title: 'طلب اجتماع مع اللجنة',
      description: 'طلب اجتماع مع لجنة المشاريع لمناقشة التقدم',
      status: 'in_progress',
      priority: 'medium',
      student: 'سارة أحمد حسن',
      supervisor: 'د. فاطمة علي',
      requestedDate: '2024-01-28',
      createdAt: '2024-01-22',
      updatedAt: '2024-01-23',
      reason: 'مناقشة التقدم المحرز في المرحلة الأولى',
      response: 'تم تحديد موعد الاجتماع ليوم الخميس القادم.',
      reviewer: 'د. فاطمة علي'
    },
    {
      id: '5',
      type: 'change_group',
      title: 'طلب تغيير المجموعة',
      description: 'طلب تغيير المجموعة بسبب عدم التوافق مع الأعضاء الحاليين',
      status: 'pending',
      priority: 'high',
      student: 'محمد أحمد حسن',
      requestedDate: '2024-01-30',
      createdAt: '2024-01-25',
      updatedAt: '2024-01-25',
      reason: 'عدم التوافق في العمل مع المجموعة الحالية'
    },
    {
      id: '6',
      type: 'change_project',
      title: 'طلب تغيير المشروع',
      description: 'طلب تغيير موضوع المشروع إلى موضوع أكثر تحدياً',
      status: 'pending',
      priority: 'medium',
      student: 'نورا سعد محمد',
      requestedDate: '2024-02-01',
      createdAt: '2024-01-26',
      updatedAt: '2024-01-26',
      reason: 'الرغبة في العمل على مشروع أكثر تحدياً وتطويراً'
    }
  ])

  const statusOptions = [
    { value: 'all', label: 'جميع الحالات' },
    { value: 'pending', label: 'قيد المراجعة' },
    { value: 'approved', label: 'مقبول' },
    { value: 'rejected', label: 'مرفوض' },
    { value: 'in_progress', label: 'قيد التنفيذ' }
  ]

  const typeOptions = [
    { value: 'all', label: 'جميع الأنواع' },
    { value: 'supervision', label: 'طلب إشراف' },
    { value: 'meeting', label: 'طلب اجتماع' },
    { value: 'extension', label: 'تمديد الموعد' },
    { value: 'change_supervisor', label: 'تغيير المشرف' },
    { value: 'change_group', label: 'تغيير المجموعة' },
    { value: 'change_project', label: 'تغيير المشروع' },
    { value: 'other', label: 'طلب آخر' }
  ]

  const priorityOptions = [
    { value: 'all', label: 'جميع الأولويات' },
    { value: 'low', label: 'منخفض' },
    { value: 'medium', label: 'متوسط' },
    { value: 'high', label: 'عالي' }
  ]

  const sortOptions = [
    { value: 'createdAt', label: 'تاريخ الإرسال' },
    { value: 'title', label: 'العنوان' },
    { value: 'status', label: 'الحالة' },
    { value: 'type', label: 'نوع الطلب' },
    { value: 'priority', label: 'الأولوية' }
  ]


  const getStatusText = (status: string) => {
    switch (status) {
      case 'approved': return 'مقبول'
      case 'pending': return 'قيد المراجعة'
      case 'rejected': return 'مرفوض'
      case 'in_progress': return 'قيد التنفيذ'
      default: return status
    }
  }

  const getTypeText = (type: string) => {
    switch (type) {
      case 'supervision': return 'طلب إشراف'
      case 'meeting': return 'طلب اجتماع'
      case 'extension': return 'تمديد الموعد'
      case 'change_supervisor': return 'تغيير المشرف'
      case 'change_group': return 'تغيير المجموعة'
      case 'change_project': return 'تغيير المشروع'
      case 'other': return 'طلب آخر'
      default: return type
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

  const filteredRequests = requests
    .filter(request => {
      const matchesSearch = !searchQuery ||
        request.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        request.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        request.reason?.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesStatus = statusFilter === 'all' || request.status === statusFilter
      const matchesType = typeFilter === 'all' || request.type === typeFilter
      const matchesPriority = priorityFilter === 'all' || request.priority === priorityFilter

      return matchesSearch && matchesStatus && matchesType && matchesPriority
    })
    .sort((a, b) => {
      let comparison = 0

      switch (sortBy) {
        case 'title':
          comparison = a.title.localeCompare(b.title, 'ar')
          break
        case 'createdAt':
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          break
        case 'updatedAt':
          comparison = new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime()
          break
        case 'requestedDate':
          comparison = new Date(a.requestedDate).getTime() - new Date(b.requestedDate).getTime()
          break
        default:
          comparison = 0
      }

      return sortOrder === 'asc' ? comparison : -comparison
    })

  const handleAddRequest = () => {
    setEditingRequest(null)
    setIsModalOpen(true)
  }

  const handleEditRequest = (request: Request) => {
    setEditingRequest(request)
    setIsModalOpen(true)
  }

  const handleDeleteRequest = (requestId: string) => {
    if (window.confirm('هل أنت متأكد من حذف هذا الطلب؟')) {
      setRequests(prev => prev.filter(r => r.id !== requestId))
    }
  }

  const handleViewRequest = (request: Request) => {
    console.log('View request:', request)
    // Implement view functionality
  }

  const handleModalSubmit = (data: any) => {
    if (editingRequest) {
      // Update existing request
      setRequests(prev => prev.map(r =>
        r.id === editingRequest.id
          ? { ...r, ...data, updatedAt: new Date().toISOString().split('T')[0] }
          : r
      ))
    } else {
      // Add new request
      const newRequest: Request = {
        id: Math.random().toString(36).substring(7),
        ...data,
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0],
        status: 'pending'
      }
      setRequests(prev => [newRequest, ...prev])
    }
    setIsModalOpen(false)
    setEditingRequest(null)
  }

  const handleFilterClear = () => {
    setStatusFilter('all')
    setTypeFilter('all')
    setPriorityFilter('all')
    setSortBy('createdAt')
    setSortOrder('desc')
  }

  const getActiveFiltersCount = () => {
    let count = 0
    if (statusFilter !== 'all') count++
    if (typeFilter !== 'all') count++
    if (priorityFilter !== 'all') count++
    if (sortBy !== 'createdAt') count++
    if (sortOrder !== 'desc') count++
    return count
  }

  const columns = [
    {
      key: 'title',
      label: 'عنوان الطلب',
      sortable: true,
      render: (request: Request) => (
        <div>
          <h3 className="font-medium text-gray-900">{request.title}</h3>
          <p className="text-sm text-gray-600 line-clamp-1">{request.description}</p>
        </div>
      )
    },
    {
      key: 'type',
      label: 'النوع',
      render: (request: Request) => (
        <span className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-full">
          {getTypeText(request.type)}
        </span>
      )
    },
    {
      key: 'status',
      label: 'الحالة',
      render: (request: Request) => (
        <span className={cn(
          'px-2 py-1 text-xs rounded-full',
          request.status === 'approved' ? 'bg-green-100 text-green-800' :
            request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
              request.status === 'rejected' ? 'bg-red-100 text-red-800' :
                request.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                  'bg-gray-100 text-gray-800'
        )}>
          {getStatusText(request.status)}
        </span>
      )
    },
    {
      key: 'priority',
      label: 'الأولوية',
      render: (request: Request) => (
        <span className={cn('px-2 py-1 rounded-full text-xs font-medium', getPriorityColor(request.priority))}>
          {getPriorityText(request.priority)}
        </span>
      )
    },
    {
      key: 'requestedDate',
      label: 'التاريخ المطلوب',
      sortable: true,
      render: (request: Request) => (
        <span className="text-sm text-gray-600">
          {new Date(request.requestedDate).toLocaleDateString('ar')}
        </span>
      )
    },
    {
      key: 'updatedAt',
      label: 'آخر تحديث',
      sortable: true,
      render: (request: Request) => (
        <span className="text-sm text-gray-600">
          {new Date(request.updatedAt).toLocaleDateString('ar')}
        </span>
      )
    },
    {
      key: 'actions',
      label: 'الإجراءات',
      render: (request: Request) => (
        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          <button
            onClick={() => handleViewRequest(request)}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            title="عرض"
          >
            <Eye size={16} />
          </button>
          {request.status === 'pending' && (
            <button
              onClick={() => handleEditRequest(request)}
              className="text-blue-600 hover:text-blue-700 transition-colors"
              title="تعديل"
            >
              <Edit size={16} />
            </button>
          )}
          <button
            onClick={() => handleDeleteRequest(request.id)}
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
    <div className="space-y-6">
      {/* Header */}
      <Card className="hover-lift">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 rtl:space-x-reverse">
              {/* <MessageSquare className="w-6 h-6 text-gpms-dark" /> */}
              <div>
                <h1 className="text-xl font-bold text-gray-900">{t('navigation.requestsList')}</h1>
                {/* <p className="text-gray-600 mt-1">إدارة الطلبات والاستفسارات</p> */}
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
                    getActiveFiltersCount() > 0 && 'bg-gpms-light/10 border-gpms-light text-gpms-dark'
                  )}
                >
                  <SlidersHorizontal size={16} className="mr-1 rtl:mr-0 rtl:ml-1" />
                  {t('common.filter')}
                  {getActiveFiltersCount() > 0 && (
                    <span className="absolute -top-1 -right-1 rtl:right-auto rtl:-left-1 bg-gpms-dark text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {getActiveFiltersCount()}
                    </span>
                  )}
                </Button>
              </SimplePopover>

              <Button
                onClick={handleAddRequest}
                className="bg-gpms-dark text-white hover:bg-gpms-light"
              >
                <Plus className="w-4 h-4 mr-1 rtl:mr-0 rtl:ml-1" />
                طلب جديد
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
              placeholder="البحث في الطلبات..."
              className="w-full"
            />
          </div> */}

          {/* Requests Display */}
          {viewMode === 'table' ? (
            <Card className="hover-lift">
              <CardContent className="p-0">
                <DataTable
                  data={filteredRequests}
                  columns={columns}
                  emptyMessage="لا توجد طلبات"
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
              {filteredRequests.map((request) => (
                <Card key={request.id} className="hover-lift">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center">
                        {/* <Send size={20} className="text-gray-400 ml-2 rtl:ml-0 rtl:mr-2" /> */}
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900">{request.title}</h3>
                          <p className="text-sm text-gray-600 line-clamp-2 mt-1">{request.description}</p>
                        </div>
                      </div>
                      <span className={cn(
                        'px-2 py-1 text-xs rounded-full',
                        request.status === 'approved' ? 'bg-green-100 text-green-800' :
                          request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            request.status === 'rejected' ? 'bg-red-100 text-red-800' :
                              request.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                                'bg-gray-100 text-gray-800'
                      )}>
                        {getStatusText(request.status)}
                      </span>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <span>النوع:</span>
                        <span className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-full">
                          {getTypeText(request.type)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <span>الأولوية:</span>
                        <span className={cn('px-2 py-1 text-xs rounded-full', getPriorityColor(request.priority))}>
                          {getPriorityText(request.priority)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <span>التاريخ المطلوب:</span>
                        <span>{new Date(request.requestedDate).toLocaleDateString('ar')}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <span>آخر تحديث:</span>
                        <span>{new Date(request.updatedAt).toLocaleDateString('ar')}</span>
                      </div>
                      {request.supervisor && (
                        <div className="flex items-center justify-between text-sm text-gray-600">
                          <span>المشرف:</span>
                          <span>{request.supervisor}</span>
                        </div>
                      )}
                    </div>

                    {request.reason && (
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-700 mb-1">السبب:</h4>
                        <p className="text-sm text-gray-600 line-clamp-2">{request.reason}</p>
                      </div>
                    )}

                    {request.response && (
                      <div className={`rounded-lg p-3 mb-4 ${request.status === 'approved' ? 'bg-green-50 border border-green-200' :
                          request.status === 'rejected' ? 'bg-red-50 border border-red-200' :
                            'bg-blue-50 border border-blue-200'
                        }`}>
                        <h4 className="text-sm font-medium text-gray-700 mb-1">الرد:</h4>
                        <p className="text-sm text-gray-600 line-clamp-2">{request.response}</p>
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                      <div className="flex space-x-2 rtl:space-x-reverse">
                        <button
                          onClick={() => handleViewRequest(request)}
                          className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                          title="عرض"
                        >
                          <Eye size={16} />
                        </button>
                        {request.status === 'pending' && (
                          <button
                            onClick={() => handleEditRequest(request)}
                            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                            title="تعديل"
                          >
                            <Edit size={16} />
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteRequest(request.id)}
                          className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                          title="حذف"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <button className="text-gpms-dark hover:text-gpms-light text-sm font-medium transition-colors">
                        عرض التفاصيل
                      </button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Empty State */}
          {filteredRequests.length === 0 && (
            <Card className="hover-lift">
              <CardContent className="text-center py-12">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Send size={32} className="text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد طلبات</h3>
                <p className="text-gray-600 mb-4">لم يتم العثور على طلبات تطابق معايير البحث</p>
                <Button
                  onClick={handleAddRequest}
                  className="bg-gpms-dark text-white hover:bg-gpms-light"
                >
                  إضافة طلب جديد
                </Button>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>

      {/* Modal */}
      <RequestFormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setEditingRequest(null)
        }}
        onSubmit={handleModalSubmit}
        editData={editingRequest}
      />
    </div>
  )
}

export default StudentRequests
