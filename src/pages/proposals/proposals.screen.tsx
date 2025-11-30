import React, { useState, useMemo, useEffect } from 'react'
import { useLanguage } from '@/context/LanguageContext'
import { useAuth } from '@/context/AuthContext'
import { useLocation } from 'react-router-dom'
import { cn, getActiveFiltersCount } from '@/lib/utils'
import { Card, CardContent, CardHeader } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Divider from '@/components/ui/Divider'
import DataTable from '@/components/ui/DataTable'
import SimplePopover from '@/components/ui/SimplePopover'
import AdvancedFilter from '@/components/ui/AdvancedFilter'
import Modal from '@/components/ui/Modal'
import UnifiedProposalForm from '@/components/forms/UnifiedProposalForm'
import { ViewModeToggle } from '@/components/shared'
import { StatusBadge } from '@/components/shared'
import { Eye, Edit, CheckCircle, XCircle, Plus, SlidersHorizontal, Megaphone, Send, Clock } from 'lucide-react'
import { useProposalSubmission } from '@/hooks/forms/useProposalSubmission'
import { useProposalAdd } from './new/ProposalAdd.hook'
import { CreateProposalInput, Proposal } from './schema'
import { approveProposal, rejectProposal, updateProposal, getProposals, requestProposalModification } from '@/services/proposals.service'
import { useNavigate } from 'react-router-dom'
import { useNotifications } from '@/context/NotificationContext'
import { Form, FormGroup, FormLabel } from '@/components/ui/Form'

interface ProposalsScreenProps {
    customProposals?: Proposal[]
    customLoading?: boolean
    filterType?: 'my' | 'group' | 'approved' | 'all'
}

const ProposalsScreen: React.FC<ProposalsScreenProps> = ({ 
    customProposals, 
    customLoading,
    filterType = 'all'
}) => {
    const { t } = useLanguage()
    const { user } = useAuth()
    const location = useLocation()
    const navigate = useNavigate()
    const { addNotification } = useNotifications()
    const { checkSubmissionPeriod } = useProposalSubmission()
    const { createProposal } = useProposalAdd()

    const [proposals, setProposals] = useState<Proposal[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [searchQuery] = useState('')
    const [statusFilter, setStatusFilter] = useState('all')
    const [priorityFilter, setPriorityFilter] = useState('all')
    const [sortBy, setSortBy] = useState('submittedDate')
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
    const [viewMode, setViewMode] = useState<'table' | 'grid'>('table')
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingProposal, setEditingProposal] = useState<Proposal | null>(null)
    const [viewProposal, setViewProposal] = useState<Proposal | null>(null)
    const [, setActiveTab] = useState<'my' | 'group' | 'approved'>('my')
    const [selectedProposalsToAnnounce, setSelectedProposalsToAnnounce] = useState<string[]>([])
    const [modificationModalOpen, setModificationModalOpen] = useState(false)
    const [proposalForModification, setProposalForModification] = useState<Proposal | null>(null)
    const [modificationNotes, setModificationNotes] = useState('')

    useEffect(() => {
        if (customProposals !== undefined) {
            setProposals(customProposals)
            return
        }
        
        const loadProposals = async () => {
            setIsLoading(true)
            try {
                const data = await getProposals()
                // Apply filter based on filterType
                let filteredData = data
                if (filterType === 'my' && user) {
                    filteredData = data.filter(p => 
                        p.studentId === user.id || p.submittedBy === user.id
                    )
                } else if (filterType === 'group' && user) {
                    // Filter by group proposals (proposals with team members)
                    filteredData = data.filter(p => 
                        p.studentId === user.id || p.submittedBy === user.id
                    )
                } else if (filterType === 'approved') {
                    filteredData = data.filter(p => p.status === 'approved')
                }
                setProposals(filteredData)
            } catch (err) {
                console.error('Error loading proposals:', err)
                addNotification({
                    title: 'خطأ',
                    message: 'فشل في تحميل المقترحات. يرجى تحديث الصفحة.',
                    type: 'error'
                })
            } finally {
                setIsLoading(false)
            }
        }
        loadProposals()
    }, [customProposals, filterType, user, addNotification])
    
    // Use custom loading if provided
    const displayLoading = customLoading !== undefined ? customLoading : isLoading

    useEffect(() => {
        const path = location.pathname
        if (path.includes('/proposals/my')) setActiveTab('my')
        else if (path.includes('/proposals/group')) setActiveTab('group')
        else if (path.includes('/proposals/approved')) setActiveTab('approved')
    }, [location.pathname])


    const [submissionPeriodStatus, setSubmissionPeriodStatus] = useState<{ 
        isOpen: boolean
        message?: string
        period?: { startDate: string; endDate: string; name: string }
    }>({ isOpen: true })
    
    useEffect(() => {
      const checkPeriod = async () => {
        try {
          const periodCheck = await checkSubmissionPeriod(user?.role || 'student')
          setSubmissionPeriodStatus(periodCheck)
        } catch (error) {
          console.error('Error checking period:', error)
          setSubmissionPeriodStatus({ isOpen: false, message: 'حدث خطأ أثناء التحقق من فترة التقديم' })
        }
      }
      if (user) {
        checkPeriod()
      }
    }, [user, checkSubmissionPeriod])
    
    const isSubmissionPeriodOpen = () => submissionPeriodStatus.isOpen

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
        { value: 'score', label: 'الدرجة' }
    ]

    const filteredProposals = useMemo(() => {
        return proposals.filter((proposal: Proposal) => {
            const matchesSearch = !searchQuery ||
                proposal.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                proposal.description?.toLowerCase().includes(searchQuery.toLowerCase())

            const matchesStatus = statusFilter === 'all' || proposal.status === statusFilter
            const matchesPriority = priorityFilter === 'all' || proposal.priority === priorityFilter

            return matchesSearch && matchesStatus && matchesPriority
        })
    }, [proposals, searchQuery, statusFilter, priorityFilter])

    const handleFilterClear = () => {
        setStatusFilter('all')
        setPriorityFilter('all')
        setSortBy('submittedDate')
        setSortOrder('desc')
    }

    const handleAnnounceProjects = async () => {
        if (selectedProposalsToAnnounce.length === 0) {
            addNotification({
                title: 'تحذير',
                message: 'يرجى اختيار مشاريع للإعلان',
                type: 'warning'
            })
            return
        }

        try {
            // Update proposals status to 'available_for_registration'
            for (const proposalId of selectedProposalsToAnnounce) {
                await updateProposal(proposalId, {
                    status: 'approved',
                    // Add a flag to indicate it's announced
                })
            }

            addNotification({
                title: 'تم الإعلان',
                message: `تم إعلان ${selectedProposalsToAnnounce.length} مشروع(ات) بنجاح. سيتم إشعار الطلاب.`,
                type: 'success'
            })

            setSelectedProposalsToAnnounce([])
            // Reload proposals
            const data = await getProposals()
            setProposals(data)
        } catch (error) {
            addNotification({
                title: 'خطأ',
                message: 'فشل في إعلان المشاريع. يرجى المحاولة مرة أخرى.',
                type: 'error'
            })
        }
    }

    const approvedProposals = useMemo(() => {
        return filteredProposals.filter(p => p.status === 'approved')
    }, [filteredProposals])

    const columns = useMemo(() => [
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
            render: (proposal: any) => <StatusBadge status={proposal.status} />
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
            key: 'actions',
            label: 'الإجراءات',
            render: (proposal: Proposal) => (
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    {user?.role === 'committee' && proposal.status === 'approved' && (
                        <input
                            type="checkbox"
                            checked={selectedProposalsToAnnounce.includes(proposal.id)}
                            onChange={(e) => {
                                if (e.target.checked) {
                                    setSelectedProposalsToAnnounce(prev => [...prev, proposal.id])
                                } else {
                                    setSelectedProposalsToAnnounce(prev => prev.filter(id => id !== proposal.id))
                                }
                            }}
                            className="w-4 h-4 text-gpms-dark border-gray-300 rounded focus:ring-gpms-light"
                            title="اختر للإعلان"
                        />
                    )}
                    <button
                        onClick={() => setViewProposal(proposal)}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                        title="عرض"
                    >
                        <Eye size={16} />
                    </button>
                    {user?.role === 'student' && proposal.status === 'draft' && (
                        <button
                            onClick={() => {
                                setEditingProposal(proposal)
                                setIsModalOpen(true)
                            }}
                            className="text-blue-600 hover:text-blue-700 transition-colors"
                            title="تعديل"
                        >
                            <Edit size={16} />
                        </button>
                    )}
                    {user?.role === 'committee' && (
                        <>
                            <button
                                onClick={async () => {
                                    try {
                                        await approveProposal(proposal.id)
                                        setProposals(prev => prev.map(p =>
                                            p.id === proposal.id ? { ...p, status: 'approved' } : p
                                        ))
                                        addNotification({
                                            title: 'تمت الموافقة',
                                            message: 'تمت الموافقة على المقترح بنجاح',
                                            type: 'success'
                                        })
                                    } catch (err) {
                                        console.error('Error approving proposal:', err)
                                        addNotification({
                                            title: 'خطأ',
                                            message: 'فشل في الموافقة على المقترح. يرجى المحاولة مرة أخرى.',
                                            type: 'error'
                                        })
                                    }
                                }}
                                className="text-green-600 hover:text-green-700 transition-colors"
                                title="موافقة"
                                disabled={proposal.status === 'approved'}
                            >
                                <CheckCircle size={16} />
                            </button>
                            <button
                                onClick={() => {
                                    setProposalForModification(proposal)
                                    setModificationNotes('')
                                    setModificationModalOpen(true)
                                }}
                                className="text-yellow-600 hover:text-yellow-700 transition-colors"
                                title="طلب تعديل"
                                disabled={proposal.status === 'needs_modification'}
                            >
                                <Edit size={16} />
                            </button>
                            <button
                                onClick={async () => {
                                    try {
                                        await rejectProposal(proposal.id)
                                        setProposals(prev => prev.map(p =>
                                            p.id === proposal.id ? { ...p, status: 'rejected' } : p
                                        ))
                                        addNotification({
                                            title: 'تم الرفض',
                                            message: 'تم رفض المقترح بنجاح',
                                            type: 'success'
                                        })
                                    } catch (err) {
                                        console.error('Error rejecting proposal:', err)
                                        addNotification({
                                            title: 'خطأ',
                                            message: 'فشل في رفض المقترح. يرجى المحاولة مرة أخرى.',
                                            type: 'error'
                                        })
                                    }
                                }}
                                className="text-red-600 hover:text-red-700 transition-colors"
                                title="رفض"
                                disabled={proposal.status === 'rejected'}
                            >
                                <XCircle size={16} />
                            </button>
                        </>
                    )}
                </div>
            )
        }
    ], [user?.role, selectedProposalsToAnnounce, setSelectedProposalsToAnnounce, setViewProposal, setEditingProposal, setIsModalOpen, addNotification])

    return (
        <div className="space-y-6">
            {/* Period Status Banner */}
            {user?.role === 'student' && !submissionPeriodStatus.isOpen && (
                <Card className="border-yellow-300 bg-yellow-50">
                    <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                            <Megaphone className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                            <div className="flex-1">
                                <h3 className="font-semibold text-yellow-900 mb-1">فترة التقديم مغلقة</h3>
                                <p className="text-sm text-yellow-800 mb-2">{submissionPeriodStatus.message}</p>
                                {submissionPeriodStatus.period && (
                                    <div className="text-xs text-yellow-700 bg-yellow-100 p-2 rounded">
                                        <p><strong>الفترة:</strong> {submissionPeriodStatus.period.name}</p>
                                        <p><strong>من:</strong> {new Date(submissionPeriodStatus.period.startDate).toLocaleDateString('ar-SA')}</p>
                                        <p><strong>إلى:</strong> {new Date(submissionPeriodStatus.period.endDate).toLocaleDateString('ar-SA')}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}
            {user?.role === 'student' && submissionPeriodStatus.isOpen && submissionPeriodStatus.period && (
                <Card className="border-green-300 bg-green-50">
                    <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                            <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                            <div className="flex-1">
                                <h3 className="font-semibold text-green-900 mb-1">فترة التقديم مفتوحة</h3>
                                <div className="text-xs text-green-800 bg-green-100 p-2 rounded mt-2">
                                    <p><strong>الفترة:</strong> {submissionPeriodStatus.period.name}</p>
                                    <p><strong>من:</strong> {new Date(submissionPeriodStatus.period.startDate).toLocaleDateString('ar-SA')}</p>
                                    <p><strong>إلى:</strong> {new Date(submissionPeriodStatus.period.endDate).toLocaleDateString('ar-SA')}</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}
            <Card className="hover-lift">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-xl font-bold text-gray-900">{t('navigation.proposalsList')}</h1>
                        </div>
            <div className="flex items-center space-x-3 rtl:space-x-reverse">
              {user?.role === 'committee' && approvedProposals.length > 0 && selectedProposalsToAnnounce.length > 0 && (
                <Button
                  onClick={async () => {
                    try {
                      // Update proposals status to 'announced' or 'available_for_registration'
                      const updatePromises = selectedProposalsToAnnounce.map(id =>
                        updateProposal(id, { status: 'announced' as any })
                      )
                      await Promise.all(updatePromises)
                      
                      setProposals(prev => prev.map(p =>
                        selectedProposalsToAnnounce.includes(p.id) ? { ...p, status: 'announced' as any } : p
                      ))
                      
                      addNotification({
                        title: 'تم الإعلان',
                        message: `تم إعلان ${selectedProposalsToAnnounce.length} مشروع(ات) معتمد(ة) بنجاح. أصبحت متاحة للتسجيل من قبل الطلاب.`,
                        type: 'success'
                      })
                      
                      setSelectedProposalsToAnnounce([])
                    } catch (err) {
                      console.error('Error announcing proposals:', err)
                      addNotification({
                        title: 'خطأ',
                        message: 'فشل في إعلان المشاريع. يرجى المحاولة مرة أخرى.',
                        type: 'error'
                      })
                    }
                  }}
                  className="bg-green-600 text-white hover:bg-green-700"
                >
                  <Megaphone className="w-4 h-4 mr-1 rtl:mr-0 rtl:ml-1" />
                  إعلان المشاريع المختارة ({selectedProposalsToAnnounce.length})
                </Button>
              )}
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
                            {(user?.role === 'student' || user?.role === 'supervisor') && (
                                <Button
                                    onClick={() => {
                                        setEditingProposal(null)
                                        setIsModalOpen(true)
                                    }}
                                    disabled={user?.role === 'student' && !isSubmissionPeriodOpen()}
                                    className={cn(
                                        (user?.role === 'supervisor' || isSubmissionPeriodOpen())
                                            ? "bg-gpms-dark text-white hover:bg-gpms-light"
                                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                    )}
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
                    {displayLoading ? (
                        <div className="text-center py-12">جاري التحميل...</div>
                    ) : viewMode === 'table' ? (
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
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                            {filteredProposals.map((proposal: Proposal) => (
                                <Card key={proposal.id} className="hover-lift">
                                    <CardContent className="p-6">
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex-1">
                                                <h3 className="text-md font-semibold text-gray-900 mb-2">{proposal.title}</h3>
                                                <p className="text-sm text-gray-600 line-clamp-2">{proposal.description}</p>
                                            </div>
                                            <StatusBadge status={proposal.status} />
                                        </div>
                                        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                                            <button
                                                onClick={() => setViewProposal(proposal)}
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

            <UnifiedProposalForm
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false)
                    setEditingProposal(null)
                }}
                onSubmit={async (data: CreateProposalInput) => {
                    try {
                        if (editingProposal) {
                            const updated = await updateProposal(editingProposal.id, data)
                            setProposals(prev => prev.map(p =>
                                p.id === editingProposal.id ? updated : p
                            ))
                        } else {
                            const newProposal = await createProposal(data)
                            setProposals(prev => [newProposal, ...prev])
                        }
                        setIsModalOpen(false)
                        setEditingProposal(null)
                    } catch (err) {
                        console.error('Error submitting proposal:', err)
                        addNotification({
                            title: 'خطأ',
                            message: 'فشل في حفظ المقترح. يرجى المحاولة مرة أخرى.',
                            type: 'error'
                        })
                    }
                }}
                editData={editingProposal}
                userRole={(user?.role === 'student' || user?.role === 'supervisor' || user?.role === 'committee') ? user.role : 'student'}
                mode={editingProposal ? 'edit' : 'create'}
            />

            <Modal
                isOpen={!!viewProposal}
                onClose={() => setViewProposal(null)}
                title={viewProposal ? `تفاصيل المقترح - ${viewProposal.title}` : 'تفاصيل المقترح'}
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
                                <p className="text-gray-700 mt-1"><StatusBadge status={viewProposal.status} /></p>
                            </div>
                        </div>
                        <div>
                            <span className="font-medium">الوصف:</span>
                            <p className="text-gray-700 mt-1">{viewProposal.description}</p>
                        </div>
                    </div>
                )}
            </Modal>

            {/* Request Modification Modal */}
            <Modal
                isOpen={modificationModalOpen}
                onClose={() => {
                    setModificationModalOpen(false)
                    setProposalForModification(null)
                    setModificationNotes('')
                }}
                title="طلب تعديل المقترح"
                size="md"
            >
                {proposalForModification && (
                    <Form onSubmit={async (e) => {
                        e.preventDefault()
                        if (!modificationNotes.trim()) {
                            addNotification({
                                title: 'خطأ',
                                message: 'يرجى إدخال ملاحظات التعديل المطلوبة',
                                type: 'error'
                            })
                            return
                        }

                        try {
                            await requestProposalModification(proposalForModification.id, modificationNotes)
                            setProposals(prev => prev.map(p =>
                                p.id === proposalForModification.id ? { ...p, status: 'needs_modification' } : p
                            ))
                            addNotification({
                                title: 'تم إرسال طلب التعديل',
                                message: 'تم إرسال طلب التعديل للمقدم بنجاح. سيتم إشعاره لإعادة التقديم بعد التعديلات.',
                                type: 'success'
                            })
                            setModificationModalOpen(false)
                            setProposalForModification(null)
                            setModificationNotes('')
                        } catch (err) {
                            console.error('Error requesting modification:', err)
                            addNotification({
                                title: 'خطأ',
                                message: 'فشل في إرسال طلب التعديل. يرجى المحاولة مرة أخرى.',
                                type: 'error'
                            })
                        }
                    }}>
                        <div className="space-y-4">
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <p className="font-medium text-gray-900 mb-1">المقترح:</p>
                                <p className="text-sm text-gray-700">{proposalForModification.title}</p>
                            </div>
                            <FormGroup>
                                <FormLabel htmlFor="modificationNotes" required>ملاحظات التعديل المطلوبة</FormLabel>
                                <textarea
                                    id="modificationNotes"
                                    value={modificationNotes}
                                    onChange={(e) => setModificationNotes(e.target.value)}
                                    rows={6}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gpms-light focus:border-transparent"
                                    placeholder="اذكر التعديلات المطلوبة في المقترح..."
                                    required
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    سيتم إشعار مقدم المقترح بهذه الملاحظات لإعادة التقديم بعد التعديلات
                                </p>
                            </FormGroup>
                            <div className="flex justify-end gap-3 pt-4 border-t">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => {
                                        setModificationModalOpen(false)
                                        setProposalForModification(null)
                                        setModificationNotes('')
                                    }}
                                >
                                    إلغاء
                                </Button>
                                <Button type="submit">
                                    إرسال طلب التعديل
                                </Button>
                            </div>
                        </div>
                    </Form>
                )}
            </Modal>
        </div>
    )
}

export default ProposalsScreen

