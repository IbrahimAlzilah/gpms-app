import { apiRequest } from './api'
import { mockStudents, StudentItem } from '@/mock'

export interface StudentEligibility {
  eligible: boolean
  reason?: string
  details: {
    hasEnoughHours: boolean
    hasMinimumGPA: boolean
    isNotRegisteredInAnotherProject: boolean
    completedPrerequisites: boolean
    hoursInfo?: {
      completed: number
      required: number
      remaining: number
    }
    gpaInfo?: {
      current: number
      minimum: number
      difference: number
    }
    currentProject?: {
      id: string
      title: string
      status: string
    }
  }
}

export interface StudentAcademicInfo {
  studentId: string
  completedHours: number
  requiredHours: number
  gpa: number
  minimumGPA: number
  isRegisteredInProject: boolean
  currentProjectId?: string
  completedPrerequisites: boolean
}

export async function getStudents(): Promise<StudentItem[]> {
  const res = await apiRequest<StudentItem[]>('/students', 'GET', undefined, {
    mockData: mockStudents,
  })
  return res.data
}

/**
 * Get student academic information for eligibility checking
 */
export async function getStudentAcademicInfo(studentId: string): Promise<StudentAcademicInfo> {
  const res = await apiRequest<StudentAcademicInfo>(
    `/students/${studentId}/academic-info`,
    'GET',
    undefined,
    {
      mockData: {
        studentId,
        completedHours: 120,
        requiredHours: 100,
        gpa: 3.5,
        minimumGPA: 2.5,
        isRegisteredInProject: false,
        completedPrerequisites: true,
      } as StudentAcademicInfo,
    }
  )
  return res.data
}

/**
 * Check if student is eligible to register for a graduation project
 * This function checks:
 * - Sufficient credit hours
 * - Minimum GPA requirement
 * - Not already registered in another project
 * - Completed prerequisites
 */
export async function checkStudentEligibility(
  studentId: string
): Promise<StudentEligibility> {
  try {
    const academicInfo = await getStudentAcademicInfo(studentId)
    const registrationCheck = await checkStudentProjectRegistration(studentId)
    
    const reasons: string[] = []
    const hasEnoughHours = academicInfo.completedHours >= academicInfo.requiredHours
    const hasMinimumGPA = academicInfo.gpa >= academicInfo.minimumGPA
    const isNotRegisteredInAnotherProject = !academicInfo.isRegisteredInProject && !registrationCheck.isRegistered
    const completedPrerequisites = academicInfo.completedPrerequisites

    const details: StudentEligibility['details'] = {
      hasEnoughHours,
      hasMinimumGPA,
      isNotRegisteredInAnotherProject,
      completedPrerequisites,
      hoursInfo: {
        completed: academicInfo.completedHours,
        required: academicInfo.requiredHours,
        remaining: Math.max(0, academicInfo.requiredHours - academicInfo.completedHours)
      },
      gpaInfo: {
        current: academicInfo.gpa,
        minimum: academicInfo.minimumGPA,
        difference: academicInfo.gpa - academicInfo.minimumGPA
      },
      currentProject: registrationCheck.isRegistered && registrationCheck.projectId ? {
        id: registrationCheck.projectId,
        title: registrationCheck.projectTitle || 'مشروع آخر',
        status: 'active'
      } : academicInfo.currentProjectId ? {
        id: academicInfo.currentProjectId,
        title: 'مشروع مسجل',
        status: 'active'
      } : undefined
    }

    // Check credit hours
    if (!hasEnoughHours) {
      reasons.push(
        `الساعات المكتملة (${academicInfo.completedHours}) أقل من المطلوب (${academicInfo.requiredHours}). تحتاج ${details.hoursInfo.remaining} ساعة إضافية.`
      )
    }

    // Check GPA
    if (!hasMinimumGPA) {
      const gpaDifference = academicInfo.minimumGPA - academicInfo.gpa
      reasons.push(
        `المعدل التراكمي (${academicInfo.gpa.toFixed(2)}) أقل من الحد الأدنى المطلوب (${academicInfo.minimumGPA}). تحتاج لتحسين المعدل بمقدار ${gpaDifference.toFixed(2)}.`
      )
    }

    // Check if already registered
    if (!isNotRegisteredInAnotherProject) {
      const projectTitle = registrationCheck.projectTitle || details.currentProject?.title || 'مشروع آخر'
      reasons.push(`الطالب مسجل بالفعل في مشروع: "${projectTitle}". لا يمكنك التسجيل في مشروع آخر.`)
    }

    // Check prerequisites
    if (!completedPrerequisites) {
      reasons.push('الطالب لم يكمل المتطلبات الأساسية المطلوبة للتسجيل في مشروع التخرج.')
    }

    const eligible = reasons.length === 0

    return {
      eligible,
      reason: eligible ? undefined : reasons.join('\n'),
      details,
    }
  } catch (error) {
    console.error('Error checking eligibility:', error)
    return {
      eligible: false,
      reason: 'حدث خطأ أثناء التحقق من الأهلية. يرجى المحاولة مرة أخرى أو التواصل مع الدعم.',
      details: {
        hasEnoughHours: false,
        hasMinimumGPA: false,
        isNotRegisteredInAnotherProject: false,
        completedPrerequisites: false
      }
    }
  }
}

/**
 * Check if student is already registered in a project
 */
export async function checkStudentProjectRegistration(
  studentId: string
): Promise<{ isRegistered: boolean; projectId?: string; projectTitle?: string }> {
  const res = await apiRequest<{ isRegistered: boolean; projectId?: string; projectTitle?: string }>(
    `/students/${studentId}/project-registration`,
    'GET',
    undefined,
    {
      mockData: {
        isRegistered: false,
      },
    }
  )
  return res.data
}

