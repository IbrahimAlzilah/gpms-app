import React, { useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useNotifications } from '@/context/NotificationContext'
import Button from '@/components/ui/Button'
import Modal from '@/components/ui/Modal'
import { Project } from '@/pages/projects/schema'
import { registerForProject, ProjectRegistrationRequest, getStudentRegistrations } from '@/services/project-registration.service'
import { checkStudentEligibility, checkStudentProjectRegistration, StudentEligibility } from '@/services/students.service'
import { X, CheckCircle, XCircle, Clock, Award, BookOpen, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * Props for ProjectRegistrationForm component
 */
export interface ProjectRegistrationFormComponentProps {
  /** Whether the modal is open */
  isOpen: boolean
  /** Callback to close the modal */
  onClose: () => void
  /** The project to register for */
  project: Project | null
  /** Callback when registration is successful */
  onSuccess?: () => void
}

const ProjectRegistrationForm: React.FC<ProjectRegistrationFormComponentProps> = ({
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
  const [eligibilityCheck, setEligibilityCheck] = useState<{ checked: boolean; eligible: boolean; message?: string; details?: StudentEligibility['details'] }>({ checked: false, eligible: true })

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
          message: eligibility.reason,
          details: eligibility.details
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

        {/* Eligibility Check Results */}
        {eligibilityCheck.checked && eligibilityCheck.details && (
          <div className={cn(
            "border rounded-lg p-4 space-y-3",
            eligibilityCheck.eligible 
              ? "bg-green-50 border-green-200" 
              : "bg-red-50 border-red-200"
          )}>
            <div className="flex items-center gap-2 mb-3">
              {eligibilityCheck.eligible ? (
                <>
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <h3 className="font-semibold text-green-900">مؤهل للتسجيل</h3>
                </>
              ) : (
                <>
                  <XCircle className="w-5 h-5 text-red-600" />
                  <h3 className="font-semibold text-red-900">غير مؤهل للتسجيل</h3>
                </>
              )}
            </div>

            {eligibilityCheck.message && (
              <div className={cn(
                "p-3 rounded-lg text-sm",
                eligibilityCheck.eligible ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
              )}>
                <p className="whitespace-pre-line">{eligibilityCheck.message}</p>
              </div>
            )}

            {/* Detailed Eligibility Information */}
            <div className="space-y-2 text-sm">
              {/* Credit Hours Check */}
              <div className="flex items-center justify-between p-2 bg-white rounded">
                <div className="flex items-center gap-2">
                  {eligibilityCheck.details.hasEnoughHours ? (
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-600" />
                  )}
                  <span className="font-medium">الساعات المطلوبة</span>
                </div>
                {eligibilityCheck.details.hoursInfo && (
                  <div className="text-gray-600">
                    <span className={eligibilityCheck.details.hasEnoughHours ? "text-green-700" : "text-red-700"}>
                      {eligibilityCheck.details.hoursInfo.completed}/{eligibilityCheck.details.hoursInfo.required}
                    </span>
                    {!eligibilityCheck.details.hasEnoughHours && (
                      <span className="text-red-600 mr-2">({eligibilityCheck.details.hoursInfo.remaining} ساعة ناقصة)</span>
                    )}
                  </div>
                )}
              </div>

              {/* GPA Check */}
              <div className="flex items-center justify-between p-2 bg-white rounded">
                <div className="flex items-center gap-2">
                  {eligibilityCheck.details.hasMinimumGPA ? (
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-600" />
                  )}
                  <span className="font-medium">المعدل التراكمي</span>
                </div>
                {eligibilityCheck.details.gpaInfo && (
                  <div className="text-gray-600">
                    <span className={eligibilityCheck.details.hasMinimumGPA ? "text-green-700" : "text-red-700"}>
                      {eligibilityCheck.details.gpaInfo.current.toFixed(2)}
                    </span>
                    <span className="text-gray-500 mr-1">/ الحد الأدنى: {eligibilityCheck.details.gpaInfo.minimum}</span>
                    {!eligibilityCheck.details.hasMinimumGPA && (
                      <span className="text-red-600 mr-2">({Math.abs(eligibilityCheck.details.gpaInfo.difference).toFixed(2)} ناقص)</span>
                    )}
                  </div>
                )}
              </div>

              {/* Project Registration Check */}
              <div className="flex items-center justify-between p-2 bg-white rounded">
                <div className="flex items-center gap-2">
                  {eligibilityCheck.details.isNotRegisteredInAnotherProject ? (
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-600" />
                  )}
                  <span className="font-medium">عدم التسجيل في مشروع آخر</span>
                </div>
                {eligibilityCheck.details.currentProject && (
                  <span className="text-sm text-red-600">
                    {eligibilityCheck.details.currentProject.title}
                  </span>
                )}
              </div>

              {/* Prerequisites Check */}
              <div className="flex items-center justify-between p-2 bg-white rounded">
                <div className="flex items-center gap-2">
                  {eligibilityCheck.details.completedPrerequisites ? (
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-600" />
                  )}
                  <span className="font-medium">المتطلبات الأساسية</span>
                </div>
                <span className={eligibilityCheck.details.completedPrerequisites ? "text-green-700" : "text-red-700"}>
                  {eligibilityCheck.details.completedPrerequisites ? "مكتملة" : "غير مكتملة"}
                </span>
              </div>
            </div>
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

