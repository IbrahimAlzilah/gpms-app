/**
 * Student Project Tracking Component
 * Displays the current project information and tracking for students
 */

import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Project } from '@/pages/projects/schema'
import Button from '@/components/ui/Button'
import { StatusBadge } from '@/components/shared'
import { MessageSquare, Calendar, CheckCircle, Upload, Send } from 'lucide-react'
import { formatDateWithWeekday, formatDate } from '@/utils/date'

/**
 * Props for StudentProjectTracking component
 */
export interface StudentProjectTrackingProps {
  project: Project
  onReplyToNotes?: () => void
}

/**
 * Student Project Tracking Component
 */
export const StudentProjectTracking: React.FC<StudentProjectTrackingProps> = ({
  project,
  onReplyToNotes
}) => {
  const navigate = useNavigate()

  return (
    <div className="mb-6 border border-gray-200 rounded-lg p-6 bg-white">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">متابعة مشروعي</h3>

      {/* Project Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <span className="text-sm text-gray-600">اسم المشروع:</span>
          <p className="text-gray-900 font-medium">{project.title}</p>
        </div>
        <div>
          <span className="text-sm text-gray-600">الحالة:</span>
          <p className="text-gray-900 font-medium">
            <StatusBadge status={project.status} />
          </p>
        </div>
        {project.supervisor && (
          <div>
            <span className="text-sm text-gray-600">المشرف:</span>
            <p className="text-gray-900 font-medium">{project.supervisor}</p>
          </div>
        )}
        {project.progress !== undefined && (
          <div>
            <span className="text-sm text-gray-600">نسبة الإنجاز:</span>
            <div className="mt-2">
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="text-gray-700">{project.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-gpms-light h-3 rounded-full transition-all duration-300"
                  style={{ width: `${project.progress}%` }}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Supervisor Notes */}
      {project.supervisorNotes && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start justify-between mb-2">
            <h4 className="font-medium text-blue-900 flex items-center">
              <MessageSquare size={16} className="me-2" />
              ملاحظات المشرف
            </h4>
            {project.lastMeetingDate && (
              <span className="text-xs text-blue-600">
                {formatDate(project.lastMeetingDate)}
              </span>
            )}
          </div>
          <p className="text-sm text-blue-800">{project.supervisorNotes}</p>
          {onReplyToNotes && (
            <Button
              size="sm"
              variant="outline"
              className="mt-3 text-blue-700 border-blue-300 hover:bg-blue-100"
              onClick={onReplyToNotes}
            >
              الرد على الملاحظات
            </Button>
          )}
        </div>
      )}

      {/* Timeline */}
      <div className="mb-6">
        <h4 className="font-medium text-gray-900 mb-3 flex items-center">
          <Calendar size={16} className="me-2" />
          الجدول الزمني
        </h4>
        <div className="space-y-3">
          {project.nextMeetingDate && (
            <div className="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div>
                <p className="text-sm font-medium text-yellow-900">الاجتماع القادم</p>
                <p className="text-xs text-yellow-700">
                  {formatDateWithWeekday(project.nextMeetingDate)}
                </p>
              </div>
              <Calendar size={20} className="text-yellow-600" />
            </div>
          )}
          {project.defenseDate && (
            <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
              <div>
                <p className="text-sm font-medium text-green-900">موعد المناقشة النهائية</p>
                <p className="text-xs text-green-700">
                  {formatDateWithWeekday(project.defenseDate)}
                  {project.defenseTime && ` - ${project.defenseTime}`}
                </p>
                {project.defenseLocation && (
                  <p className="text-xs text-green-600 mt-1">📍 {project.defenseLocation}</p>
                )}
              </div>
              <Calendar size={20} className="text-green-600" />
            </div>
          )}
          {project.milestones && project.milestones.length > 0 && (
            <div className="mt-4">
              <p className="text-sm font-medium text-gray-700 mb-2">المراحل الرئيسية:</p>
              <div className="space-y-2">
                {project.milestones.map((milestone) => (
                  <div
                    key={milestone.id}
                    className={`flex items-center justify-between p-2 rounded ${
                      milestone.completed
                        ? 'bg-green-50 border border-green-200'
                        : 'bg-gray-50 border border-gray-200'
                    }`}
                  >
                    <div className="flex items-center">
                      {milestone.completed ? (
                        <CheckCircle size={16} className="text-green-600 me-2" />
                      ) : (
                        <div className="w-4 h-4 border-2 border-gray-400 rounded-full me-2" />
                      )}
                      <span
                        className={`text-sm ${
                          milestone.completed ? 'text-green-800 line-through' : 'text-gray-700'
                        }`}
                      >
                        {milestone.title}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500">
                        {formatDate(milestone.dueDate)}
                      </span>
                      {!milestone.completed && (
                        <div className="w-16 bg-gray-200 rounded-full h-1.5">
                          <div
                            className="bg-blue-500 h-1.5 rounded-full"
                            style={{ width: `${milestone.progress}%` }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200">
        <Button onClick={() => navigate('/documents')} variant="outline">
          <Upload className="w-4 h-4 mr-1 rtl:mr-0 rtl:ml-1" />
          تسليم/رفع المستندات
        </Button>
        <Button onClick={() => navigate('/requests/new')} variant="outline">
          <Send className="w-4 h-4 mr-1 rtl:mr-0 rtl:ml-1" />
          تقديم طلب
        </Button>
      </div>
    </div>
  )
}

