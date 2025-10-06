import { apiRequest } from './api'
import { mockRequests, RequestItem } from '@/mock'

export async function getRequests(): Promise<RequestItem[]> {
  const res = await apiRequest<RequestItem[]>('/requests', 'GET', undefined, {
    mockData: mockRequests,
  })
  return res.data
}


