import React, { useState } from 'react'
import { useLanguage } from '../../context/LanguageContext'
import { cn, getActiveFiltersCount } from '../../lib/utils'
import { Card, CardContent, CardHeader } from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Divider from '../../components/ui/Divider'
import { SearchBar } from '../../components/ui/Filter'
import DataTable from '../../components/ui/DataTable'
import SimplePopover from '../../components/ui/SimplePopover'
import AdvancedFilter from '../../components/ui/AdvancedFilter'
import Modal from '../../components/ui/Modal'
import ConfirmDialog from '../../components/ui/ConfirmDialog'
import {
  Eye,
  CheckCircle,
  XCircle,
  User,
  Calendar,
  MessageSquare,
  Send,
  Grid3X3,
  List,
  SlidersHorizontal
} from 'lucide-react'

interface Request {
  id: string
  student: string
  studentId: string
  project: string
  type: 'supervision_request' | 'meeting_request' | 'extension' | 'change' | 'other'
  description: string
  submittedDate: string
  status: 'pending' | 'approved' | 'rejected' | 'in_progress'
  priority: 'low' | 'medium' | 'high'
  attachments: string[]
}

const SupervisorRequests: React.FC = () => {
  const { t } = useLanguage()
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [sortBy, setSortBy] = useState('submittedDate')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('grid')
  const [rejectOpen, setRejectOpen] = useState(false)
  const [rejectRequestId, setRejectRequestId] = useState<string | null>(null)
  const [rejectReason, setRejectReason] = useState('')
  const [allowReapply, setAllowReapply] = useState(true)
  const [viewingRequest, setViewingRequest] = useState<Request | null>(null)
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false)
  const [requestToDelete, setRequestToDelete] = useState<Request | null>(null)

  // Mock data
  const [requests, setRequests] = useState<Request[]>([
    {
      id: '1',
      student: 'أحمد محمد علي',
      studentId: '2021001234',
      project: 'تطبيق إدارة المكتبة الذكية',
      type: 'supervision_request',
      description: 'طلب إشراف على مشروع تطبيق إدارة المكتبة باستخدام تقنيات حديثة',
      submittedDate: '2024-01-22',
      status: 'pending',
      priority: 'high',
      attachments: ['proposal.pdf', 'cv.pdf']
    },
    {
      id: '2',
      student: 'فاطمة حسن محمد',
      studentId: '2021001235',
      project: 'نظام إدارة المستودعات',
      type: 'supervision_request',
      description: 'طلب إشراف على مشروع نظام إدارة المستودعات والمخزون',
      submittedDate: '2024-01-21',
      status: 'approved',
      priority: 'medium',
      attachments: ['proposal.docx']
    },
    {
      id: '3',
      student: 'محمد خالد أحمد',
      studentId: '2021001236',
      project: 'منصة التعليم الإلكتروني',
      type: 'meeting_request',
      description: 'طلب اجتماع لمناقشة التقدم في المشروع',
      submittedDate: '2024-01-20',
      status: 'pending',
      priority: 'medium',
      attachments: []
    },
    {
      id: '4',
      student: 'سارة أحمد محمود',
      studentId: '2021001237',
      project: 'تطبيق توصيل الطلبات',
      type: 'supervision_request',
      description: 'طلب إشراف على مشروع تطبيق توصيل الطلبات',
      submittedDate: '2024-01-19',
      status: 'rejected',
      priority: 'low',
      attachments: ['proposal.pdf', 'design.pdf']
    },
    {
      id: '5',
      student: 'علي حسن محمد',
      studentId: '2021001238',
      project: 'نظام إدارة المستشفيات',
      type: 'extension',
      description: 'طلب تمديد موعد تسليم المشروع لظروف خاصة',
      submittedDate: '2024-01-18',
      status: 'in_progress',
      priority: 'high',
      attachments: ['medical_report.pdf']
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
    { value: 'supervision_request', label: 'طلب إشراف' },
    { value: 'meeting_request', label: 'طلب اجتماع' },
    { value: 'extension', label: 'تمديد الموعد' },
    { value: 'change', label: 'تغيير المشرف' },
    { value: 'other', label: 'طلب آخر' }
  ]

  const priorityOptions = [
    { value: 'all', label: 'جميع الأولويات' },
    { value: 'low', label: 'منخفض' },
    { value: 'medium', label: 'متوسط' },
    { value: 'high', label: 'عالي' }
  ]

  const sortOptions = [
    { value: 'submittedDate', label: 'تاريخ الإرسال' },
    { value: 'student', label: 'اسم الطالب' },
    { value: 'status', label: 'الحالة' },
    { value: 'type', label: 'نوع الطلب' },
    { value: 'priority', label: 'الأولوية' }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'rejected':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'approved':
        return 'مقبول'
      case 'pending':
        return 'قيد المراجعة'
      case 'rejected':
        return 'مرفوض'
      default:
        return status
    }
  }

  const getTypeText = (type: string) => {
    switch (type) {
      case 'supervision_request':
        return 'طلب إشراف'
      case 'meeting_request':
        return 'طلب اجتماع'
      default:
        return type
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800'
      case 'normal':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const filteredRequests = requests
    .filter(request => {
      const matchesSearch = !searchQuery ||
        request.student.toLowerCase().includes(searchQuery.toLowerCase()) ||
        request.project.toLowerCase().includes(searchQuery.toLowerCase()) ||
        request.description.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesStatus = statusFilter === 'all' || request.status === statusFilter
      const matchesType = typeFilter === 'all' || request.type === typeFilter
      const matchesPriority = priorityFilter === 'all' || request.priority === priorityFilter

      return matchesSearch && matchesStatus && matchesType && matchesPriority
    })
    .sort((a, b) => {
      let comparison = 0

      switch (sortBy) {
        case 'student':
          comparison = a.student.localeCompare(b.student, 'ar')
          break
        case 'submittedDate':
          comparison = new Date(a.submittedDate).getTime() - new Date(b.submittedDate).getTime()
          break
        case 'status':
          comparison = a.status.localeCompare(b.status)
          break
        case 'type':
          comparison = a.type.localeCompare(b.type)
          break
        case 'priority':
          const priorityOrder = { low: 1, medium: 2, high: 3 }
          comparison = priorityOrder[a.priority as keyof typeof priorityOrder] - priorityOrder[b.priority as keyof typeof priorityOrder]
          break
        default:
          comparison = 0
      }

      return sortOrder === 'asc' ? comparison : -comparison
    })

  const handleApproveRequest = (requestId: string) => {
    setRequests(prev => prev.map(req =>
      req.id === requestId ? { ...req, status: 'approved' } : req
    ))
  }

  const handleRejectRequest = (requestId: string, allowReapplication: boolean = true) => {
    setRequests(prev => prev.map(req =>
      req.id === requestId ? {
        ...req,
        status: 'rejected',
        allowReapplication,
        rejectionReason: allowReapplication ? 'يمكن للطالب التقديم لمشرف آخر' : 'تم رفض الطلب نهائياً'
      } : req
    ))
  }

  const handleViewRequest = (request: Request) => {
    setViewingRequest(request)
  }

  const handleFilterClear = () => {
    setStatusFilter('all')
    setTypeFilter('all')
    setPriorityFilter('all')
    setSortBy('submittedDate')
    setSortOrder('desc')
  }


  const columns = [
    {
      key: 'student',
      label: 'الطالب',
      sortable: true,
      render: (request: Request) => (
        <div>
          <h3 className="font-medium text-gray-900">{request.student}</h3>
          <p className="text-sm text-gray-600">({request.studentId})</p>
        </div>
      )
    },
    {
      key: 'project',
      label: 'المشروع',
      render: (request: Request) => (
        <div>
          <h4 className="font-medium text-gray-900">{request.project}</h4>
          <p className="text-sm text-gray-600 line-clamp-1">{request.description}</p>
        </div>
      )
    },
    {
      key: 'type',
      label: 'نوع الطلب',
      sortable: true,
      render: (request: Request) => (
        <span className="text-sm text-gray-600">{getTypeText(request.type)}</span>
      )
    },
    {
      key: 'status',
      label: 'الحالة',
      sortable: true,
      render: (request: Request) => (
        <span className={cn('px-2 py-1 text-xs rounded-full', getStatusColor(request.status))}>
          {getStatusText(request.status)}
        </span>
      )
    },
    {
      key: 'priority',
      label: 'الأولوية',
      sortable: true,
      render: (request: Request) => (
        <span className={cn('px-2 py-1 text-xs rounded-full', getPriorityColor(request.priority))}>
          {request.priority === 'high' ? 'عالي' : request.priority === 'medium' ? 'متوسط' : 'منخفض'}
        </span>
      )
    },
    {
      key: 'submittedDate',
      label: 'تاريخ الإرسال',
      sortable: true,
      render: (request: Request) => (
        <span className="text-sm text-gray-600">
          {new Date(request.submittedDate).toLocaleDateString('ar')}
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
            <>
              <button
                onClick={() => handleApproveRequest(request.id)}
                className="text-green-600 hover:text-green-700 transition-colors"
                title="قبول"
              >
                <CheckCircle size={16} />
              </button>
              <button
                onClick={() => handleRejectRequest(request.id)}
                className="text-red-600 hover:text-red-700 transition-colors"
                title="رفض"
              >
                <XCircle size={16} />
              </button>
            </>
          )}
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
              {/* <Send className="w-6 h-6 text-gpms-dark" /> */}
              <div>
                <h1 className="text-xl font-bold text-gray-900">قائمة الطلبات</h1>
                {/* <p className="text-gray-600 mt-1">مراجعة وإدارة طلبات الإشراف</p> */}
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
                <Card key={request.id} className="1hover-lift">
                  <CardContent className="p-6">
                    {/* Request Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          {/* <User size={20} className="text-gray-400 ml-2 rtl:ml-0 rtl:mr-2" /> */}
                          <h3 className="text-lg font-semibold text-gray-900">{request.student}</h3>
                          <span className="text-sm text-gray-500 mr-2 rtl:mr-2 rtl:ml-0">({request.studentId})</span>
                        </div>
                        <h4 className="text-md font-medium text-gray-800 mb-2">{request.project}</h4>
                        <p className="text-sm text-gray-600 mb-3">{request.description}</p>

                        <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                          <div className="flex items-center">
                            <Calendar size={16} className="mr-1 rtl:mr-0 rtl:ml-1" />
                            <span>تاريخ الإرسال: {new Date(request.submittedDate).toLocaleDateString('ar')}</span>
                          </div>
                          <div className="flex items-center">
                            <Send size={16} className="mr-1 rtl:mr-0 rtl:ml-1" />
                            <span>نوع الطلب: {getTypeText(request.type)}</span>
                          </div>
                          {request.attachments.length > 0 && (
                            <div className="flex items-center">
                              <span>المرفقات: {request.attachments.length} ملف</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-col items-end space-y-2">
                        <span className={cn('px-3 py-1 text-sm rounded-full', getStatusColor(request.status))}>
                          {getStatusText(request.status)}
                        </span>
                        {/* <span className={cn('px-2 py-1 text-xs rounded-full', getPriorityColor(request.priority))}>
                          {request.priority === 'high' ? 'عالي' : request.priority === 'medium' ? 'متوسط' : 'منخفض'}
                        </span> */}
                      </div>
                    </div>

                    {/* Attachments */}
                    {request.attachments.length > 0 && (
                      <div className="bg-gray-50 rounded-lg p-4 mb-4">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">المرفقات:</h4>
                        <div className="flex flex-wrap gap-2">
                          {request.attachments.map((attachment, index) => (
                            <span key={index} className="px-2 py-1 bg-white text-gray-700 text-xs rounded border">
                              {attachment}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                      <div className="flex space-x-2 rtl:space-x-reverse">
                        <button
                          onClick={() => handleViewRequest(request)}
                          className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                          title="عرض"
                        >
                          <Eye size={16} />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                          <MessageSquare size={16} />
                        </button>
                      </div>

                      {request.status === 'pending' && (
                        <div className="flex space-x-2 rtl:space-x-reverse">
                          <button
                            onClick={() => handleApproveRequest(request.id)}
                            className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors flex items-center"
                          >
                            <CheckCircle size={16} className="mr-1 rtl:mr-0 rtl:ml-1" />
                            قبول
                          </button>
                          <div className="relative">
                            <button
                              onClick={() => {
                                setRejectRequestId(request.id)
                                setRejectReason('')
                                setAllowReapply(true)
                                setRejectOpen(true)
                              }}
                              className="px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors flex items-center"
                            >
                              <XCircle size={16} className="mr-1 rtl:mr-0 rtl:ml-1" />
                              رفض
                            </button>
                          </div>
                        </div>
                      )}

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
                <p className="text-gray-600">لم يتم العثور على طلبات تطابق معايير البحث</p>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
      <Modal
        isOpen={rejectOpen}
        onClose={() => { setRejectOpen(false); setRejectRequestId(null) }}
        title="رفض الطلب"
        onSubmit={(e) => {
          e?.preventDefault()
          if (rejectRequestId) {
            handleRejectRequest(rejectRequestId, allowReapply)
          }
          setRejectOpen(false)
          setRejectRequestId(null)
        }}
        size="md"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">سبب الرفض</label>
            <textarea
              rows={4}
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gpms-light focus:border-transparent"
              placeholder="اكتب سبب الرفض..."
            />
          </div>
          <label className="inline-flex items-center gap-2 text-sm text-gray-700">
            <input type="checkbox" checked={allowReapply} onChange={(e) => setAllowReapply(e.target.checked)} className="rounded border-gray-300 text-gpms-dark focus:ring-gpms-light" />
            السماح للطالب بالبحث عن مشرف آخر
          </label>
        </div>
      </Modal>

      {/* View Request Modal */}
      <Modal
        isOpen={!!viewingRequest}
        onClose={() => setViewingRequest(null)}
        title={viewingRequest ? `تفاصيل الطلب - ${viewingRequest.project}` : 'تفاصيل الطلب'}
        size="lg"
      >
        {viewingRequest && (
          <div className="space-y-4 text-sm text-gray-700">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="font-medium">نوع الطلب:</span>
                <p className="text-gray-700 mt-1">{getTypeText(viewingRequest.type)}</p>
              </div>
              <div>
                <span className="font-medium">الحالة:</span>
                <p className="text-gray-700 mt-1">{getStatusText(viewingRequest.status)}</p>
              </div>
              <div>
                <span className="font-medium">الأولوية:</span>
                <p className="text-gray-700 mt-1">{viewingRequest.priority === 'high' ? 'عالي' : viewingRequest.priority === 'medium' ? 'متوسط' : 'منخفض'}</p>
              </div>
              <div>
                <span className="font-medium">تاريخ الإرسال:</span>
                <p className="text-gray-700 mt-1">{new Date(viewingRequest.submittedDate).toLocaleDateString('ar')}</p>
              </div>
              <div>
                <span className="font-medium">الطالب:</span>
                <p className="text-gray-700 mt-1">{viewingRequest.student} ({viewingRequest.studentId})</p>
              </div>
              <div>
                <span className="font-medium">المشروع:</span>
                <p className="text-gray-700 mt-1">{viewingRequest.project}</p>
              </div>
            </div>
            <div>
              <span className="font-medium">الوصف:</span>
              <p className="text-gray-700 mt-1">{viewingRequest.description}</p>
            </div>
            {viewingRequest.attachments.length > 0 && (
              <div>
                <span className="font-medium">المرفقات:</span>
                <div className="flex flex-wrap gap-2 mt-1">
                  {viewingRequest.attachments.map((a, i) => (
                    <span key={i} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded border">{a}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  )
}

export default SupervisorRequests
