import { apiRequest } from './api'
import { mockSchedules, ScheduleItem } from '@/mock'
import { Schedule, CreateScheduleInput, UpdateScheduleInput } from '@/pages/schedules/schema'

export async function getSchedules(): Promise<Schedule[]> {
  const res = await apiRequest<Schedule[]>('/schedules', 'GET', undefined, {
    mockData: mockSchedules.map(s => ({
      id: s.id,
      title: s.title || 'Schedule',
      description: s.notes,
      type: s.type as any,
      status: 'scheduled' as any,
      date: s.start.split('T')[0],
      startTime: new Date(s.start).toLocaleTimeString('ar', { hour: '2-digit', minute: '2-digit' }),
      endTime: new Date(s.end).toLocaleTimeString('ar', { hour: '2-digit', minute: '2-digit' }),
      location: s.location || '',
      participants: s.attendees,
      projectId: s.projectId,
      priority: 'medium' as any,
      createdAt: s.createdAt
    } as Schedule)),
  })
  return res.data
}

export async function getScheduleById(id: string): Promise<Schedule> {
  const res = await apiRequest<Schedule>(`/schedules/${id}`, 'GET', undefined, {
    mockData: {
      id,
      title: 'Sample Schedule',
      description: '',
      type: 'meeting',
      status: 'scheduled',
      date: new Date().toISOString().split('T')[0],
      startTime: '09:00',
      endTime: '10:00',
      location: '',
      participants: [],
      priority: 'medium',
    } as Schedule,
  })
  return res.data
}

export async function createSchedule(data: CreateScheduleInput): Promise<Schedule> {
  const res = await apiRequest<Schedule>('/schedules', 'POST', data, {
    mockData: {
      id: Math.random().toString(36).substring(7),
      ...data,
      createdAt: new Date().toISOString(),
    } as Schedule,
  })
  return res.data
}

export async function updateSchedule(id: string, data: UpdateScheduleInput): Promise<Schedule> {
  const res = await apiRequest<Schedule>(`/schedules/${id}`, 'PUT', data, {
    mockData: {
      id,
      ...data,
    } as Schedule,
  })
  return res.data
}

export async function deleteSchedule(id: string): Promise<void> {
  await apiRequest<void>(`/schedules/${id}`, 'DELETE', undefined, {
    mockData: undefined,
  })
}


