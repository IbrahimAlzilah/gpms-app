import React, { useState } from 'react'
import { useLanguage } from '../../context/LanguageContext'
import { cn, getActiveFiltersCount } from '../../lib/utils'
import { Card, CardContent, CardHeader } from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Divider from '../../components/ui/Divider'
import { SearchBar } from '../../components/ui/Filter'
import DataTable from '../../components/ui/DataTable'
import DocumentFormModal from '../../components/forms/DocumentFormModal'
import Modal from '../../components/ui/Modal'
import ConfirmDialog from '../../components/ui/ConfirmDialog'
import SimplePopover from '../../components/ui/SimplePopover'
import AdvancedFilter from '../../components/ui/AdvancedFilter'
import {
  Eye,
  Edit,
  Trash2,
  Download,
  Upload,
  FileText,
  Image,
  File,
  Grid3X3,
  List,
  FolderOpen,
  SlidersHorizontal
} from 'lucide-react'

interface Document {
  id: string
  title: string
  description: string
  type: 'proposal' | 'progress_report' | 'source_code' | 'presentation' | 'design' | 'final_report_chapters' | 'presentation_codes' | 'other'
  fileName: string
  fileSize: string
  uploadedDate: string
  status: 'approved' | 'pending' | 'rejected'
  version: string
  uploadedBy: string
  tags: string[]
  isPublic: boolean
}

const StudentDocuments: React.FC = () => {
  const { t } = useLanguage()
  const [searchQuery, setSearchQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [sortBy, setSortBy] = useState('uploadedDate')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('grid')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingDocument, setEditingDocument] = useState<Document | null>(null)

  // Mock data
  const [documents, setDocuments] = useState<Document[]>([
    {
      id: '1',
      title: 'مقترح المشروع النهائي',
      description: 'المقترح الكامل لمشروع تطبيق المكتبة',
      type: 'proposal',
      fileName: 'project_proposal_v2.pdf',
      fileSize: '2.4 MB',
      uploadedDate: '2024-01-10',
      status: 'approved',
      version: '2.0',
      uploadedBy: 'أحمد محمد',
      tags: ['مقترح', 'PDF', 'مشروع'],
      isPublic: false
    },
    {
      id: '2',
      title: 'تقرير التقدم الأول',
      description: 'تقرير شامل عن تقدم المشروع في الشهر الأول',
      type: 'progress_report',
      fileName: 'progress_report_1.docx',
      fileSize: '1.8 MB',
      uploadedDate: '2024-01-15',
      status: 'pending',
      version: '1.0',
      uploadedBy: 'فاطمة حسن',
      tags: ['تقرير', 'تقدم', 'Word'],
      isPublic: false
    },
    {
      id: '3',
      title: 'الكود المصدري - المرحلة الأولى',
      description: 'الكود المصدري للمرحلة الأولى من التطبيق',
      type: 'source_code',
      fileName: 'source_code_v1.zip',
      fileSize: '15.2 MB',
      uploadedDate: '2024-01-20',
      status: 'approved',
      version: '1.0',
      uploadedBy: 'محمد خالد',
      tags: ['كود', 'مصدر', 'ZIP'],
      isPublic: true
    },
    {
      id: '4',
      title: 'عرض تقديمي للمشروع',
      description: 'العرض التقديمي للمراجعة الأولى',
      type: 'presentation',
      fileName: 'project_presentation.pptx',
      fileSize: '8.7 MB',
      uploadedDate: '2024-01-22',
      status: 'rejected',
      version: '1.0',
      uploadedBy: 'أحمد محمد',
      tags: ['عرض', 'PowerPoint', 'تقديمي'],
      isPublic: false
    },
    {
      id: '5',
      title: 'وثائق التصميم',
      description: 'مخططات التصميم وواجهات المستخدم',
      type: 'design',
      fileName: 'design_documents.pdf',
      fileSize: '5.1 MB',
      uploadedDate: '2024-01-18',
      status: 'approved',
      version: '1.2',
      uploadedBy: 'سارة أحمد',
      tags: ['تصميم', 'مخططات', 'PDF'],
      isPublic: true
    },
    {
      id: '6',
      title: 'الفصل الأول - المقدمة',
      description: 'الفصل الأول من التقرير النهائي - المقدمة والأهداف',
      type: 'final_report_chapters',
      fileName: 'chapter_1_introduction.docx',
      fileSize: '2.8 MB',
      uploadedDate: '2024-01-24',
      status: 'pending',
      version: '1.0',
      uploadedBy: 'أحمد محمد',
      tags: ['تقرير نهائي', 'فصل أول', 'مقدمة'],
      isPublic: false
    },
    {
      id: '7',
      title: 'كود العرض التقديمي',
      description: 'الكود المصدري للعرض التقديمي التفاعلي',
      type: 'presentation_codes',
      fileName: 'presentation_code.zip',
      fileSize: '12.5 MB',
      uploadedDate: '2024-01-26',
      status: 'approved',
      version: '2.1',
      uploadedBy: 'فاطمة حسن',
      tags: ['عرض تقديمي', 'كود', 'تفاعلي'],
      isPublic: true
    }
  ])

  const typeOptions = [
    { value: 'all', label: 'جميع الأنواع' },
    { value: 'proposal', label: 'مقترح' },
    { value: 'progress_report', label: 'تقرير تقدم' },
    { value: 'source_code', label: 'كود مصدري' },
    { value: 'presentation', label: 'عرض تقديمي' },
    { value: 'design', label: 'تصميم' },
    { value: 'final_report_chapters', label: 'فصول التقرير النهائي' },
    { value: 'presentation_codes', label: 'أكواد العرض' },
    { value: 'other', label: 'أخرى' }
  ]

  const statusOptions = [
    { value: 'all', label: 'جميع الحالات' },
    { value: 'approved', label: 'معتمد' },
    { value: 'pending', label: 'قيد المراجعة' },
    { value: 'rejected', label: 'مرفوض' }
  ]

  const sortOptions = [
    { value: 'uploadedDate', label: 'تاريخ الرفع' },
    { value: 'title', label: 'العنوان' },
    { value: 'type', label: 'نوع المستند' },
    { value: 'status', label: 'الحالة' },
    { value: 'fileSize', label: 'حجم الملف' }
  ]

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'proposal':
      case 'progress_report':
        return FileText
      case 'source_code':
        return File
      case 'presentation':
        return FileText
      case 'design':
        return Image
      default:
        return File
    }
  }

  const getTypeText = (type: string) => {
    switch (type) {
      case 'proposal': return 'مقترح'
      case 'progress_report': return 'تقرير تقدم'
      case 'source_code': return 'كود مصدري'
      case 'presentation': return 'عرض تقديمي'
      case 'design': return 'تصميم'
      case 'final_report_chapters': return 'فصول التقرير النهائي'
      case 'presentation_codes': return 'أكواد العرض'
      case 'other': return 'أخرى'
      default: return type
    }
  }


  const getStatusText = (status: string) => {
    switch (status) {
      case 'approved': return 'معتمد'
      case 'pending': return 'قيد المراجعة'
      case 'rejected': return 'مرفوض'
      default: return status
    }
  }

  const filteredDocuments = documents
    .filter(doc => {
      const matchesSearch = !searchQuery ||
        doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.fileName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))

      const matchesType = typeFilter === 'all' || doc.type === typeFilter
      const matchesStatus = statusFilter === 'all' || doc.status === statusFilter

      return matchesSearch && matchesType && matchesStatus
    })
    .sort((a, b) => {
      let comparison = 0

      switch (sortBy) {
        case 'title':
          comparison = a.title.localeCompare(b.title, 'ar')
          break
        case 'uploadedDate':
          comparison = new Date(a.uploadedDate).getTime() - new Date(b.uploadedDate).getTime()
          break
        case 'fileSize':
          // Extract numeric value from file size string
          const aSize = parseFloat(a.fileSize.replace(/[^\d.]/g, ''))
          const bSize = parseFloat(b.fileSize.replace(/[^\d.]/g, ''))
          comparison = aSize - bSize
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

  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false)
  const [docIdToDelete, setDocIdToDelete] = useState<string | null>(null)
  const handleDeleteDocument = (documentId: string) => {
    setDocIdToDelete(documentId)
    setConfirmDeleteOpen(true)
  }

  const [viewDoc, setViewDoc] = useState<Document | null>(null)
  const handleViewDocument = (document: Document) => {
    setViewDoc(document)
  }

  const handleDownloadDocument = (docItem: Document) => {
    // Simulate document download
    const link = window.document.createElement('a')
    link.href = '#'
    link.download = docItem.fileName

    const content = `
مستند: ${docItem.title}
الملف: ${docItem.fileName}
النوع: ${getTypeText(docItem.type)}
الحجم: ${docItem.fileSize}
تاريخ الرفع: ${new Date(docItem.uploadedDate).toLocaleDateString('ar')}
الحالة: ${getStatusText(docItem.status)}
الإصدار: ${docItem.version}
رفع بواسطة: ${docItem.uploadedBy}
${docItem.description ? `الوصف: ${docItem.description}` : ''}

ملاحظة: هذا ملف تجريبي. في التطبيق الحقيقي، سيتم تحميل الملف الفعلي.
    `

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    link.href = url

    window.document.body.appendChild(link)
    link.click()
    window.document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const handleModalSubmit = (data: any) => {
    if (editingDocument) {
      // Update existing document
      setDocuments(prev => prev.map(d =>
        d.id === editingDocument.id
          ? { ...d, ...data, uploadedDate: d.uploadedDate }
          : d
      ))
    } else {
      // Add new document
      const newDocument: Document = {
        id: Math.random().toString(36).substring(7),
        ...data,
        uploadedDate: new Date().toISOString().split('T')[0],
        status: 'pending'
      }
      setDocuments(prev => [newDocument, ...prev])
    }
    setIsModalOpen(false)
    setEditingDocument(null)
  }

  const handleFilterClear = () => {
    setTypeFilter('all')
    setStatusFilter('all')
    setSortBy('uploadedDate')
    setSortOrder('desc')
  }


  const columns = [
    {
      key: 'title',
      label: 'عنوان المستند',
      sortable: true,
      render: (document: Document) => {
        const FileIcon = getFileIcon(document.type)
        return (
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
              <FileIcon className="w-5 h-5 text-gray-600" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">{document.title}</h3>
              <p className="text-sm text-gray-600 line-clamp-1">{document.description}</p>
            </div>
          </div>
        )
      }
    },
    {
      key: 'type',
      label: 'النوع',
      render: (document: Document) => (
        <span className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-full">
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
          document.status === 'approved' ? 'bg-green-100 text-green-800' :
            document.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
              document.status === 'rejected' ? 'bg-red-100 text-red-800' :
                'bg-gray-100 text-gray-800'
        )}>
          {getStatusText(document.status)}
        </span>
      )
    },
    {
      key: 'fileSize',
      label: 'الحجم',
      sortable: true,
      render: (document: Document) => (
        <span className="text-sm text-gray-600">{document.fileSize}</span>
      )
    },
    {
      key: 'uploadedDate',
      label: 'تاريخ الرفع',
      sortable: true,
      render: (document: Document) => (
        <span className="text-sm text-gray-600">
          {new Date(document.uploadedDate).toLocaleDateString('ar')}
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
            className="text-gray-400 hover:text-gray-600 transition-colors"
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
              {/* <FolderOpen className="w-6 h-6 text-gpms-dark" /> */}
              <div>
                <h1 className="text-xl font-bold text-gray-900">إدارة {t('navigation.documents')}</h1>
                {/* <p className="text-gray-600 mt-1">إدارة المستندات والملفات</p> */}
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
                    priorityOptions={[]}
                    typeOptions={typeOptions}
                    sortOptions={sortOptions}
                    statusFilter={statusFilter}
                    priorityFilter="all"
                    typeFilter={typeFilter}
                    sortBy={sortBy}
                    sortOrder={sortOrder}
                    onStatusChange={setStatusFilter}
                    onPriorityChange={() => { }}
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
                    getActiveFiltersCount(statusFilter, typeFilter, searchQuery, sortBy, sortOrder) > 0 && 'bg-gpms-light/10 border-gpms-light text-gpms-dark'
                  )}
                >
                  <SlidersHorizontal size={16} className="mr-1 rtl:mr-0 rtl:ml-1" />
                  {t('common.filter')}
                  {getActiveFiltersCount(statusFilter, typeFilter, searchQuery, sortBy, sortOrder) > 0 && (
                    <span className="absolute -top-1 -right-1 rtl:right-auto rtl:-left-1 bg-gpms-dark text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {getActiveFiltersCount(statusFilter, typeFilter, searchQuery, sortBy, sortOrder)}
                    </span>
                  )}
                </Button>
              </SimplePopover>

              <Button
                onClick={handleAddDocument}
                className="bg-gpms-dark text-white hover:bg-gpms-light"
              >
                <Upload className="w-4 h-4 mr-1 rtl:mr-0 rtl:ml-1" />
                رفع مستند
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
              placeholder="البحث في المستندات..."
              className="w-full"
            />
          </div> */}

          {/* Documents Display */}
          {viewMode === 'table' ? (
            <Card className="hover-lift">
              <CardContent className="p-0">
                <DataTable
                  data={filteredDocuments}
                  columns={columns}
                  emptyMessage="لا توجد مستندات"
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
              {filteredDocuments.map((doc) => {
                const FileIcon = getFileIcon(doc.type)

                return (
                  <Card key={doc.id} className="1hover-lift">
                    <CardContent className="p-6">
                      {/* Document Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center">
                          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center ml-3 rtl:ml-0 rtl:mr-3">
                            <FileIcon size={24} className="text-gray-600" />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900 mb-1">{doc.title}</h3>
                            <p className="text-sm text-gray-600 line-clamp-2">{doc.description}</p>
                          </div>
                        </div>
                        <span className={cn(
                          'px-2 py-1 text-xs rounded-full',
                          doc.status === 'approved' ? 'bg-green-100 text-green-800' :
                            doc.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              doc.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                'bg-gray-100 text-gray-800'
                        )}>
                          {getStatusText(doc.status)}
                        </span>
                      </div>

                      {/* Document Info */}
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center justify-between text-sm text-gray-600">
                          <span>اسم الملف:</span>
                          <span className="font-medium text-xs">{doc.fileName}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm text-gray-600">
                          <span>الحجم:</span>
                          <span>{doc.fileSize}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm text-gray-600">
                          <span>الإصدار:</span>
                          <span>{doc.version}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm text-gray-600">
                          <span>تاريخ الرفع:</span>
                          <span>{new Date(doc.uploadedDate).toLocaleDateString('ar')}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm text-gray-600">
                          <span>رفع بواسطة:</span>
                          <span>{doc.uploadedBy}</span>
                        </div>
                      </div>

                      {/* Type Badge and Public Status */}
                      <div className="flex items-center justify-between mb-4">
                        <span className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-full">
                          {getTypeText(doc.type)}
                        </span>
                        {doc.isPublic && (
                          <span className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full">
                            عام
                          </span>
                        )}
                      </div>

                      {/* Tags */}
                      {doc.tags.length > 0 && (
                        <div className="mb-4">
                          <div className="flex flex-wrap gap-1">
                            {doc.tags.map((tag, index) => (
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
                            onClick={() => handleViewDocument(doc)}
                            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                            title="عرض"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            onClick={() => handleDownloadDocument(doc)}
                            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                            title="تحميل"
                          >
                            <Download size={16} />
                          </button>
                          <button
                            onClick={() => handleEditDocument(doc)}
                            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                            title="تعديل"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteDocument(doc.id)}
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
                )
              })}
            </div>
          )}

          {/* Empty State */}
          {filteredDocuments.length === 0 && (
            <Card className="hover-lift">
              <CardContent className="text-center py-12">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Upload size={32} className="text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد مستندات</h3>
                <p className="text-gray-600 mb-4">لم يتم العثور على مستندات تطابق معايير البحث</p>
                <Button
                  onClick={handleAddDocument}
                  className="bg-gpms-dark text-white hover:bg-gpms-light"
                >
                  رفع مستند جديد
                </Button>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>

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
      <Modal
        isOpen={!!viewDoc}
        onClose={() => setViewDoc(null)}
        title={viewDoc ? `معاينة المستند: ${viewDoc.title}` : 'معاينة المستند'}
        size="lg"
      >
        {viewDoc && (
          <div className="space-y-4 text-sm text-gray-700">
            <div className="grid grid-cols-2 gap-4">
              <div><span className="font-medium">النوع:</span> {getTypeText(viewDoc.type)}</div>
              <div><span className="font-medium">الحجم:</span> {viewDoc.fileSize}</div>
              <div><span className="font-medium">تاريخ الرفع:</span> {new Date(viewDoc.uploadedDate).toLocaleDateString('ar')}</div>
              <div><span className="font-medium">الحالة:</span> {getStatusText(viewDoc.status)}</div>
              <div><span className="font-medium">الإصدار:</span> {viewDoc.version}</div>
              <div><span className="font-medium">رفع بواسطة:</span> {viewDoc.uploadedBy}</div>
            </div>
            <div>
              <span className="font-medium">الوصف:</span>
              <p className="mt-1 text-gray-600">{viewDoc.description}</p>
            </div>
            {viewDoc.tags?.length ? (
              <div className="flex flex-wrap gap-2">
                {viewDoc.tags.map((tag, i) => (
                  <span key={i} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">{tag}</span>
                ))}
              </div>
            ) : null}
            <div className="flex justify-end">
              <Button onClick={() => handleDownloadDocument(viewDoc)} className="bg-gpms-dark text-white hover:bg-gpms-light">
                <Download className="w-4 h-4 mr-1 rtl:mr-0 rtl:ml-1" />
                تحميل
              </Button>
            </div>
          </div>
        )}
      </Modal>
      <ConfirmDialog
        isOpen={confirmDeleteOpen}
        title="تأكيد الحذف"
        description="هل أنت متأكد من حذف هذا المستند؟"
        variant="destructive"
        onConfirm={() => {
          if (docIdToDelete) {
            setDocuments(prev => prev.filter(d => d.id !== docIdToDelete))
          }
          setConfirmDeleteOpen(false)
          setDocIdToDelete(null)
        }}
        onCancel={() => {
          setConfirmDeleteOpen(false)
          setDocIdToDelete(null)
        }}
      />
    </div>
  )
}

export default StudentDocuments
