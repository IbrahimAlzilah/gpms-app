/**
 * Committee Dashboard Section Component
 * Displays statistics and management options for committee members
 */

import React, { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { Project } from '@/pages/projects/schema'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import { Award, FileText, User } from 'lucide-react'

/**
 * Props for CommitteeDashboardSection component
 */
export interface CommitteeDashboardSectionProps {
    projects: Project[]
    projectsNeedingSupervisor: Project[]
    onAssignSupervisor: (project: Project) => void
}

/**
 * Committee Dashboard Section Component
 */
export const CommitteeDashboardSection: React.FC<CommitteeDashboardSectionProps> = ({
    projects,
    projectsNeedingSupervisor,
    onAssignSupervisor
}) => {
    const navigate = useNavigate()
    const { user } = useAuth()

    // Calculate statistics
    const stats = useMemo(() => ({
        approved: projects.filter((p) => p.status === 'approved').length,
        inProgress: projects.filter((p) => p.status === 'in_progress').length,
        completed: projects.filter((p) => p.status === 'completed').length,
        needingSupervisor: projectsNeedingSupervisor.length
    }), [projects, projectsNeedingSupervisor])

    if (user?.role !== 'committee') {
        return null
    }

    return (
        <>
            {/* Statistics Dashboard */}
            <div className="mb-6 border border-gray-200 rounded-lg p-6 bg-white">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">إدارة المشاريع والدرجات</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="text-2xl font-bold text-blue-600">
                            {stats.approved}
                        </div>
                        <div className="text-sm text-blue-800">مشاريع معتمدة</div>
                    </div>
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <div className="text-2xl font-bold text-green-600">
                            {stats.inProgress}
                        </div>
                        <div className="text-sm text-green-800">مشاريع قيد التنفيذ</div>
                    </div>
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <div className="text-2xl font-bold text-yellow-600">
                            {stats.completed}
                        </div>
                        <div className="text-sm text-yellow-800">مشاريع مكتملة</div>
                    </div>
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                        <div className="text-2xl font-bold text-purple-600">
                            {stats.needingSupervisor}
                        </div>
                        <div className="text-sm text-purple-800">تحتاج مشرف</div>
                    </div>
                </div>
                <div className="flex gap-3">
                    <Button
                        onClick={() => navigate('/evaluations')}
                        variant="outline"
                    >
                        <Award className="w-4 h-4 mr-1 rtl:mr-0 rtl:ml-1" />
                        إدارة الدرجات
                    </Button>
                    <Button
                        onClick={() => navigate('/reports')}
                        variant="outline"
                    >
                        <FileText className="w-4 h-4 mr-1 rtl:mr-0 rtl:ml-1" />
                        التقارير الإحصائية
                    </Button>
                </div>
            </div>

            {/* Projects Needing Supervisor */}
            {projectsNeedingSupervisor.length > 0 && (
                <div className="mb-6 border border-orange-200 rounded-lg p-6 bg-orange-50">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">المشاريع التي تحتاج مشرف</h3>
                        <Badge variant="warning">{projectsNeedingSupervisor.length} مشروع</Badge>
                    </div>
                    <div className="space-y-3">
                        {projectsNeedingSupervisor.map((project) => (
                            <div key={project.id} className="bg-white border border-gray-200 rounded-lg p-4 flex items-center justify-between">
                                <div className="flex-1">
                                    <h4 className="font-medium text-gray-900">{project.title}</h4>
                                    <p className="text-sm text-gray-600 mt-1">{project.description}</p>
                                    {project.department && (
                                        <p className="text-xs text-gray-500 mt-1">التخصص: {project.department}</p>
                                    )}
                                </div>
                                <Button
                                    size="sm"
                                    onClick={() => onAssignSupervisor(project)}
                                    className="bg-orange-600 text-white hover:bg-orange-700"
                                >
                                    <User className="w-4 h-4 ml-1 rtl:ml-0 rtl:mr-1" />
                                    تعيين مشرف
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </>
    )
}

