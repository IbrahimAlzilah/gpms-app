import { apiRequest } from './api'
import { mockRequests, RequestItem } from '@/mock'
import { Request, CreateRequestInput, UpdateRequestInput } from '@/pages/requests/schema'

export async function getRequests(): Promise<Request[]> {
  const res = await apiRequest<Request[]>('/requests', 'GET', undefined, {
    mockData: mockRequests.map(r => ({
      id: r.id,
      type: r.type,
      title: r.title,
      description: r.description,
      status: r.status,
      priority: r.priority,
      student: r.student,
      supervisor: r.supervisor,
      requestedDate: r.requestedDate || r.submissionDate,
      createdAt: r.createdAt,
      updatedAt: r.updatedAt,
      reason: r.reason,
      response: r.response,
      reviewer: r.reviewer
    } as Request)),
  })
  return res.data
}

export async function getRequestById(id: string): Promise<Request> {
  const res = await apiRequest<Request>(`/requests/${id}`, 'GET', undefined, {
    mockData: {
      id,
      type: 'other',
      title: 'Sample Request',
      description: 'Sample description',
      status: 'pending',
      priority: 'medium',
      requestedDate: new Date().toISOString(),
    } as Request,
  })
  return res.data
}

export async function createRequest(data: CreateRequestInput): Promise<Request> {
  const res = await apiRequest<Request>('/requests', 'POST', data, {
    mockData: {
      id: Math.random().toString(36).substring(7),
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    } as Request,
  })
  return res.data
}

export async function updateRequest(id: string, data: UpdateRequestInput): Promise<Request> {
  const res = await apiRequest<Request>(`/requests/${id}`, 'PUT', data, {
    mockData: {
      id,
      ...data,
      updatedAt: new Date().toISOString(),
    } as Request,
  })
  return res.data
}

export async function deleteRequest(id: string): Promise<void> {
  await apiRequest<void>(`/requests/${id}`, 'DELETE', undefined, {
    mockData: undefined,
  })
}

export async function approveRequest(id: string, response?: string): Promise<Request> {
  return updateRequest(id, { status: 'approved', response, updatedAt: new Date().toISOString() })
}

export async function rejectRequest(id: string, reason: string): Promise<Request> {
  return updateRequest(id, { status: 'rejected', reason, updatedAt: new Date().toISOString() })
}

export interface RequestApprovalFlow {
  currentStep: 'supervisor' | 'committee' | 'completed'
  steps: Array<{
    step: 'supervisor' | 'committee'
    status: 'pending' | 'approved' | 'rejected'
    reviewedBy?: string
    reviewedAt?: string
    comments?: string
  }>
}

export interface RequestWithFlow extends Request {
  approvalFlow?: RequestApprovalFlow
}

/**
 * Get approval flow for a request
 */
export async function getRequestApprovalFlow(requestId: string): Promise<RequestApprovalFlow> {
  const res = await apiRequest<RequestApprovalFlow>(
    `/requests/${requestId}/approval-flow`,
    'GET',
    undefined,
    {
      mockData: {
        currentStep: 'supervisor',
        steps: [
          {
            step: 'supervisor',
            status: 'pending',
          },
        ],
      } as RequestApprovalFlow,
    }
  )
  return res.data
}

/**
 * Approve request by supervisor
 * This sends the request to committee if required, or completes it if supervisor-only approval
 */
export async function approveRequestBySupervisor(
  requestId: string,
  response?: string,
  comments?: string
): Promise<Request> {
  const request = await getRequestById(requestId)
  
  // Check if request needs committee approval after supervisor approval
  const needsCommitteeApproval = 
    request.type === 'supervision' ||
    request.type === 'change_supervisor' ||
    request.type === 'extension'

  if (needsCommitteeApproval) {
    // Update request status to pending_committee
    return updateRequest(requestId, {
      status: 'in_progress',
      response,
      updatedAt: new Date().toISOString(),
    })
  } else {
    // Supervisor-only approval, complete the request
    return updateRequest(requestId, {
      status: 'approved',
      response,
      updatedAt: new Date().toISOString(),
    })
  }
}

/**
 * Approve request by committee (final approval)
 */
export async function approveRequestByCommittee(
  requestId: string,
  response?: string,
  comments?: string
): Promise<Request> {
  return updateRequest(requestId, {
    status: 'approved',
    response,
    updatedAt: new Date().toISOString(),
  })
}

/**
 * Reject request by supervisor
 */
export async function rejectRequestBySupervisor(
  requestId: string,
  reason: string
): Promise<Request> {
  return updateRequest(requestId, {
    status: 'rejected',
    reason,
    updatedAt: new Date().toISOString(),
  })
}

/**
 * Reject request by committee
 */
export async function rejectRequestByCommittee(
  requestId: string,
  reason: string
): Promise<Request> {
  return updateRequest(requestId, {
    status: 'rejected',
    reason,
    updatedAt: new Date().toISOString(),
  })
}

/**
 * Execute the action based on request type after approval
 */
export async function executeRequestAction(requestId: string, requestType: string, actionData: any): Promise<void> {
  // Execute the action based on request type
  const res = await apiRequest<void>(`/requests/${requestId}/execute`, 'POST', { requestType, actionData }, {
    mockData: undefined,
  })
  return res.data
}

/**
 * Get requests pending supervisor approval
 */
export async function getRequestsPendingSupervisor(supervisorId?: string): Promise<Request[]> {
  const allRequests = await getRequests()
  return allRequests.filter(
    (req) =>
      req.status === 'pending' &&
      (req.type === 'supervision' ||
        req.type === 'change_supervisor' ||
        req.type === 'meeting' ||
        req.type === 'extension') &&
      (!supervisorId || req.supervisor === supervisorId)
  )
}

/**
 * Get requests pending committee approval
 */
export async function getRequestsPendingCommittee(): Promise<Request[]> {
  const allRequests = await getRequests()
  return allRequests.filter(
    (req) =>
      (req.status === 'in_progress' || req.status === 'pending') &&
      (req.type === 'change_group' ||
        req.type === 'change_project' ||
        // Requests that need committee approval after supervisor approval
        (req.type === 'supervision' && req.status === 'in_progress') ||
        (req.type === 'change_supervisor' && req.status === 'in_progress') ||
        (req.type === 'extension' && req.status === 'in_progress'))
  )
}

