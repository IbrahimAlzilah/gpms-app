import { apiRequest } from './api'
import { Evaluation, CreateEvaluationInput, UpdateEvaluationInput } from '@/pages/evaluations/schema'

export async function getEvaluations(): Promise<Evaluation[]> {
  const res = await apiRequest<Evaluation[]>('/evaluations', 'GET', undefined, {
    mockData: [],
  })
  return res.data
}

export async function getEvaluationById(id: string): Promise<Evaluation> {
  const res = await apiRequest<Evaluation>(`/evaluations/${id}`, 'GET', undefined, {
    mockData: {
      id,
      projectTitle: 'Sample Project',
      evaluationType: 'proposal',
      status: 'pending',
      dueDate: new Date().toISOString(),
      maxScore: 100,
      priority: 'medium',
    } as Evaluation,
  })
  return res.data
}

export async function createEvaluation(data: CreateEvaluationInput): Promise<Evaluation> {
  const res = await apiRequest<Evaluation>('/evaluations', 'POST', data, {
    mockData: {
      id: Math.random().toString(36).substring(7),
      ...data,
    } as Evaluation,
  })
  return res.data
}

export async function updateEvaluation(id: string, data: UpdateEvaluationInput): Promise<Evaluation> {
  const res = await apiRequest<Evaluation>(`/evaluations/${id}`, 'PUT', data, {
    mockData: {
      id,
      ...data,
    } as Evaluation,
  })
  return res.data
}

export async function deleteEvaluation(id: string): Promise<void> {
  await apiRequest<void>(`/evaluations/${id}`, 'DELETE', undefined, {
    mockData: undefined,
  })
}

