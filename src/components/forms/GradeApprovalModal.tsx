import React, { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useNotifications } from '@/context/NotificationContext'
import Modal from '@/components/ui/Modal'
import Button from '@/components/ui/Button'
import { Form, FormGroup, FormLabel } from '@/components/ui/Form'
import { 
  getProjectFinalGrade, 
  approveFinalGrade, 
  rejectFinalGrade,
  calculateFinalGrade,
  FinalGradeCalculation,
  GradeWeights
} from '@/services/grades.service'
import { CheckCircle, XCircle, Award, Calculator, AlertCircle, User, BookOpen } from 'lucide-react'
import { cn } from '@/lib/utils'

interface GradeApprovalModalProps {
  isOpen: boolean
  onClose: () => void
  projectId: string
  projectTitle: string
  studentId: string
  studentName: string
  supervisorScore?: number
  discussionScore?: number
  onSuccess: () => void
}

const GradeApprovalModal: React.FC<GradeApprovalModalProps> = ({
  isOpen,
  onClose,
  projectId,
  projectTitle,
  studentId,
  studentName,
  supervisorScore,
  discussionScore,
  onSuccess
}) => {
  const { user } = useAuth()
  const { addNotification } = useNotifications()
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingGrade, setIsLoadingGrade] = useState(false)
  const [finalGrade, setFinalGrade] = useState<FinalGradeCalculation | null>(null)
  const [weights, setWeights] = useState<GradeWeights>({ supervisorWeight: 0.4, discussionWeight: 0.6 })
  const [comments, setComments] = useState('')
  const [action, setAction] = useState<'approve' | 'reject' | null>(null)

  useEffect(() => {
    if (isOpen && projectId) {
      loadFinalGrade()
    }
  }, [isOpen, projectId])

  const loadFinalGrade = async () => {
    setIsLoadingGrade(true)
    try {
      const grade = await getProjectFinalGrade(projectId)
      if (grade) {
        setFinalGrade(grade)
        setWeights(grade.weights)
      } else if (supervisorScore !== undefined && discussionScore !== undefined) {
        // Calculate if we have both scores
        const calculated = calculateFinalGrade(supervisorScore, discussionScore, weights)
        setFinalGrade(calculated)
      }
    } catch (error) {
      console.error('Error loading final grade:', error)
    } finally {
      setIsLoadingGrade(false)
    }
  }

  const handleCalculate = () => {
    if (supervisorScore !== undefined && discussionScore !== undefined) {
      const calculated = calculateFinalGrade(supervisorScore, discussionScore, weights)
      setFinalGrade(calculated)
    }
  }

  const handleApprove = async () => {
    if (!finalGrade) return

    setIsLoading(true)
    try {
      await approveFinalGrade(projectId, user?.id || '', comments || undefined)
      addNotification({
        title: 'تم اعتماد الدرجة',
        message: `تم اعتماد الدرجة النهائية للمشروع "${projectTitle}". سيتم إشعار الطالب.`,
        type: 'success'
      })
      onSuccess()
      onClose()
    } catch (error) {
      addNotification({
        title: 'خطأ',
        message: 'فشل في اعتماد الدرجة. يرجى المحاولة مرة أخرى.',
        type: 'error'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleReject = async () => {
    if (!comments.trim()) {
      addNotification({
        title: 'خطأ',
        message: 'يرجى إدخال سبب الرفض',
        type: 'error'
      })
      return
    }

    setIsLoading(true)
    try {
      await rejectFinalGrade(projectId, user?.id || '', comments)
      addNotification({
        title: 'تم رفض الدرجة',
        message: `تم رفض الدرجة النهائية. سيتم إشعار لجنة المناقشة لإعادة التقييم.`,
        type: 'success'
      })
      onSuccess()
      onClose()
    } catch (error) {
      addNotification({
        title: 'خطأ',
        message: 'فشل في رفض الدرجة. يرجى المحاولة مرة أخرى.',
        type: 'error'
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="اعتماد الدرجة النهائية"
      size="lg"
    >
      <div className="space-y-6">
        {/* Project Info */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <BookOpen size={20} className="text-gray-600" />
            <h3 className="font-semibold text-gray-900">معلومات المشروع</h3>
          </div>
          <div className="space-y-1 text-sm">
            <p><span className="font-medium">المشروع:</span> {projectTitle}</p>
            <p><span className="font-medium">الطالب:</span> {studentName}</p>
          </div>
        </div>

        {/* Grade Calculation */}
        {isLoadingGrade ? (
          <div className="text-center py-8">جاري تحميل الدرجات...</div>
        ) : (
          <div className="space-y-4">
            {/* Input Scores if not available */}
            {(supervisorScore === undefined || discussionScore === undefined) && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <AlertCircle size={20} className="text-yellow-600" />
                  <h3 className="font-semibold text-yellow-900">إدخال الدرجات</h3>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      درجة المشرف
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={supervisorScore || ''}
                      onChange={(e) => {
                        const score = parseFloat(e.target.value) || 0
                        if (discussionScore !== undefined) {
                          const calculated = calculateFinalGrade(score, discussionScore, weights)
                          setFinalGrade(calculated)
                        }
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-gpms-light focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      درجة لجنة المناقشة
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={discussionScore || ''}
                      onChange={(e) => {
                        const score = parseFloat(e.target.value) || 0
                        if (supervisorScore !== undefined) {
                          const calculated = calculateFinalGrade(supervisorScore, score, weights)
                          setFinalGrade(calculated)
                        }
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-gpms-light focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Weights */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      وزن درجة المشرف (%)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      step="0.1"
                      value={weights.supervisorWeight * 100}
                      onChange={(e) => {
                        const supervisorWeight = parseFloat(e.target.value) / 100
                        const discussionWeight = 1 - supervisorWeight
                        setWeights({ supervisorWeight, discussionWeight })
                        if (supervisorScore !== undefined && discussionScore !== undefined) {
                          const calculated = calculateFinalGrade(supervisorScore, discussionScore, { supervisorWeight, discussionWeight })
                          setFinalGrade(calculated)
                        }
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-gpms-light focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      وزن درجة المناقشة (%)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      step="0.1"
                      value={weights.discussionWeight * 100}
                      onChange={(e) => {
                        const discussionWeight = parseFloat(e.target.value) / 100
                        const supervisorWeight = 1 - discussionWeight
                        setWeights({ supervisorWeight, discussionWeight })
                        if (supervisorScore !== undefined && discussionScore !== undefined) {
                          const calculated = calculateFinalGrade(supervisorScore, discussionScore, { supervisorWeight, discussionWeight })
                          setFinalGrade(calculated)
                        }
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-gpms-light focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Final Grade Display */}
            {finalGrade && (
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <Award className="w-5 h-5 text-yellow-500" />
                    الدرجة النهائية المحسوبة
                  </h3>
                  {finalGrade.isApproved && (
                    <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                      معتمدة
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <div className="text-sm text-gray-600 mb-1">درجة المشرف</div>
                    <div className="text-2xl font-bold text-blue-600">
                      {finalGrade.supervisorScore.toFixed(1)}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      وزن: {(finalGrade.weights.supervisorWeight * 100).toFixed(0)}%
                    </div>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <div className="text-sm text-gray-600 mb-1">درجة المناقشة</div>
                    <div className="text-2xl font-bold text-purple-600">
                      {finalGrade.discussionScore.toFixed(1)}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      وزن: {(finalGrade.weights.discussionWeight * 100).toFixed(0)}%
                    </div>
                  </div>
                  <div className="bg-white rounded-lg p-4 border-2 border-gpms-dark">
                    <div className="text-sm text-gray-600 mb-1">الدرجة النهائية</div>
                    <div className={cn(
                      "text-3xl font-bold",
                      finalGrade.finalScore >= 90 ? "text-green-600" :
                      finalGrade.finalScore >= 80 ? "text-blue-600" :
                      finalGrade.finalScore >= 70 ? "text-yellow-600" :
                      "text-red-600"
                    )}>
                      {finalGrade.finalScore.toFixed(2)}
                    </div>
                    <div className="text-sm font-medium text-gray-700 mt-1">
                      {finalGrade.finalGrade}
                    </div>
                  </div>
                </div>

                {/* Calculation Breakdown */}
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                    <Calculator size={16} />
                    تفاصيل الحساب
                  </h4>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>
                      ({finalGrade.supervisorScore} × {(finalGrade.weights.supervisorWeight * 100).toFixed(0)}%) + 
                      ({finalGrade.discussionScore} × {(finalGrade.weights.discussionWeight * 100).toFixed(0)}%) = 
                      <span className="font-semibold text-gray-900 mr-1">{finalGrade.finalScore.toFixed(2)}</span>
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Comments */}
            <FormGroup>
              <FormLabel htmlFor="comments">
                {action === 'reject' ? 'سبب الرفض (مطلوب)' : 'ملاحظات (اختيارية)'}
              </FormLabel>
              <textarea
                id="comments"
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-gpms-light focus:border-transparent"
                placeholder={action === 'reject' ? 'اذكر سبب رفض الدرجة...' : 'أدخل أي ملاحظات إضافية...'}
                required={action === 'reject'}
              />
            </FormGroup>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isLoading}
              >
                إلغاء
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setAction('reject')
                  if (comments.trim()) {
                    handleReject()
                  }
                }}
                disabled={isLoading || !finalGrade}
                className="bg-red-600 text-white hover:bg-red-700 border-red-600"
              >
                <XCircle className="w-4 h-4 ml-1 rtl:ml-0 rtl:mr-1" />
                رفض
              </Button>
              <Button
                type="button"
                onClick={() => {
                  setAction('approve')
                  handleApprove()
                }}
                disabled={isLoading || !finalGrade || finalGrade.isApproved}
                className="bg-green-600 text-white hover:bg-green-700"
              >
                <CheckCircle className="w-4 h-4 ml-1 rtl:ml-0 rtl:mr-1" />
                اعتماد الدرجة
              </Button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  )
}

export default GradeApprovalModal

