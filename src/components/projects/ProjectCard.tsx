/**
 * Project Card Component
 * Displays a project in grid view
 */

import React from 'react'
import { Project } from '@/pages/projects/schema'
import { Card, CardContent } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { StatusBadge, PriorityBadge } from '@/components/shared'
import { Eye, Edit, Trash2, User, Users, FolderOpen, Calendar, Clock } from 'lucide-react'
import { formatDate } from '@/utils/date'

/**
 * Props for ProjectCard component
 */
export interface ProjectCardProps {
    project: Project
    userRole?: string
    canEdit?: boolean
    canDelete?: boolean
    onView: (project: Project) => void
    onEdit?: (project: Project) => void
    onDelete?: (projectId: string) => void
    onRegister?: (project: Project) => void
}

/**
 * Project Card Component
 */
export const ProjectCard: React.FC<ProjectCardProps> = ({
    project,
    userRole,
    canEdit,
    canDelete,
    onView,
    onEdit,
    onDelete,
    onRegister
}) => {
    return (
        <Card className="hover-lift">
            <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                        <h3 className="text-md font-semibold text-gray-900 mb-2">{project.title}</h3>
                        <p className="text-sm text-gray-600 line-clamp-2">{project.description}</p>
                    </div>
                    <StatusBadge status={project.status} />
                </div>

                <div className="space-y-3 mb-4">
                    {project.supervisor && (
                        <div className="flex items-center text-sm text-gray-600">
                            <User size={16} className="me-2" />
                            <span>{project.supervisor}</span>
                        </div>
                    )}
                    {userRole === 'student' && (
                        <div className="flex items-center text-sm text-gray-600">
                            <Users size={16} className="me-2" />
                            <span>{(project.students || project.teamMembers || []).length} طالب مسجل</span>
                        </div>
                    )}
                    {userRole === 'supervisor' && project.teamMembers && project.teamMembers.length > 0 && (
                        <div className="flex items-center text-sm text-gray-600">
                            <Users size={16} className="me-2" />
                            <span>{project.teamMembers.length} طالب</span>
                        </div>
                    )}
                    {project.department && (
                        <div className="flex items-center text-sm text-gray-600">
                            <FolderOpen size={16} className="me-2" />
                            <span>{project.department}</span>
                        </div>
                    )}
                    {project.startDate && project.endDate && (
                        <div className="flex items-center text-sm text-gray-600">
                            <Calendar size={16} className="me-2" />
                            <span>
                                {formatDate(project.startDate)} - {formatDate(project.endDate)}
                            </span>
                        </div>
                    )}
                    {userRole === 'supervisor' && project.nextMeetingDate && (
                        <div className="flex items-center text-sm text-blue-600">
                            <Clock size={16} className="me-2" />
                            <span>لقاء قادم: {formatDate(project.nextMeetingDate)}</span>
                        </div>
                    )}
                    <div className="flex items-center justify-between text-sm text-gray-600">
                        <span>الأولوية:</span>
                        <PriorityBadge priority={project.priority} />
                    </div>
                </div>

                {project.progress !== undefined && (
                    <div className="mb-4">
                        <div className="flex justify-between text-sm text-gray-600 mb-1">
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
                )}

                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div className="flex space-x-2 rtl:space-x-reverse">
                        <button
                            onClick={() => onView(project)}
                            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                            title="عرض"
                        >
                            <Eye size={16} />
                        </button>
                        {canEdit && onEdit && (
                            <button
                                onClick={() => onEdit(project)}
                                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                                title="تعديل"
                            >
                                <Edit size={16} />
                            </button>
                        )}
                        {canDelete && onDelete && (
                            <button
                                onClick={() => onDelete(project.id)}
                                className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                                title="حذف"
                            >
                                <Trash2 size={16} />
                            </button>
                        )}
                    </div>
                    {userRole === 'student' && project.status === 'approved' && onRegister && (
                        <Button
                            onClick={() => onRegister(project)}
                            size="sm"
                            className="bg-gpms-dark text-white hover:bg-gpms-light text-xs"
                        >
                            التسجيل
                        </Button>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}

