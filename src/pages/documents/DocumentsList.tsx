import React, { useState } from 'react'
import { useLanguage } from '../../context/LanguageContext'
import { cn } from '../../lib/utils'
import { Card, CardContent, CardHeader } from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import { SearchBar } from '../../components/ui/Filter'
import { Table } from '../../components/ui/Table'
import GridView, { DocumentCard } from '../../components/ui/GridView'
import ViewToggle from '../../components/ui/ViewToggle'
import AdvancedFilter from '../../components/ui/AdvancedFilter'
import DocumentFormModal from '../../components/forms/DocumentFormModal'
import { 
  Plus, 
  Eye, 
  Edit, 
  Trash2,
  Download,
  Calendar,
  User,
  FileText,
  CheckCircle,
  Clock,
  AlertCircle,
  Upload
} from 'lucide-react'

interface Document {
  id: string
  title: string
  description: string
  type: 'chapter1' | 'final_report' | 'code' | 'presentation' | 'other'
  status: 'draft' | 'submitted' | 'approved' | 'rejected' | 'pending_review'
  priority: 'low' | 'medium' | 'high'
  author: string
  authorRole: 'student' | 'supervisor'
  uploadDate: string
  reviewDate?: string
  reviewer?: string
  comments?: string
  fileSize: string
  fileType: string
  version: string
  tags: string[]
  createdAt: string
  updatedAt: string
}

const DocumentsList: React.FC = () => {
  const { t } = useLanguage()
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [sortBy, setSortBy] = useState('updatedAt')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('grid')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingDocument, setEditingDocument] = useState<Document | null>(null)
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  // Mock data
  const [documents, setDocuments] = useState<Document[]>([
    {
      id: '1',
      title: 'الفصل الأول - مقدمة المشروع',
      description: 'مقدمة شاملة عن مشروع تطوير نظام إدارة المكتبة الذكية',
      type: 'chapter1',
      status: 'approved',
      priority: 'high',
      author: 'أحمد محمد علي',
      authorRole: 'student',
      uploadDate: '2024-01-15',
      reviewDate: '2024-01-20',
      reviewer: 'د. سارة أحمد حسن',
      comments: 'ممتاز، يحتاج لبعض التحسينات في المراجع',
      fileSize: '2.5 MB',
      fileType: 'PDF',
      version: '1.2',
      tags: ['فصل أول', 'مقدمة', 'نظام إدارة'],
      createdAt: '2024-01-15',
      updatedAt: '2024-01-20'
    },
    {
      id: '2',
      title: 'التقرير النهائي للمشروع',
      description: 'تقرير شامل يلخص جميع مراحل تطوير النظام والنتائج المحققة',
      type: 'final_report',
      status: 'submitted',
      priority: 'high',
      author: 'فاطمة علي محمد',
      authorRole: 'student',
      uploadDate: '2024-01-18',
      fileSize: '5.8 MB',
      fileType: 'PDF',
      version: '2.0',
      tags: ['تقرير نهائي', 'نتائج', 'تطوير'],
      createdAt: '2024-01-18',
      updatedAt: '2024-01-22'
    },
    {
      id: '3',
      title: 'كود المصدر - الواجهة الأمامية',
      description: 'كود React.js للواجهة الأمامية لنظام إدارة المكتبة',
      type: 'code',
      status: 'pending_review',
      priority: 'medium',
      author: 'محمد خالد محمود',
      authorRole: 'student',
      uploadDate: '2024-01-20',
      fileSize: '15.2 MB',
      fileType: 'ZIP',
      version: '1.0',
      tags: ['كود', 'React', 'واجهة أمامية'],
      createdAt: '2024-01-20',
      updatedAt: '2024-01-22'
    },
    {
      id: '4',
      title: 'عرض تقديمي - الدفاع عن المشروع',
      description: 'عرض تقديمي شامل للدفاع عن مشروع الذكاء الاصطناعي',
      type: 'presentation',
      status: 'draft',
      priority: 'low',
      author: 'سارة أحمد حسن',
      authorRole: 'student',
      uploadDate: '2024-01-22',
      fileSize: '8.7 MB',
      fileType: 'PPTX',
      version: '0.5',
      tags: ['عرض تقديمي', 'دفاع', 'ذكاء اصطناعي'],
      createdAt: '2024-01-22',
      updatedAt: '2024-01-22'
    },
    {
      id: '5',
      title: 'دليل المستخدم - النظام الجديد',
      description: 'دليل شامل لاستخدام نظام إدارة المستودعات',
      type: 'other',
      status: 'rejected',
      priority: 'medium',
      author: 'د. خالد محمود الحسن',
      authorRole: 'supervisor',
      uploadDate: '2024-01-10',
      reviewDate: '2024-01-15',
      reviewer: 'د. نورا أحمد محمد',
      comments: 'يحتاج لإعادة كتابة مع إضافة المزيد من الصور التوضيحية',
      fileSize: '3.1 MB',
      fileType: 'PDF',
      version: '1.1',
      tags: ['دليل مستخدم', 'نظام', 'مستودعات'],
      createdAt: '2024-01-10',
      updatedAt: '2024-01-15'
    }
  ])

  const getStatusText = (status: string) => {
    switch (status) {
      case 'draft': return 'مسودة'
      case 'submitted': return 'مُرسل'
      case 'approved': return 'موافق عليه'
      case 'rejected': return 'مرفوض'
      case 'pending_review': return 'قيد المراجعة'
      default: return status
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800'
      case 'submitted': return 'bg-blue-100 text-blue-800'
      case 'approved': return 'bg-green-100 text-green-800'
      case 'rejected': return 'bg-red-100 text-red-800'
      case 'pending_review': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeText = (type: string) => {
    switch (type) {
      case 'chapter1': return 'فصل أول'
      case 'final_report': return 'تقرير نهائي'
      case 'code': return 'كود'
      case 'presentation': return 'عرض تقديمي'
      case 'other': return 'أخرى'
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

  const filteredDocuments = documents
    .filter(document => {
      const matchesSearch = !searchQuery ||
        document.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        document.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        document.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))

      const matchesStatus = statusFilter === 'all' || document.status === statusFilter
      const matchesType = typeFilter === 'all' || document.type === typeFilter
      const matchesPriority = priorityFilter === 'all' || document.priority === priorityFilter

      return matchesSearch && matchesStatus && matchesType && matchesPriority
    })
    .sort((a, b) => {
      let comparison = 0

      switch (sortBy) {
        case 'title':
          comparison = a.title.localeCompare(b.title, 'ar')
          break
        case 'uploadDate':
          comparison = new Date(a.uploadDate).getTime() - new Date(b.uploadDate).getTime()
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

  const handleAddDocument = () => {
    setEditingDocument(null)
    setIsModalOpen(true)
  }

  const handleEditDocument = (document: Document) => {
    setEditingDocument(document)
    setIsModalOpen(true)
  }

  const handleDeleteDocument = (documentId: string) => {
    if (window.confirm('هل أنت متأكد من حذف هذا المستند؟')) {
      setDocuments(prev => prev.filter(d => d.id !== documentId))
    }
  }

  const handleViewDocument = (document: Document) => {
    console.log('View document:', document)
    // Implement view functionality
  }

  const handleDownloadDocument = (document: Document) => {
    console.log('Download document:', document)
    // Implement download functionality
  }

  const handleModalSubmit = (data: any) => {
    if (editingDocument) {
      // Update existing document
      setDocuments(prev => prev.map(d =>
        d.id === editingDocument.id
          ? { ...d, ...data, updatedAt: new Date().toISOString().split('T')[0] }
          : d
      ))
    } else {
      // Add new document
      const newDocument: Document = {
        id: Math.random().toString(36).substring(7),
        ...data,
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0],
        status: 'draft'
      }
      setDocuments(prev => [newDocument, ...prev])
    }
    setIsModalOpen(false)
    setEditingDocument(null)
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
      label: 'عنوان المستند',
      sortable: true,
      render: (document: Document) => (
        <div>
          <h3 className="font-medium text-gray-900">{document.title}</h3>
          <p className="text-sm text-gray-600 line-clamp-1">{document.description}</p>
        </div>
      )
    },
    {
      key: 'type',
      label: 'نوع المستند',
      render: (document: Document) => (
        <span className="px-2 py-1 text-xs rounded-full bg-indigo-100 text-indigo-800">
          {getTypeText(document.type)}
        </span>
      )
    },
    {
      key: 'status',
      label: 'الحالة',
      render: (document: Document) => (
        <span className={cn(
          'px-2 py-1 text-xs rounded-full',
          getStatusColor(document.status)
        )}>
          {getStatusText(document.status)}
        </span>
      )
    },
    {
      key: 'author',
      label: 'المؤلف',
      render: (document: Document) => (
        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 text-sm font-medium">
            {document.author.charAt(0)}
          </div>
          <div>
            <span className="text-sm text-gray-900">{document.author}</span>
            <div className="text-xs text-gray-500">{getRoleText(document.authorRole)}</div>
          </div>
        </div>
      )
    },
    {
      key: 'fileInfo',
      label: 'معلومات الملف',
      render: (document: Document) => (
        <div className="text-sm text-gray-600">
          <div>{document.fileSize}</div>
          <div className="text-xs text-gray-500">{document.fileType}</div>
        </div>
      )
    },
    {
      key: 'version',
      label: 'الإصدار',
      render: (document: Document) => (
        <span className="text-sm text-gray-600">v{document.version}</span>
      )
    },
    {
      key: 'uploadDate',
      label: 'تاريخ الرفع',
      sortable: true,
      render: (document: Document) => (
        <span className="text-sm text-gray-600">
          {new Date(document.uploadDate).toLocaleDateString('ar')}
        </span>
      )
    },
    {
      key: 'actions',
      label: 'الإجراءات',
      render: (document: Document) => (
        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          <button
            onClick={() => handleViewDocument(document)}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            title="عرض"
          >
            <Eye size={16} />
          </button>
          <button
            onClick={() => handleDownloadDocument(document)}
            className="text-green-600 hover:text-green-700 transition-colors"
            title="تحميل"
          >
            <Download size={16} />
          </button>
          <button
            onClick={() => handleEditDocument(document)}
            className="text-blue-600 hover:text-blue-700 transition-colors"
            title="تعديل"
          >
            <Edit size={16} />
          </button>
          <button
            onClick={() => handleDeleteDocument(document.id)}
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
              <FileText className="w-6 h-6 text-indigo-600" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">قائمة المستندات</h1>
                <p className="text-gray-600 mt-1">إدارة ومتابعة جميع المستندات</p>
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
                onClick={handleAddDocument}
                className="bg-indigo-600 text-white hover:bg-indigo-700"
              >
                <Upload className="w-4 h-4 mr-1 rtl:mr-0 rtl:ml-1" />
                مستند جديد
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
              placeholder="البحث في المستندات..."
              className="w-full"
            />
          </div>
        </CardContent>
      </Card>

      {/* Documents Display */}
      {viewMode === 'table' ? (
        <Card className="hover-lift">
          <CardContent className="p-0">
            <Table
              data={filteredDocuments}
              columns={columns}
              emptyMessage="لا توجد مستندات"
              className="min-h-[400px]"
            />
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
          {filteredDocuments.map((document) => (
            <DocumentCard
              key={document.id}
              document={document}
              onView={handleViewDocument}
              onEdit={handleEditDocument}
              onDelete={handleDeleteDocument}
              onDownload={handleDownloadDocument}
            />
          ))}
        </div>
      )}

      {/* Empty State */}
      {filteredDocuments.length === 0 && (
        <Card className="hover-lift">
          <CardContent className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText size={32} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد مستندات</h3>
            <p className="text-gray-600 mb-4">لم يتم العثور على مستندات تطابق معايير البحث</p>
            <Button
              onClick={handleAddDocument}
              className="bg-indigo-600 text-white hover:bg-indigo-700"
            >
              رفع مستند جديد
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Modal */}
      <DocumentFormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setEditingDocument(null)
        }}
        onSubmit={handleModalSubmit}
        editData={editingDocument}
      />
    </div>
  )
}

export default DocumentsList
