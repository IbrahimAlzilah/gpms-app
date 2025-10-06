import { apiRequest } from './api'
import { mockProjects, ProjectSummary, mockStudentProjects, StudentProject } from '@/mock'

export async function getProjects(): Promise<ProjectSummary[]> {
  const res = await apiRequest<ProjectSummary[]>('/projects', 'GET', undefined, {
    mockData: mockProjects,
  })
  return res.data
}

export async function getStudentProjects(): Promise<StudentProject[]> {
  const res = await apiRequest<StudentProject[]>('/student/projects', 'GET', undefined, {
    mockData: mockStudentProjects,
  })
  return res.data
}


