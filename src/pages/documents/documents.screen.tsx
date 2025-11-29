import React, { useState, useMemo } from 'react'
import { useLanguage } from '@/context/LanguageContext'
import { useAuth } from '@/context/AuthContext'
import { cn, getActiveFiltersCount } from '@/lib/utils'
import { Card, CardContent, CardHeader } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Divider from '@/components/ui/Divider'
import DataTable from '@/components/ui/DataTable'
import SimplePopover from '@/components/ui/SimplePopover'
import AdvancedFilter from '@/components/ui/AdvancedFilter'
import Modal from '@/components/ui/Modal'
import ConfirmDialog from '@/components/ui/ConfirmDialog'
import DocumentFormModal from '@/components/forms/DocumentFormModal'
import { ViewModeToggle } from '@/components/shared'
import { StatusBadge, PriorityBadge } from '@/components/shared'
import {
  Eye,
  Edit,
  Trash2,
  Download,
  Plus,
  FileText,
  Image,
  File,
  MessageSquare,
  SlidersHorizontal
} from 'lucide-react'
import { Document } from './schema'
import { useDocuments } from './documents.hook'

const DocumentsScreen: React.FC = () => {
  const { t } = useLanguage()
  const { user } = useAuth()
  const { documents: hookDocuments, isLoading } = useDocuments()
  const [documents, setDocuments] = useState<Document[]>(hookDocuments)
  const [searchQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [sortBy, setSortBy] = useState('uploadedDate')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('grid')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingDocument, setEditingDocument] = useState<Document | null>(null)
  const [viewDocument, setViewDocument] = useState<Document | null>(null)
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)

  // Role-based view: students see documents, supervisors see notes
  const isNoteView = user?.role === 'supervisor'

  const typeOptions = [
    { value: 'all', label: 'جميع الأنواع' },
    { value: 'proposal', label: 'مقترح' },
    { value: 'progress_report', label: 'تقرير تقدم' },
    { value: 'source_code', label: 'كود مصدري' },
    { value: 'presentation', label: 'عرض تقديمي' },
    { value: 'design', label: 'تصميم' },
    { value: 'final_report_chapters', label: 'فصول التقرير النهائي' },
    { value: 'presentation_codes', label: 'أكواد العرض' },
    { value: 'note', label: 'ملاحظة' },
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
    { value: 'createdAt', label: 'تاريخ الإنشاء' },
    { value: 'updatedAt', label: 'آخر تحديث' },
    { value: 'title', label: 'العنوان' },
    { value: 'fileSize', label: 'الحجم' }
  ]

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'proposal':
      case 'progress_report':
      case 'final_report_chapters':
        return FileText
      case 'source_code':
      case 'presentation_codes':
        return File
      case 'presentation':
        return FileText
      case 'design':
        return Image
      case 'note':
        return MessageSquare
      default:
        return File
    }
  }

  const getTypeText = (type: string) => {
    const typeMap: Record<string, string> = {
      proposal: 'مقترح',
      progress_report: 'تقرير تقدم',
      source_code: 'كود مصدري',
      presentation: 'عرض تقديمي',
      design: 'تصميم',
      final_report_chapters: 'فصول التقرير النهائي',
      presentation_codes: 'أكواد العرض',
      note: 'ملاحظة',
      other: 'أخرى'
    }
    return typeMap[type] || type
  }


  const filteredDocuments = useMemo(() => {
    return documents.filter(doc => {
      // Filter by document type (notes vs documents)
      if (isNoteView && doc.type !== 'note') return false
      if (!isNoteView && doc.type === 'note') return false

      const matchesSearch = !searchQuery ||
        doc.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.content?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.fileName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))

      const matchesType = typeFilter === 'all' || doc.type === typeFilter
      const matchesStatus = statusFilter === 'all' || doc.status === statusFilter

      return matchesSearch && matchesType && matchesStatus
    }).sort((a, b) => {
      let comparison = 0
      const dateA = a.uploadedDate || a.createdAt || a.updatedAt || ''
      const dateB = b.uploadedDate || b.createdAt || b.updatedAt || ''

      switch (sortBy) {
        case 'title':
          comparison = (a.title || '').localeCompare(b.title || '', 'ar')
          break
        case 'uploadedDate':
        case 'createdAt':
        case 'updatedAt':
          comparison = new Date(dateA).getTime() - new Date(dateB).getTime()
          break
        case 'fileSize':
          const aSize = parseFloat((a.fileSize || '0').replace(/[^\d.]/g, ''))
          const bSize = parseFloat((b.fileSize || '0').replace(/[^\d.]/g, ''))
          comparison = aSize - bSize
          break
        default:
          comparison = 0
      }

      return sortOrder === 'asc' ? comparison : -comparison
    })
  }, [documents, searchQuery, typeFilter, statusFilter, sortBy, sortOrder, isNoteView])

  const canCreate = user?.role === 'student' || user?.role === 'supervisor'
  const canEdit = user?.role === 'student' || user?.role === 'supervisor'
  const canDelete = user?.role === 'student' || user?.role === 'supervisor'

  const handleFilterClear = () => {
    setTypeFilter('all')
    setStatusFilter('all')
    setSortBy('uploadedDate')
    setSortOrder('desc')
  }

  const handleDownloadDocument = (doc: Document) => {
    if (doc.fileName) {
      const link = window.document.createElement('a')
      link.href = '#'
      link.download = doc.fileName
      window.document.body.appendChild(link)
      link.click()
      window.document.body.removeChild(link)
    }
  }

  const columns = useMemo(() => [
    {
      key: 'title',
      label: isNoteView ? 'عنوان الملاحظة' : 'عنوان المستند',
      sortable: true,
      render: (doc: Document) => {
        const FileIcon = getFileIcon(doc.type || 'other')
        return (
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
              <FileIcon className="w-5 h-5 text-gray-600" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">{doc.title}</h3>
              <p className="text-sm text-gray-600 line-clamp-1">
                {doc.description || doc.content || doc.fileName}
              </p>
            </div>
          </div>
        )
      }
    },
    {
      key: 'type',
      label: 'النوع',
      render: (doc: Document) => (
        <span className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-full">
          {getTypeText(doc.type || 'other')}
        </span>
      )
    },
    {
      key: 'status',
      label: 'الحالة',
      render: (doc: Document) => doc.status ? (
        <StatusBadge status={doc.status} />
      ) : doc.priority ? (
        <PriorityBadge priority={doc.priority} />
      ) : null
    },
    {
      key: 'fileSize',
      label: isNoteView ? 'المشروع' : 'الحجم',
      sortable: !isNoteView,
      render: (doc: Document) => (
        <span className="text-sm text-gray-600">
          {isNoteView ? doc.project : doc.fileSize || '-'}
        </span>
      )
    },
    {
      key: 'uploadedDate',
      label: 'التاريخ',
      sortable: true,
      render: (doc: Document) => (
        <span className="text-sm text-gray-600">
          {new Date(doc.uploadedDate || doc.createdAt || doc.updatedAt || '').toLocaleDateString('ar')}
        </span>
      )
    },
    {
      key: 'actions',
      label: 'الإجراءات',
      render: (doc: Document) => (
        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          <button
            onClick={() => setViewDocument(doc)}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            title="عرض"
          >
            <Eye size={16} />
          </button>
          {doc.fileName && !isNoteView && (
            <button
              onClick={() => handleDownloadDocument(doc)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              title="تحميل"
            >
              <Download size={16} />
            </button>
          )}
          {canEdit && (
            <button
              onClick={() => {
                setEditingDocument(doc)
                setIsModalOpen(true)
              }}
              className="text-blue-600 hover:text-blue-700 transition-colors"
              title="تعديل"
            >
              <Edit size={16} />
            </button>
          )}
          {canDelete && (
            <button
              onClick={() => setConfirmDeleteId(doc.id)}
              className="text-red-600 hover:text-red-700 transition-colors"
              title="حذف"
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>
      )
    }
  ], [isNoteView, canEdit, canDelete])

  return (
    <div className="space-y-6">
      <Card className="hover-lift">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                {isNoteView ? 'الملاحظات' : t('navigation.documents')}
              </h1>
            </div>
            <div className="flex items-center space-x-3 rtl:space-x-reverse">
              <ViewModeToggle viewMode={viewMode} onViewModeChange={setViewMode} />
              <SimplePopover
                content={
                  <AdvancedFilter
                    statusOptions={statusOptions}
                    priorityOptions={typeOptions}
                    sortOptions={sortOptions}
                    statusFilter={statusFilter}
                    priorityFilter={typeFilter}
                    sortBy={sortBy}
                    sortOrder={sortOrder}
                    onStatusChange={setStatusFilter}
                    onPriorityChange={setTypeFilter}
                    onSortChange={setSortBy}
                    onSortOrderChange={setSortOrder}
                    onApply={() => { }}
                    onClear={handleFilterClear}
                  />
                }
              >
                <Button variant="outline" size="md" className={cn(
                  'relative',
                  getActiveFiltersCount(statusFilter, typeFilter, searchQuery, sortBy, sortOrder) > 0 && 'bg-gpms-light/10 border-gpms-light text-gpms-dark'
                )}>
                  <SlidersHorizontal size={16} className="mr-1 rtl:mr-0 rtl:ml-1" />
                  {t('common.filter')}
                </Button>
              </SimplePopover>
              {canCreate && (
                <Button
                  onClick={() => {
                    setEditingDocument(null)
                    setIsModalOpen(true)
                  }}
                  className="bg-gpms-dark text-white hover:bg-gpms-light"
                >
                  <Plus className="w-4 h-4 mr-1 rtl:mr-0 rtl:ml-1" />
                  {isNoteView ? 'ملاحظة جديدة' : 'إضافة مستند'}
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <Divider />
        <CardContent>
          {isLoading ? (
            <div className="text-center py-12">جاري التحميل...</div>
          ) : viewMode === 'table' ? (
            <DataTable
              data={filteredDocuments}
              columns={columns}
              emptyMessage={isNoteView ? 'لا توجد ملاحظات' : 'لا توجد مستندات'}
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
              {filteredDocuments.map((doc) => {
                const FileIcon = getFileIcon(doc.type || 'other')
                return (
                  <Card key={doc.id} className="hover-lift">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                          <FileIcon className="w-6 h-6 text-gray-600" />
                        </div>
                        {doc.status && <StatusBadge status={doc.status} />}
                        {doc.priority && !doc.status && <PriorityBadge priority={doc.priority} />}
                      </div>
                      <h3 className="text-md font-semibold text-gray-900 mb-2">{doc.title}</h3>
                      <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                        {doc.description || doc.content || doc.fileName}
                      </p>
                      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                        <button
                          onClick={() => setViewDocument(doc)}
                          className="text-gpms-dark hover:text-gpms-light text-sm font-medium transition-colors"
                        >
                          عرض التفاصيل
                        </button>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <DocumentFormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setEditingDocument(null)
        }}
        onSubmit={(data) => {
          if (editingDocument) {
            setDocuments(prev => prev.map(d =>
              d.id === editingDocument.id ? { ...d, ...data } : d
            ))
          } else {
            const newDoc: Document = {
              id: Math.random().toString(36).substring(7),
              ...data,
              uploadedDate: new Date().toISOString().split('T')[0],
              createdAt: new Date().toISOString().split('T')[0],
              status: isNoteView ? undefined : 'pending',
              type: isNoteView ? 'note' : data.type
            }
            setDocuments(prev => [newDoc, ...prev])
          }
          setIsModalOpen(false)
          setEditingDocument(null)
        }}
        editData={editingDocument}
      />

      <Modal
        isOpen={!!viewDocument}
        onClose={() => setViewDocument(null)}
        title={viewDocument ? `تفاصيل ${isNoteView ? 'الملاحظة' : 'المستند'} - ${viewDocument.title}` : 'التفاصيل'}
        size="lg"
      >
        {viewDocument && (
          <div className="space-y-4 text-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="font-medium">النوع:</span>
                <p className="text-gray-700 mt-1">{getTypeText(viewDocument.type || 'other')}</p>
              </div>
              {viewDocument.status && (
                <div>
                  <span className="font-medium">الحالة:</span>
                  <p className="text-gray-700 mt-1"><StatusBadge status={viewDocument.status} /></p>
                </div>
              )}
              {viewDocument.priority && (
                <div>
                  <span className="font-medium">الأولوية:</span>
                  <p className="text-gray-700 mt-1"><PriorityBadge priority={viewDocument.priority} /></p>
                </div>
              )}
              {viewDocument.fileName && (
                <div>
                  <span className="font-medium">اسم الملف:</span>
                  <p className="text-gray-700 mt-1">{viewDocument.fileName}</p>
                </div>
              )}
              {viewDocument.fileSize && (
                <div>
                  <span className="font-medium">الحجم:</span>
                  <p className="text-gray-700 mt-1">{viewDocument.fileSize}</p>
                </div>
              )}
              {viewDocument.project && (
                <div>
                  <span className="font-medium">المشروع:</span>
                  <p className="text-gray-700 mt-1">{viewDocument.project}</p>
                </div>
              )}
            </div>
            {viewDocument.description && (
              <div>
                <span className="font-medium">الوصف:</span>
                <p className="text-gray-700 mt-1">{viewDocument.description}</p>
              </div>
            )}
            {viewDocument.content && (
              <div>
                <span className="font-medium">المحتوى:</span>
                <p className="text-gray-700 mt-1">{viewDocument.content}</p>
              </div>
            )}
          </div>
        )}
      </Modal>

      <ConfirmDialog
        isOpen={!!confirmDeleteId}
        title="تأكيد الحذف"
        description={`هل أنت متأكد من حذف ${isNoteView ? 'هذه الملاحظة' : 'هذا المستند'}؟`}
        variant="destructive"
        onConfirm={() => {
          setDocuments(prev => prev.filter(d => d.id !== confirmDeleteId))
          setConfirmDeleteId(null)
        }}
        onCancel={() => setConfirmDeleteId(null)}
      />
    </div>
  )
}

export default DocumentsScreen
