import React, { useState } from 'react'
import { useLanguage } from '../../context/LanguageContext'
import { cn } from '../../lib/utils'
import { Card, CardContent, CardHeader } from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import { SearchBar } from '../../components/ui/Filter'
import { Table } from '../../components/ui/Table'
import GridView, { ProposalCard } from '../../components/ui/GridView'
import ViewToggle from '../../components/ui/ViewToggle'
import AdvancedFilter from '../../components/ui/AdvancedFilter'
import ProposalFormModal from '../../components/forms/ProposalFormModal'
import { 
  Plus, 
  Eye, 
  Edit, 
  Trash2,
  Calendar,
  User,
  FileText,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react'

interface Proposal {
  id: string
  title: string
  description: string
  status: 'draft' | 'submitted' | 'under_review' | 'approved' | 'rejected' | 'pending'
  priority: 'low' | 'medium' | 'high'
  submitter: string
  submitterRole: 'student' | 'supervisor'
  submissionDate: string
  reviewDate?: string
  reviewer?: string
  comments?: string
  tags: string[]
  createdAt: string
  updatedAt: string
}

const ProposalsList: React.FC = () => {
  const { t } = useLanguage()
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [roleFilter, setRoleFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [sortBy, setSortBy] = useState('updatedAt')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('grid')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProposal, setEditingProposal] = useState<Proposal | null>(null)
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  // Mock data
  const [proposals, setProposals] = useState<Proposal[]>([
    {
      id: '1',
      title: 'مقترح تطوير نظام إدارة المكتبة الذكية',
      description: 'مقترح لتطوير نظام متكامل لإدارة المكتبات باستخدام تقنيات الذكاء الاصطناعي',
      status: 'under_review',
      priority: 'high',
      submitter: 'أحمد محمد علي',
      submitterRole: 'student',
      submissionDate: '2024-01-15',
      reviewDate: '2024-01-25',
      reviewer: 'د. سارة أحمد حسن',
      comments: 'مقترح ممتاز يحتاج لبعض التحسينات في الجانب التقني',
      tags: ['تطوير ويب', 'ذكاء اصطناعي', 'قواعد البيانات'],
      createdAt: '2024-01-15',
      updatedAt: '2024-01-22'
    },
    {
      id: '2',
      title: 'مقترح مشروع الذكاء الاصطناعي في الطب',
      description: 'تطوير نموذج ذكي لتحليل الصور الطبية وتشخيص الأمراض',
      status: 'approved',
      priority: 'high',
      submitter: 'د. خالد محمود الحسن',
      submitterRole: 'supervisor',
      submissionDate: '2024-01-10',
      reviewDate: '2024-01-20',
      reviewer: 'د. فاطمة علي محمد',
      comments: 'مقترح رائد في مجال الذكاء الاصطناعي الطبي',
      tags: ['ذكاء اصطناعي', 'الطب', 'تحليل الصور'],
      createdAt: '2024-01-10',
      updatedAt: '2024-01-20'
    },
    {
      id: '3',
      title: 'مقترح منصة التعليم الإلكتروني',
      description: 'تطوير منصة تفاعلية للتعليم عن بعد مع دعم الواقع الافتراضي',
      status: 'rejected',
      priority: 'medium',
      submitter: 'سارة أحمد حسن',
      submitterRole: 'student',
      submissionDate: '2024-01-12',
      reviewDate: '2024-01-18',
      reviewer: 'د. محمد خالد محمود',
      comments: 'المقترح يحتاج لمزيد من التفاصيل التقنية والمالية',
      tags: ['تعليم إلكتروني', 'واقع افتراضي', 'تفاعل'],
      createdAt: '2024-01-12',
      updatedAt: '2024-01-18'
    },
    {
      id: '4',
      title: 'مقترح نظام إدارة المستشفى الذكي',
      description: 'نظام شامل لإدارة العمليات الطبية والمواعيد في المستشفيات',
      status: 'pending',
      priority: 'low',
      submitter: 'د. نورا أحمد محمد',
      submitterRole: 'supervisor',
      submissionDate: '2024-01-20',
      tags: ['إدارة المستشفى', 'قواعد البيانات', 'واجهة مستخدم'],
      createdAt: '2024-01-20',
      updatedAt: '2024-01-20'
    },
    {
      id: '5',
      title: 'مقترح تطبيق التجارة الإلكترونية',
      description: 'منصة تجارة إلكترونية متكاملة مع نظام دفع آمن',
      status: 'draft',
      priority: 'medium',
      submitter: 'محمد خالد محمود',
      submitterRole: 'student',
      submissionDate: '2024-01-25',
      tags: ['تطوير ويب', 'التجارة الإلكترونية', 'الدفع الإلكتروني'],
      createdAt: '2024-01-25',
      updatedAt: '2024-01-25'
    }
  ])

  const getStatusText = (status: string) => {
    switch (status) {
      case 'draft': return 'مسودة'
      case 'submitted': return 'مُرسل'
      case 'under_review': return 'قيد المراجعة'
      case 'approved': return 'موافق عليه'
      case 'rejected': return 'مرفوض'
      case 'pending': return 'معلق'
      default: return status
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800'
      case 'submitted': return 'bg-blue-100 text-blue-800'
      case 'under_review': return 'bg-yellow-100 text-yellow-800'
      case 'approved': return 'bg-green-100 text-green-800'
      case 'rejected': return 'bg-red-100 text-red-800'
      case 'pending': return 'bg-orange-100 text-orange-800'
      default: return 'bg-gray-100 text-gray-800'
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

  const filteredProposals = proposals
    .filter(proposal => {
      const matchesSearch = !searchQuery ||
        proposal.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        proposal.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        proposal.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))

      const matchesStatus = statusFilter === 'all' || proposal.status === statusFilter
      const matchesRole = roleFilter === 'all' || proposal.submitterRole === roleFilter
      const matchesPriority = priorityFilter === 'all' || proposal.priority === priorityFilter

      return matchesSearch && matchesStatus && matchesRole && matchesPriority
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

  const handleAddProposal = () => {
    setEditingProposal(null)
    setIsModalOpen(true)
  }

  const handleEditProposal = (proposal: Proposal) => {
    setEditingProposal(proposal)
    setIsModalOpen(true)
  }

  const handleDeleteProposal = (proposalId: string) => {
    if (window.confirm('هل أنت متأكد من حذف هذا المقترح؟')) {
      setProposals(prev => prev.filter(p => p.id !== proposalId))
    }
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
          ? { ...p, ...data, updatedAt: new Date().toISOString().split('T')[0] }
          : p
      ))
    } else {
      // Add new proposal
      const newProposal: Proposal = {
        id: Math.random().toString(36).substring(7),
        ...data,
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0],
        status: 'draft'
      }
      setProposals(prev => [newProposal, ...prev])
    }
    setIsModalOpen(false)
    setEditingProposal(null)
  }

  const handleApplyFilters = () => {
    // Filters are already applied through state updates
    console.log('Filters applied')
  }

  const handleClearFilters = () => {
    setStatusFilter('all')
    setRoleFilter('all')
    setPriorityFilter('all')
    setSortBy('updatedAt')
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
          getStatusColor(proposal.status)
        )}>
          {getStatusText(proposal.status)}
        </span>
      )
    },
    {
      key: 'submitter',
      label: 'المقدم',
      render: (proposal: Proposal) => (
        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-sm font-medium">
            {proposal.submitter.charAt(0)}
          </div>
          <div>
            <span className="text-sm text-gray-900">{proposal.submitter}</span>
            <div className="text-xs text-gray-500">{getRoleText(proposal.submitterRole)}</div>
          </div>
        </div>
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
      key: 'submissionDate',
      label: 'تاريخ التقديم',
      sortable: true,
      render: (proposal: Proposal) => (
        <span className="text-sm text-gray-600">
          {new Date(proposal.submissionDate).toLocaleDateString('ar')}
        </span>
      )
    },
    {
      key: 'reviewer',
      label: 'المراجع',
      render: (proposal: Proposal) => (
        <span className="text-sm text-gray-600">
          {proposal.reviewer || 'غير محدد'}
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
          <button
            onClick={() => handleEditProposal(proposal)}
            className="text-blue-600 hover:text-blue-700 transition-colors"
            title="تعديل"
          >
            <Edit size={16} />
          </button>
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
              <FileText className="w-6 h-6 text-purple-600" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">قائمة المقترحات</h1>
                <p className="text-gray-600 mt-1">إدارة ومتابعة جميع المقترحات</p>
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
                onClick={handleAddProposal}
                className="bg-purple-600 text-white hover:bg-purple-700"
              >
                <Plus className="w-4 h-4 mr-1 rtl:mr-0 rtl:ml-1" />
                مقترح جديد
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
              placeholder="البحث في المقترحات..."
              className="w-full"
            />
          </div>
        </CardContent>
      </Card>

      {/* Proposals Display */}
      {viewMode === 'table' ? (
        <Card className="hover-lift">
          <CardContent className="p-0">
            <Table
              data={filteredProposals}
              columns={columns}
              emptyMessage="لا توجد مقترحات"
              className="min-h-[400px]"
            />
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
          {filteredProposals.map((proposal) => (
            <ProposalCard
              key={proposal.id}
              proposal={proposal}
              onView={handleViewProposal}
              onEdit={handleEditProposal}
              onDelete={handleDeleteProposal}
            />
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
              className="bg-purple-600 text-white hover:bg-purple-700"
            >
              إضافة مقترح جديد
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Modal */}
      <ProposalFormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setEditingProposal(null)
        }}
        onSubmit={handleModalSubmit}
        editData={editingProposal}
      />
    </div>
  )
}

export default ProposalsList
