import React, { useState } from 'react'
import { useLanguage } from '../../context/LanguageContext'
import { cn } from '../../lib/utils'
import { Card, CardContent } from '../ui/Card'
import Button from '../ui/Button'
import Badge from '../ui/Badge'
import { Table } from '../ui/Table'
import { SearchBar, FilterDropdown, FilterBar } from '../ui/Filter'
import GridView, { ReportCard } from '../ui/GridView'
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  FileText,
  Download,
  BarChart3,
  LayoutGrid,
  List
} from 'lucide-react'
import DocumentFormModal from '../forms/DocumentFormModal'

interface Report {
  id: string
  title: string
  description: string
  type: 'progress' | 'final' | 'technical' | 'financial' | 'other'
  status: 'draft' | 'pending' | 'approved' | 'rejected'
  priority: 'low' | 'medium' | 'high'
  author: string
  projectId: string
  projectTitle: string
  createdAt: string
  updatedAt: string
  dueDate?: string
  attachments: number
  version: string
}

interface ReportsTableProps {
  className?: string
}

const ReportsTable: React.FC<ReportsTableProps> = ({ className }) => {
  const { t } = useLanguage()
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [sortBy, setSortBy] = useState('updatedAt')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingReport, setEditingReport] = useState<Report | null>(null)
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table')

  // Mock data
  const [reports, setReports] = useState<Report[]>([
    {
      id: '1',
      title: 'تقرير التقدم - المرحلة الأولى',
      description: 'تقرير مفصل عن التقدم المحرز في المرحلة الأولى من مشروع تطبيق إدارة المكتبة',
      type: 'progress',
      status: 'approved',
      priority: 'high',
      author: 'أحمد محمد علي',
      projectId: '1',
      projectTitle: 'تطبيق إدارة المكتبة الذكية',
      createdAt: '2024-01-15',
      updatedAt: '2024-01-20',
      dueDate: '2024-01-25',
      attachments: 3,
      version: '1.2'
    },
    {
      id: '2',
      title: 'التقرير التقني النهائي',
      description: 'تقرير تقني شامل يوضح جميع الجوانب التقنية للمشروع',
      type: 'technical',
      status: 'pending',
      priority: 'medium',
      author: 'فاطمة علي محمد',
      projectId: '2',
      projectTitle: 'نظام إدارة المستشفى',
      createdAt: '2024-01-10',
      updatedAt: '2024-01-18',
      dueDate: '2024-01-30',
      attachments: 5,
      version: '2.0'
    },
    {
      id: '3',
      title: 'تقرير التكلفة والميزانية',
      description: 'تقرير مفصل عن التكاليف والميزانية المطلوبة للمشروع',
      type: 'financial',
      status: 'draft',
      priority: 'low',
      author: 'محمد خالد محمود',
      projectId: '3',
      projectTitle: 'مشروع الذكاء الاصطناعي',
      createdAt: '2024-01-18',
      updatedAt: '2024-01-21',
      attachments: 2,
      version: '1.0'
    },
    {
      id: '4',
      title: 'التقرير النهائي للمشروع',
      description: 'التقرير النهائي الشامل الذي يلخص جميع مراحل المشروع والنتائج',
      type: 'final',
      status: 'approved',
      priority: 'high',
      author: 'سارة أحمد حسن',
      projectId: '4',
      projectTitle: 'تطبيق التجارة الإلكترونية',
      createdAt: '2023-12-01',
      updatedAt: '2024-01-15',
      attachments: 8,
      version: '3.1'
    },
    {
      id: '5',
      title: 'تقرير مراجعة الأمان',
      description: 'تقرير مراجعة شامل لجميع جوانب الأمان في النظام',
      type: 'other',
      status: 'rejected',
      priority: 'medium',
      author: 'خالد محمود الحسن',
      projectId: '5',
      projectTitle: 'نظام إدارة المخزون',
      createdAt: '2024-01-12',
      updatedAt: '2024-01-19',
      attachments: 1,
      version: '1.1'
    }
  ])

  const statusOptions = [
    { value: 'all', label: 'جميع الحالات' },
    { value: 'draft', label: 'مسودة' },
    { value: 'pending', label: 'قيد المراجعة' },
    { value: 'approved', label: 'موافق عليه' },
    { value: 'rejected', label: 'مرفوض' }
  ]

  const typeOptions = [
    { value: 'all', label: 'جميع الأنواع' },
    { value: 'progress', label: 'تقرير تقدم' },
    { value: 'final', label: 'تقرير نهائي' },
    { value: 'technical', label: 'تقرير تقني' },
    { value: 'financial', label: 'تقرير مالي' },
    { value: 'other', label: 'أخرى' }
  ]

  const priorityOptions = [
    { value: 'all', label: 'جميع الأولويات' },
    { value: 'low', label: 'منخفض' },
    { value: 'medium', label: 'متوسط' },
    { value: 'high', label: 'عالي' }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'default'
      case 'pending': return 'warning'
      case 'approved': return 'success'
      case 'rejected': return 'error'
      default: return 'default'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'draft': return 'مسودة'
      case 'pending': return 'قيد المراجعة'
      case 'approved': return 'موافق عليه'
      case 'rejected': return 'مرفوض'
      default: return status
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'progress': return 'تقرير تقدم'
      case 'final': return 'تقرير نهائي'
      case 'technical': return 'تقرير تقني'
      case 'financial': return 'تقرير مالي'
      case 'other': return 'أخرى'
      default: return type
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
      case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
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

  const filteredReports = reports
    .filter(report => {
      const matchesSearch = !searchQuery ||
        report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        report.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        report.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        report.projectTitle.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesStatus = statusFilter === 'all' || report.status === statusFilter
      const matchesType = typeFilter === 'all' || report.type === typeFilter
      const matchesPriority = priorityFilter === 'all' || report.priority === priorityFilter

      return matchesSearch && matchesStatus && matchesType && matchesPriority
    })
    .sort((a, b) => {
      let comparison = 0

      switch (sortBy) {
        case 'title':
          comparison = a.title.localeCompare(b.title, 'ar')
          break
        case 'author':
          comparison = a.author.localeCompare(b.author, 'ar')
          break
        case 'createdAt':
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          break
        case 'updatedAt':
          comparison = new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime()
          break
        case 'dueDate':
          comparison = new Date(a.dueDate || '').getTime() - new Date(b.dueDate || '').getTime()
          break
        default:
          comparison = 0
      }

      return sortOrder === 'asc' ? comparison : -comparison
    })

  const handleAddReport = () => {
    setEditingReport(null)
    setIsModalOpen(true)
  }

  const handleEditReport = (report: Report) => {
    setEditingReport(report)
    setIsModalOpen(true)
  }

  const handleDeleteReport = (reportId: string) => {
    if (window.confirm('هل أنت متأكد من حذف هذا التقرير؟')) {
      setReports(prev => prev.filter(r => r.id !== reportId))
    }
  }

  const handleViewReport = (report: Report) => {
    console.log('View report:', report)
    // Implement view functionality
  }

  const handleDownloadReport = (report: Report) => {
    console.log('Download report:', report)
    // Implement download functionality
  }

  const handleModalSubmit = (data: any) => {
    if (editingReport) {
      // Update existing report
      setReports(prev => prev.map(r =>
        r.id === editingReport.id
          ? { ...r, ...data, updatedAt: new Date().toISOString().split('T')[0] }
          : r
      ))
    } else {
      // Add new report
      const newReport: Report = {
        id: Math.random().toString(36).substring(7),
        ...data,
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0],
        status: 'draft',
        attachments: 0,
        version: '1.0'
      }
      setReports(prev => [newReport, ...prev])
    }
    setIsModalOpen(false)
    setEditingReport(null)
  }

  const columns = [
    {
      key: 'title',
      label: 'عنوان التقرير',
      sortable: true,
      render: (report: Report) => (
        <div>
          <h3 className="font-medium text-gray-900 dark:text-gray-100">{report.title}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">{report.description}</p>
        </div>
      )
    },
    {
      key: 'type',
      label: 'نوع التقرير',
      render: (report: Report) => (
        <Badge variant="info" className="bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800">
          {getTypeLabel(report.type)}
        </Badge>
      )
    },
    {
      key: 'status',
      label: 'الحالة',
      render: (report: Report) => (
        <Badge variant={getStatusColor(report.status)}>
          {getStatusLabel(report.status)}
        </Badge>
      )
    },
    {
      key: 'priority',
      label: 'الأولوية',
      render: (report: Report) => (
        <span className={cn('px-2 py-1 rounded-full text-xs font-medium border border-transparent', getPriorityColor(report.priority))}>
          {getPriorityLabel(report.priority)}
        </span>
      )
    },
    {
      key: 'author',
      label: 'المؤلف',
      sortable: true,
      render: (report: Report) => (
        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          <div className="w-8 h-8 bg-gpms-primary/10 rounded-full flex items-center justify-center text-gpms-primary text-sm font-bold">
            {report.author.charAt(0)}
          </div>
          <span className="text-sm text-gray-900 dark:text-gray-100">{report.author}</span>
        </div>
      )
    },
    {
      key: 'project',
      label: 'المشروع',
      render: (report: Report) => (
        <div>
          <span className="text-sm text-gray-900 dark:text-gray-100">{report.projectTitle}</span>
        </div>
      )
    },
    {
      key: 'attachments',
      label: 'المرفقات',
      render: (report: Report) => (
        <div className="flex items-center space-x-1 rtl:space-x-reverse text-gray-500 dark:text-gray-400">
          <FileText size={14} />
          <span className="text-sm">{report.attachments}</span>
        </div>
      )
    },
    {
      key: 'version',
      label: 'الإصدار',
      render: (report: Report) => (
        <span className="text-sm text-gray-500 dark:text-gray-400 font-mono bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded">v{report.version}</span>
      )
    },
    {
      key: 'dueDate',
      label: 'تاريخ الاستحقاق',
      sortable: true,
      render: (report: Report) => (
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {report.dueDate ? new Date(report.dueDate).toLocaleDateString('ar') : 'غير محدد'}
        </span>
      )
    },
    {
      key: 'updatedAt',
      label: 'آخر تحديث',
      sortable: true,
      render: (report: Report) => (
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {new Date(report.updatedAt).toLocaleDateString('ar')}
        </span>
      )
    },
    {
      key: 'actions',
      label: 'الإجراءات',
      render: (report: Report) => (
        <div className="flex items-center gap-1">
          <button
            onClick={() => handleViewReport(report)}
            className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            title="عرض"
          >
            <Eye size={16} />
          </button>
          <button
            onClick={() => handleDownloadReport(report)}
            className="p-1.5 text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
            title="تحميل"
          >
            <Download size={16} />
          </button>
          <button
            onClick={() => handleEditReport(report)}
            className="p-1.5 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
            title="تعديل"
          >
            <Edit size={16} />
          </button>
          <button
            onClick={() => handleDeleteReport(report.id)}
            className="p-1.5 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
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
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-gpms-primary to-gpms-dark p-8 text-white shadow-xl">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 rounded-full bg-white/10 blur-3xl" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                <FileText className="w-6 h-6 text-yellow-300" />
              </div>
              <h2 className="text-2xl font-bold">إدارة التقارير</h2>
            </div>
            <p className="text-blue-100 max-w-xl text-sm leading-relaxed">
              إدارة ومتابعة جميع التقارير الخاصة بالمشاريع والطلاب
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* View Mode Toggle */}
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-1 flex">
              <button
                onClick={() => setViewMode('table')}
                className={cn(
                  "p-2 rounded-md transition-all",
                  viewMode === 'table' ? "bg-white text-gpms-primary shadow-sm" : "text-white hover:bg-white/10"
                )}
                title="عرض الجدول"
              >
                <List size={20} />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={cn(
                  "p-2 rounded-md transition-all",
                  viewMode === 'grid' ? "bg-white text-gpms-primary shadow-sm" : "text-white hover:bg-white/10"
                )}
                title="عرض الشبكة"
              >
                <LayoutGrid size={20} />
              </button>
            </div>

            <Button
              onClick={handleAddReport}
              className="bg-white text-gpms-primary hover:bg-blue-50 border-0 shadow-lg"
            >
              <Plus className="w-4 h-4 mr-1 rtl:mr-0 rtl:ml-1" />
              تقرير جديد
            </Button>
          </div>
        </div>
      </div>

      <Card className="border-0 shadow-lg overflow-hidden">
        <CardContent className="p-6">
          {/* Search and Filters */}
          <div className="space-y-4 mb-6">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="البحث في التقارير..."
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
                className="px-3 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:ring-2 focus:ring-gpms-primary/20 outline-none"
              >
                <option value="updatedAt">آخر تحديث</option>
                <option value="title">العنوان</option>
                <option value="author">المؤلف</option>
                <option value="dueDate">تاريخ الاستحقاق</option>
                <option value="createdAt">تاريخ الإنشاء</option>
              </select>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
                className="px-3"
              >
                {sortOrder === 'asc' ? '↑' : '↓'}
              </Button>
            </FilterBar>
          </div>

          {/* Reports Table/Grid */}
          {viewMode === 'table' ? (
            <Table
              data={filteredReports}
              columns={columns}
              emptyMessage="لا توجد تقارير"
              className="min-h-[400px]"
            />
          ) : (
            <div className="p-1">
              <GridView
                data={filteredReports}
                renderItem={(report) => (
                  <ReportCard
                    report={report}
                    onView={handleViewReport}
                    onEdit={handleEditReport}
                    onDelete={handleDeleteReport}
                    onDownload={handleDownloadReport}
                  />
                )}
                emptyMessage="لا توجد تقارير"
                className="min-h-[400px]"
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal */}
      <DocumentFormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setEditingReport(null)
        }}
        onSubmit={handleModalSubmit}
        editData={editingReport}
      />
    </div>
  )
}

export default ReportsTable
