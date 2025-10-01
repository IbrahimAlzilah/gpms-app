import React, { useState } from 'react'
import { useLanguage } from '../../context/LanguageContext'
import { cn } from '../../lib/utils'
import { Card, CardContent, CardHeader } from '../ui/Card'
import Button from '../ui/Button'
import Input from '../ui/Input'
import Badge from '../ui/Badge'
import { Table } from '../ui/Table'
import { SearchBar, FilterDropdown, FilterBar } from '../ui/Filter'
import GridView, { RequestCard } from '../ui/GridView'
import ViewToggle from '../ui/ViewToggle'
import { 
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  MoreVertical,
  MessageSquare,
  Calendar,
  User,
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react'
import RequestFormModal from '../forms/RequestFormModal'

interface Request {
  id: string
  type: 'supervision' | 'meeting' | 'extension' | 'change' | 'other'
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
}

interface RequestsTableProps {
  className?: string
}

const RequestsTable: React.FC<RequestsTableProps> = ({ className }) => {
  const { t } = useLanguage()
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [sortBy, setSortBy] = useState('updatedAt')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingRequest, setEditingRequest] = useState<Request | null>(null)
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table')

  // Mock data
  const [requests, setRequests] = useState<Request[]>([
    {
      id: '1',
      type: 'supervision',
      title: 'طلب إشراف على مشروع الذكاء الاصطناعي',
      description: 'أطلب الإشراف على مشروع تطوير نموذج ذكي لتحليل البيانات الطبية',
      status: 'pending',
      priority: 'high',
      student: 'أحمد محمد علي',
      supervisor: 'د. سارة أحمد حسن',
      requestedDate: '2024-02-01',
      createdAt: '2024-01-20',
      updatedAt: '2024-01-22',
      reason: 'المشروع يتطلب خبرة في مجال الذكاء الاصطناعي والتحليل الطبي'
    },
    {
      id: '2',
      type: 'meeting',
      title: 'طلب اجتماع لمناقشة تقدم المشروع',
      description: 'أطلب جدولة اجتماع لمناقشة التقدم المحرز في المرحلة الأولى',
      status: 'approved',
      priority: 'medium',
      student: 'فاطمة علي محمد',
      supervisor: 'د. خالد محمود الحسن',
      requestedDate: '2024-01-25',
      createdAt: '2024-01-18',
      updatedAt: '2024-01-21',
      reason: 'انتهيت من المرحلة الأولى وأحتاج لمراجعة التقدم'
    },
    {
      id: '3',
      type: 'extension',
      title: 'طلب تمديد موعد تسليم التقرير',
      description: 'أطلب تمديد موعد تسليم تقرير المرحلة الثانية لمدة أسبوع',
      status: 'rejected',
      priority: 'low',
      student: 'محمد خالد محمود',
      supervisor: 'د. أحمد محمد علي',
      requestedDate: '2024-01-30',
      createdAt: '2024-01-15',
      updatedAt: '2024-01-20',
      reason: 'واجهت بعض الصعوبات التقنية في تطوير النظام'
    },
    {
      id: '4',
      type: 'change',
      title: 'طلب تغيير عنوان المشروع',
      description: 'أطلب تغيير عنوان المشروع ليعكس المحتوى الفعلي بشكل أفضل',
      status: 'in_progress',
      priority: 'medium',
      student: 'سارة أحمد حسن',
      supervisor: 'د. فاطمة علي محمد',
      requestedDate: '2024-01-28',
      createdAt: '2024-01-12',
      updatedAt: '2024-01-19',
      reason: 'العنوان الحالي لا يعكس طبيعة المشروع الفعلية'
    },
    {
      id: '5',
      type: 'other',
      title: 'طلب استخدام معمل الحاسوب',
      description: 'أطلب استخدام معمل الحاسوب المتقدم لإجراء التجارب',
      status: 'pending',
      priority: 'low',
      student: 'خالد محمود الحسن',
      requestedDate: '2024-02-05',
      createdAt: '2024-01-22',
      updatedAt: '2024-01-22',
      reason: 'المشروع يتطلب أجهزة متطورة غير متوفرة في المعمل العادي'
    }
  ])

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
    { value: 'change', label: 'طلب تغيير' },
    { value: 'other', label: 'طلب آخر' }
  ]

  const priorityOptions = [
    { value: 'all', label: 'جميع الأولويات' },
    { value: 'low', label: 'منخفض' },
    { value: 'medium', label: 'متوسط' },
    { value: 'high', label: 'عالي' }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'warning'
      case 'approved': return 'success'
      case 'rejected': return 'error'
      case 'in_progress': return 'info'
      default: return 'default'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending': return 'قيد الانتظار'
      case 'approved': return 'موافق عليه'
      case 'rejected': return 'مرفوض'
      case 'in_progress': return 'قيد المعالجة'
      default: return status
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'supervision': return 'طلب إشراف'
      case 'meeting': return 'طلب اجتماع'
      case 'extension': return 'طلب تمديد'
      case 'change': return 'طلب تغيير'
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

  const getPriorityLabel = (priority: string) => {
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
        request.student.toLowerCase().includes(searchQuery.toLowerCase())
      
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
        case 'student':
          comparison = a.student.localeCompare(b.student, 'ar')
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
        <Badge variant="info">
          {getTypeLabel(request.type)}
        </Badge>
      )
    },
    {
      key: 'status',
      label: 'الحالة',
      render: (request: Request) => (
        <Badge variant={getStatusColor(request.status)}>
          {getStatusLabel(request.status)}
        </Badge>
      )
    },
    {
      key: 'priority',
      label: 'الأولوية',
      render: (request: Request) => (
        <span className={cn('px-2 py-1 rounded-full text-xs font-medium', getPriorityColor(request.priority))}>
          {getPriorityLabel(request.priority)}
        </span>
      )
    },
    {
      key: 'student',
      label: 'الطالب',
      sortable: true,
      render: (request: Request) => (
        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          <div className="w-8 h-8 bg-gpms-light rounded-full flex items-center justify-center text-white text-sm font-medium">
            {request.student.charAt(0)}
          </div>
          <span className="text-sm text-gray-900">{request.student}</span>
        </div>
      )
    },
    {
      key: 'supervisor',
      label: 'المشرف',
      render: (request: Request) => (
        <span className="text-sm text-gray-600">
          {request.supervisor || 'غير محدد'}
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
    <div className={cn('space-y-6', className)}>
      {/* Header */}
      <Card className="hover-lift">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 rtl:space-x-reverse">
              <MessageSquare className="w-6 h-6 text-gpms-dark" />
              <h2 className="text-xl font-bold text-gray-900">إدارة الطلبات</h2>
            </div>
            
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              {/* View Mode Toggle */}
              <ViewToggle
                viewMode={viewMode}
                onViewModeChange={setViewMode}
              />
              
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

        <CardContent>
          {/* Search and Filters */}
          <div className="space-y-4">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="البحث في الطلبات..."
              className="w-full"
            />

            <FilterBar>
              <FilterDropdown
                label="الحالة"
                value={statusFilter}
                onChange={setStatusFilter}
                options={statusOptions}
              />
              
              <FilterDropdown
                label="النوع"
                value={typeFilter}
                onChange={setTypeFilter}
                options={typeOptions}
              />
              
              <FilterDropdown
                label="الأولوية"
                value={priorityFilter}
                onChange={setPriorityFilter}
                options={priorityOptions}
              />
              
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-gpms-light focus:border-transparent"
              >
                <option value="updatedAt">آخر تحديث</option>
                <option value="title">العنوان</option>
                <option value="student">الطالب</option>
                <option value="requestedDate">التاريخ المطلوب</option>
                <option value="createdAt">تاريخ الإنشاء</option>
              </select>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
              >
                {sortOrder === 'asc' ? '↑' : '↓'}
              </Button>
            </FilterBar>
          </div>
        </CardContent>
      </Card>

      {/* Requests Table/Grid */}
      <Card className="hover-lift">
        <CardContent className="p-0">
          {viewMode === 'table' ? (
            <Table
              data={filteredRequests}
              columns={columns}
              emptyMessage="لا توجد طلبات"
              className="min-h-[400px]"
            />
          ) : (
            <div className="p-4">
              <GridView
                data={filteredRequests}
                renderItem={(request) => (
                  <RequestCard
                    request={request}
                    onView={handleViewRequest}
                    onEdit={handleEditRequest}
                    onDelete={handleDeleteRequest}
                  />
                )}
                emptyMessage="لا توجد طلبات"
                className="min-h-[400px]"
              />
            </div>
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

export default RequestsTable
