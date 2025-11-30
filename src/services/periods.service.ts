import { apiRequest } from './api'

export type PeriodType = 
  | 'proposal_submission'
  | 'project_registration'
  | 'document_submission'
  | 'evaluation'
  | 'defense'

export interface Period {
  id: string
  type: PeriodType
  name: string
  startDate: string
  endDate: string
  isActive: boolean
  createdAt: string
  createdBy: string
}

export interface CreatePeriodInput {
  type: PeriodType
  name: string
  startDate: string
  endDate: string
}

export interface UpdatePeriodInput {
  name?: string
  startDate?: string
  endDate?: string
  isActive?: boolean
}

export async function getPeriods(): Promise<Period[]> {
  const res = await apiRequest<Period[]>('/periods', 'GET', undefined, {
    mockData: [
      {
        id: '1',
        type: 'proposal_submission',
        name: 'فترة تقديم المقترحات',
        startDate: '2024-01-01',
        endDate: '2024-01-31',
        isActive: true,
        createdAt: new Date().toISOString(),
        createdBy: 'committee'
      },
      {
        id: '2',
        type: 'project_registration',
        name: 'فترة التسجيل في المشاريع',
        startDate: '2024-02-01',
        endDate: '2024-02-15',
        isActive: true,
        createdAt: new Date().toISOString(),
        createdBy: 'committee'
      },
      {
        id: '3',
        type: 'document_submission',
        name: 'فترة تسليم الوثائق',
        startDate: '2024-03-01',
        endDate: '2024-03-31',
        isActive: false,
        createdAt: new Date().toISOString(),
        createdBy: 'committee'
      },
      {
        id: '4',
        type: 'evaluation',
        name: 'فترة التقييم',
        startDate: '2024-04-01',
        endDate: '2024-04-30',
        isActive: false,
        createdAt: new Date().toISOString(),
        createdBy: 'committee'
      },
      {
        id: '5',
        type: 'defense',
        name: 'فترة المناقشة',
        startDate: '2024-05-01',
        endDate: '2024-05-31',
        isActive: false,
        createdAt: new Date().toISOString(),
        createdBy: 'committee'
      }
    ] as Period[],
  })
  return res.data
}

export async function getPeriodByType(type: PeriodType): Promise<Period | null> {
  const res = await apiRequest<Period | null>(`/periods/type/${type}`, 'GET', undefined, {
    mockData: {
      id: '1',
      type,
      name: `فترة ${type}`,
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      isActive: true,
      createdAt: new Date().toISOString(),
      createdBy: 'committee'
    } as Period,
  })
  return res.data
}

export async function createPeriod(data: CreatePeriodInput): Promise<Period> {
  const res = await apiRequest<Period>('/periods', 'POST', data, {
    mockData: {
      id: `PERIOD-${Date.now()}`,
      ...data,
      isActive: true,
      createdAt: new Date().toISOString(),
      createdBy: 'committee'
    } as Period,
  })
  return res.data
}

export async function updatePeriod(id: string, data: UpdatePeriodInput): Promise<Period> {
  const res = await apiRequest<Period>(`/periods/${id}`, 'PUT', data, {
    mockData: {
      id,
      ...data,
    } as Period,
  })
  return res.data
}

export async function deletePeriod(id: string): Promise<void> {
  await apiRequest<void>(`/periods/${id}`, 'DELETE', undefined, {
    mockData: undefined,
  })
}

export async function checkPeriodStatus(type: PeriodType): Promise<{ isOpen: boolean; period: Period | null }> {
  const period = await getPeriodByType(type)
  if (!period) {
    return { isOpen: false, period: null }
  }

  const now = new Date()
  const startDate = new Date(period.startDate)
  const endDate = new Date(period.endDate)

  const isOpen = period.isActive && now >= startDate && now <= endDate

  return { isOpen, period }
}

