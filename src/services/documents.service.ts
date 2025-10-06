import { apiRequest } from './api'
import { mockDocuments, DocumentItem } from '@/mock'

export async function getDocuments(): Promise<DocumentItem[]> {
  const res = await apiRequest<DocumentItem[]>('/documents', 'GET', undefined, {
    mockData: mockDocuments,
  })
  return res.data
}


