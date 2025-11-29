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


