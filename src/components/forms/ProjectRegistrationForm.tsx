import React, { useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useNotifications } from '@/context/NotificationContext'
import Button from '@/components/ui/Button'
import Modal from '@/components/ui/Modal'
import { Project } from '@/pages/projects/schema'
import { registerForProject, ProjectRegistrationRequest, getStudentRegistrations } from '@/services/project-registration.service'
import { checkStudentEligibility, checkStudentProjectRegistration } from '@/services/students.service'
import { X } from 'lucide-react'

interface ProjectRegistrationFormProps {
  isOpen: boolean
  onClose: () => void
  project: Project | null
  onSuccess?: () => void
}

const ProjectRegistrationForm: React.FC<ProjectRegistrationFormProps> = ({
  isOpen,
  onClose,
  project,
  onSuccess
}) => {
  const { user } = useAuth()
  const { addNotification } = useNotifications()
  const [reason, setReason] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isChecking, setIsChecking] = useState(false)
  const [errors, setErrors] = useState<{ reason?: string; general?: string }>({})
  const [eligibilityCheck, setEligibilityCheck] = useState<{ checked: boolean; eligible: boolean; message?: string }>({ checked: false, eligible: true })

  React.useEffect(() => {
    const checkEligibility = async () => {
      if (!user?.id || !isOpen) return

      setIsChecking(true)
      try {
        // Check if student is already registered in another project
        const registrationCheck = await checkStudentProjectRegistration(user.id)
        
        if (registrationCheck.isRegistered) {
          setEligibilityCheck({
            checked: true,
            eligible: false,
            message: `لديك بالفعل مشروع مسجل: "${registrationCheck.projectTitle || 'مشروع آخر'}". لا يمكنك التسجيل في مشروع آخر.`
          })
          return
        }

        // Check existing registrations as fallback
        const existingRegistrations = await getStudentRegistrations(user.id)
        const hasPendingOrApproved = existingRegistrations.some(
          reg => reg.status === 'pending' || reg.status === 'approved'
        )

        if (hasPendingOrApproved) {
          setEligibilityCheck({
            checked: true,
            eligible: false,
            message: 'لديك بالفعل طلب تسجيل قيد المراجعة. لا يمكنك التسجيل في مشروع آخر.'
          })
          return
        }

        // Check student eligibility (academic requirements, etc.)
        const eligibility = await checkStudentEligibility(user.id)
        setEligibilityCheck({
          checked: true,
          eligible: eligibility.eligible,
          message: eligibility.reason
        })
      } catch (error) {
        console.error('Error checking eligibility:', error)
        setEligibilityCheck({
          checked: true,
          eligible: false, // Don't allow submission if check fails
          message: 'حدث خطأ أثناء التحقق من الأهلية. يرجى المحاولة مرة أخرى أو التواصل مع الدعم.'
        })
      } finally {
        setIsChecking(false)
      }
    }

    checkEligibility()
  }, [user, isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})

    if (!project || !user) {
      return
    }

    if (!eligibilityCheck.checked || isChecking) {
      setErrors({ general: 'جاري التحقق من الصلاحية...' })
      return
    }

    if (!eligibilityCheck.eligible) {
      setErrors({ general: eligibilityCheck.message || 'غير مؤهل للتسجيل في المشروع' })
      return
    }

    setIsLoading(true)

    try {
      const registrationData: ProjectRegistrationRequest = {
        projectId: project.id,
        studentId: user.id,
        reason: reason.trim() || undefined
      }

      await registerForProject(registrationData)

      addNotification({
        title: 'تم إرسال طلب التسجيل',
        message: `تم إرسال طلب التسجيل في مشروع "${project.title}" بنجاح. سيتم مراجعة الطلب من قبل لجنة المشاريع.`,
        type: 'success'
      })

      setReason('')
      setEligibilityCheck({ checked: false, eligible: true })
      onSuccess?.()
      onClose()
    } catch (error) {
      addNotification({
        title: 'خطأ في التسجيل',
        message: error instanceof Error ? error.message : 'حدث خطأ أثناء إرسال طلب التسجيل. يرجى المحاولة مرة أخرى.',
        type: 'error'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    setReason('')
    setErrors({})
    onClose()
  }

  if (!project) return null

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={`التسجيل في مشروع: ${project.title}`}
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
            {project.supervisor && (
              <div>
                <span className="font-medium">المشرف:</span>
                <p className="text-gray-700">{project.supervisor}</p>
              </div>
            )}
            {project.department && (
              <div>
                <span className="font-medium">التخصص:</span>
                <p className="text-gray-700">{project.department}</p>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="reason" className="block text-sm font-medium text-gray-700">
            سبب اختيار المشروع (اختياري)
          </label>
          <textarea
            id="reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-gpms-light focus:border-transparent"
            placeholder="اذكر سبب اختيارك لهذا المشروع..."
          />
          {errors.reason && (
            <p className="text-sm text-red-600">{errors.reason}</p>
          )}
        </div>

        {isChecking && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm text-yellow-800">
            <p>جاري التحقق من الصلاحية...</p>
          </div>
        )}

        {eligibilityCheck.checked && !eligibilityCheck.eligible && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-800">
            <p className="font-medium mb-1">غير مؤهل للتسجيل:</p>
            <p>{eligibilityCheck.message || 'لا يمكنك التسجيل في هذا المشروع'}</p>
          </div>
        )}

        {eligibilityCheck.checked && eligibilityCheck.eligible && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-sm text-green-800">
            <p className="font-medium mb-1">✓ مؤهل للتسجيل</p>
            <p>يمكنك المتابعة في إرسال طلب التسجيل</p>
          </div>
        )}

        {errors.general && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-800">
            {errors.general}
          </div>
        )}

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-800">
          <p className="font-medium mb-1">ملاحظة:</p>
          <p>سيتم إرسال طلب التسجيل إلى لجنة المشاريع للمراجعة. سيتم إشعارك بالقرار عند مراجعة الطلب.</p>
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
            disabled={isLoading || isChecking || (eligibilityCheck.checked && !eligibilityCheck.eligible)}
            className="bg-gpms-dark text-white hover:bg-gpms-light"
          >
            {isLoading ? 'جاري الإرسال...' : isChecking ? 'جاري التحقق...' : 'إرسال طلب التسجيل'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}

export default ProjectRegistrationForm

