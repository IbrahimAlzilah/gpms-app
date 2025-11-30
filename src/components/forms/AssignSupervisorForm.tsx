import React, { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useNotifications } from '@/context/NotificationContext'
import Modal from '@/components/ui/Modal'
import Button from '@/components/ui/Button'
import { Project } from '@/pages/projects/schema'
import { Supervisor, assignSupervisor, getSupervisors } from '@/services/supervisor-assignment.service'
import { User, CheckCircle, XCircle, AlertCircle } from 'lucide-react'

interface AssignSupervisorFormProps {
  isOpen: boolean
  onClose: () => void
  project: Project | null
  onSuccess?: () => void
}

const AssignSupervisorForm: React.FC<AssignSupervisorFormProps> = ({
  isOpen,
  onClose,
  project,
  onSuccess
}) => {
  const { user } = useAuth()
  const { addNotification } = useNotifications()
  const [supervisors, setSupervisors] = useState<Supervisor[]>([])
  const [selectedSupervisorId, setSelectedSupervisorId] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingSupervisors, setIsLoadingSupervisors] = useState(false)
  const [errors, setErrors] = useState<{ supervisor?: string }>({})

  useEffect(() => {
    if (isOpen && project) {
      loadSupervisors()
    }
  }, [isOpen, project])

  const loadSupervisors = async () => {
    setIsLoadingSupervisors(true)
    try {
      const data = await getSupervisors()
      // Filter supervisors by department if project has department
      const filtered = project?.department
        ? data.filter(s => s.department === project.department)
        : data
      setSupervisors(filtered)
    } catch (error) {
      addNotification({
        title: 'خطأ',
        message: 'فشل في تحميل قائمة المشرفين. يرجى المحاولة مرة أخرى.',
        type: 'error'
      })
    } finally {
      setIsLoadingSupervisors(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})

    if (!project || !selectedSupervisorId) {
      setErrors({ supervisor: 'يرجى اختيار مشرف' })
      return
    }

    const selectedSupervisor = supervisors.find(s => s.id === selectedSupervisorId)
    if (!selectedSupervisor) {
      setErrors({ supervisor: 'المشرف المحدد غير موجود' })
      return
    }

    // Check if supervisor has reached max projects
    if (selectedSupervisor.currentProjectsCount >= selectedSupervisor.maxProjects) {
      setErrors({ supervisor: `هذا المشرف وصل إلى الحد الأقصى للمشاريع (${selectedSupervisor.maxProjects})` })
      return
    }

    setIsLoading(true)

    try {
      await assignSupervisor(project.id, selectedSupervisorId)

      addNotification({
        title: 'تم التعيين',
        message: `تم تعيين ${selectedSupervisor.name} كمشرف على المشروع "${project.title}" بنجاح. سيتم إشعار المشرف.`,
        type: 'success'
      })

      setSelectedSupervisorId('')
      onSuccess?.()
      onClose()
    } catch (error) {
      addNotification({
        title: 'خطأ في التعيين',
        message: error instanceof Error ? error.message : 'حدث خطأ أثناء تعيين المشرف. يرجى المحاولة مرة أخرى.',
        type: 'error'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    setSelectedSupervisorId('')
    setErrors({})
    onClose()
  }

  if (!project) return null

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={`تعيين مشرف للمشروع: ${project.title}`}
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            معلومات المشروع
          </label>
          <div className="bg-gray-50 p-4 rounded-lg space-y-2 text-sm">
            <div>
              <span className="font-medium">العنوان:</span>
              <p className="text-gray-700">{project.title}</p>
            </div>
            <div>
              <span className="font-medium">الوصف:</span>
              <p className="text-gray-700">{project.description}</p>
            </div>
            {project.department && (
              <div>
                <span className="font-medium">التخصص:</span>
                <p className="text-gray-700">{project.department}</p>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="supervisor" className="block text-sm font-medium text-gray-700">
            اختر المشرف <span className="text-red-500">*</span>
          </label>
          {isLoadingSupervisors ? (
            <div className="text-center py-4 text-gray-500">جاري تحميل المشرفين...</div>
          ) : (
            <select
              id="supervisor"
              value={selectedSupervisorId}
              onChange={(e) => setSelectedSupervisorId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-gpms-light focus:border-transparent"
            >
              <option value="">-- اختر مشرف --</option>
              {supervisors.map((supervisor) => {
                const isAvailable = supervisor.currentProjectsCount < supervisor.maxProjects
                const remaining = supervisor.maxProjects - supervisor.currentProjectsCount
                return (
                  <option key={supervisor.id} value={supervisor.id}>
                    {supervisor.name} - {supervisor.department}
                    {supervisor.specialization && ` (${supervisor.specialization})`}
                    {isAvailable ? ` - متاح (${remaining} مشروع متبقي)` : ' - ممتلئ'}
                  </option>
                )
              })}
            </select>
          )}
          {errors.supervisor && (
            <p className="text-sm text-red-600 flex items-center">
              <AlertCircle size={14} className="ml-1 rtl:ml-0 rtl:mr-1" />
              {errors.supervisor}
            </p>
          )}
        </div>

        {selectedSupervisorId && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm">
            {(() => {
              const selected = supervisors.find(s => s.id === selectedSupervisorId)
              if (!selected) return null
              return (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-blue-900">المشرف المختار:</span>
                    <span className="text-blue-700">{selected.name}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-blue-700">المشاريع الحالية:</span>
                    <span className="font-medium text-blue-900">
                      {selected.currentProjectsCount} / {selected.maxProjects}
                    </span>
                  </div>
                  {selected.specialization && (
                    <div className="flex items-center justify-between">
                      <span className="text-blue-700">التخصص:</span>
                      <span className="text-blue-900">{selected.specialization}</span>
                    </div>
                  )}
                </div>
              )
            })()}
          </div>
        )}

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm text-yellow-800">
          <p className="font-medium mb-1">ملاحظة:</p>
          <p>سيتم إرسال إشعار للمشرف المختار بطلب الإشراف على هذا المشروع. يمكن للمشرف قبول أو رفض الطلب.</p>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={isLoading}
          >
            إلغاء
          </Button>
          <Button
            type="submit"
            disabled={isLoading || !selectedSupervisorId || isLoadingSupervisors}
            className="bg-gpms-dark text-white hover:bg-gpms-light"
          >
            {isLoading ? 'جاري التعيين...' : 'تعيين المشرف'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}

export default AssignSupervisorForm

