import React, { useMemo, useState, useEffect } from 'react'
import { useLanguage } from '../../context/LanguageContext'
import { useAuth } from '../../context/AuthContext'
import { cn, getActiveFiltersCount } from '../../lib/utils'
import { Card, CardContent, CardHeader } from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Divider from '../../components/ui/Divider'
import DataTable from '../../components/ui/DataTable'
import UnifiedProposalForm from '../../components/forms/UnifiedProposalForm'
import SimplePopover from '../../components/ui/SimplePopover'
import AdvancedFilter from '../../components/ui/AdvancedFilter'
import { useProposalSubmission } from '../../hooks/forms/useProposalSubmission'
import Modal from '../../components/ui/Modal'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  Plus,
  Eye,
  Edit,
  Trash2,
  FileText,
  Grid3X3,
  List,
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
  department?: string
  comments?: string
  score?: number
  submittedBy?: string
  tags: string[]
}

const StudentProposals: React.FC = () => {
  const { t } = useLanguage()
  const { user } = useAuth()
  const { checkSubmissionPeriod } = useProposalSubmission()
  const navigate = useNavigate()
  const location = useLocation()

  // Check if proposal submission period is open using the hook
  const submissionPeriodCheck = checkSubmissionPeriod(user?.role || 'student')
  const isSubmissionPeriodOpen = () => submissionPeriodCheck.isOpen
  const [searchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [submittedByFilter, setsubmittedByFilter] = useState('all')
  const [sortBy, setSortBy] = useState('submittedDate')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProposal, setEditingProposal] = useState<Proposal | null>(null)
  const [activeTab, setActiveTab] = useState<'my' | 'group' | 'approved'>('my')

  // تحديد التبويب المناسب بناءً على الرابط
  useEffect(() => {
    const path = location.pathname
    if (path.includes('/student/proposals/my')) {
      setActiveTab('my')
    } else if (path.includes('/student/proposals/group')) {
      setActiveTab('group')
    } else if (path.includes('/student/proposals/approved')) {
      setActiveTab('approved')
    } else {
      setActiveTab('my') // افتراضي
    }
  }, [location.pathname])
  const [viewProposal, setViewProposal] = useState<Proposal | null>(null)
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)

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
      department: 'Computer Science',
      comments: 'مقترح ممتاز، يحتاج إلى بعض التحسينات في التصميم',
      score: 85,
      submittedBy: 'Fatima Ahmed',
      tags: ['تطوير ويب', 'ذكاء اصطناعي', 'قواعد البيانات']
    },
    {
      id: '2',
      title: 'نظام إدارة المستودعات الذكي',
      description: 'نظام متقدم لإدارة المخزون والمستودعات باستخدام تقنيات IoT',
      status: 'pending',
      submittedDate: '2024-01-20',
      department: 'Computer Science',
      submittedBy: 'Fatima Ahmed',
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
      department: 'Computer Science',
      comments: 'المقترح يحتاج إلى مزيد من التفصيل في الجانب التقني',
      score: 45,
      submittedBy: 'Fatima Ahmed',
      tags: ['تعليم إلكتروني', 'واقع افتراضي', 'تفاعل']
    },
    {
      id: '4',
      title: 'تطبيق إدارة المكتبة الذكية',
      description: 'تطبيق ويب شامل لإدارة المكتبات مع ميزات الذكاء الاصطناعي',
      status: 'approved',
      submittedDate: '2024-01-10',
      reviewedDate: '2024-01-15',
      reviewer: 'د. أحمد محمد',
      department: 'Computer Science',
      comments: 'مقترح ممتاز، يحتاج إلى بعض التحسينات في التصميم',
      score: 85,
      submittedBy: 'Fatima Ahmed',
      tags: ['تطوير ويب', 'ذكاء اصطناعي', 'قواعد البيانات']
    },
  ])

  const statusOptions = [
    { value: 'all', label: 'جميع الحالات' },
    { value: 'draft', label: 'مسودة' },
    { value: 'submitted', label: 'مُرسل' },
    { value: 'under_review', label: 'قيد المراجعة' },
    { value: 'approved', label: 'مقبول' },
    { value: 'rejected', label: 'مرفوض' }
  ]

  const submittedByOptions = useMemo(() => {
    const names = Array.from(new Set((proposals || [])
      .map(p => p.submittedBy)
      .filter((v): v is string => !!v)))
    return [{ value: 'all', label: 'الكل' }, ...names.map(n => ({ value: n, label: n }))]
  }, [proposals])

  const sortOptions = [
    { value: 'submittedDate', label: 'تاريخ التقديم' },
    { value: 'title', label: 'العنوان' },
    { value: 'status', label: 'الحالة' },
    { value: 'submittedBy', label: 'قدم بواسطة' },
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

  // Removed misleading submittedBy color helpers; we'll show department as a neutral badge

  const myName = useMemo(() => user?.fullName || 'Me', [user])
  const isEnrolledInProject = false // TODO: wire with actual enrollment state

  const scopeFiltered = useMemo(() => {
    if (activeTab === 'my') {
      return proposals.filter(p => (p.submittedBy || '') === myName)
    }
    if (activeTab === 'group') {
      return proposals.filter(p => (p.submittedBy || '') !== myName && p.status !== 'approved')
    }
    return proposals.filter(p => p.status === 'approved')
  }, [activeTab, proposals, myName])


  const filteredProposals = scopeFiltered
    .filter(proposal => {
      const matchesSearch = !searchQuery ||
        proposal.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        proposal.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        proposal.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))

      const matchesStatus = statusFilter === 'all' || proposal.status === statusFilter
      const matchessubmittedBy = submittedByFilter === 'all' || proposal.submittedBy === submittedByFilter

      return matchesSearch && matchesStatus && matchessubmittedBy
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
    setConfirmDeleteId(proposalId)
  }
  const confirmDelete = () => {
    if (confirmDeleteId) {
      setProposals(prev => prev.filter(p => p.id !== confirmDeleteId))
      setConfirmDeleteId(null)
    }
  }
  const cancelDelete = () => setConfirmDeleteId(null)

  const handleViewProposal = (proposal: Proposal) => setViewProposal(proposal)

  const handleRegisterForProposal = (_proposal: Proposal) => {
    // TODO: Replace with real API and state update
    navigate('/projects')
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
    setsubmittedByFilter('all')
    setSortBy('submittedDate')
    setSortOrder('desc')
  }


  const columns = [
    {
      key: 'title',
      label: 'عنوان المشروع',
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
      key: 'submittedBy',
      label: 'قدم بواسطة',
      render: (proposal: Proposal) => (
        <p className="text-sm text-gray-600 line-clamp-1">{proposal.submittedBy}</p>
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
      key: 'department',
      label: 'القسم/التخصص',
      render: (proposal: Proposal) => (
        <p className="text-sm text-gray-600 line-clamp-1">{proposal.department}</p>
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
          {activeTab === 'my' && proposal.status === 'draft' && (
            <button
              onClick={() => handleEditProposal(proposal)}
              className="text-blue-600 hover:text-blue-700 transition-colors"
              title="تعديل"
            >
              <Edit size={16} />
            </button>
          )}
          {activeTab === 'my' && (
            <button
              onClick={() => handleDeleteProposal(proposal.id)}
              className="text-red-600 hover:text-red-700 transition-colors"
              title="حذف"
            >
              <Trash2 size={16} />
            </button>
          )}
          {activeTab === 'approved' && !isEnrolledInProject && (
            <Button size="sm" onClick={() => handleRegisterForProposal(proposal)}>
              تسجيل في هذا المقترح
            </Button>
          )}
        </div>
      )
    }
  ]

  return (
    <>
      <div className="space-y-6">
        {/* Page Title */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {activeTab === 'my' && 'مقترحاتي'}
            {activeTab === 'group' && 'مقترحات مجموعتي'}
            {activeTab === 'approved' && 'المقترحات المعتمدة'}
          </h1>
          <p className="text-gray-600">
            {activeTab === 'my' && 'إدارة مقترحاتك الشخصية'}
            {activeTab === 'group' && 'مقترحات أعضاء مجموعتك'}
            {activeTab === 'approved' && 'المقترحات المعتمدة من قبل اللجنة'}
          </p>
        </div>

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
                      priorityOptions={submittedByOptions}
                      sortOptions={sortOptions}
                      statusFilter={statusFilter}
                      priorityFilter={submittedByFilter}
                      sortBy={sortBy}
                      sortOrder={sortOrder}
                      onStatusChange={setStatusFilter}
                      onPriorityChange={setsubmittedByFilter}
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
                      getActiveFiltersCount(statusFilter, submittedByFilter, searchQuery, sortBy, sortOrder) > 0 && 'bg-gpms-light/10 border-gpms-light text-gpms-dark'
                    )}
                  >
                    <SlidersHorizontal size={16} className="mr-1 rtl:mr-0 rtl:ml-1" />
                    {t('common.filter')}
                    {getActiveFiltersCount(statusFilter, submittedByFilter, searchQuery, sortBy, sortOrder) > 0 && (
                      <span className="absolute -top-1 -right-1 rtl:right-auto rtl:-left-1 bg-gpms-dark text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {getActiveFiltersCount(statusFilter, submittedByFilter, searchQuery, sortBy, sortOrder)}
                      </span>
                    )}
                  </Button>
                </SimplePopover>

                {activeTab !== 'approved' && (
                  <Button
                    onClick={handleAddProposal}
                    disabled={!isSubmissionPeriodOpen()}
                    className={cn(
                      isSubmissionPeriodOpen()
                        ? "bg-gpms-dark text-white hover:bg-gpms-light"
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    )}
                    title={!isSubmissionPeriodOpen() ? submissionPeriodCheck.message || "لا يمكن تقديم المقترحات حاليًا" : ""}
                  >
                    <Plus className="w-4 h-4 mr-1 rtl:mr-0 rtl:ml-1" />
                    مقترح جديد
                  </Button>
                )}
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
                        {proposal.department && (
                          <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-700">
                            {proposal.department}
                          </span>
                        )}
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
                          {activeTab === 'my' && proposal.status === 'draft' && (
                            <button
                              onClick={() => handleEditProposal(proposal)}
                              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                              title="تعديل"
                            >
                              <Edit size={16} />
                            </button>
                          )}
                          {activeTab === 'my' && (
                            <button
                              onClick={() => handleDeleteProposal(proposal.id)}
                              className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                              title="حذف"
                            >
                              <Trash2 size={16} />
                            </button>
                          )}
                          {activeTab === 'approved' && !isEnrolledInProject && (
                            <Button size="sm" onClick={() => handleRegisterForProposal(proposal)}>
                              تسجيل في هذا المقترح
                            </Button>
                          )}
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
                    disabled={!isSubmissionPeriodOpen()}
                    className={cn(
                      isSubmissionPeriodOpen()
                        ? "bg-gpms-dark text-white hover:bg-gpms-light"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    )}
                    title={!isSubmissionPeriodOpen() ? submissionPeriodCheck.message || "لا يمكن تقديم المقترحات حاليًا" : ""}
                  >
                    إضافة مقترح جديد
                  </Button>
                </CardContent>
              </Card>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Modal */}
      <UnifiedProposalForm
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setEditingProposal(null)
        }}
        onSubmit={handleModalSubmit}
        editData={editingProposal}
        userRole="student"
        mode={editingProposal ? 'edit' : 'create'}
      />

      {/* Confirm Delete Modal */}
      <Modal
        isOpen={!!confirmDeleteId}
        onClose={cancelDelete}
        title={'تأكيد الحذف'}
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-gray-700 text-sm">هل أنت متأكد من حذف هذا المقترح؟ لا يمكن التراجع عن هذا الإجراء.</p>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={cancelDelete}>إلغاء</Button>
            <Button onClick={confirmDelete} className="bg-red-600 text-white hover:bg-red-700">حذف</Button>
          </div>
        </div>
      </Modal>

      {/* View Proposal Modal */}
      <Modal
        isOpen={!!viewProposal}
        onClose={() => setViewProposal(null)}
        title={'تفاصيل المقترح'}
        size="lg"
      >
        {viewProposal && (
          <div className="space-y-4 text-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="font-medium">عنوان المقترح:</span>
                <p className="text-gray-700 mt-1">{viewProposal.title}</p>
              </div>
              <div>
                <span className="font-medium">الحالة:</span>
                <p className="text-gray-700 mt-1">{getStatusText(viewProposal.status)}</p>
              </div>
              <div>
                <span className="font-medium">تاريخ الإرسال:</span>
                <p className="text-gray-700 mt-1">{new Date(viewProposal.submittedDate).toLocaleDateString('ar')}</p>
              </div>
            </div>
            <div>
              <span className="font-medium">الوصف:</span>
              <p className="text-gray-700 mt-1">{viewProposal.description}</p>
            </div>
          </div>
        )}
      </Modal>
    </>
  )
}

export default StudentProposals
