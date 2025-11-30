/**
 * Project Actions Component
 * Displays action buttons for projects in table view
 */

import React from 'react'
import { Project } from '@/pages/projects/schema'
import { useNavigate } from 'react-router-dom'
import {
    Eye,
    Edit,
    Trash2,
    CheckCircle,
    XCircle,
    Star,
    MessageSquare,
    User
} from 'lucide-react'
import { approveProject, rejectProject } from '@/services/projects.service'
import { useNotifications } from '@/context/NotificationContext'

/**
 * Props for ProjectActions component
 */
export interface ProjectActionsProps {
    project: Project
    userRole?: string
    canEdit?: boolean
    canDelete?: boolean
    canApprove?: boolean
    canEvaluate?: boolean
    onView: (project: Project) => void
    onEdit?: (project: Project) => void
    onDelete?: (projectId: string) => void
    onAssignSupervisor?: (project: Project) => void
    onAddNotes?: (project: Project) => void
    onRegister?: (project: Project) => void
}

/**
 * Project Actions Component
 */
export const ProjectActions: React.FC<ProjectActionsProps> = ({
    project,
    userRole,
    canEdit,
    canDelete,
    canApprove,
    canEvaluate,
    onView,
    onEdit,
    onDelete,
    onAssignSupervisor,
    onAddNotes,
    onRegister
}) => {
    const navigate = useNavigate()
    const { addNotification } = useNotifications()

    const handleApprove = async () => {
        try {
            await approveProject(project.id)
            addNotification({
                title: 'تمت الموافقة',
                message: `تمت الموافقة على المشروع "${project.title}" بنجاح`,
                type: 'success'
            })
            navigate('/projects')
        } catch (err) {
            console.error('Error approving project:', err)
            addNotification({
                title: 'خطأ',
                message: 'حدث خطأ أثناء الموافقة على المشروع',
                type: 'error'
            })
        }
    }

    const handleReject = async () => {
        const reason = prompt('يرجى إدخال سبب الرفض:')
        if (!reason) return

        try {
            await rejectProject(project.id, reason)
            addNotification({
                title: 'تم الرفض',
                message: `تم رفض المشروع "${project.title}"`,
                type: 'info'
            })
            navigate('/projects')
        } catch (err) {
            console.error('Error rejecting project:', err)
            addNotification({
                title: 'خطأ',
                message: 'حدث خطأ أثناء رفض المشروع',
                type: 'error'
            })
        }
    }

    return (
        <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <button
                onClick={() => onView(project)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                title="عرض"
            >
                <Eye size={16} />
            </button>
            {canEdit && onEdit && (
                <button
                    onClick={() => onEdit(project)}
                    className="text-blue-600 hover:text-blue-700 transition-colors"
                    title="تعديل"
                >
                    <Edit size={16} />
                </button>
            )}
            {canDelete && onDelete && (
                <button
                    onClick={() => onDelete(project.id)}
                    className="text-red-600 hover:text-red-700 transition-colors"
                    title="حذف"
                >
                    <Trash2 size={16} />
                </button>
            )}
            {canApprove && (
                <>
                    <button
                        onClick={handleApprove}
                        className="text-green-600 hover:text-green-700 transition-colors"
                        title="موافقة"
                    >
                        <CheckCircle size={16} />
                    </button>
                    <button
                        onClick={handleReject}
                        className="text-red-600 hover:text-red-700 transition-colors"
                        title="رفض"
                    >
                        <XCircle size={16} />
                    </button>
                </>
            )}
            {userRole === 'committee' && !project.supervisor && project.status === 'approved' && onAssignSupervisor && (
                <button
                    onClick={() => onAssignSupervisor(project)}
                    className="text-blue-600 hover:text-blue-700 transition-colors"
                    title="تعيين مشرف"
                >
                    <User size={16} />
                </button>
            )}
            {canEvaluate && (
                <button
                    onClick={() => navigate(`/evaluations/new?projectId=${project.id}`)}
                    className="text-yellow-600 hover:text-yellow-700 transition-colors"
                    title="تقييم"
                >
                    <Star size={16} />
                </button>
            )}
            {userRole === 'supervisor' && onAddNotes && (
                <button
                    onClick={() => onAddNotes(project)}
                    className="text-blue-600 hover:text-blue-700 transition-colors"
                    title="إضافة ملاحظات/موعد لقاء"
                >
                    <MessageSquare size={16} />
                </button>
            )}
            {userRole === 'student' && project.status === 'approved' && onRegister && (
                <button
                    onClick={() => onRegister(project)}
                    className="text-green-600 hover:text-green-700 transition-colors"
                    title="التسجيل في المشروع"
                >
                    <CheckCircle size={16} />
                </button>
            )}
        </div>
    )
}

