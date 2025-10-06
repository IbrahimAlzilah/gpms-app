import React, { useState } from 'react'
import { useLanguage } from '../../context/LanguageContext'
import { cn, getActiveFiltersCount } from '../../lib/utils'
import { Card, CardContent, CardHeader } from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Divider from '../../components/ui/Divider'
import { SearchBar } from '../../components/ui/Filter'
import DataTable from '../../components/ui/DataTable'
import UnifiedProposalForm from '../../components/forms/UnifiedProposalForm'
import SimplePopover from '../../components/ui/SimplePopover'
import AdvancedFilter from '../../components/ui/AdvancedFilter'
import ConfirmDialog from '../../components/ui/ConfirmDialog'
import {
  Plus,
  Eye,
  Edit,
  Trash2,
  FileText,
  Grid3X3,
  List,
  BookOpen,
  SlidersHorizontal
} from 'lucide-react'

interface Proposal {
  id: string
  title: string
  description: string
  status: 'draft' | 'submitted' | 'under_review' | 'approved' | 'rejected' | 'pending'
  submittedDate: string
  reviewedDate?: string
  reviewer?: string
  comments?: string
  score?: number
  priority: 'low' | 'medium' | 'high'
  tags: string[]
}

const StudentProposals: React.FC = () => {
  const { t } = useLanguage()
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [sortBy, setSortBy] = useState('submittedDate')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProposal, setEditingProposal] = useState<Proposal | null>(null)
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false)
  const [proposalIdToDelete, setProposalIdToDelete] = useState<string | null>(null)

  // Mock data
  const [proposals, setProposals] = useState<Proposal[]>([
    {
      id: '1',
      title: 'تطبيق إدارة المكتبة الذكية',
      description: 'تطبيق ويب شامل لإدارة المكتبات مع ميزات الذكاء الاصطناعي',
      status: 'approved',
      submittedDate: '2024-01-10',
      reviewedDate: '2024-01-15',
      reviewer: 'د. أحمد محمد',
      comments: 'مقترح ممتاز، يحتاج إلى بعض التحسينات في التصميم',
      score: 85,
      priority: 'high',
      tags: ['تطوير ويب', 'ذكاء اصطناعي', 'قواعد البيانات']
    },
    {
      id: '2',
      title: 'نظام إدارة المستودعات الذكي',
      description: 'نظام متقدم لإدارة المخزون والمستودعات باستخدام تقنيات IoT',
      status: 'pending',
      submittedDate: '2024-01-20',
      priority: 'medium',
      tags: ['IoT', 'إدارة المخزون', 'تقنيات حديثة']
    },
    {
      id: '3',
      title: 'منصة التعليم الإلكتروني التفاعلية',
      description: 'منصة تعليمية تفاعلية مع تقنيات الواقع الافتراضي',
      status: 'rejected',
      submittedDate: '2023-12-15',
      reviewedDate: '2023-12-20',
      reviewer: 'د. سارة أحمد',
      comments: 'المقترح يحتاج إلى مزيد من التفصيل في الجانب التقني',
      score: 45,
      priority: 'low',
      tags: ['تعليم إلكتروني', 'واقع افتراضي', 'تفاعل']
    }
  ])

  const statusOptions = [
    { value: 'all', label: 'جميع الحالات' },
    { value: 'draft', label: 'مسودة' },
    { value: 'submitted', label: 'مُرسل' },
    { value: 'under_review', label: 'قيد المراجعة' },
    { value: 'approved', label: 'مقبول' },
    { value: 'rejected', label: 'مرفوض' }
  ]

  const priorityOptions = [
    { value: 'all', label: 'جميع الأولويات' },
    { value: 'low', label: 'منخفض' },
    { value: 'medium', label: 'متوسط' },
    { value: 'high', label: 'عالي' }
  ]

  const sortOptions = [
    { value: 'submittedDate', label: 'تاريخ التقديم' },
    { value: 'title', label: 'العنوان' },
    { value: 'status', label: 'الحالة' },
    { value: 'priority', label: 'الأولوية' },
    { value: 'score', label: 'الدرجة' }
  ]


  const getStatusText = (status: string) => {
    switch (status) {
      case 'approved': return 'مقبول'
      case 'pending': return 'قيد المراجعة'
      case 'rejected': return 'مرفوض'
      case 'under_review': return 'قيد المراجعة'
      case 'draft': return 'مسودة'
      default: return status
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

  const filteredProposals = proposals
    .filter(proposal => {
      const matchesSearch = !searchQuery ||
        proposal.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        proposal.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        proposal.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))

      const matchesStatus = statusFilter === 'all' || proposal.status === statusFilter
      const matchesPriority = priorityFilter === 'all' || proposal.priority === priorityFilter

      return matchesSearch && matchesStatus && matchesPriority
    })
    .sort((a, b) => {
      let comparison = 0

      switch (sortBy) {
        case 'title':
          comparison = a.title.localeCompare(b.title, 'ar')
          break
        case 'submittedDate':
          comparison = new Date(a.submittedDate).getTime() - new Date(b.submittedDate).getTime()
          break
        case 'score':
          comparison = (a.score || 0) - (b.score || 0)
          break
        default:
          comparison = 0
      }

      return sortOrder === 'asc' ? comparison : -comparison
    })

  const handleAddProposal = () => {
    setEditingProposal(null)
    setIsModalOpen(true)
  }

  const handleEditProposal = (proposal: Proposal) => {
    setEditingProposal(proposal)
    setIsModalOpen(true)
  }

  const handleDeleteProposal = (proposalId: string) => {
    setProposalIdToDelete(proposalId)
    setConfirmDeleteOpen(true)
  }

  const confirmDelete = () => {
    if (proposalIdToDelete) {
      setProposals(prev => prev.filter(p => p.id !== proposalIdToDelete))
    }
    setConfirmDeleteOpen(false)
    setProposalIdToDelete(null)
  }

  const cancelDelete = () => {
    setConfirmDeleteOpen(false)
    setProposalIdToDelete(null)
  }

  const handleViewProposal = (proposal: Proposal) => {
    console.log('View proposal:', proposal)
    // Implement view functionality
  }

  const handleModalSubmit = (data: any) => {
    if (editingProposal) {
      // Update existing proposal
      setProposals(prev => prev.map(p =>
        p.id === editingProposal.id
          ? { ...p, ...data, submittedDate: p.submittedDate }
          : p
      ))
    } else {
      // Add new proposal
      const newProposal: Proposal = {
        id: Math.random().toString(36).substring(7),
        ...data,
        submittedDate: new Date().toISOString().split('T')[0],
        status: 'submitted'
      }
      setProposals(prev => [newProposal, ...prev])
    }
    setIsModalOpen(false)
    setEditingProposal(null)
  }

  const handleFilterClear = () => {
    setStatusFilter('all')
    setPriorityFilter('all')
    setSortBy('submittedDate')
    setSortOrder('desc')
  }


  const columns = [
    {
      key: 'title',
      label: 'عنوان المقترح',
      sortable: true,
      render: (proposal: Proposal) => (
        <div>
          <h3 className="font-medium text-gray-900">{proposal.title}</h3>
          <p className="text-sm text-gray-600 line-clamp-1">{proposal.description}</p>
        </div>
      )
    },
    {
      key: 'status',
      label: 'الحالة',
      render: (proposal: Proposal) => (
        <span className={cn(
          'px-2 py-1 text-xs rounded-full',
          proposal.status === 'approved' ? 'bg-green-100 text-green-800' :
            proposal.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
              proposal.status === 'rejected' ? 'bg-red-100 text-red-800' :
                proposal.status === 'under_review' ? 'bg-blue-100 text-blue-800' :
                  'bg-gray-100 text-gray-800'
        )}>
          {getStatusText(proposal.status)}
        </span>
      )
    },
    {
      key: 'priority',
      label: 'الأولوية',
      render: (proposal: Proposal) => (
        <span className={cn('px-2 py-1 rounded-full text-xs font-medium', getPriorityColor(proposal.priority))}>
          {getPriorityText(proposal.priority)}
        </span>
      )
    },
    {
      key: 'submittedDate',
      label: 'تاريخ الإرسال',
      sortable: true,
      render: (proposal: Proposal) => (
        <span className="text-sm text-gray-600">
          {new Date(proposal.submittedDate).toLocaleDateString('ar')}
        </span>
      )
    },
    {
      key: 'score',
      label: 'الدرجة',
      sortable: true,
      render: (proposal: Proposal) => (
        <span className="text-sm text-gray-600">
          {proposal.score ? `${proposal.score}/100` : '-'}
        </span>
      )
    },
    {
      key: 'actions',
      label: 'الإجراءات',
      render: (proposal: Proposal) => (
        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          <button
            onClick={() => handleViewProposal(proposal)}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            title="عرض"
          >
            <Eye size={16} />
          </button>
          {proposal.status === 'draft' && (
            <button
              onClick={() => handleEditProposal(proposal)}
              className="text-blue-600 hover:text-blue-700 transition-colors"
              title="تعديل"
            >
              <Edit size={16} />
            </button>
          )}
          <button
            onClick={() => handleDeleteProposal(proposal.id)}
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
              {/* <BookOpen className="w-6 h-6 text-gpms-dark" /> */}
              <div>
                <h1 className="text-xl font-bold text-gray-900">{t('navigation.proposalsList')}</h1>
                {/* <p className="text-gray-600 mt-1">إدارة مقترحات المشاريع</p> */}
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
                <Button
                  variant="outline"
                  size="md"
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
                onClick={handleAddProposal}
                className="bg-gpms-dark text-white hover:bg-gpms-light"
              >
                <Plus className="w-4 h-4 mr-1 rtl:mr-0 rtl:ml-1" />
                مقترح جديد
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
              placeholder="البحث في المقترحات..."
              className="w-full"
            />
          </div> */}

          {/* Proposals Display */}
          {viewMode === 'table' ? (
            <Card className="hover-lift">
              <CardContent className="p-0">
                <DataTable
                  data={filteredProposals}
                  columns={columns}
                  emptyMessage="لا توجد مقترحات"
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
              {filteredProposals.map((proposal) => (
                <Card key={proposal.id} className="hover-lift">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center">
                        <FileText size={20} className="text-gray-400 ml-2 rtl:ml-0 rtl:mr-2" />
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900">{proposal.title}</h3>
                          <p className="text-sm text-gray-600 line-clamp-2 mt-1">{proposal.description}</p>
                        </div>
                      </div>
                      <span className={cn(
                        'px-2 py-1 text-xs rounded-full',
                        proposal.status === 'approved' ? 'bg-green-100 text-green-800' :
                          proposal.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            proposal.status === 'rejected' ? 'bg-red-100 text-red-800' :
                              proposal.status === 'under_review' ? 'bg-blue-100 text-blue-800' :
                                'bg-gray-100 text-gray-800'
                      )}>
                        {getStatusText(proposal.status)}
                      </span>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <span>تاريخ الإرسال:</span>
                        <span>{new Date(proposal.submittedDate).toLocaleDateString('ar')}</span>
                      </div>
                      {proposal.reviewedDate && (
                        <div className="flex items-center justify-between text-sm text-gray-600">
                          <span>تاريخ المراجعة:</span>
                          <span>{new Date(proposal.reviewedDate).toLocaleDateString('ar')}</span>
                        </div>
                      )}
                      {proposal.reviewer && (
                        <div className="flex items-center justify-between text-sm text-gray-600">
                          <span>المراجع:</span>
                          <span>{proposal.reviewer}</span>
                        </div>
                      )}
                      {proposal.score && (
                        <div className="flex items-center justify-between text-sm text-gray-600">
                          <span>الدرجة:</span>
                          <span className="font-medium">{proposal.score}/100</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between mb-4">
                      <span className={cn('px-2 py-1 text-xs rounded-full', getPriorityColor(proposal.priority))}>
                        {getPriorityText(proposal.priority)}
                      </span>
                    </div>

                    {proposal.tags.length > 0 && (
                      <div className="mb-4">
                        <div className="flex flex-wrap gap-1">
                          {proposal.tags.map((tag, index) => (
                            <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {proposal.comments && (
                      <div className="bg-gray-50 rounded-lg p-3 mb-4">
                        <h4 className="text-sm font-medium text-gray-700 mb-1">تعليقات المراجع:</h4>
                        <p className="text-sm text-gray-600 line-clamp-2">{proposal.comments}</p>
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                      <div className="flex space-x-2 rtl:space-x-reverse">
                        <button
                          onClick={() => handleViewProposal(proposal)}
                          className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                          title="عرض"
                        >
                          <Eye size={16} />
                        </button>
                        {proposal.status === 'draft' && (
                          <button
                            onClick={() => handleEditProposal(proposal)}
                            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                            title="تعديل"
                          >
                            <Edit size={16} />
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteProposal(proposal.id)}
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
          {filteredProposals.length === 0 && (
            <Card className="hover-lift">
              <CardContent className="text-center py-12">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText size={32} className="text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد مقترحات</h3>
                <p className="text-gray-600 mb-4">لم يتم العثور على مقترحات تطابق معايير البحث</p>
                <Button
                  onClick={handleAddProposal}
                  className="bg-gpms-dark text-white hover:bg-gpms-light"
                >
                  إضافة مقترح جديد
                </Button>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>

      {/* Modal */}
      <UnifiedProposalForm
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setEditingProposal(null)
        }}
        onSubmit={handleModalSubmit}
        editData={editingProposal}
        userRole="supervisor"
        mode={editingProposal ? 'edit' : 'create'}
      />
      <ConfirmDialog
        isOpen={confirmDeleteOpen}
        title="تأكيد الحذف"
        description="هل أنت متأكد من حذف هذا المقترح؟ لا يمكن التراجع عن هذه العملية."
        variant="destructive"
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </div>
  )
}

export default StudentProposals
