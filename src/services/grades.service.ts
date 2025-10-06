import { apiRequest } from './api'
import { mockGrades, GradeItem } from '@/mock'

export async function getGrades(): Promise<GradeItem[]> {
  const res = await apiRequest<GradeItem[]>('/grades', 'GET', undefined, {
    mockData: mockGrades,
  })
  return res.data
}


