import React, { useState } from 'react'
import { useLanguage } from '../../context/LanguageContext'
import { cn, getActiveFiltersCount } from '../../lib/utils'
import { Card, CardContent, CardHeader } from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Divider from '../../components/ui/Divider'
import { SearchBar } from '../../components/ui/Filter'
import SimplePopover from '../../components/ui/SimplePopover'
import DataTable from '../../components/ui/DataTable'
import AdvancedFilter from '../../components/ui/AdvancedFilter'
import ConfirmDialog from '../../components/ui/ConfirmDialog'
import Modal from '../../components/ui/Modal'
import {
  Eye,
  Edit,
  CheckCircle,
  XCircle,
  Calendar,
  User,
  Grid3X3,
  List,
  FileText,
  SlidersHorizontal
} from 'lucide-react'

interface Proposal {
  id: string
  title: string
  description: string
  status: 'submitted' | 'under_review' | 'approved' | 'rejected' | 'needs_revision'
  priority: 'low' | 'medium' | 'high'
  student: string
  studentId: string
  supervisor?: string
  submittedDate: string
  reviewDate?: string
  score?: number
  comments: string
  tags: string[]
  department: string
}

const CommitteeProposals: React.FC = () => {
  const { t } = useLanguage()
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [sortBy, setSortBy] = useState('submittedDate')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('grid')
  const [confirmApproveOpen, setConfirmApproveOpen] = useState(false)
  const [proposalIdToApprove, setProposalIdToApprove] = useState<string | null>(null)
  const [modificationOpen, setModificationOpen] = useState(false)
  const [rejectionOpen, setRejectionOpen] = useState(false)
  const [targetProposalId, setTargetProposalId] = useState<string | null>(null)
  const [modificationRequest, setModificationRequest] = useState('')
  const [rejectionReason, setRejectionReason] = useState('')

  // Mock data
  const [proposals] = useState<Proposal[]>([
    {
      id: '1',
      title: 'نظام إدارة المكتبة الذكية',
      description: 'تطبيق ويب متكامل لإدارة المكتبات الجامعية باستخدام الذكاء الاصطناعي',
      status: 'under_review',
      priority: 'high',
      student: 'أحمد محمد علي',
      studentId: '2021001234',
      supervisor: 'د. أحمد محمد',
      submittedDate: '2024-01-20',
      reviewDate: '2024-01-22',
      // score: 88,
      comments: 'مقترح ممتاز، يحتاج إلى تفاصيل أكثر في الجانب التقني',
      tags: ['تطوير ويب', 'ذكاء اصطناعي', 'قواعد البيانات'],
      department: 'علوم الحاسوب'
    },
    {
      id: '2',
      title: 'تطبيق التجارة الإلكترونية',
      description: 'منصة تجارة إلكترونية شاملة مع نظام دفع آمن ومتطور',
      status: 'approved',
      priority: 'medium',
      student: 'سارة أحمد محمد',
      studentId: '2021001235',
      supervisor: 'د. سارة أحمد',
      submittedDate: '2024-01-18',
      reviewDate: '2024-01-20',
      // score: 92,
      comments: 'مقترح ممتاز ومدروس جيداً',
      tags: ['تجارة إلكترونية', 'دفع إلكتروني', 'أمان'],
      department: 'علوم الحاسوب'
    },
    {
      id: '3',
      title: 'نظام إدارة المستشفيات',
      description: 'نظام شامل لإدارة العمليات الطبية والمواعيد والسجلات الطبية',
      status: 'submitted',
      priority: 'high',
      student: 'علي حسن محمد',
      studentId: '2021001236',
      submittedDate: '2024-01-25',
      comments: '',
      tags: ['إدارة طبية', 'قواعد البيانات', 'أمان المعلومات'],
      department: 'هندسة البرمجيات'
    },
    {
      id: '4',
      title: 'منصة التعليم التفاعلي',
      description: 'منصة تعليمية تفاعلية باستخدام الواقع الافتراضي والواقع المعزز',
      status: 'needs_revision',
      priority: 'low',
      student: 'خالد محمد أحمد',
      studentId: '2021001237',
      submittedDate: '2024-01-15',
      reviewDate: '2024-01-17',
      // score: 65,
      comments: 'المقترح يحتاج إلى مزيد من التفصيل في الجانب التقني وخطة التنفيذ',
      tags: ['تعليم إلكتروني', 'واقع افتراضي', 'تفاعل'],
      department: 'تقنية المعلومات'
    },
    {
      id: '5',
      title: 'نظام إدارة الموارد البشرية',
      description: 'نظام متكامل لإدارة الموارد البشرية والرواتب والحضور',
      status: 'rejected',
      priority: 'medium',
      student: 'مريم علي سعد',
      studentId: '2021001238',
      submittedDate: '2024-01-10',
      reviewDate: '2024-01-12',
      // score: 55,
      comments: 'المقترح غير واضح ويفتقر للجدوى العملية',
      tags: ['إدارة موارد بشرية', 'رواتب', 'حضور'],
      department: 'نظم المعلومات'
    }
  ])

  const statusOptions = [
    { value: 'all', label: 'جميع الحالات' },
    { value: 'submitted', label: 'مُقدم' },
    { value: 'under_review', label: 'قيد المراجعة' },
    { value: 'approved', label: 'موافق عليه' },
    { value: 'rejected', label: 'مرفوض' },
    { value: 'needs_revision', label: 'يحتاج مراجعة' }
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
      case 'submitted': return 'مُقدم'
      case 'under_review': return 'قيد المراجعة'
      case 'approved': return 'موافق عليه'
      case 'rejected': return 'مرفوض'
      case 'needs_revision': return 'يحتاج مراجعة'
      default: return status
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'submitted': return 'bg-blue-100 text-blue-800'
      case 'under_review': return 'bg-yellow-100 text-yellow-800'
      case 'approved': return 'bg-green-100 text-green-800'
      case 'rejected': return 'bg-red-100 text-red-800'
      case 'needs_revision': return 'bg-orange-100 text-orange-800'
      default: return 'bg-gray-100 text-gray-800'
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

  const filteredProposals = proposals.filter(proposal => {
    const matchesSearch = !searchQuery ||
      proposal.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      proposal.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      proposal.student.toLowerCase().includes(searchQuery.toLowerCase()) ||
      proposal.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      proposal.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesStatus = statusFilter === 'all' || proposal.status === statusFilter
    const matchesPriority = priorityFilter === 'all' || proposal.priority === priorityFilter

    return matchesSearch && matchesStatus && matchesPriority
  })

  const handleFilterClear = () => {
    setStatusFilter('all')
    setPriorityFilter('all')
    setSortBy('submittedDate')
    setSortOrder('desc')
  }

  const [viewProposal, setViewProposal] = useState<Proposal | null>(null)
  const handleViewProposal = (proposal: Proposal) => {
    setViewProposal(proposal)
  }

  const handleApproveProposal = (proposalId: string) => {
    setProposalIdToApprove(proposalId)
    setConfirmApproveOpen(true)
  }

  const confirmApprove = () => {
    if (proposalIdToApprove) {
      console.log('Approving proposal:', proposalIdToApprove)
    }
    setConfirmApproveOpen(false)
    setProposalIdToApprove(null)
  }

  const cancelApprove = () => {
    setConfirmApproveOpen(false)
    setProposalIdToApprove(null)
  }

  const handleRequestModification = (proposalId: string) => {
    setTargetProposalId(proposalId)
    setModificationRequest('')
    setModificationOpen(true)
  }

  const handleRejectProposal = (proposalId: string) => {
    setTargetProposalId(proposalId)
    setRejectionReason('')
    setRejectionOpen(true)
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
      key: 'student',
      label: 'الطالب',
      render: (proposal: Proposal) => (
        <span className="text-sm text-gray-600">{proposal.student} ({proposal.studentId})</span>
      )
    },
    {
      key: 'status',
      label: 'الحالة',
      render: (proposal: Proposal) => (
        <span className={cn('px-2 py-1 text-xs rounded-full', getStatusColor(proposal.status))}>
          {getStatusText(proposal.status)}
        </span>
      )
    },
    {
      key: 'submittedDate',
      label: 'تاريخ التقديم',
      sortable: true,
      render: (proposal: Proposal) => (
        <span className="text-sm text-gray-600">{new Date(proposal.submittedDate).toLocaleDateString('ar')}</span>
      )
    },
    {
      key: 'score',
      label: 'الدرجة',
      sortable: true,
      render: (proposal: Proposal) => (
        <span className="text-sm text-gray-600">{proposal.score ? `${proposal.score}/100` : '-'}</span>
      )
    },
    {
      key: 'actions',
      label: 'الإجراءات',
      render: (proposal: Proposal) => (
        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          <button onClick={() => handleViewProposal(proposal)} className="p-2 text-gray-400 hover:text-gray-600" title="عرض">
            <Eye size={16} />
          </button>
          <button className="p-2 text-gray-400 hover:text-gray-600" title="تعديل">
            <Edit size={16} />
          </button>
          {proposal.status === 'submitted' && (
            <>
              <button onClick={() => handleApproveProposal(proposal.id)} className="p-2 text-gray-400 hover:text-green-600" title="موافقة">
                <CheckCircle size={16} />
              </button>
              <button onClick={() => handleRequestModification(proposal.id)} className="p-2 text-gray-400 hover:text-yellow-600" title="طلب تعديل">
                <Edit size={16} />
              </button>
              <button onClick={() => handleRejectProposal(proposal.id)} className="p-2 text-gray-400 hover:text-red-600" title="رفض">
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
              {/* <FileText className="w-6 h-6 text-gpms-dark" /> */}
              <div>
                <h1 className="text-xl font-bold text-gray-900">إدارة المقترحات</h1>
                {/* <p className="text-gray-600 mt-1">مراجعة وإدارة مقترحات المشاريع المقدمة</p> */}
              </div>
            </div>

            <div className="flex items-center space-x-3 rtl:space-x-reverse">
              {/* View Mode Toggle */}
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  title="جدول"
                  onClick={() => setViewMode('table')}
                  className={cn(
                    'px-3 py-1 rounded-md text-sm font-medium transition-colors',
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
                    'px-3 py-1 rounded-md text-sm font-medium transition-colors',
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
                  className="min-h[400px]"
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
                    {/* Proposal Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-md font-semibold text-gray-900 mb-2">{proposal.title}</h3>
                        <p className="text-sm text-gray-600 line-clamp-2">{proposal.description}</p>
                      </div>
                      <span className={cn('px-2 py-1 text-xs rounded-full', getStatusColor(proposal.status))}>
                        {getStatusText(proposal.status)}
                      </span>
                    </div>

                    {/* Student Info */}
                    <div className="mb-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <User size={16} className="ml-2 rtl:ml-0 rtl:mr-2" />
                        <span>{proposal.student} ({proposal.studentId})</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600 mt-1">
                        <Calendar size={16} className="ml-2 rtl:ml-0 rtl:mr-2" />
                        <span>تاريخ التقديم: {new Date(proposal.submittedDate).toLocaleDateString('ar')}</span>
                      </div>
                    </div>

                    {/* Proposal Info */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <span>الأولوية:</span>
                        <span className={cn('px-2 py-1 text-xs rounded-full', getPriorityColor(proposal.priority))}>
                          {getPriorityText(proposal.priority)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <span>القسم:</span>
                        <span className="font-medium">{proposal.department}</span>
                      </div>
                      {proposal.supervisor && (
                        <div className="flex items-center justify-between text-sm text-gray-600">
                          <span>المشرف:</span>
                          <span className="font-medium">{proposal.supervisor}</span>
                        </div>
                      )}
                      {proposal.score && (
                        <div className="flex items-center justify-between text-sm text-gray-600">
                          <span>الدرجة:</span>
                          <span className="font-medium text-gray-900">{proposal.score}/100</span>
                        </div>
                      )}
                    </div>

                    {/* Tags */}
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

                    {/* Comments */}
                    {proposal.comments && (
                      <div className="mb-4">
                        <p className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
                          {proposal.comments}
                        </p>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                      <div className="flex space-x-2 rtl:space-x-reverse">
                        <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors" title="عرض">
                          <Eye size={16} />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors" title="تعديل">
                          <Edit size={16} />
                        </button>
                        {proposal.status === 'submitted' && (
                          <>
                            <button
                              onClick={() => handleApproveProposal(proposal.id)}
                              className="p-2 text-gray-400 hover:text-green-600 transition-colors"
                              title="موافقة"
                            >
                              <CheckCircle size={16} />
                            </button>
                            <button
                              onClick={() => handleRequestModification(proposal.id)}
                              className="p-2 text-gray-400 hover:text-yellow-600 transition-colors"
                              title="طلب تعديل"
                            >
                              <Edit size={16} />
                            </button>
                            <button
                              onClick={() => handleRejectProposal(proposal.id)}
                              className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                              title="رفض"
                            >
                              <XCircle size={16} />
                            </button>
                          </>
                        )}
                      </div>
                      <button
                        onClick={() => handleViewProposal(proposal)}
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

          {/* Empty State */}
          {filteredProposals.length === 0 && (
            <Card className="hover-lift">
              <CardContent className="text-center py-12">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText size={32} className="text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد مقترحات</h3>
                <p className="text-gray-600">لم يتم العثور على مقترحات تطابق معايير البحث</p>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
      {/* View Proposal Modal */}
      <Modal
        isOpen={!!viewProposal}
        onClose={() => setViewProposal(null)}
        title={viewProposal ? viewProposal.title : ''}
        size="lg"
      >
        {viewProposal && (
          <div className="space-y-4 text-sm text-gray-700">
            <div className="grid grid-cols-2 gap-4">
              <div><span className="font-medium">الحالة:</span> {getStatusText(viewProposal.status)}</div>
              <div><span className="font-medium">الأولوية:</span> {getPriorityText(viewProposal.priority)}</div>
              <div><span className="font-medium">تاريخ التقديم:</span> {new Date(viewProposal.submittedDate).toLocaleDateString('ar')}</div>
              {viewProposal.supervisor && (
                <div><span className="font-medium">المشرف المقترح:</span> {viewProposal.supervisor}</div>
              )}
            </div>
            <div>
              <span className="font-medium">الوصف:</span>
              <p className="mt-1 text-gray-600">{viewProposal.description}</p>
            </div>
            {viewProposal.tags?.length ? (
              <div className="flex flex-wrap gap-2">
                {viewProposal.tags.map((tag, i) => (
                  <span key={i} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">{tag}</span>
                ))}
              </div>
            ) : null}
            {viewProposal.comments && (
              <div>
                <span className="font-medium">ملاحظات:</span>
                <p className="mt-1 text-gray-600">{viewProposal.comments}</p>
              </div>
            )}
          </div>
        )}
      </Modal>
      <ConfirmDialog
        isOpen={confirmApproveOpen}
        title="تأكيد الموافقة"
        description="هل تريد الموافقة على هذا المقترح؟"
        onConfirm={confirmApprove}
        onCancel={cancelApprove}
      />

      {/* Request Modification Modal */}
      <Modal
        isOpen={modificationOpen}
        onClose={() => { setModificationOpen(false); setTargetProposalId(null) }}
        title="طلب تعديل على المقترح"
        size="md"
        onSubmit={(e) => {
          e?.preventDefault()
          if (targetProposalId && modificationRequest.trim()) {
            console.log('Requesting modification for proposal:', targetProposalId, modificationRequest)
          }
          setModificationOpen(false)
          setTargetProposalId(null)
          setModificationRequest('')
        }}
      >
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">تفاصيل طلب التعديل</label>
          <textarea
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gpms-light focus:border-transparent"
            placeholder="اكتب طلب التعديل المطلوب..."
            value={modificationRequest}
            onChange={(e) => setModificationRequest(e.target.value)}
            required
          />
        </div>
      </Modal>

      {/* Rejection Reason Modal */}
      <Modal
        isOpen={rejectionOpen}
        onClose={() => { setRejectionOpen(false); setTargetProposalId(null) }}
        title="سبب الرفض"
        size="md"
        onSubmit={(e) => {
          e?.preventDefault()
          if (targetProposalId && rejectionReason.trim()) {
            console.log('Rejecting proposal:', targetProposalId, rejectionReason)
          }
          setRejectionOpen(false)
          setTargetProposalId(null)
          setRejectionReason('')
        }}
      >
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">اكتب سبب الرفض</label>
          <textarea
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gpms-light focus:border-transparent"
            placeholder="سبب الرفض..."
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            required
          />
        </div>
      </Modal>
    </div>
  )
}

export default CommitteeProposals