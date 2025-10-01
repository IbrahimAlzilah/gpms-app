import React from 'react'
import { cn } from '../../lib/utils'
import { Card, CardContent } from './Card'
import Badge from './Badge'
import { 
  Eye, 
  Edit, 
  Trash2, 
  Download,
  Calendar,
  User,
  FileText,
  Clock,
  AlertCircle,
  CheckCircle
} from 'lucide-react'

interface GridViewProps<T> {
  data: T[]
  renderItem: (item: T, index: number) => React.ReactNode
  emptyMessage?: string
  className?: string
}

const GridView = <T,>({ 
  data, 
  renderItem, 
  emptyMessage = "لا توجد عناصر",
  className 
}: GridViewProps<T>) => {
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        <div className="text-center">
          <FileText size={48} className="mx-auto mb-4 text-gray-300" />
          <p className="text-lg">{emptyMessage}</p>
        </div>
      </div>
    )
  }

  return (
    <div className={cn(
      "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4",
      className
    )}>
      {data.map((item, index) => (
        <div key={index} className="w-full">
          {renderItem(item, index)}
        </div>
      ))}
    </div>
  )
}

// Project Card Component
interface ProjectCardProps {
  project: {
    id: string
    title: string
    description: string
    status: 'draft' | 'submitted' | 'under_review' | 'approved' | 'rejected' | 'in_progress' | 'completed'
    priority: 'low' | 'medium' | 'high'
    student: string
    supervisor?: string
    createdAt: string
    updatedAt: string
    progress: number
    tags: string[]
  }
  onView: (project: any) => void
  onEdit: (project: any) => void
  onDelete: (id: string) => void
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  onView,
  onEdit,
  onDelete
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'default'
      case 'submitted': return 'info'
      case 'under_review': return 'warning'
      case 'approved': return 'success'
      case 'rejected': return 'error'
      case 'in_progress': return 'info'
      case 'completed': return 'success'
      default: return 'default'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'draft': return 'مسودة'
      case 'submitted': return 'مُرسل'
      case 'under_review': return 'قيد المراجعة'
      case 'approved': return 'موافق عليه'
      case 'rejected': return 'مرفوض'
      case 'in_progress': return 'قيد التنفيذ'
      case 'completed': return 'مكتمل'
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

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'low': return 'منخفض'
      case 'medium': return 'متوسط'
      case 'high': return 'عالي'
      default: return priority
    }
  }

  return (
    <Card className="hover-lift h-full">
      <CardContent className="p-4 h-full flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 mb-1">
              {project.title}
            </h3>
            <p className="text-xs text-gray-600 line-clamp-2">
              {project.description}
            </p>
          </div>
        </div>

        {/* Status and Priority */}
        <div className="flex items-center justify-between mb-3">
          <Badge variant={getStatusColor(project.status)}>
            {getStatusLabel(project.status)}
          </Badge>
          <span className={cn('px-2 py-1 rounded-full text-xs font-medium', getPriorityColor(project.priority))}>
            {getPriorityLabel(project.priority)}
          </span>
        </div>

        {/* Progress */}
        <div className="mb-3">
          <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
            <span>التقدم</span>
            <span>{project.progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gpms-light h-2 rounded-full transition-all duration-300"
              style={{ width: `${project.progress}%` }}
            />
          </div>
        </div>

        {/* Student and Supervisor */}
        <div className="space-y-2 mb-3 flex-1">
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <User size={14} className="text-gray-500" />
            <span className="text-xs text-gray-600 truncate">{project.student}</span>
          </div>
          {project.supervisor && (
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <User size={14} className="text-gray-500" />
              <span className="text-xs text-gray-600 truncate">{project.supervisor}</span>
            </div>
          )}
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-3">
          {project.tags.slice(0, 2).map((tag, index) => (
            <span 
              key={index}
              className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
            >
              {tag}
            </span>
          ))}
          {project.tags.length > 2 && (
            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
              +{project.tags.length - 2}
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <span className="text-xs text-gray-500">
            {new Date(project.updatedAt).toLocaleDateString('ar')}
          </span>
          <div className="flex items-center space-x-1 rtl:space-x-reverse">
            <button
              onClick={() => onView(project)}
              className="text-gray-400 hover:text-gray-600 transition-colors p-1"
              title="عرض"
            >
              <Eye size={14} />
            </button>
            <button
              onClick={() => onEdit(project)}
              className="text-blue-600 hover:text-blue-700 transition-colors p-1"
              title="تعديل"
            >
              <Edit size={14} />
            </button>
            <button
              onClick={() => onDelete(project.id)}
              className="text-red-600 hover:text-red-700 transition-colors p-1"
              title="حذف"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Request Card Component
interface RequestCardProps {
  request: {
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
  onView: (request: any) => void
  onEdit: (request: any) => void
  onDelete: (id: string) => void
}

export const RequestCard: React.FC<RequestCardProps> = ({
  request,
  onView,
  onEdit,
  onDelete
}) => {
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

  return (
    <Card className="hover-lift h-full">
      <CardContent className="p-4 h-full flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 mb-1">
              {request.title}
            </h3>
            <p className="text-xs text-gray-600 line-clamp-2">
              {request.description}
            </p>
          </div>
        </div>

        {/* Type, Status and Priority */}
        <div className="space-y-2 mb-3">
          <div className="flex items-center justify-between">
            <Badge variant="info">
              {getTypeLabel(request.type)}
            </Badge>
            <Badge variant={getStatusColor(request.status)}>
              {getStatusLabel(request.status)}
            </Badge>
          </div>
          <div className="flex justify-end">
            <span className={cn('px-2 py-1 rounded-full text-xs font-medium', getPriorityColor(request.priority))}>
              {getPriorityLabel(request.priority)}
            </span>
          </div>
        </div>

        {/* Student and Supervisor */}
        <div className="space-y-2 mb-3 flex-1">
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <User size={14} className="text-gray-500" />
            <span className="text-xs text-gray-600 truncate">{request.student}</span>
          </div>
          {request.supervisor && (
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <User size={14} className="text-gray-500" />
              <span className="text-xs text-gray-600 truncate">{request.supervisor}</span>
            </div>
          )}
        </div>

        {/* Requested Date */}
        <div className="flex items-center space-x-2 rtl:space-x-reverse mb-3">
          <Calendar size={14} className="text-gray-500" />
          <span className="text-xs text-gray-600">
            {new Date(request.requestedDate).toLocaleDateString('ar')}
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <span className="text-xs text-gray-500">
            {new Date(request.updatedAt).toLocaleDateString('ar')}
          </span>
          <div className="flex items-center space-x-1 rtl:space-x-reverse">
            <button
              onClick={() => onView(request)}
              className="text-gray-400 hover:text-gray-600 transition-colors p-1"
              title="عرض"
            >
              <Eye size={14} />
            </button>
            <button
              onClick={() => onEdit(request)}
              className="text-blue-600 hover:text-blue-700 transition-colors p-1"
              title="تعديل"
            >
              <Edit size={14} />
            </button>
            <button
              onClick={() => onDelete(request.id)}
              className="text-red-600 hover:text-red-700 transition-colors p-1"
              title="حذف"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Report Card Component
interface ReportCardProps {
  report: {
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
  onView: (report: any) => void
  onEdit: (report: any) => void
  onDelete: (id: string) => void
  onDownload: (report: any) => void
}

export const ReportCard: React.FC<ReportCardProps> = ({
  report,
  onView,
  onEdit,
  onDelete,
  onDownload
}) => {
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

  return (
    <Card className="hover-lift h-full">
      <CardContent className="p-4 h-full flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 mb-1">
              {report.title}
            </h3>
            <p className="text-xs text-gray-600 line-clamp-2">
              {report.description}
            </p>
          </div>
        </div>

        {/* Type, Status and Priority */}
        <div className="space-y-2 mb-3">
          <div className="flex items-center justify-between">
            <Badge variant="info">
              {getTypeLabel(report.type)}
            </Badge>
            <Badge variant={getStatusColor(report.status)}>
              {getStatusLabel(report.status)}
            </Badge>
          </div>
          <div className="flex justify-end">
            <span className={cn('px-2 py-1 rounded-full text-xs font-medium', getPriorityColor(report.priority))}>
              {getPriorityLabel(report.priority)}
            </span>
          </div>
        </div>

        {/* Author and Project */}
        <div className="space-y-2 mb-3 flex-1">
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <User size={14} className="text-gray-500" />
            <span className="text-xs text-gray-600 truncate">{report.author}</span>
          </div>
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <FileText size={14} className="text-gray-500" />
            <span className="text-xs text-gray-600 truncate">{report.projectTitle}</span>
          </div>
        </div>

        {/* Attachments and Version */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <FileText size={14} className="text-gray-500" />
            <span className="text-xs text-gray-600">{report.attachments} مرفق</span>
          </div>
          <span className="text-xs text-gray-500">v{report.version}</span>
        </div>

        {/* Due Date */}
        {report.dueDate && (
          <div className="flex items-center space-x-2 rtl:space-x-reverse mb-3">
            <Calendar size={14} className="text-gray-500" />
            <span className="text-xs text-gray-600">
              {new Date(report.dueDate).toLocaleDateString('ar')}
            </span>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <span className="text-xs text-gray-500">
            {new Date(report.updatedAt).toLocaleDateString('ar')}
          </span>
          <div className="flex items-center space-x-1 rtl:space-x-reverse">
            <button
              onClick={() => onView(report)}
              className="text-gray-400 hover:text-gray-600 transition-colors p-1"
              title="عرض"
            >
              <Eye size={14} />
            </button>
            <button
              onClick={() => onDownload(report)}
              className="text-green-600 hover:text-green-700 transition-colors p-1"
              title="تحميل"
            >
              <Download size={14} />
            </button>
            <button
              onClick={() => onEdit(report)}
              className="text-blue-600 hover:text-blue-700 transition-colors p-1"
              title="تعديل"
            >
              <Edit size={14} />
            </button>
            <button
              onClick={() => onDelete(report.id)}
              className="text-red-600 hover:text-red-700 transition-colors p-1"
              title="حذف"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Proposal Card Component
interface ProposalCardProps {
  proposal: {
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
  onView: (proposal: any) => void
  onEdit: (proposal: any) => void
  onDelete: (id: string) => void
}

export const ProposalCard: React.FC<ProposalCardProps> = ({
  proposal,
  onView,
  onEdit,
  onDelete
}) => {
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

  const getStatusLabel = (status: string) => {
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

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'low': return 'منخفض'
      case 'medium': return 'متوسط'
      case 'high': return 'عالي'
      default: return priority
    }
  }

  return (
    <Card className="hover-lift h-full">
      <CardContent className="p-4 h-full flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 mb-1">
              {proposal.title}
            </h3>
            <p className="text-xs text-gray-600 line-clamp-2">
              {proposal.description}
            </p>
          </div>
        </div>

        {/* Status and Priority */}
        <div className="flex items-center justify-between mb-3">
          <span className={cn('px-2 py-1 text-xs rounded-full', getStatusColor(proposal.status))}>
            {getStatusLabel(proposal.status)}
          </span>
          <span className={cn('px-2 py-1 rounded-full text-xs font-medium', getPriorityColor(proposal.priority))}>
            {getPriorityLabel(proposal.priority)}
          </span>
        </div>

        {/* Submitter */}
        <div className="space-y-2 mb-3 flex-1">
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <User size={14} className="text-gray-500" />
            <div>
              <span className="text-xs text-gray-900 truncate block">{proposal.submitter}</span>
              <span className="text-xs text-gray-500">{getRoleText(proposal.submitterRole)}</span>
            </div>
          </div>
          {proposal.reviewer && (
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <User size={14} className="text-gray-500" />
              <span className="text-xs text-gray-600 truncate">{proposal.reviewer}</span>
            </div>
          )}
        </div>

        {/* Submission Date */}
        <div className="flex items-center space-x-2 rtl:space-x-reverse mb-3">
          <Calendar size={14} className="text-gray-500" />
          <span className="text-xs text-gray-600">
            {new Date(proposal.submissionDate).toLocaleDateString('ar')}
          </span>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-3">
          {proposal.tags.slice(0, 2).map((tag, index) => (
            <span 
              key={index}
              className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
            >
              {tag}
            </span>
          ))}
          {proposal.tags.length > 2 && (
            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
              +{proposal.tags.length - 2}
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <span className="text-xs text-gray-500">
            {new Date(proposal.updatedAt).toLocaleDateString('ar')}
          </span>
          <div className="flex items-center space-x-1 rtl:space-x-reverse">
            <button
              onClick={() => onView(proposal)}
              className="text-gray-400 hover:text-gray-600 transition-colors p-1"
              title="عرض"
            >
              <Eye size={14} />
            </button>
            <button
              onClick={() => onEdit(proposal)}
              className="text-blue-600 hover:text-blue-700 transition-colors p-1"
              title="تعديل"
            >
              <Edit size={14} />
            </button>
            <button
              onClick={() => onDelete(proposal.id)}
              className="text-red-600 hover:text-red-700 transition-colors p-1"
              title="حذف"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Document Card Component
interface DocumentCardProps {
  document: {
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
  onView: (document: any) => void
  onEdit: (document: any) => void
  onDelete: (id: string) => void
  onDownload: (document: any) => void
}

export const DocumentCard: React.FC<DocumentCardProps> = ({
  document,
  onView,
  onEdit,
  onDelete,
  onDownload
}) => {
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

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'draft': return 'مسودة'
      case 'submitted': return 'مُرسل'
      case 'approved': return 'موافق عليه'
      case 'rejected': return 'مرفوض'
      case 'pending_review': return 'قيد المراجعة'
      default: return status
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

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'low': return 'منخفض'
      case 'medium': return 'متوسط'
      case 'high': return 'عالي'
      default: return priority
    }
  }

  return (
    <Card className="hover-lift h-full">
      <CardContent className="p-4 h-full flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 mb-1">
              {document.title}
            </h3>
            <p className="text-xs text-gray-600 line-clamp-2">
              {document.description}
            </p>
          </div>
        </div>

        {/* Type, Status and Priority */}
        <div className="space-y-2 mb-3">
          <div className="flex items-center justify-between">
            <span className="px-2 py-1 text-xs rounded-full bg-indigo-100 text-indigo-800">
              {getTypeText(document.type)}
            </span>
            <span className={cn('px-2 py-1 text-xs rounded-full', getStatusColor(document.status))}>
              {getStatusLabel(document.status)}
            </span>
          </div>
          <div className="flex justify-end">
            <span className={cn('px-2 py-1 rounded-full text-xs font-medium', getPriorityColor(document.priority))}>
              {getPriorityLabel(document.priority)}
            </span>
          </div>
        </div>

        {/* Author */}
        <div className="space-y-2 mb-3 flex-1">
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <User size={14} className="text-gray-500" />
            <div>
              <span className="text-xs text-gray-900 truncate block">{document.author}</span>
              <span className="text-xs text-gray-500">{getRoleText(document.authorRole)}</span>
            </div>
          </div>
          {document.reviewer && (
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <User size={14} className="text-gray-500" />
              <span className="text-xs text-gray-600 truncate">{document.reviewer}</span>
            </div>
          )}
        </div>

        {/* File Info */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <FileText size={14} className="text-gray-500" />
            <span className="text-xs text-gray-600">{document.fileSize}</span>
          </div>
          <span className="text-xs text-gray-500">v{document.version}</span>
        </div>

        {/* Upload Date */}
        <div className="flex items-center space-x-2 rtl:space-x-reverse mb-3">
          <Calendar size={14} className="text-gray-500" />
          <span className="text-xs text-gray-600">
            {new Date(document.uploadDate).toLocaleDateString('ar')}
          </span>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-3">
          {document.tags.slice(0, 2).map((tag, index) => (
            <span 
              key={index}
              className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
            >
              {tag}
            </span>
          ))}
          {document.tags.length > 2 && (
            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
              +{document.tags.length - 2}
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <span className="text-xs text-gray-500">
            {new Date(document.updatedAt).toLocaleDateString('ar')}
          </span>
          <div className="flex items-center space-x-1 rtl:space-x-reverse">
            <button
              onClick={() => onView(document)}
              className="text-gray-400 hover:text-gray-600 transition-colors p-1"
              title="عرض"
            >
              <Eye size={14} />
            </button>
            <button
              onClick={() => onDownload(document)}
              className="text-green-600 hover:text-green-700 transition-colors p-1"
              title="تحميل"
            >
              <Download size={14} />
            </button>
            <button
              onClick={() => onEdit(document)}
              className="text-blue-600 hover:text-blue-700 transition-colors p-1"
              title="تعديل"
            >
              <Edit size={14} />
            </button>
            <button
              onClick={() => onDelete(document.id)}
              className="text-red-600 hover:text-red-700 transition-colors p-1"
              title="حذف"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default GridView
