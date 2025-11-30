import React, { useState, useMemo, useEffect } from 'react'
import { useLanguage } from '@/context/LanguageContext'
import { useAuth } from '@/context/AuthContext'
import { cn, getActiveFiltersCount } from '@/lib/utils'
import { Card, CardContent, CardHeader } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Divider from '@/components/ui/Divider'
import DataTable from '@/components/ui/DataTable'
import SimplePopover from '@/components/ui/SimplePopover'
import AdvancedFilter from '@/components/ui/AdvancedFilter'
import RequestFormModal from '@/components/forms/RequestFormModal'
import Modal from '@/components/ui/Modal'
import ConfirmDialog from '@/components/ui/ConfirmDialog'
import { ViewModeToggle } from '@/components/shared'
import { StatusBadge, PriorityBadge } from '@/components/shared'
import { Plus, Eye, Edit, Trash2, CheckCircle, XCircle, Send, SlidersHorizontal } from 'lucide-react'
import { Request } from './schema'
import { 
  approveRequest, 
  rejectRequest, 
  updateRequest, 
  createRequest, 
  executeRequestAction,
  approveRequestBySupervisor,
  approveRequestByCommittee,
  rejectRequestBySupervisor,
  rejectRequestByCommittee,
  getRequestsPendingSupervisor,
  getRequestsPendingCommittee
} from '@/services/requests.service'
import { useNavigate } from 'react-router-dom'
import { useRequests } from './requests.hook'
import { useNotifications } from '@/context/NotificationContext'

const RequestsScreen: React.FC = () => {
  const { t } = useLanguage()
  const { user } = useAuth()
  const navigate = useNavigate()
  const { addNotification } = useNotifications()
  const { requests: initialRequests, isLoading: requestsLoading, refetch } = useRequests()
  const [requests, setRequests] = useState<Request[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [sortBy, setSortBy] = useState('updatedAt')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingRequest, setEditingRequest] = useState<Request | null>(null)
  const [viewRequest, setViewRequest] = useState<Request | null>(null)
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)
  const [rejectOpen, setRejectOpen] = useState(false)
  const [rejectRequestId, setRejectRequestId] = useState<string | null>(null)

  useEffect(() => {
    setRequests(initialRequests)
  }, [initialRequests])

  const statusOptions = [
    { value: 'all', label: 'جميع الحالات' },
    { value: 'pending', label: 'قيد الانتظار' },
    { value: 'approved', label: 'موافق عليه' },
    { value: 'rejected', label: 'مرفوض' },
    { value: 'in_progress', label: 'قيد المعالجة' }
  ]

  const typeOptions = [
    { value: 'all', label: 'جميع الأنواع' },
    { value: 'supervision', label: 'طلب إشراف' },
    { value: 'meeting', label: 'طلب اجتماع' },
    { value: 'extension', label: 'طلب تمديد' },
    { value: 'change_supervisor', label: 'تغيير المشرف' },
    { value: 'change_group', label: 'تغيير المجموعة' },
    { value: 'other', label: 'أخرى' }
  ]

  const priorityOptions = [
    { value: 'all', label: 'جميع الأولويات' },
    { value: 'low', label: 'منخفض' },
    { value: 'medium', label: 'متوسط' },
    { value: 'high', label: 'عالي' }
  ]

  const sortOptions = [
    { value: 'updatedAt', label: 'آخر تحديث' },
    { value: 'requestedDate', label: 'تاريخ الطلب' },
    { value: 'status', label: 'الحالة' },
    { value: 'priority', label: 'الأولوية' }
  ]

  const filteredRequests = useMemo(() => {
    return requests.filter(request => {
      const matchesSearch = !searchQuery ||
        request.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        request.description?.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesStatus = statusFilter === 'all' || request.status === statusFilter
      const matchesType = typeFilter === 'all' || request.type === typeFilter
      const matchesPriority = priorityFilter === 'all' || request.priority === priorityFilter

      return matchesSearch && matchesStatus && matchesType && matchesPriority
    })
  }, [requests, searchQuery, statusFilter, typeFilter, priorityFilter])

  const canCreate = user?.role === 'student'
  const canApprove = user?.role === 'supervisor' || user?.role === 'committee'
  const canHandle = user?.role === 'committee'
  
  // For committee, show all requests that need committee approval
  const committeeRequests = useMemo(() => {
    if (user?.role === 'committee') {
      return filteredRequests.filter(r => 
        r.type === 'change_supervisor' || 
        r.type === 'change_group' || 
        r.type === 'change_project' ||
        (r.type === 'supervision' && r.status === 'approved') // Already approved by supervisor
      )
    }
    return filteredRequests
  }, [filteredRequests, user?.role])
  
  // For supervisors, filter to show only supervision requests
  const supervisorRequests = useMemo(() => {
    if (user?.role === 'supervisor') {
      return filteredRequests.filter(r => r.type === 'supervision' || r.type === 'supervision_request')
    }
    return filteredRequests
  }, [filteredRequests, user?.role])
  
  const MAX_SUPERVISED_PROJECTS = 5 // Maximum projects a supervisor can supervise

  const handleFilterClear = () => {
    setStatusFilter('all')
    setTypeFilter('all')
    setPriorityFilter('all')
    setSortBy('updatedAt')
    setSortOrder('desc')
  }

  const columns = useMemo(() => [
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
        <span className="text-sm text-gray-600">{request.type}</span>
      )
    },
    {
      key: 'status',
      label: 'الحالة',
      render: (request: Request) => <StatusBadge status={request.status} />
    },
    {
      key: 'priority',
      label: 'الأولوية',
      render: (request: Request) => <PriorityBadge priority={request.priority} />
    },
    {
      key: 'actions',
      label: 'الإجراءات',
      render: (request: Request) => (
        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          <button
            onClick={() => setViewRequest(request)}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            title="عرض"
          >
            <Eye size={16} />
          </button>
          {canCreate && request.status === 'pending' && (
            <button
              onClick={() => navigate(`/requests/${request.id}/edit`)}
              className="text-blue-600 hover:text-blue-700 transition-colors"
              title="تعديل"
            >
              <Edit size={16} />
            </button>
          )}
          {canApprove && request.status === 'pending' && user?.role === 'supervisor' && (
            <>
              <button
                onClick={async () => {
                  // Check if supervisor has reached max projects (for supervision requests)
                  if (user?.role === 'supervisor' && (request.type === 'supervision' || request.type === 'supervision_request')) {
                    // TODO: Get current supervised projects count from API
                    const currentProjectsCount = 3 // Mock data - should come from API
                    if (currentProjectsCount >= MAX_SUPERVISED_PROJECTS) {
                      addNotification({
                        title: 'لا يمكن الموافقة',
                        message: `لقد وصلت إلى الحد الأقصى للمشاريع المشرفة عليها (${MAX_SUPERVISED_PROJECTS}). يرجى رفض الطلب أو إلغاء إشراف على مشروع آخر.`,
                        type: 'warning'
                      })
                      return
                    }
                  }
                  
                  try {
                    // Use supervisor approval function
                    const approvedRequest = await approveRequestBySupervisor(request.id, undefined, undefined)
                    setRequests(prev => prev.map(r =>
                      r.id === request.id ? { ...r, status: approvedRequest.status } : r
                    ))
                    addNotification({
                      title: 'تمت الموافقة',
                      message: 'تم قبول الطلب بنجاح. سيتم إرساله للجنة المشاريع للاعتماد النهائي.',
                      type: 'success',
                      category: 'request'
                    })
                  } catch (err) {
                    console.error('Error approving request:', err)
                    addNotification({
                      title: 'خطأ',
                      message: err instanceof Error ? err.message : 'فشل في الموافقة على الطلب. يرجى المحاولة مرة أخرى.',
                      type: 'error'
                    })
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
                      // Use committee rejection function
                      const rejectedRequest = await rejectRequestByCommittee(request.id, reason)
                      setRequests(prev => prev.map(r =>
                        r.id === request.id ? { ...r, status: rejectedRequest.status, reason } : r
                      ))
                      addNotification({
                        title: 'تم الرفض',
                        message: 'تم رفض الطلب. سيتم إشعار الطالب بالقرار.',
                        type: 'info',
                        category: 'request'
                      })
                    } catch (err) {
                      console.error('Error rejecting request:', err)
                      addNotification({
                        title: 'خطأ',
                        message: 'فشل في رفض الطلب. يرجى المحاولة مرة أخرى.',
                        type: 'error'
                      })
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
          {canHandle && request.status === 'pending' && (
            <>
              <button
                onClick={async () => {
                  try {
                    // Use committee approval function
                    const approvedRequest = await approveRequestByCommittee(request.id, 'تمت الموافقة من قبل لجنة المشاريع', undefined)
                    
                    // Then execute the requested action
                    try {
                      const actionData: any = {}
                      
                      // Prepare action data based on request type
                      if (request.type === 'change_supervisor') {
                        actionData.newSupervisorId = request.description?.match(/supervisor[:\s]+(\w+)/i)?.[1] || ''
                        actionData.projectId = request.description?.match(/project[:\s]+(\w+)/i)?.[1] || ''
                      } else if (request.type === 'change_group') {
                        actionData.newGroupId = request.description?.match(/group[:\s]+(\w+)/i)?.[1] || ''
                        actionData.studentId = request.description?.match(/student[:\s]+(\w+)/i)?.[1] || ''
                      } else if (request.type === 'change_project') {
                        actionData.newProjectId = request.description?.match(/project[:\s]+(\w+)/i)?.[1] || ''
                        actionData.studentId = request.description?.match(/student[:\s]+(\w+)/i)?.[1] || ''
                      }
                      
                      await executeRequestAction(request.id, request.type, actionData)
                      
                      addNotification({
                        title: 'تمت الموافقة والتنفيذ',
                        message: `تم قبول الطلب وتنفيذ الإجراء المطلوب (${request.type}). سيتم إشعار الطالب.`,
                        type: 'success'
                      })
                    } catch (actionError) {
                      // Request approved but action execution failed
                      console.error('Error executing action:', actionError)
                      addNotification({
                        title: 'تمت الموافقة',
                        message: 'تم قبول الطلب ولكن فشل تنفيذ الإجراء. يرجى تنفيذه يدوياً.',
                        type: 'warning'
                      })
                    }
                    
                    setRequests(prev => prev.map(r =>
                      r.id === request.id ? { ...r, status: 'approved' } : r
                    ))
                  } catch (err) {
                    console.error('Error approving request:', err)
                    addNotification({
                      title: 'خطأ',
                      message: 'فشل في الموافقة على الطلب. يرجى المحاولة مرة أخرى.',
                      type: 'error'
                    })
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
                      // Use committee rejection function
                      const rejectedRequest = await rejectRequestByCommittee(request.id, reason)
                      setRequests(prev => prev.map(r =>
                        r.id === request.id ? { ...r, status: rejectedRequest.status, reason } : r
                      ))
                      addNotification({
                        title: 'تم الرفض',
                        message: 'تم رفض الطلب. سيتم إشعار الطالب بالقرار.',
                        type: 'info',
                        category: 'request'
                      })
                    } catch (err) {
                      console.error('Error rejecting request:', err)
                      addNotification({
                        title: 'خطأ',
                        message: 'فشل في رفض الطلب. يرجى المحاولة مرة أخرى.',
                        type: 'error'
                      })
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
        </div>
      )
    }
  ], [canCreate, canApprove, canHandle, user?.role, MAX_SUPERVISED_PROJECTS, addNotification])

  return (
    <div className="space-y-6">
      <Card className="hover-lift">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-900">{t('navigation.requests')}</h1>
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
                  onClick={() => {
                    setEditingRequest(null)
                    setIsModalOpen(true)
                  }}
                  className="bg-gpms-dark text-white hover:bg-gpms-light"
                >
                  <Plus className="w-4 h-4 mr-1 rtl:mr-0 rtl:ml-1" />
                  طلب جديد
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <Divider />
        <CardContent>
          {requestsLoading ? (
            <div className="text-center py-12">جاري التحميل...</div>
          ) : (
            <>
              {user?.role === 'supervisor' && (
                <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>ملاحظة:</strong> يتم عرض طلبات الإشراف فقط. الحد الأقصى للمشاريع المشرفة عليها: {MAX_SUPERVISED_PROJECTS}
                  </p>
                </div>
              )}
              {user?.role === 'committee' && (
                <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-green-800">
                    <strong>ملاحظة:</strong> يتم عرض الطلبات التي تحتاج موافقة لجنة المشاريع (تغيير مشرف، مجموعة، مشروع، إلخ).
                  </p>
                </div>
              )}
            </>
          )}
          {viewMode === 'table' ? (
            <DataTable
              data={
                user?.role === 'supervisor' ? supervisorRequests :
                user?.role === 'committee' ? committeeRequests :
                filteredRequests
              }
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
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {(
                user?.role === 'supervisor' ? supervisorRequests :
                user?.role === 'committee' ? committeeRequests :
                filteredRequests
              ).map((request) => (
                <Card key={request.id} className="hover-lift">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-md font-semibold text-gray-900 mb-2">{request.title}</h3>
                        <p className="text-sm text-gray-600 line-clamp-2">{request.description}</p>
                      </div>
                      <StatusBadge status={request.status} />
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                      <button
                        onClick={() => setViewRequest(request)}
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

      <RequestFormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setEditingRequest(null)
        }}
        onSubmit={async (data) => {
          try {
            if (editingRequest) {
              await updateRequest(editingRequest.id, data)
              refetch()
            } else {
              const newRequest = await createRequest(data)
              setRequests(prev => [newRequest, ...prev])
            }
            setIsModalOpen(false)
            setEditingRequest(null)
          } catch (err) {
            console.error('Error submitting request:', err)
            addNotification({
              title: 'خطأ',
              message: 'فشل في حفظ الطلب. يرجى المحاولة مرة أخرى.',
              type: 'error'
            })
          }
        }}
        editData={editingRequest}
      />

      <Modal
        isOpen={!!viewRequest}
        onClose={() => setViewRequest(null)}
        title={viewRequest ? `تفاصيل الطلب - ${viewRequest.title}` : 'تفاصيل الطلب'}
        size="lg"
      >
        {viewRequest && (
          <div className="space-y-4 text-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="font-medium">الحالة:</span>
                <p className="text-gray-700 mt-1"><StatusBadge status={viewRequest.status} /></p>
              </div>
              <div>
                <span className="font-medium">الأولوية:</span>
                <p className="text-gray-700 mt-1"><PriorityBadge priority={viewRequest.priority} /></p>
              </div>
            </div>
            <div>
              <span className="font-medium">الوصف:</span>
              <p className="text-gray-700 mt-1">{viewRequest.description}</p>
            </div>
          </div>
        )}
      </Modal>

      <ConfirmDialog
        isOpen={!!confirmDeleteId}
        title="تأكيد الحذف"
        description="هل أنت متأكد من حذف هذا الطلب؟"
        variant="danger"
        onConfirm={() => {
          setRequests(prev => prev.filter(r => r.id !== confirmDeleteId))
          setConfirmDeleteId(null)
        }}
        onCancel={() => setConfirmDeleteId(null)}
      />
    </div>
  )
}

export default RequestsScreen
