import React, { useState, useMemo } from 'react'
import { useAuth } from '@/context/AuthContext'
import { getActiveFiltersCount } from '@/lib/utils'
import { Card, CardContent, CardHeader } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Divider from '@/components/ui/Divider'
import DataTable from '@/components/ui/DataTable'
import SimplePopover from '@/components/ui/SimplePopover'
import AdvancedFilter from '@/components/ui/AdvancedFilter'
import Modal from '@/components/ui/Modal'
import { ViewModeToggle } from '@/components/shared'
import { StatusBadge } from '@/components/shared'
import { Eye, CheckCircle, XCircle, SlidersHorizontal, Calendar } from 'lucide-react'
import { SupervisionRequest } from './schema'
import { useSupervisorRequests } from './supervisor-requests.hook'
import { acceptSupervisionRequest, rejectSupervisionRequest, checkSupervisorProjectLimit } from '@/services/supervisor-requests.service'
import { useNotifications } from '@/context/NotificationContext'
import Input from '@/components/ui/Input'
import { Form, FormGroup, FormLabel } from '@/components/ui/Form'

const SupervisorRequestsScreen: React.FC = () => {
  const { user } = useAuth()
  const { addNotification } = useNotifications()
  const { requests, isLoading, refetch } = useSupervisorRequests()

  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [sortBy, setSortBy] = useState('requestedAt')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table')
  const [viewRequest, setViewRequest] = useState<SupervisionRequest | null>(null)
  const [actionModalOpen, setActionModalOpen] = useState(false)
  const [selectedRequest, setSelectedRequest] = useState<SupervisionRequest | null>(null)
  const [actionType, setActionType] = useState<'accept' | 'reject' | null>(null)
  const [responseText, setResponseText] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)

  const statusOptions = [
    { value: 'all', label: 'جميع الحالات' },
    { value: 'pending', label: 'قيد الانتظار' },
    { value: 'accepted', label: 'مقبول' },
    { value: 'rejected', label: 'مرفوض' },
    { value: 'approved_by_committee', label: 'معتمد من اللجنة' }
  ]

  const priorityOptions = [
    { value: 'all', label: 'جميع الأولويات' }
  ]

  const sortOptions = [
    { value: 'requestedAt', label: 'تاريخ الطلب' },
    { value: 'projectTitle', label: 'اسم المشروع' },
    { value: 'studentName', label: 'اسم الطالب' },
    { value: 'status', label: 'الحالة' }
  ]

  const filteredRequests = useMemo(() => {
    return requests.filter(request => {
      const matchesSearch = !searchQuery ||
        request.projectTitle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        request.studentName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        request.studentEmail?.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesStatus = statusFilter === 'all' || request.status === statusFilter

      return matchesSearch && matchesStatus
    }).sort((a, b) => {
      let comparison = 0
      switch (sortBy) {
        case 'requestedAt':
          comparison = new Date(a.requestedAt).getTime() - new Date(b.requestedAt).getTime()
          break
        case 'projectTitle':
          comparison = (a.projectTitle || '').localeCompare(b.projectTitle || '', 'ar')
          break
        case 'studentName':
          comparison = (a.studentName || '').localeCompare(b.studentName || '', 'ar')
          break
        case 'status':
          comparison = (a.status || '').localeCompare(b.status || '', 'ar')
          break
        default:
          comparison = 0
      }
      return sortOrder === 'asc' ? comparison : -comparison
    })
  }, [requests, searchQuery, statusFilter, sortBy, sortOrder])

  const handleFilterClear = () => {
    setSearchQuery('')
    setStatusFilter('all')
    setSortBy('requestedAt')
    setSortOrder('desc')
  }

  const handleAccept = (request: SupervisionRequest) => {
    setSelectedRequest(request)
    setActionType('accept')
    setResponseText('')
    setActionModalOpen(true)
  }

  const handleReject = (request: SupervisionRequest) => {
    setSelectedRequest(request)
    setActionType('reject')
    setResponseText('')
    setActionModalOpen(true)
  }

  const handleProcessAction = async () => {
    if (!selectedRequest || !actionType) return

    setIsProcessing(true)
    try {
      if (actionType === 'accept') {
        // Check supervisor project limit before accepting
        if (user?.id) {
          const limitCheck = await checkSupervisorProjectLimit(user.id)
          if (!limitCheck.canAccept) {
            addNotification({
              title: 'لا يمكن قبول الطلب',
              message: limitCheck.message || `تم الوصول للحد الأقصى للمشاريع (${limitCheck.currentProjects}/${limitCheck.maxProjects})`,
              type: 'error'
            })
            setIsProcessing(false)
            return
          }
        }

        await acceptSupervisionRequest(selectedRequest.id, responseText || undefined)
        addNotification({
          title: 'تم قبول الطلب',
          message: `تم قبول طلب الإشراف على مشروع "${selectedRequest.projectTitle}". سيتم إرساله للجنة المشاريع للاعتماد النهائي.`,
          type: 'success',
          category: 'request'
        })
      } else {
        if (!responseText.trim()) {
          addNotification({
            title: 'خطأ',
            message: 'يرجى إدخال سبب الرفض',
            type: 'error'
          })
          setIsProcessing(false)
          return
        }
        await rejectSupervisionRequest(selectedRequest.id, responseText)
        addNotification({
          title: 'تم رفض الطلب',
          message: `تم رفض طلب الإشراف على مشروع "${selectedRequest.projectTitle}"`,
          type: 'success',
          category: 'request'
        })
      }
      setActionModalOpen(false)
      setSelectedRequest(null)
      setActionType(null)
      setResponseText('')
      refetch()
    } catch (error) {
      addNotification({
        title: 'خطأ',
        message: error instanceof Error ? error.message : 'حدث خطأ أثناء معالجة الطلب',
        type: 'error'
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const columns = useMemo(() => [
    {
      key: 'projectTitle',
      label: 'المشروع',
      sortable: true,
      render: (request: SupervisionRequest) => (
        <div>
          <h3 className="font-medium text-gray-900">{request.projectTitle}</h3>
          {request.groupName && (
            <p className="text-sm text-gray-600">المجموعة: {request.groupName}</p>
          )}
        </div>
      )
    },
    {
      key: 'studentName',
      label: 'الطالب',
      sortable: true,
      render: (request: SupervisionRequest) => (
        <div>
          <p className="font-medium text-gray-900">{request.studentName}</p>
          <p className="text-sm text-gray-600">{request.studentEmail}</p>
        </div>
      )
    },
    {
      key: 'status',
      label: 'الحالة',
      sortable: true,
      render: (request: SupervisionRequest) => <StatusBadge status={request.status} />
    },
    {
      key: 'requestedAt',
      label: 'تاريخ الطلب',
      sortable: true,
      render: (request: SupervisionRequest) => (
        <div className="flex items-center text-sm text-gray-600">
          <Calendar size={14} className="ml-1 rtl:ml-0 rtl:mr-1" />
          {new Date(request.requestedAt).toLocaleDateString('ar-SA')}
        </div>
      )
    },
    {
      key: 'actions',
      label: 'الإجراءات',
      render: (request: SupervisionRequest) => (
        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          <button
            onClick={() => setViewRequest(request)}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            title="عرض التفاصيل"
          >
            <Eye size={16} />
          </button>
          {request.status === 'pending' && (
            <>
              <button
                onClick={() => handleAccept(request)}
                className="text-green-600 hover:text-green-700 transition-colors"
                title="قبول الطلب"
              >
                <CheckCircle size={16} />
              </button>
              <button
                onClick={() => handleReject(request)}
                className="text-red-600 hover:text-red-700 transition-colors"
                title="رفض الطلب"
              >
                <XCircle size={16} />
              </button>
            </>
          )}
        </div>
      )
    }
  ], [])

  if (user?.role !== 'supervisor') {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">غير مصرح لك بالوصول إلى هذه الصفحة</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Card className="hover-lift">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-900">طلبات الإشراف</h1>
              <p className="text-sm text-gray-600 mt-1">مراجعة و معالجة طلبات الإشراف الواردة</p>
            </div>
          </div>
        </CardHeader>
        <Divider />
        <CardContent>
          {/* Filters */}
          <div className="mb-6 flex flex-wrap items-center gap-4">
            <div className="flex-1 min-w-[200px]">
              <Input
                type="text"
                placeholder="ابحث عن مشروع، طالب، أو بريد إلكتروني..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>
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
                  onPriorityChange={() => { }}
                  onSortChange={setSortBy}
                  onSortOrderChange={setSortOrder}
                  onApply={() => { }}
                  onClear={handleFilterClear}
                />
              }
            >
              <Button variant="outline" className="relative">
                <SlidersHorizontal className="w-4 h-4 ml-1 rtl:ml-0 rtl:mr-1" />
                الفلاتر
                {getActiveFiltersCount(statusFilter, 'all', searchQuery, sortBy, sortOrder) > 0 && (
                  <span className="absolute -top-1 -right-1 rtl:right-auto rtl:-left-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {getActiveFiltersCount(statusFilter, 'all', searchQuery, sortBy, sortOrder)}
                  </span>
                )}
              </Button>
            </SimplePopover>
            <ViewModeToggle viewMode={viewMode} onViewModeChange={setViewMode} />
          </div>

          {/* Data Table */}
          {isLoading ? (
            <div className="text-center py-12">جاري التحميل...</div>
          ) : (
            <DataTable
              data={filteredRequests}
              columns={columns}
              sortBy={sortBy}
              sortOrder={sortOrder}
              onSort={(key, direction) => {
                setSortBy(key)
                setSortOrder(direction)
              }}
              emptyMessage="لا توجد طلبات إشراف"
            />
          )}
        </CardContent>
      </Card>

      {/* View Request Modal */}
      <Modal
        isOpen={!!viewRequest}
        onClose={() => setViewRequest(null)}
        title="تفاصيل طلب الإشراف"
        size="lg"
      >
        {viewRequest && (
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">المشروع</h3>
              <p className="text-gray-700">{viewRequest.projectTitle}</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">الطالب</h3>
              <p className="text-gray-700">{viewRequest.studentName}</p>
              <p className="text-sm text-gray-600">{viewRequest.studentEmail}</p>
            </div>
            {viewRequest.groupName && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">المجموعة</h3>
                <p className="text-gray-700">{viewRequest.groupName}</p>
              </div>
            )}
            {viewRequest.reason && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">السبب</h3>
                <p className="text-gray-700">{viewRequest.reason}</p>
              </div>
            )}
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">الحالة</h3>
              <StatusBadge status={viewRequest.status} />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">تاريخ الطلب</h3>
              <p className="text-gray-700">{new Date(viewRequest.requestedAt).toLocaleString('ar-SA')}</p>
            </div>
          </div>
        )}
      </Modal>

      {/* Accept/Reject Modal */}
      <Modal
        isOpen={actionModalOpen}
        onClose={() => {
          setActionModalOpen(false)
          setSelectedRequest(null)
          setActionType(null)
          setResponseText('')
        }}
        title={actionType === 'accept' ? 'قبول طلب الإشراف' : 'رفض طلب الإشراف'}
        size="md"
      >
        <Form onSubmit={(e) => { e.preventDefault(); handleProcessAction(); }}>
          <div className="space-y-4">
            {selectedRequest && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="font-medium text-gray-900">المشروع: {selectedRequest.projectTitle}</p>
                <p className="text-sm text-gray-600">الطالب: {selectedRequest.studentName}</p>
              </div>
            )}
            <FormGroup>
              <FormLabel htmlFor="response" required={actionType === 'reject'}>
                {actionType === 'accept' ? 'ملاحظات (اختيارية)' : 'سبب الرفض'}
              </FormLabel>
              <textarea
                id="response"
                value={responseText}
                onChange={(e) => setResponseText(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gpms-light focus:border-transparent"
                placeholder={actionType === 'accept' ? 'أدخل أي ملاحظات...' : 'أدخل سبب الرفض...'}
                required={actionType === 'reject'}
              />
            </FormGroup>
            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setActionModalOpen(false)
                  setSelectedRequest(null)
                  setActionType(null)
                  setResponseText('')
                }}
              >
                إلغاء
              </Button>
              <Button
                type="submit"
                loading={isProcessing}
                className={actionType === 'accept' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}
              >
                {actionType === 'accept' ? 'قبول' : 'رفض'}
              </Button>
            </div>
          </div>
        </Form>
      </Modal>
    </div>
  )
}

export default SupervisorRequestsScreen

