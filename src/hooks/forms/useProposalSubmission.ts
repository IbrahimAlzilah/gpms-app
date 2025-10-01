import { useState, useCallback } from 'react'
import { useFormValidation, commonValidationRules } from './useFormValidation'

export interface ProposalData {
  title: string
  description: string
  objectives: string
  methodology?: string
  timeline?: string
  resources?: string
  expectedOutcomes?: string
  keywords: string[]
  teamMembers: Array<{
    name: string
    email: string
    phone?: string
    role: string
  }>
  attachments?: string[]
  userRole?: 'student' | 'supervisor' | 'committee'
}

export interface ProposalSubmissionResult {
  success: boolean
  message: string
  proposalId?: string
  nextStep?: string
}

export const useProposalSubmission = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Validation rules for proposals
  const proposalValidationRules = {
    title: commonValidationRules.title,
    description: commonValidationRules.description,
    objectives: {
      required: true,
      minLength: 10,
      maxLength: 500
    },
    methodology: {
      minLength: 10,
      maxLength: 1000
    },
    timeline: {
      minLength: 5,
      maxLength: 500
    },
    teamMembers: {
      required: true,
      custom: (members: any[]) => {
        if (!members || members.length === 0) {
          return 'يجب أن تحتوي المجموعة على عضو واحد على الأقل'
        }
        if (members.length > 5) {
          return 'لا يمكن أن تحتوي المجموعة على أكثر من 5 أعضاء'
        }
        // Validate each member
        for (const member of members) {
          if (!member.name.trim()) {
            return 'اسم العضو مطلوب'
          }
          if (!member.email.trim()) {
            return 'البريد الإلكتروني للعضو مطلوب'
          }
          if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(member.email)) {
            return 'تنسيق البريد الإلكتروني غير صحيح'
          }
        }
        return null
      }
    }
  }

  const { errors, validateForm, validateFieldOnChange, clearErrors } = useFormValidation(proposalValidationRules)

  const validateProposalData = useCallback((data: ProposalData): string | null => {
    const isValid = validateForm(data)
    if (!isValid) {
      return 'يرجى تصحيح الأخطاء في النموذج'
    }

    // Additional business logic validation
    if (data.keywords.length === 0) {
      return 'يجب إضافة تقنية واحدة على الأقل'
    }

    if (data.keywords.length > 10) {
      return 'لا يمكن إضافة أكثر من 10 تقنيات'
    }

    return null
  }, [validateForm])

  const checkSubmissionPeriod = useCallback((userRole: string): { isOpen: boolean; message?: string } => {
    const now = new Date()
    const currentYear = now.getFullYear()
    
    // Define submission periods based on role
    const periods = {
      student: {
        start: new Date(`${currentYear}-01-01`),
        end: new Date(`${currentYear}-03-31`)
      },
      supervisor: {
        start: new Date(`${currentYear}-01-01`),
        end: new Date(`${currentYear}-12-31`)
      },
      committee: {
        start: new Date(`${currentYear}-01-01`),
        end: new Date(`${currentYear}-12-31`)
      }
    }

    const period = periods[userRole as keyof typeof periods]
    if (!period) {
      return { isOpen: false, message: 'دور المستخدم غير صحيح' }
    }

    if (now < period.start) {
      return { 
        isOpen: false, 
        message: `فترة التقديم لم تبدأ بعد. تبدأ في ${period.start.toLocaleDateString('ar')}` 
      }
    }

    if (now > period.end) {
      return { 
        isOpen: false, 
        message: `فترة التقديم انتهت. انتهت في ${period.end.toLocaleDateString('ar')}` 
      }
    }

    return { isOpen: true }
  }, [])

  const submitProposal = useCallback(async (
    data: ProposalData,
    userRole: 'student' | 'supervisor' | 'committee' = 'student'
  ): Promise<ProposalSubmissionResult> => {
    setIsLoading(true)
    setError(null)

    try {
      // Check submission period
      const periodCheck = checkSubmissionPeriod(userRole)
      if (!periodCheck.isOpen) {
        setError(periodCheck.message || 'فترة التقديم مغلقة')
        return { success: false, message: periodCheck.message || 'فترة التقديم مغلقة' }
      }

      // Validate proposal data
      const validationError = validateProposalData(data)
      if (validationError) {
        setError(validationError)
        return { success: false, message: validationError }
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))

      const proposalId = `PROP-${Date.now()}`
      let message = 'تم إرسال المقترح بنجاح'
      let nextStep = ''

      // Role-specific logic
      switch (userRole) {
        case 'student':
          message = 'تم إرسال مقترح المشروع للجنة المراجعة'
          nextStep = 'في انتظار مراجعة المقترح من قبل لجنة المشاريع'
          break
        case 'supervisor':
          message = 'تم إرسال مقترح المشروع كاقتراح من المشرف'
          nextStep = 'سيتم مراجعة المقترح من قبل لجنة المشاريع'
          break
        case 'committee':
          message = 'تم حفظ المقترح في النظام'
          nextStep = 'المقترح متاح للطلاب للاختيار منه'
          break
      }

      return {
        success: true,
        message,
        proposalId,
        nextStep
      }

    } catch (error) {
      const errorMessage = 'حدث خطأ أثناء إرسال المقترح'
      setError(errorMessage)
      return { success: false, message: errorMessage }
    } finally {
      setIsLoading(false)
    }
  }, [validateProposalData, checkSubmissionPeriod])

  const getProposalTypeInfo = useCallback((userRole: string) => {
    const typeInfo = {
      student: {
        title: 'مقترح مشروع جديد',
        description: 'تقديم مقترح لمشروع التخرج',
        submitButtonText: 'إرسال المقترح',
        successMessage: 'تم إرسال المقترح بنجاح'
      },
      supervisor: {
        title: 'اقتراح مشروع من المشرف',
        description: 'اقتراح مشروع للطلاب',
        submitButtonText: 'إرسال الاقتراح',
        successMessage: 'تم إرسال الاقتراح بنجاح'
      },
      committee: {
        title: 'إضافة مقترح جديد',
        description: 'إضافة مقترح مشروع للنظام',
        submitButtonText: 'حفظ المقترح',
        successMessage: 'تم حفظ المقترح بنجاح'
      }
    }

    return typeInfo[userRole as keyof typeof typeInfo] || typeInfo.student
  }, [])

  return {
    isLoading,
    error,
    errors,
    submitProposal,
    getProposalTypeInfo,
    checkSubmissionPeriod,
    validateFieldOnChange,
    clearErrors
  }
}
