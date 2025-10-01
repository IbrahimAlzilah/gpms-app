import { useState, useCallback } from 'react'

export interface RequestData {
  type: string
  title: string
  description: string
  priority: 'low' | 'medium' | 'high'
  requestedDate: string
  supervisor?: string
  reason?: string
  newGroupMembers?: string
  newProjectDetails?: string
  extensionPeriod?: string
  attachments?: string[]
}

export interface RequestSubmissionResult {
  success: boolean
  message: string
  requestId?: string
  nextStep?: string
}

export const useRequestSubmission = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const determineApprovalPath = useCallback((requestType: string): string[] => {
    switch (requestType) {
      case 'supervision':
        return ['supervisor', 'committee']
      case 'change_supervisor':
        return ['supervisor', 'committee']
      case 'change_group':
        return ['committee']
      case 'change_project':
        return ['committee']
      case 'meeting':
        return ['supervisor']
      case 'extension':
        return ['supervisor', 'committee']
      default:
        return ['committee']
    }
  }, [])

  const validateRequestData = useCallback((data: RequestData): string | null => {
    if (!data.title.trim()) {
      return 'عنوان الطلب مطلوب'
    }
    if (!data.description.trim()) {
      return 'وصف الطلب مطلوب'
    }
    if (!data.requestedDate) {
      return 'التاريخ المطلوب مطلوب'
    }

    // Type-specific validation
    switch (data.type) {
      case 'supervision':
      case 'change_supervisor':
        if (!data.supervisor) {
          return 'المشرف مطلوب'
        }
        break
      case 'change_group':
        if (!data.newGroupMembers) {
          return 'تفاصيل الأعضاء الجدد مطلوبة'
        }
        break
      case 'change_project':
        if (!data.newProjectDetails) {
          return 'تفاصيل المشروع الجديد مطلوبة'
        }
        break
      case 'extension':
        if (!data.extensionPeriod) {
          return 'فترة التمديد مطلوبة'
        }
        break
    }

    return null
  }, [])

  const submitRequest = useCallback(async (data: RequestData): Promise<RequestSubmissionResult> => {
    setIsLoading(true)
    setError(null)

    try {
      // Validate request data
      const validationError = validateRequestData(data)
      if (validationError) {
        setError(validationError)
        return { success: false, message: validationError }
      }

      // Determine approval path
      const approvalPath = determineApprovalPath(data.type)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))

      // Mock response based on request type
      const requestId = `REQ-${Date.now()}`
      let message = 'تم إرسال الطلب بنجاح'
      let nextStep = ''

      switch (data.type) {
        case 'supervision':
          message = 'تم إرسال طلب الإشراف للمشرف المحدد'
          nextStep = 'في انتظار موافقة المشرف'
          break
        case 'change_supervisor':
          message = 'تم إرسال طلب تغيير المشرف'
          nextStep = 'في انتظار موافقة المشرف الحالي'
          break
        case 'change_group':
          message = 'تم إرسال طلب تغيير المجموعة للجنة'
          nextStep = 'في انتظار موافقة لجنة المشاريع'
          break
        case 'change_project':
          message = 'تم إرسال طلب تغيير المشروع للجنة'
          nextStep = 'في انتظار موافقة لجنة المشاريع'
          break
        case 'meeting':
          message = 'تم إرسال طلب الاجتماع للمشرف'
          nextStep = 'في انتظار تأكيد موعد الاجتماع'
          break
        case 'extension':
          message = 'تم إرسال طلب التمديد'
          nextStep = 'في انتظار موافقة المشرف واللجنة'
          break
      }

      return {
        success: true,
        message,
        requestId,
        nextStep
      }

    } catch (error) {
      const errorMessage = 'حدث خطأ أثناء إرسال الطلب'
      setError(errorMessage)
      return { success: false, message: errorMessage }
    } finally {
      setIsLoading(false)
    }
  }, [validateRequestData, determineApprovalPath])

  const getRequestTypeInfo = useCallback((type: string) => {
    const typeInfo = {
      supervision: {
        label: 'طلب إشراف',
        description: 'طلب إشراف على مشروع التخرج',
        requiredFields: ['supervisor']
      },
      change_supervisor: {
        label: 'تغيير المشرف',
        description: 'طلب تغيير المشرف الحالي',
        requiredFields: ['supervisor', 'reason']
      },
      change_group: {
        label: 'تغيير المجموعة',
        description: 'طلب تغيير المجموعة الحالية',
        requiredFields: ['newGroupMembers', 'reason']
      },
      change_project: {
        label: 'تغيير المشروع',
        description: 'طلب تغيير موضوع المشروع',
        requiredFields: ['newProjectDetails', 'reason']
      },
      meeting: {
        label: 'طلب اجتماع',
        description: 'طلب اجتماع مع المشرف',
        requiredFields: ['requestedDate']
      },
      extension: {
        label: 'طلب تمديد',
        description: 'طلب تمديد فترة المشروع',
        requiredFields: ['extensionPeriod', 'reason']
      }
    }

    return typeInfo[type as keyof typeof typeInfo] || {
      label: 'طلب عام',
      description: 'طلب عام',
      requiredFields: []
    }
  }, [])

  return {
    isLoading,
    error,
    submitRequest,
    getRequestTypeInfo,
    determineApprovalPath
  }
}


