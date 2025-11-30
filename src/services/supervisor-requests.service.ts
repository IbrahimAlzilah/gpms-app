import { apiRequest } from './api'
import { SupervisionRequest } from '@/pages/supervisor-requests/schema'

export async function getSupervisorRequests(supervisorId: string): Promise<SupervisionRequest[]> {
  const res = await apiRequest<SupervisionRequest[]>('/supervisor-requests', 'GET', undefined, {
    mockData: [
      {
        id: 'SR-1',
        projectId: 'p1',
        projectTitle: 'تطبيق إدارة المكتبة الذكية',
        studentId: '1',
        studentName: 'أحمد محمد علي',
        studentEmail: 'ahmed.mohamed@university.edu',
        groupId: '1',
        groupName: 'مجموعة التطوير الذكي',
        status: 'pending',
        requestedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        supervisorId: supervisorId,
        reason: 'نرغب في العمل على هذا المشروع تحت إشرافك'
      },
      {
        id: 'SR-2',
        projectId: 'p2',
        projectTitle: 'نظام إدارة المستودعات',
        studentId: '2',
        studentName: 'فاطمة حسن',
        studentEmail: 'fatima.hassan@university.edu',
        status: 'pending',
        requestedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        supervisorId: supervisorId,
        reason: 'نحتاج إشرافك على مشروعنا'
      }
    ] as SupervisionRequest[],
  })
  return res.data
}

/**
 * Check if supervisor has reached maximum projects limit
 */
export async function checkSupervisorProjectLimit(supervisorId: string): Promise<{
  canAccept: boolean
  currentProjects: number
  maxProjects: number
  message?: string
}> {
  const res = await apiRequest<{
    canAccept: boolean
    currentProjects: number
    maxProjects: number
    message?: string
  }>(`/supervisors/${supervisorId}/project-limit`, 'GET', undefined, {
    mockData: {
      canAccept: true,
      currentProjects: 3,
      maxProjects: 5,
    },
  })
  return res.data
}

export async function acceptSupervisionRequest(requestId: string, response?: string): Promise<SupervisionRequest> {
  // First get the request to check supervisor
  const request = await getSupervisorRequestById(requestId)
  
  // Check supervisor project limit
  if (request.supervisorId) {
    const limitCheck = await checkSupervisorProjectLimit(request.supervisorId)
    if (!limitCheck.canAccept) {
      throw new Error(limitCheck.message || `تم الوصول للحد الأقصى للمشاريع (${limitCheck.currentProjects}/${limitCheck.maxProjects})`)
    }
  }

  const res = await apiRequest<SupervisionRequest>(`/supervisor-requests/${requestId}/accept`, 'POST', { response }, {
    mockData: {
      id: requestId,
      projectId: request.projectId,
      projectTitle: request.projectTitle,
      studentId: request.studentId,
      studentName: request.studentName,
      studentEmail: request.studentEmail,
      status: 'accepted', // After supervisor accepts, it goes to committee for final approval
      requestedAt: request.requestedAt,
      respondedAt: new Date().toISOString(),
      supervisorId: request.supervisorId,
      response: response || 'تم قبول طلب الإشراف. سيتم إرساله للجنة المشاريع للاعتماد النهائي.'
    } as SupervisionRequest,
  })
  return res.data
}

export async function rejectSupervisionRequest(requestId: string, reason: string): Promise<SupervisionRequest> {
  const res = await apiRequest<SupervisionRequest>(`/supervisor-requests/${requestId}/reject`, 'POST', { reason }, {
    mockData: {
      id: requestId,
      projectId: 'p1',
      projectTitle: 'تطبيق إدارة المكتبة الذكية',
      studentId: '1',
      studentName: 'أحمد محمد علي',
      studentEmail: 'ahmed.mohamed@university.edu',
      status: 'rejected',
      requestedAt: new Date().toISOString(),
      respondedAt: new Date().toISOString(),
      supervisorId: '2',
      reason: reason
    } as SupervisionRequest,
  })
  return res.data
}

export async function getSupervisorRequestById(requestId: string): Promise<SupervisionRequest> {
  const res = await apiRequest<SupervisionRequest>(`/supervisor-requests/${requestId}`, 'GET', undefined, {
    mockData: {
      id: requestId,
      projectId: 'p1',
      projectTitle: 'تطبيق إدارة المكتبة الذكية',
      studentId: '1',
      studentName: 'أحمد محمد علي',
      studentEmail: 'ahmed.mohamed@university.edu',
      status: 'pending',
      requestedAt: new Date().toISOString(),
      supervisorId: '2'
    } as SupervisionRequest,
  })
  return res.data
}

