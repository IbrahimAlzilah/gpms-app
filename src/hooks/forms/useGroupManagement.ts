import { useState, useCallback } from 'react'
import { useFormValidation, commonValidationRules } from './useFormValidation'

export interface GroupMember {
  id: string
  name: string
  email: string
  studentId: string
  role: 'leader' | 'member'
  status: 'active' | 'pending' | 'invited'
  joinDate: string
}

export interface GroupData {
  id?: string
  name: string
  project: string
  maxMembers: number
  members: GroupMember[]
  createdAt?: string
  status?: 'active' | 'pending' | 'inactive'
}

export interface GroupActionResult {
  success: boolean
  message: string
  groupId?: string
  nextStep?: string
}

export const useGroupManagement = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Validation rules for group management
  const groupValidationRules = {
    name: {
      required: true,
      minLength: 3,
      maxLength: 100
    },
    project: {
      required: true,
      minLength: 5,
      maxLength: 200
    },
    maxMembers: {
      required: true,
      custom: (value: number) => {
        if (value < 2) {
          return 'يجب أن تحتوي المجموعة على عضوين على الأقل'
        }
        if (value > 5) {
          return 'لا يمكن أن تحتوي المجموعة على أكثر من 5 أعضاء'
        }
        return null
      }
    },
    members: {
      required: true,
      custom: (members: GroupMember[]) => {
        if (!members || members.length === 0) {
          return 'يجب أن تحتوي المجموعة على عضو واحد على الأقل'
        }
        if (members.length > 5) {
          return 'لا يمكن أن تحتوي المجموعة على أكثر من 5 أعضاء'
        }
        return null
      }
    }
  }

  const { errors, validateForm, validateFieldOnChange, clearErrors } = useFormValidation(groupValidationRules)

  const validateGroupData = useCallback((data: GroupData): string | null => {
    const isValid = validateForm(data)
    if (!isValid) {
      return 'يرجى تصحيح الأخطاء في النموذج'
    }

    // Check for duplicate emails
    const emails = data.members.map(member => member.email.toLowerCase())
    const uniqueEmails = new Set(emails)
    if (emails.length !== uniqueEmails.size) {
      return 'يوجد أعضاء مكررون في المجموعة'
    }

    // Check for at least one leader
    const hasLeader = data.members.some(member => member.role === 'leader')
    if (!hasLeader) {
      return 'يجب أن تحتوي المجموعة على قائد واحد على الأقل'
    }

    return null
  }, [validateForm])

  const validateLeaveGroup = useCallback((currentMembers: GroupMember[], currentUserId: string): string | null => {
    // UC-06: A2 - يجب أن يبقى عضو واحد على الأقل
    if (currentMembers.length <= 1) {
      return 'لا يمكن مغادرة المجموعة - يجب أن يبقى عضو واحد على الأقل'
    }

    // Check if current user is the only leader
    const leaders = currentMembers.filter(member => member.role === 'leader')
    const currentUserIsLeader = currentMembers.find(member => member.id === currentUserId)?.role === 'leader'
    
    if (currentUserIsLeader && leaders.length === 1) {
      return 'لا يمكن مغادرة المجموعة - أنت القائد الوحيد. يجب تعيين قائد جديد أولاً'
    }

    return null
  }, [])

  const createGroup = useCallback(async (data: GroupData): Promise<GroupActionResult> => {
    setIsLoading(true)
    setError(null)

    try {
      // Validate group data
      const validationError = validateGroupData(data)
      if (validationError) {
        setError(validationError)
        return { success: false, message: validationError }
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))

      const groupId = `GROUP-${Date.now()}`
      const message = 'تم إنشاء المجموعة بنجاح'
      const nextStep = 'يمكنك الآن دعوة أعضاء جدد للمجموعة'

      return {
        success: true,
        message,
        groupId,
        nextStep
      }

    } catch (error) {
      const errorMessage = 'حدث خطأ أثناء إنشاء المجموعة'
      setError(errorMessage)
      return { success: false, message: errorMessage }
    } finally {
      setIsLoading(false)
    }
  }, [validateGroupData])

  const joinGroup = useCallback(async (groupId: string, userData: Partial<GroupMember>): Promise<GroupActionResult> => {
    setIsLoading(true)
    setError(null)

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))

      const message = 'تم الانضمام للمجموعة بنجاح'
      const nextStep = 'يمكنك الآن المشاركة في أنشطة المجموعة'

      return {
        success: true,
        message,
        groupId,
        nextStep
      }

    } catch (error) {
      const errorMessage = 'حدث خطأ أثناء الانضمام للمجموعة'
      setError(errorMessage)
      return { success: false, message: errorMessage }
    } finally {
      setIsLoading(false)
    }
  }, [])

  const leaveGroup = useCallback(async (
    groupId: string, 
    currentMembers: GroupMember[], 
    currentUserId: string
  ): Promise<GroupActionResult> => {
    setIsLoading(true)
    setError(null)

    try {
      // Validate leave group conditions
      const validationError = validateLeaveGroup(currentMembers, currentUserId)
      if (validationError) {
        setError(validationError)
        return { success: false, message: validationError }
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))

      const message = 'تم مغادرة المجموعة بنجاح'
      const nextStep = 'يمكنك الآن الانضمام لمجموعة أخرى أو إنشاء مجموعة جديدة'

      return {
        success: true,
        message,
        groupId,
        nextStep
      }

    } catch (error) {
      const errorMessage = 'حدث خطأ أثناء مغادرة المجموعة'
      setError(errorMessage)
      return { success: false, message: errorMessage }
    } finally {
      setIsLoading(false)
    }
  }, [validateLeaveGroup])

  const inviteMember = useCallback(async (
    groupId: string, 
    email: string, 
    message?: string
  ): Promise<GroupActionResult> => {
    setIsLoading(true)
    setError(null)

    try {
      // Validate email
      if (!email.trim()) {
        setError('البريد الإلكتروني مطلوب')
        return { success: false, message: 'البريد الإلكتروني مطلوب' }
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        setError('تنسيق البريد الإلكتروني غير صحيح')
        return { success: false, message: 'تنسيق البريد الإلكتروني غير صحيح' }
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))

      const inviteMessage = `تم إرسال دعوة للانضمام للمجموعة إلى ${email}`
      const nextStep = 'في انتظار قبول الدعوة من الطالب'

      return {
        success: true,
        message: inviteMessage,
        groupId,
        nextStep
      }

    } catch (error) {
      const errorMessage = 'حدث خطأ أثناء إرسال الدعوة'
      setError(errorMessage)
      return { success: false, message: errorMessage }
    } finally {
      setIsLoading(false)
    }
  }, [])

  const removeMember = useCallback(async (
    groupId: string, 
    memberId: string, 
    currentMembers: GroupMember[]
  ): Promise<GroupActionResult> => {
    setIsLoading(true)
    setError(null)

    try {
      // Check if removing this member would leave the group with no members
      if (currentMembers.length <= 1) {
        setError('لا يمكن إزالة العضو - يجب أن يبقى عضو واحد على الأقل')
        return { success: false, message: 'لا يمكن إزالة العضو - يجب أن يبقى عضو واحد على الأقل' }
      }

      // Check if removing the only leader
      const leaders = currentMembers.filter(member => member.role === 'leader')
      const memberToRemove = currentMembers.find(member => member.id === memberId)
      
      if (memberToRemove?.role === 'leader' && leaders.length === 1) {
        setError('لا يمكن إزالة القائد الوحيد - يجب تعيين قائد جديد أولاً')
        return { success: false, message: 'لا يمكن إزالة القائد الوحيد - يجب تعيين قائد جديد أولاً' }
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))

      const message = 'تم إزالة العضو من المجموعة بنجاح'
      const nextStep = 'تم تحديث قائمة أعضاء المجموعة'

      return {
        success: true,
        message,
        groupId,
        nextStep
      }

    } catch (error) {
      const errorMessage = 'حدث خطأ أثناء إزالة العضو'
      setError(errorMessage)
      return { success: false, message: errorMessage }
    } finally {
      setIsLoading(false)
    }
  }, [])

  const assignNewLeader = useCallback(async (
    groupId: string, 
    newLeaderId: string
  ): Promise<GroupActionResult> => {
    setIsLoading(true)
    setError(null)

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))

      const message = 'تم تعيين قائد جديد للمجموعة بنجاح'
      const nextStep = 'يمكنك الآن مغادرة المجموعة بأمان'

      return {
        success: true,
        message,
        groupId,
        nextStep
      }

    } catch (error) {
      const errorMessage = 'حدث خطأ أثناء تعيين القائد الجديد'
      setError(errorMessage)
      return { success: false, message: errorMessage }
    } finally {
      setIsLoading(false)
    }
  }, [])

  return {
    isLoading,
    error,
    errors,
    createGroup,
    joinGroup,
    leaveGroup,
    inviteMember,
    removeMember,
    assignNewLeader,
    validateLeaveGroup,
    validateFieldOnChange,
    clearErrors
  }
}
