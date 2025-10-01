import React, { useState } from 'react'
import { useLanguage } from '../../context/LanguageContext'
import { cn } from '../../lib/utils'
import { Card, CardContent, CardHeader } from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import { SearchBar } from '../../components/ui/Filter'
import { Table } from '../../components/ui/Table'
import GridView, { RequestCard } from '../../components/ui/GridView'
import ViewToggle from '../../components/ui/ViewToggle'
import AdvancedFilter from '../../components/ui/AdvancedFilter'
import RequestFormModal from '../../components/forms/RequestFormModal'
import { 
  Plus, 
  Eye, 
  Edit, 
  Trash2,
  Calendar,
  User,
  MessageSquare,
  CheckCircle,
  Clock,
  AlertCircle,
  XCircle
} from 'lucide-react'

interface Request {
  id: string
  type: 'supervision' | 'meeting' | 'extension' | 'change' | 'other'
  title: string
  description: string
  status: 'pending' | 'approved' | 'rejected' | 'in_progress'
  priority: 'low' | 'medium' | 'high'
  requester: string
  requesterRole: 'student' | 'supervisor'
  submissionDate: string
  responseDate?: string
  responder?: string
  response?: string
  tags: string[]
  createdAt: string
  updatedAt: string
}

const RequestsList: React.FC = () => {
  const { t } = useLanguage()
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [sortBy, setSortBy] = useState('updatedAt')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('grid')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingRequest, setEditingRequest] = useState<Request | null>(null)
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  // Mock data
  const [requests, setRequests] = useState<Request[]>([
    {
      id: '1',
      type: 'supervision',
      title: 'طلب إشراف على مشروع الذكاء الاصطناعي',
      description: 'أطلب الإشراف على مشروع تطوير نموذج ذكي لتحليل البيانات الطبية',
      status: 'pending',
      priority: 'high',
      requester: 'أحمد محمد علي',
      requesterRole: 'student',
      submissionDate: '2024-01-20',
      tags: ['إشراف', 'ذكاء اصطناعي', 'تحليل البيانات'],
      createdAt: '2024-01-20',
      updatedAt: '2024-01-22'
    },
    {
      id: '2',
      type: 'meeting',
      title: 'طلب اجتماع لمناقشة تقدم المشروع',
      description: 'أطلب جدولة اجتماع لمناقشة التقدم المحرز في المرحلة الأولى',
      status: 'approved',
      priority: 'medium',
      requester: 'فاطمة علي محمد',
      requesterRole: 'student',
      submissionDate: '2024-01-18',
      responseDate: '2024-01-21',
      responder: 'د. خالد محمود الحسن',
      response: 'تم الموافقة على الاجتماع، سيتم جدولته خلال الأسبوع القادم',
      tags: ['اجتماع', 'مناقشة', 'تقدم'],
      createdAt: '2024-01-18',
      updatedAt: '2024-01-21'
    },
    {
      id: '3',
      type: 'extension',
      title: 'طلب تمديد موعد تسليم التقرير',
      description: 'أطلب تمديد موعد تسليم تقرير المرحلة الثانية لمدة أسبوع',
      status: 'rejected',
      priority: 'low',
      requester: 'محمد خالد محمود',
      requesterRole: 'student',
      submissionDate: '2024-01-15',
      responseDate: '2024-01-20',
      responder: 'د. أحمد محمد علي',
      response: 'لا يمكن تمديد الموعد بسبب قرب انتهاء الفصل الدراسي',
      tags: ['تمديد', 'تقرير', 'موعد'],
      createdAt: '2024-01-15',
      updatedAt: '2024-01-20'
    },
    {
      id: '4',
      type: 'change',
      title: 'طلب تغيير عنوان المشروع',
      description: 'أطلب تغيير عنوان المشروع ليعكس المحتوى الفعلي بشكل أفضل',
      status: 'in_progress',
      priority: 'medium',
      requester: 'سارة أحمد حسن',
      requesterRole: 'student',
      submissionDate: '2024-01-12',
      responseDate: '2024-01-19',
      responder: 'د. فاطمة علي محمد',
      response: 'تم استلام الطلب وسيتم مراجعته مع اللجنة المختصة',
      tags: ['تغيير', 'عنوان', 'مشروع'],
      createdAt: '2024-01-12',
      updatedAt: '2024-01-19'
    },
    {
      id: '5',
      type: 'other',
      title: 'طلب استخدام معمل الحاسوب',
      description: 'أطلب استخدام معمل الحاسوب المتقدم لإجراء التجارب',
      status: 'pending',
      priority: 'low',
      requester: 'خالد محمود الحسن',
      requesterRole: 'student',
      submissionDate: '2024-01-22',
      tags: ['معمل', 'حاسوب', 'تجارب'],
      createdAt: '2024-01-22',
      updatedAt: '2024-01-22'
    }
  ])

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'قيد الانتظار'
      case 'approved': return 'موافق عليه'
      case 'rejected': return 'مرفوض'
      case 'in_progress': return 'قيد المعالجة'
      default: return status
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'approved': return 'bg-green-100 text-green-800'
      case 'rejected': return 'bg-red-100 text-red-800'
      case 'in_progress': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeText = (type: string) => {
    switch (type) {
      case 'supervision': return 'طلب إشراف'
      case 'meeting': return 'طلب اجتماع'
      case 'extension': return 'طلب تمديد'
      case 'change': return 'طلب تغيير'
      case 'other': return 'طلب آخر'
      default: return type
    }
  }

  const getRoleText = (role: string) => {
    switch (role) {
      case 'student': return 'طالب'
      case 'supervisor': return 'مشرف'
      default: return role
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
        request.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))

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
        case 'submissionDate':
          comparison = new Date(a.submissionDate).getTime() - new Date(b.submissionDate).getTime()
          break
        case 'updatedAt':
          comparison = new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime()
          break
        case 'createdAt':
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
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

  const handleApplyFilters = () => {
    // Filters are already applied through state updates
    console.log('Filters applied')
  }

  const handleClearFilters = () => {
    setStatusFilter('all')
    setTypeFilter('all')
    setPriorityFilter('all')
    setSortBy('updatedAt')
    setSortOrder('desc')
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
      label: 'نوع الطلب',
      render: (request: Request) => (
        <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
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
          getStatusColor(request.status)
        )}>
          {getStatusText(request.status)}
        </span>
      )
    },
    {
      key: 'requester',
      label: 'مقدم الطلب',
      render: (request: Request) => (
        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 text-sm font-medium">
            {request.requester.charAt(0)}
          </div>
          <div>
            <span className="text-sm text-gray-900">{request.requester}</span>
            <div className="text-xs text-gray-500">{getRoleText(request.requesterRole)}</div>
          </div>
        </div>
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
      key: 'submissionDate',
      label: 'تاريخ الإرسال',
      sortable: true,
      render: (request: Request) => (
        <span className="text-sm text-gray-600">
          {new Date(request.submissionDate).toLocaleDateString('ar')}
        </span>
      )
    },
    {
      key: 'responder',
      label: 'المستجيب',
      render: (request: Request) => (
        <span className="text-sm text-gray-600">
          {request.responder || 'غير محدد'}
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
          <button
            onClick={() => handleEditRequest(request)}
            className="text-blue-600 hover:text-blue-700 transition-colors"
            title="تعديل"
          >
            <Edit size={16} />
          </button>
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
              <MessageSquare className="w-6 h-6 text-orange-600" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">قائمة الطلبات</h1>
                <p className="text-gray-600 mt-1">إدارة ومتابعة جميع الطلبات</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 rtl:space-x-reverse">
              {/* View Mode Toggle */}
              <ViewToggle
                viewMode={viewMode}
                onViewModeChange={setViewMode}
              />
              
              {/* Advanced Filter */}
              <AdvancedFilter
                statusFilter={statusFilter}
                onStatusChange={setStatusFilter}
                priorityFilter={priorityFilter}
                onPriorityChange={setPriorityFilter}
                sortBy={sortBy}
                onSortByChange={setSortBy}
                sortOrder={sortOrder}
                onSortOrderChange={setSortOrder}
                onApplyFilters={handleApplyFilters}
                onClearFilters={handleClearFilters}
                isOpen={isFilterOpen}
                onToggle={() => setIsFilterOpen(!isFilterOpen)}
              />

              <Button
                onClick={handleAddRequest}
                className="bg-orange-600 text-white hover:bg-orange-700"
              >
                <Plus className="w-4 h-4 mr-1 rtl:mr-0 rtl:ml-1" />
                طلب جديد
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {/* Search Bar */}
          <div className="space-y-4">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="البحث في الطلبات..."
              className="w-full"
            />
          </div>
        </CardContent>
      </Card>

      {/* Requests Display */}
      {viewMode === 'table' ? (
        <Card className="hover-lift">
          <CardContent className="p-0">
            <Table
              data={filteredRequests}
              columns={columns}
              emptyMessage="لا توجد طلبات"
              className="min-h-[400px]"
            />
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
          {filteredRequests.map((request) => (
            <RequestCard
              key={request.id}
              request={request}
              onView={handleViewRequest}
              onEdit={handleEditRequest}
              onDelete={handleDeleteRequest}
            />
          ))}
        </div>
      )}

      {/* Empty State */}
      {filteredRequests.length === 0 && (
        <Card className="hover-lift">
          <CardContent className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageSquare size={32} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد طلبات</h3>
            <p className="text-gray-600 mb-4">لم يتم العثور على طلبات تطابق معايير البحث</p>
            <Button
              onClick={handleAddRequest}
              className="bg-orange-600 text-white hover:bg-orange-700"
            >
              إضافة طلب جديد
            </Button>
          </CardContent>
        </Card>
      )}

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

export default RequestsList
