import { apiRequest } from './api'
import { mockStudents, StudentItem } from '@/mock'

export interface StudentEligibility {
  eligible: boolean
  reason?: string
  details?: {
    hasEnoughHours?: boolean
    hasMinimumGPA?: boolean
    isNotRegisteredInAnotherProject?: boolean
    completedPrerequisites?: boolean
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
    
    const reasons: string[] = []
    const details: StudentEligibility['details'] = {
      hasEnoughHours: academicInfo.completedHours >= academicInfo.requiredHours,
      hasMinimumGPA: academicInfo.gpa >= academicInfo.minimumGPA,
      isNotRegisteredInAnotherProject: !academicInfo.isRegisteredInProject,
      completedPrerequisites: academicInfo.completedPrerequisites,
    }

    // Check credit hours
    if (!details.hasEnoughHours) {
      reasons.push(
        `الساعات المكتملة (${academicInfo.completedHours}) أقل من المطلوب (${academicInfo.requiredHours})`
      )
    }

    // Check GPA
    if (!details.hasMinimumGPA) {
      reasons.push(
        `المعدل التراكمي (${academicInfo.gpa}) أقل من الحد الأدنى المطلوب (${academicInfo.minimumGPA})`
      )
    }

    // Check if already registered
    if (!details.isNotRegisteredInAnotherProject) {
      reasons.push('الطالب مسجل بالفعل في مشروع آخر')
    }

    // Check prerequisites
    if (!details.completedPrerequisites) {
      reasons.push('الطالب لم يكمل المتطلبات الأساسية')
    }

    const eligible = reasons.length === 0

    return {
      eligible,
      reason: eligible ? undefined : reasons.join('، '),
      details,
    }
  } catch (error) {
    return {
      eligible: false,
      reason: 'حدث خطأ أثناء التحقق من الأهلية',
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

