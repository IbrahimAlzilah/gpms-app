import { apiRequest } from './api'
import { mockStudents, StudentItem } from '@/mock'

export async function getStudents(): Promise<StudentItem[]> {
  const res = await apiRequest<StudentItem[]>('/students', 'GET', undefined, {
    mockData: mockStudents,
  })
  return res.data
}


