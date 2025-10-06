import { apiRequest } from './api'
import { mockSchedules, ScheduleItem } from '@/mock'

export async function getSchedules(): Promise<ScheduleItem[]> {
  const res = await apiRequest<ScheduleItem[]>('/schedules', 'GET', undefined, {
    mockData: mockSchedules,
  })
  return res.data
}


